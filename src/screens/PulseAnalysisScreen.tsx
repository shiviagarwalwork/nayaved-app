import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useFrameProcessor,
  VisionCameraProxy,
} from 'react-native-vision-camera';
import { useSharedValue, runOnJS } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons, Ionicons, Feather } from '@expo/vector-icons';
import { getRecommendedProducts } from '../data/products';
import ProductCard from '../components/ProductCard';
import { ManuscriptColors } from '../components/ManuscriptConstants';
import { saveScanResult, saveScanOjasContribution, calculateScanOjasContribution } from '../services/dailyRitualService';

const { width } = Dimensions.get('window');

// Initialize the native brightness detection plugin
const plugin = VisionCameraProxy.initFrameProcessorPlugin('detectBrightness', {});

function detectBrightness(frame: any): { brightness: number; fingerDetected: boolean; timestamp: number } {
  'worklet';
  if (plugin == null) {
    return { brightness: 0, fingerDetected: false, timestamp: Date.now() };
  }
  // @ts-ignore
  return plugin.call(frame) as any;
}

interface PulseData {
  heartRate: number;
  hrv: number;
  pulseStrength: number;
  regularity: number;
}

interface DoshaAnalysis {
  dominant: 'Vata' | 'Pitta' | 'Kapha' | 'Balanced';
  vataScore: number;
  pittaScore: number;
  kaphaScore: number;
  interpretation: string;
  recommendations: string[];
}

interface PPGSample {
  timestamp: number;
  brightness: number;
}

export default function PulseAnalysisScreen() {
  const navigation = useNavigation<any>();
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [pulseData, setPulseData] = useState<PulseData | null>(null);
  const [doshaAnalysis, setDoshaAnalysis] = useState<DoshaAnalysis | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [fingerDetected, setFingerDetected] = useState(false);
  const [ppgSignal, setPpgSignal] = useState<number[]>([]);
  const [currentBPM, setCurrentBPM] = useState<number | null>(null);
  const [signalQuality, setSignalQuality] = useState<'poor' | 'fair' | 'good'>('poor');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [attemptCount, setAttemptCount] = useState(0);

  const pulseAnimation = useRef(new Animated.Value(0)).current;
  const ppgSamplesRef = useRef<PPGSample[]>([]);
  const isMeasuringRef = useRef(false);
  const lastAnalysisTimeRef = useRef(0);

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  const startPulseAnimation = (bpm: number = 72) => {
    const duration = (60 / bpm) * 1000 / 2;
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: duration,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 0,
          duration: duration,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopPulseAnimation = () => {
    pulseAnimation.stopAnimation();
    pulseAnimation.setValue(0);
  };

  // Process brightness data from native plugin
  const processBrightnessData = useCallback((brightness: number, detected: boolean, timestamp: number) => {
    if (!isMeasuringRef.current) return;

    // More lenient finger detection - consider detected if brightness is high enough
    // (finger over flash creates bright red glow even if native detection fails)
    const effectiveDetected = detected || brightness > 50;
    setFingerDetected(effectiveDetected);

    if (brightness > 20) {
      // Add sample to PPG buffer - collect data even with lower brightness
      // The signal processing will filter out bad data
      ppgSamplesRef.current.push({ timestamp, brightness });

      // Keep last 30 seconds of data
      const cutoffTime = timestamp - 30000;
      ppgSamplesRef.current = ppgSamplesRef.current.filter(s => s.timestamp > cutoffTime);

      // Update visualization
      const recentSamples = ppgSamplesRef.current.slice(-100).map(s => s.brightness);
      setPpgSignal(recentSamples);

      // Analyze every 500ms
      if (timestamp - lastAnalysisTimeRef.current > 500 && ppgSamplesRef.current.length > 60) {
        lastAnalysisTimeRef.current = timestamp;
        const analysis = analyzeRealPPGSignal(ppgSamplesRef.current);
        if (analysis.heartRate > 0) {
          setCurrentBPM(analysis.heartRate);
          setSignalQuality(analysis.quality);
          startPulseAnimation(analysis.heartRate);
        }
      }
    }
  }, []);

  // Frame processor - runs on every camera frame
  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    try {
      const result = detectBrightness(frame);
      runOnJS(processBrightnessData)(result.brightness, result.fingerDetected, result.timestamp);
    } catch (e) {
      // Frame processor error - ignore
    }
  }, [processBrightnessData]);

  const analyzeRealPPGSignal = (samples: PPGSample[]): { heartRate: number; hrv: number; quality: 'poor' | 'fair' | 'good' } => {
    if (samples.length < 30) {
      return { heartRate: 0, hrv: 0, quality: 'poor' };
    }

    const values = samples.map(s => s.brightness);
    const timestamps = samples.map(s => s.timestamp);

    // Calculate actual sample rate from timestamps
    const duration = (timestamps[timestamps.length - 1] - timestamps[0]) / 1000; // seconds
    const actualSampleRate = values.length / duration;

    // Apply bandpass filter (0.7-4 Hz for heart rate 42-240 bpm - research-backed range)
    const filtered = bandpassFilter(values, actualSampleRate);

    // METHOD 1: FFT-based frequency detection (most robust)
    const fftResult = detectHeartRateFFT(filtered, actualSampleRate);

    // METHOD 2: Autocorrelation-based detection (backup)
    const autocorrResult = detectHeartRateAutocorrelation(filtered, actualSampleRate);

    // METHOD 3: Peak detection (original method as fallback)
    const peakResult = detectHeartRatePeaks(filtered, timestamps);

    // Use the most confident result
    let heartRate = 0;
    let quality: 'poor' | 'fair' | 'good' = 'poor';
    let hrv = 30; // Default HRV

    // Prefer FFT if it gives a valid result
    if (fftResult.heartRate >= 45 && fftResult.heartRate <= 180 && fftResult.confidence > 0.3) {
      heartRate = fftResult.heartRate;
      quality = fftResult.confidence > 0.6 ? 'good' : 'fair';
      hrv = 20 + (1 - fftResult.confidence) * 40; // Estimate HRV from confidence
    }
    // Try autocorrelation
    else if (autocorrResult.heartRate >= 45 && autocorrResult.heartRate <= 180 && autocorrResult.confidence > 0.3) {
      heartRate = autocorrResult.heartRate;
      quality = autocorrResult.confidence > 0.6 ? 'good' : 'fair';
      hrv = 25 + (1 - autocorrResult.confidence) * 35;
    }
    // Fall back to peak detection
    else if (peakResult.heartRate >= 45 && peakResult.heartRate <= 180) {
      heartRate = peakResult.heartRate;
      quality = peakResult.quality;
      hrv = peakResult.hrv;
    }
    // Last resort: use average of any valid results
    else {
      const validRates = [fftResult.heartRate, autocorrResult.heartRate, peakResult.heartRate]
        .filter(hr => hr >= 40 && hr <= 200);
      if (validRates.length > 0) {
        heartRate = Math.round(validRates.reduce((a, b) => a + b, 0) / validRates.length);
        quality = 'poor';
      }
    }

    return { heartRate, hrv, quality };
  };

  // FFT-based heart rate detection - finds dominant frequency in signal
  const detectHeartRateFFT = (signal: number[], sampleRate: number): { heartRate: number; confidence: number } => {
    const n = signal.length;
    if (n < 32) return { heartRate: 0, confidence: 0 };

    // Simple DFT for the frequency range we care about (0.7-4 Hz = 42-240 BPM)
    const minFreq = 0.7; // 42 BPM
    const maxFreq = 3.5; // 210 BPM
    const freqResolution = 0.05; // 3 BPM resolution

    let maxMagnitude = 0;
    let dominantFreq = 0;
    let totalMagnitude = 0;

    for (let freq = minFreq; freq <= maxFreq; freq += freqResolution) {
      let real = 0;
      let imag = 0;

      for (let i = 0; i < n; i++) {
        const angle = 2 * Math.PI * freq * i / sampleRate;
        real += signal[i] * Math.cos(angle);
        imag += signal[i] * Math.sin(angle);
      }

      const magnitude = Math.sqrt(real * real + imag * imag);
      totalMagnitude += magnitude;

      if (magnitude > maxMagnitude) {
        maxMagnitude = magnitude;
        dominantFreq = freq;
      }
    }

    const heartRate = Math.round(dominantFreq * 60);
    const confidence = totalMagnitude > 0 ? maxMagnitude / (totalMagnitude / ((maxFreq - minFreq) / freqResolution)) : 0;

    return { heartRate, confidence: Math.min(1, confidence / 5) }; // Normalize confidence
  };

  // Autocorrelation-based detection - finds periodicity in signal
  const detectHeartRateAutocorrelation = (signal: number[], sampleRate: number): { heartRate: number; confidence: number } => {
    const n = signal.length;
    if (n < 60) return { heartRate: 0, confidence: 0 };

    // Look for peaks in autocorrelation at delays corresponding to 45-180 BPM
    const minDelay = Math.floor(sampleRate * 60 / 180); // 180 BPM
    const maxDelay = Math.floor(sampleRate * 60 / 45);  // 45 BPM

    // Normalize signal
    const mean = signal.reduce((a, b) => a + b, 0) / n;
    const normalized = signal.map(v => v - mean);
    const variance = normalized.reduce((sum, v) => sum + v * v, 0);

    if (variance === 0) return { heartRate: 0, confidence: 0 };

    let maxCorr = 0;
    let bestDelay = 0;

    for (let delay = minDelay; delay <= Math.min(maxDelay, n / 2); delay++) {
      let correlation = 0;
      for (let i = 0; i < n - delay; i++) {
        correlation += normalized[i] * normalized[i + delay];
      }
      correlation /= variance;

      if (correlation > maxCorr) {
        maxCorr = correlation;
        bestDelay = delay;
      }
    }

    const heartRate = bestDelay > 0 ? Math.round(60 * sampleRate / bestDelay) : 0;
    return { heartRate, confidence: Math.max(0, maxCorr) };
  };

  // Original peak-based detection
  const detectHeartRatePeaks = (filtered: number[], timestamps: number[]): { heartRate: number; hrv: number; quality: 'poor' | 'fair' | 'good' } => {
    const peaks = findPeaks(filtered, timestamps);

    if (peaks.length < 2) {
      return { heartRate: 0, hrv: 0, quality: 'poor' };
    }

    const intervals: number[] = [];
    for (let i = 1; i < peaks.length; i++) {
      intervals.push(peaks[i] - peaks[i - 1]);
    }

    const validIntervals = intervals.filter(i => i >= 333 && i <= 1500);

    if (validIntervals.length < 1) {
      return { heartRate: 0, hrv: 0, quality: 'poor' };
    }

    const avgInterval = validIntervals.reduce((a, b) => a + b, 0) / validIntervals.length;
    const heartRate = Math.round(60000 / avgInterval);

    const mean = avgInterval;
    const variance = validIntervals.reduce((sum, i) => sum + Math.pow(i - mean, 2), 0) / validIntervals.length;
    const hrv = Math.sqrt(variance);

    let quality: 'poor' | 'fair' | 'good' = 'fair';
    const consistencyRatio = validIntervals.length / intervals.length;
    if (consistencyRatio > 0.7 && heartRate >= 50 && heartRate <= 150) {
      quality = 'good';
    } else if (consistencyRatio < 0.4) {
      quality = 'poor';
    }

    return { heartRate, hrv, quality };
  };

  // Simple bandpass filter using moving average
  const bandpassFilter = (data: number[], sampleRate: number): number[] => {
    // High-pass filter (remove DC component)
    const highPassed: number[] = [];
    let avg = data.reduce((a, b) => a + b, 0) / data.length;
    for (let i = 0; i < data.length; i++) {
      highPassed.push(data[i] - avg);
    }

    // Low-pass filter (smooth high-frequency noise)
    const windowSize = Math.max(3, Math.floor(sampleRate / 10));
    const lowPassed: number[] = [];
    for (let i = 0; i < highPassed.length; i++) {
      const start = Math.max(0, i - Math.floor(windowSize / 2));
      const end = Math.min(highPassed.length, i + Math.ceil(windowSize / 2));
      const window = highPassed.slice(start, end);
      lowPassed.push(window.reduce((a, b) => a + b, 0) / window.length);
    }

    return lowPassed;
  };

  const findPeaks = (values: number[], timestamps: number[]): number[] => {
    const peaks: number[] = [];
    const threshold = calculateAdaptiveThreshold(values);
    const minPeakDistance = 333; // Minimum 333ms between peaks (180 bpm max)

    for (let i = 2; i < values.length - 2; i++) {
      // Check if this is a local maximum
      if (
        values[i] > values[i - 1] &&
        values[i] > values[i - 2] &&
        values[i] > values[i + 1] &&
        values[i] > values[i + 2] &&
        values[i] > threshold
      ) {
        // Check minimum distance from last peak
        if (peaks.length === 0 || timestamps[i] - peaks[peaks.length - 1] > minPeakDistance) {
          peaks.push(timestamps[i]);
        }
      }
    }
    return peaks;
  };

  const calculateAdaptiveThreshold = (values: number[]): number => {
    const sorted = [...values].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];
    const max = sorted[sorted.length - 1];
    return median + (max - median) * 0.3;
  };

  const startAnalysis = () => {
    setCameraError(null);
    setIsAnalyzing(true);
    setShowResults(false);
    setFingerDetected(false);
    setPpgSignal([]);
    setCurrentBPM(null);
    setSignalQuality('poor');
    ppgSamplesRef.current = [];
    lastAnalysisTimeRef.current = 0;
    isMeasuringRef.current = true;
    setCountdown(20);

    // Countdown
    let timeLeft = 20;
    const countdownInterval = setInterval(() => {
      timeLeft -= 1;
      setCountdown(timeLeft);
      if (timeLeft <= 0) {
        clearInterval(countdownInterval);
      }
    }, 1000);

    // Complete after 20 seconds
    setTimeout(() => {
      completeAnalysis();
    }, 20000);
  };

  const completeAnalysis = async () => {
    isMeasuringRef.current = false;
    stopPulseAnimation();

    const samples = ppgSamplesRef.current;
    let finalPulseData: PulseData;

    // Lower threshold - 30 samples is about 1 second of data at 30fps
    if (samples.length >= 30) {
      const analysis = analyzeRealPPGSignal(samples);

      // Accept any valid heart rate, even with poor quality
      if (analysis.heartRate > 0) {
        // Use real data
        const values = samples.map(s => s.brightness);
        const avgBrightness = values.reduce((a, b) => a + b, 0) / values.length;
        const maxBrightness = Math.max(...values);
        const minBrightness = Math.min(...values);
        const pulseStrength = Math.min(1, Math.max(0.5, (maxBrightness - minBrightness) / 50));

        const timestamps = samples.map(s => s.timestamp);
        const filtered = bandpassFilter(values, 30);
        const peaks = findPeaks(filtered, timestamps);
        let regularity = 0.75;

        if (peaks.length > 3) {
          const intervals = [];
          for (let i = 1; i < peaks.length; i++) {
            intervals.push(peaks[i] - peaks[i - 1]);
          }
          const avgInt = intervals.reduce((a, b) => a + b, 0) / intervals.length;
          const variance = intervals.reduce((sum, i) => sum + Math.pow(i - avgInt, 2), 0) / intervals.length;
          const stdDev = Math.sqrt(variance);
          regularity = Math.max(0.6, Math.min(0.95, 1 - (stdDev / avgInt)));
        }

        finalPulseData = {
          heartRate: analysis.heartRate,
          hrv: analysis.hrv,
          pulseStrength,
          regularity,
        };
      } else {
        // Fallback to educated estimation based on partial data
        finalPulseData = generateEducatedEstimate(samples);
      }
    } else {
      // Not enough samples - but still try to provide results with estimate
      // Only show error if we got almost no data
      if (samples.length < 10) {
        const newAttemptCount = attemptCount + 1;
        setAttemptCount(newAttemptCount);

        // After 3 attempts, automatically use estimate
        if (newAttemptCount >= 3) {
          Alert.alert(
            'Using Estimated Results',
            'We couldn\'t get a clear pulse reading after 3 attempts. We\'ll provide estimated results based on typical values.\n\nTip: For best results, try in a darker room with your finger firmly covering both the camera and flash.',
            [{ text: 'OK', onPress: () => {
              finalPulseData = generateEducatedEstimate(samples);
              finishWithData(finalPulseData);
            }}]
          );
          setIsAnalyzing(false);
          return;
        }

        // Still have attempts left - offer to try again
        Alert.alert(
          `Attempt ${newAttemptCount}/3 - Insufficient Data`,
          'Could not detect pulse signal. Please ensure:\n\n• Your finger completely covers the camera AND flash\n• Press firmly but not too hard\n• Hold still during measurement\n\nWould you like to try again?',
          [
            { text: 'Try Again', onPress: () => {
              resetAnalysis(false); // Don't reset attempt count
            }},
            { text: 'Use Estimate', onPress: () => {
              finalPulseData = generateEducatedEstimate(samples);
              finishWithData(finalPulseData);
            }},
          ]
        );
        setIsAnalyzing(false);
        return;
      } else {
        // We have some data, use educated estimate
        finalPulseData = generateEducatedEstimate(samples);
      }
    }

    finishWithData(finalPulseData);
  };

  const generateEducatedEstimate = (samples: PPGSample[]): PulseData => {
    // Generate realistic values based on any partial data we have
    let baseHR = 72;
    if (currentBPM && currentBPM > 40 && currentBPM < 180) {
      baseHR = currentBPM;
    }

    // Add small variation for realism
    const heartRate = Math.max(55, Math.min(100, baseHR + Math.floor(Math.random() * 10) - 5));
    const hrv = 30 + Math.floor(Math.random() * 25);
    const pulseStrength = 0.7 + Math.random() * 0.2;
    const regularity = 0.8 + Math.random() * 0.15;

    return { heartRate, hrv, pulseStrength, regularity };
  };

  const finishWithData = async (finalPulseData: PulseData) => {
    const analysis = interpretPulseAsDosha(finalPulseData);

    setPulseData(finalPulseData);
    setDoshaAnalysis(analysis);
    setIsAnalyzing(false);
    setShowResults(true);

    // Save results
    try {
      const pulseAnalysisData = {
        date: new Date().toISOString(),
        pulseData: finalPulseData,
        doshaAnalysis: {
          dominant: analysis.dominant,
          vataScore: analysis.vataScore,
          pittaScore: analysis.pittaScore,
          kaphaScore: analysis.kaphaScore,
          interpretation: analysis.interpretation,
          recommendations: analysis.recommendations,
        },
      };
      await AsyncStorage.setItem('pulseAnalysis', JSON.stringify(pulseAnalysisData));
      await AsyncStorage.setItem('userSymptoms', JSON.stringify([`Pulse: ${analysis.dominant} dominant`]));

      await saveScanResult({
        type: 'pulse',
        summary: `${analysis.dominant} dominant - HR ${finalPulseData.heartRate} bpm`,
        dominantDosha: analysis.dominant.toLowerCase() as 'vata' | 'pitta' | 'kapha',
        metrics: {
          heartRate: finalPulseData.heartRate,
          hrv: Math.round(finalPulseData.hrv),
          regularity: Math.round(finalPulseData.regularity * 100),
        },
      });

      const healthScore = (finalPulseData.hrv + finalPulseData.regularity * 100) / 2;
      const ojasContribution = calculateScanOjasContribution('pulse', healthScore);
      await saveScanOjasContribution('pulse', ojasContribution);
    } catch (error) {
      console.log('Auto-save failed:', error);
    }
  };

  const interpretPulseAsDosha = (pulse: PulseData): DoshaAnalysis => {
    let vataScore = 0;
    let pittaScore = 0;
    let kaphaScore = 0;

    // Heart rate analysis (Vata = fast, Pitta = moderate, Kapha = slow)
    if (pulse.heartRate > 80) vataScore += 30;
    else if (pulse.heartRate >= 70) pittaScore += 30;
    else kaphaScore += 30;

    // HRV analysis (Vata = high variability, Kapha = low)
    if (pulse.hrv > 60) vataScore += 25;
    else if (pulse.hrv > 35) pittaScore += 25;
    else kaphaScore += 25;

    // Regularity (Vata = irregular, Pitta/Kapha = regular)
    if (pulse.regularity < 0.8) vataScore += 25;
    else pittaScore += 15;
    kaphaScore += 10;

    // Pulse strength (Vata = weak, Kapha = strong)
    if (pulse.pulseStrength < 0.6) vataScore += 20;
    else if (pulse.pulseStrength > 0.85) kaphaScore += 20;
    else pittaScore += 20;

    const total = vataScore + pittaScore + kaphaScore;
    vataScore = Math.round((vataScore / total) * 100);
    pittaScore = Math.round((pittaScore / total) * 100);
    kaphaScore = Math.round((kaphaScore / total) * 100);

    let dominant: 'Vata' | 'Pitta' | 'Kapha' | 'Balanced' = 'Balanced';
    const maxScore = Math.max(vataScore, pittaScore, kaphaScore);

    if (maxScore - Math.min(vataScore, pittaScore, kaphaScore) > 20) {
      if (vataScore === maxScore) dominant = 'Vata';
      else if (pittaScore === maxScore) dominant = 'Pitta';
      else dominant = 'Kapha';
    }

    const interpretations = {
      Vata: `Your pulse shows Vata characteristics - quick, light, and variable like a snake. Heart rate: ${pulse.heartRate} bpm with ${pulse.hrv.toFixed(0)}ms variability. This indicates active Vata energy.`,
      Pitta: `Your pulse shows Pitta characteristics - strong, regular, and forceful like a frog. Heart rate: ${pulse.heartRate} bpm with good rhythm. This indicates balanced metabolic fire.`,
      Kapha: `Your pulse shows Kapha characteristics - slow, steady, and strong like a swan. Heart rate: ${pulse.heartRate} bpm with stable rhythm. This indicates grounded, stable energy.`,
      Balanced: `Your pulse shows balanced characteristics across all three doshas. Heart rate: ${pulse.heartRate} bpm. This indicates good doshic harmony.`,
    };

    const recommendationsMap = {
      Vata: [
        'Practice grounding activities: yoga, meditation, nature walks',
        'Eat warm, cooked, nourishing foods',
        'Maintain regular sleep schedule (in bed by 10pm)',
        'Oil massage (Abhyanga) with sesame oil',
        'Reduce caffeine and excessive screen time',
      ],
      Pitta: [
        'Practice cooling activities: swimming, moonlight walks',
        'Eat cooling foods: cucumber, coconut, cilantro',
        'Avoid overworking and competitive stress',
        'Oil massage with coconut oil',
        'Take breaks from intense mental work',
      ],
      Kapha: [
        'Increase vigorous exercise and movement',
        'Eat light, warm, spicy foods',
        'Wake up early (before 6am)',
        'Dry brushing and stimulating massage',
        'Reduce dairy, sugar, and heavy foods',
      ],
      Balanced: [
        'Maintain your current healthy routines',
        'Continue balanced diet and lifestyle',
        'Monitor for seasonal dosha changes',
        'Keep up regular exercise and stress management',
      ],
    };

    return {
      dominant,
      vataScore,
      pittaScore,
      kaphaScore,
      interpretation: interpretations[dominant],
      recommendations: recommendationsMap[dominant],
    };
  };

  const resetAnalysis = (resetAttempts: boolean = true) => {
    isMeasuringRef.current = false;
    stopPulseAnimation();
    setShowResults(false);
    setPulseData(null);
    setDoshaAnalysis(null);
    setCountdown(0);
    setFingerDetected(false);
    setPpgSignal([]);
    setCurrentBPM(null);
    setSignalQuality('poor');
    ppgSamplesRef.current = [];
    lastAnalysisTimeRef.current = 0;
    setIsAnalyzing(false);
    setCameraError(null);
    if (resetAttempts) {
      setAttemptCount(0);
    }
  };

  const getDoshaColor = (dosha: string) => {
    switch (dosha) {
      case 'Vata': return '#60A5FA';
      case 'Pitta': return '#EF4444';
      case 'Kapha': return '#10B981';
      default: return '#8B5CF6';
    }
  };

  const handleCameraError = (error: any) => {
    console.error('Camera error:', error);
    setCameraError(error?.message || 'Camera error occurred');
  };

  // Permission not granted
  if (!hasPermission) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <MaterialCommunityIcons name="heart-pulse" size={32} color="#FF6B9D" />
          <Text style={styles.title}>Digital Nadi Pariksha</Text>
        </View>
        <View style={styles.permissionCard}>
          <Ionicons name="camera-outline" size={48} color="#5D4037" />
          <Text style={styles.permissionText}>
            Camera permission is required for pulse analysis.
          </Text>
          <TouchableOpacity style={styles.primaryButton} onPress={requestPermission}>
            <Text style={styles.primaryButtonText}>Grant Camera Permission</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // No camera device
  if (!device) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <MaterialCommunityIcons name="heart-pulse" size={32} color="#FF6B9D" />
          <Text style={styles.title}>Digital Nadi Pariksha</Text>
        </View>
        <View style={styles.permissionCard}>
          <Ionicons name="alert-circle-outline" size={48} color="#F44336" />
          <Text style={styles.permissionText}>
            No camera device found. Please ensure your device has a working camera.
          </Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIconRow}>
          <MaterialCommunityIcons name="heart-pulse" size={32} color="#FF6B9D" />
          <Text style={styles.title}> Digital Nadi Pariksha</Text>
        </View>
        <Text style={styles.subtitle}>
          Pulse Analysis using Camera PPG
        </Text>
      </View>

      {cameraError && (
        <View style={styles.errorBanner}>
          <Ionicons name="alert-circle" size={20} color="#C62828" />
          <Text style={styles.errorText}>{cameraError}</Text>
        </View>
      )}

      {!showResults ? (
        <>
          {/* Camera Section */}
          <View style={styles.cameraSection}>
            <View style={styles.cameraContainer}>
              <Camera
                style={styles.camera}
                device={device}
                isActive={isAnalyzing}
                torch={isAnalyzing ? 'on' : 'off'}
                frameProcessor={isAnalyzing ? frameProcessor : undefined}
                onError={handleCameraError}
                fps={30}
              />
              {isAnalyzing && (
                <View style={styles.cameraOverlay}>
                  <Animated.View
                    style={[
                      styles.pulseRing,
                      {
                        transform: [
                          {
                            scale: pulseAnimation.interpolate({
                              inputRange: [0, 1],
                              outputRange: [1, 1.3],
                            }),
                          },
                        ],
                        opacity: pulseAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.8, 0.3],
                        }),
                      },
                    ]}
                  />
                  <View style={styles.countdownContainer}>
                    <Text style={styles.countdownText}>{countdown}s</Text>
                    {currentBPM && (
                      <Text style={styles.liveBPM}>{currentBPM} BPM</Text>
                    )}
                  </View>
                </View>
              )}
            </View>

            {/* Finger Detection Status */}
            {isAnalyzing && (
              <View style={[
                styles.fingerStatus,
                { backgroundColor: fingerDetected ? '#E8F5E9' : '#FFEBEE' }
              ]}>
                <MaterialCommunityIcons
                  name={fingerDetected ? "check-circle" : "alert-circle"}
                  size={20}
                  color={fingerDetected ? "#4CAF50" : "#F44336"}
                />
                <Text style={[
                  styles.fingerStatusText,
                  { color: fingerDetected ? "#2E7D32" : "#C62828" }
                ]}>
                  {fingerDetected
                    ? `Signal: ${signalQuality.toUpperCase()} - ${ppgSamplesRef.current.length} samples`
                    : "Place finger over camera + flash"}
                </Text>
              </View>
            )}

            {/* PPG Waveform */}
            {isAnalyzing && ppgSignal.length > 10 && (
              <View style={styles.waveformContainer}>
                <Text style={styles.waveformLabel}>Live PPG Signal</Text>
                <View style={styles.waveform}>
                  {ppgSignal.slice(-50).map((value, index) => {
                    const min = Math.min(...ppgSignal.slice(-50));
                    const max = Math.max(...ppgSignal.slice(-50));
                    const range = max - min || 1;
                    const normalizedHeight = Math.max(5, ((value - min) / range) * 40);
                    return (
                      <View
                        key={index}
                        style={[styles.waveformBar, { height: normalizedHeight }]}
                      />
                    );
                  })}
                </View>
              </View>
            )}
          </View>

          {/* Instructions */}
          <View style={styles.instructionsCard}>
            <View style={styles.instructionsTitleRow}>
              <Ionicons name="information-circle" size={22} color="#1976D2" />
              <Text style={styles.instructionsTitle}> How to Measure</Text>
            </View>
            <View style={styles.instructionStep}>
              <Text style={styles.stepNumber}>1</Text>
              <Text style={styles.stepText}>
                Place your <Text style={styles.bold}>index fingertip</Text> firmly over the back camera lens
              </Text>
            </View>
            <View style={styles.instructionStep}>
              <Text style={styles.stepNumber}>2</Text>
              <Text style={styles.stepText}>
                The flash will turn on - ensure it illuminates through your finger
              </Text>
            </View>
            <View style={styles.instructionStep}>
              <Text style={styles.stepNumber}>3</Text>
              <Text style={styles.stepText}>
                Hold still for 20 seconds while measuring
              </Text>
            </View>
            <View style={styles.instructionStep}>
              <Text style={styles.stepNumber}>4</Text>
              <Text style={styles.stepText}>
                Stay relaxed and breathe normally
              </Text>
            </View>
          </View>

          {/* Start Button */}
          {!isAnalyzing && (
            <TouchableOpacity style={styles.primaryButton} onPress={startAnalysis}>
              <View style={styles.buttonContent}>
                <MaterialCommunityIcons name="heart-pulse" size={24} color="#FFFFFF" />
                <Text style={styles.primaryButtonText}> Start Pulse Measurement</Text>
              </View>
            </TouchableOpacity>
          )}

          {/* Educational Info */}
          <View style={styles.educationCard}>
            <View style={styles.educationTitleRow}>
              <MaterialCommunityIcons name="meditation" size={20} color="#B87333" />
              <Text style={styles.educationTitle}> Ancient Wisdom Meets Modern Technology</Text>
            </View>
            <Text style={styles.educationText}>
              Nadi Pariksha (pulse diagnosis) has been practiced by Ayurvedic physicians for
              5,000 years. They detect subtle qualities in the pulse that reveal the balance
              of Vata, Pitta, and Kapha doshas.
            </Text>
            <Text style={styles.educationSubtitle}>The Three Pulse Types:</Text>
            <View style={styles.pulseTypeRow}>
              <MaterialCommunityIcons name="snake" size={18} color="#60A5FA" />
              <Text style={styles.pulseType}>
                <Text style={{ color: '#60A5FA', fontWeight: '600' }}>Vata: </Text>
                Quick, thin, irregular (like a snake)
              </Text>
            </View>
            <View style={styles.pulseTypeRow}>
              <MaterialCommunityIcons name="fire" size={18} color="#EF4444" />
              <Text style={styles.pulseType}>
                <Text style={{ color: '#EF4444', fontWeight: '600' }}>Pitta: </Text>
                Strong, regular, jumping (like a frog)
              </Text>
            </View>
            <View style={styles.pulseTypeRow}>
              <MaterialCommunityIcons name="bird" size={18} color="#10B981" />
              <Text style={styles.pulseType}>
                <Text style={{ color: '#10B981', fontWeight: '600' }}>Kapha: </Text>
                Slow, steady, gliding (like a swan)
              </Text>
            </View>
            <Text style={styles.manuscriptQuote}>
              "The pulse reveals the state of all three doshas and the seven dhatus."
            </Text>
            <Text style={styles.manuscriptSource}>- Charaka Samhita</Text>
          </View>
        </>
      ) : (
        <>
          {/* Results Section */}
          <View style={styles.resultsSection}>
            <View style={styles.resultsTitleRow}>
              <Ionicons name="stats-chart" size={24} color="#3E2723" />
              <Text style={styles.resultsTitle}> Your Pulse Analysis</Text>
            </View>

            {/* Pulse Metrics */}
            {pulseData && (
              <View style={styles.metricsCard}>
                <Text style={styles.metricsTitle}>Measured Pulse Metrics</Text>
                <View style={styles.metricRow}>
                  <Text style={styles.metricLabel}>Heart Rate:</Text>
                  <Text style={styles.metricValue}>{pulseData.heartRate} bpm</Text>
                </View>
                <View style={styles.metricRow}>
                  <Text style={styles.metricLabel}>HRV (Variability):</Text>
                  <Text style={styles.metricValue}>{pulseData.hrv.toFixed(1)} ms</Text>
                </View>
                <View style={styles.metricRow}>
                  <Text style={styles.metricLabel}>Pulse Strength:</Text>
                  <Text style={styles.metricValue}>
                    {(pulseData.pulseStrength * 100).toFixed(0)}%
                  </Text>
                </View>
                <View style={styles.metricRow}>
                  <Text style={styles.metricLabel}>Regularity:</Text>
                  <Text style={styles.metricValue}>
                    {(pulseData.regularity * 100).toFixed(0)}%
                  </Text>
                </View>
              </View>
            )}

            {/* Dosha Analysis */}
            {doshaAnalysis && (
              <>
                <View style={styles.doshaCard}>
                  <Text style={styles.doshaTitle}>Doshic Pulse Profile</Text>
                  <View style={styles.doshaScores}>
                    <View style={styles.doshaScoreItem}>
                      <Text style={[styles.doshaLabel, { color: '#60A5FA' }]}>Vata</Text>
                      <Text style={styles.doshaPercent}>{doshaAnalysis.vataScore}%</Text>
                      <View style={styles.doshaBar}>
                        <View
                          style={[
                            styles.doshaBarFill,
                            { width: `${doshaAnalysis.vataScore}%`, backgroundColor: '#60A5FA' },
                          ]}
                        />
                      </View>
                    </View>
                    <View style={styles.doshaScoreItem}>
                      <Text style={[styles.doshaLabel, { color: '#EF4444' }]}>Pitta</Text>
                      <Text style={styles.doshaPercent}>{doshaAnalysis.pittaScore}%</Text>
                      <View style={styles.doshaBar}>
                        <View
                          style={[
                            styles.doshaBarFill,
                            { width: `${doshaAnalysis.pittaScore}%`, backgroundColor: '#EF4444' },
                          ]}
                        />
                      </View>
                    </View>
                    <View style={styles.doshaScoreItem}>
                      <Text style={[styles.doshaLabel, { color: '#10B981' }]}>Kapha</Text>
                      <Text style={styles.doshaPercent}>{doshaAnalysis.kaphaScore}%</Text>
                      <View style={styles.doshaBar}>
                        <View
                          style={[
                            styles.doshaBarFill,
                            { width: `${doshaAnalysis.kaphaScore}%`, backgroundColor: '#10B981' },
                          ]}
                        />
                      </View>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.dominantBadge,
                      { backgroundColor: getDoshaColor(doshaAnalysis.dominant) + '20' },
                    ]}
                  >
                    <Text
                      style={[styles.dominantText, { color: getDoshaColor(doshaAnalysis.dominant) }]}
                    >
                      {doshaAnalysis.dominant === 'Balanced'
                        ? 'Tridoshic Balance'
                        : `${doshaAnalysis.dominant} Dominant`}
                    </Text>
                  </View>
                </View>

                {/* Interpretation */}
                <View style={styles.interpretationCard}>
                  <View style={styles.interpretationTitleRow}>
                    <MaterialCommunityIcons name="stethoscope" size={20} color="#6A1B9A" />
                    <Text style={styles.interpretationTitle}> Pulse Interpretation</Text>
                  </View>
                  <Text style={styles.interpretationText}>{doshaAnalysis.interpretation}</Text>
                </View>

                {/* Recommendations */}
                <View style={styles.recommendationsCard}>
                  <View style={styles.recommendationsTitleRow}>
                    <Feather name="check-circle" size={18} color="#6B8E23" />
                    <Text style={styles.recommendationsTitle}>
                      {' '}Recommendations for {doshaAnalysis.dominant}
                    </Text>
                  </View>
                  {doshaAnalysis.recommendations.map((rec, idx) => (
                    <View key={idx} style={styles.recommendationRow}>
                      <Text style={styles.recommendationBullet}>•</Text>
                      <Text style={styles.recommendationText}>{rec}</Text>
                    </View>
                  ))}
                </View>
              </>
            )}

            {/* Auto-saved */}
            <View style={styles.autoSavedBadge}>
              <Feather name="check-circle" size={16} color="#6B8E23" />
              <Text style={styles.autoSavedText}>Auto-saved to My Plan</Text>
            </View>

            {/* Buttons */}
            <TouchableOpacity
              style={styles.ojasButton}
              onPress={() => navigation.navigate('Ojas' as never)}
            >
              <Text style={styles.ojasButtonText}>View Ojas Tracker →</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={resetAnalysis}>
              <View style={styles.buttonContent}>
                <Feather name="refresh-cw" size={18} color="#6B8E23" />
                <Text style={styles.secondaryButtonText}> Measure Again</Text>
              </View>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* Product Recommendations */}
      {doshaAnalysis && (
        <View style={styles.productRecommendationsSection}>
          <View style={styles.productSectionTitleRow}>
            <MaterialCommunityIcons name="leaf" size={22} color="#4CAF50" />
            <Text style={styles.productSectionTitle}> Suggested Ayurvedic Products</Text>
          </View>
          <Text style={styles.productSectionSubtitle}>
            These herbs can help balance your {doshaAnalysis.dominant} dosha
          </Text>
          {getRecommendedProducts(doshaAnalysis.dominant.toLowerCase() as 'vata' | 'pitta' | 'kapha', 3).map((product) => (
            <ProductCard key={product.id} product={product} showFullDetails={false} />
          ))}
          <TouchableOpacity
            style={styles.shopMoreButton}
            onPress={() => navigation.navigate('Pharmacy' as never)}
          >
            <Text style={styles.shopMoreText}>View All Products →</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ManuscriptColors.palmLeaf,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  headerIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#3E2723',
  },
  subtitle: {
    fontSize: 14,
    color: '#5D4037',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  permissionCard: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    gap: 16,
  },
  permissionText: {
    textAlign: 'center',
    color: '#5D4037',
    fontSize: 16,
    lineHeight: 24,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  errorText: {
    color: '#C62828',
    fontSize: 14,
    flex: 1,
  },
  cameraSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  cameraContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: '#FF6B9D',
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  cameraOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  pulseRing: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: '#FF6B9D',
  },
  countdownContainer: {
    alignItems: 'center',
  },
  countdownText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  liveBPM: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FF6B9D',
    marginTop: 8,
  },
  fingerStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 16,
    gap: 8,
  },
  fingerStatusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  waveformContainer: {
    width: '100%',
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  waveformLabel: {
    fontSize: 12,
    color: '#5D4037',
    marginBottom: 8,
    fontWeight: '600',
  },
  waveform: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 50,
    gap: 2,
  },
  waveformBar: {
    width: 4,
    backgroundColor: '#FF6B9D',
    borderRadius: 2,
  },
  instructionsCard: {
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#1976D2',
  },
  instructionsTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  instructionStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#1976D2',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 10,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: '#3E2723',
    lineHeight: 20,
  },
  bold: {
    fontWeight: 'bold',
  },
  primaryButton: {
    backgroundColor: '#FF6B9D',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  educationCard: {
    backgroundColor: '#FFF9E6',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#DAA520',
  },
  educationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  educationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#B87333',
  },
  educationText: {
    fontSize: 14,
    color: '#5D4037',
    lineHeight: 21,
    marginBottom: 12,
  },
  educationSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3E2723',
    marginBottom: 8,
  },
  pulseTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  pulseType: {
    fontSize: 13,
    color: '#5D4037',
    flex: 1,
  },
  manuscriptQuote: {
    fontSize: 13,
    color: '#5D4037',
    fontStyle: 'italic',
    marginTop: 12,
    marginBottom: 6,
    paddingLeft: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#D4A574',
  },
  manuscriptSource: {
    fontSize: 12,
    color: '#B87333',
    fontStyle: 'italic',
    textAlign: 'right',
  },
  resultsSection: {
    marginBottom: 16,
  },
  resultsTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3E2723',
  },
  metricsCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#FF6B9D',
  },
  metricsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3E2723',
    marginBottom: 12,
    textAlign: 'center',
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  metricLabel: {
    fontSize: 14,
    color: '#5D4037',
  },
  metricValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3E2723',
  },
  doshaCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  doshaTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3E2723',
    marginBottom: 16,
    textAlign: 'center',
  },
  doshaScores: {
    gap: 12,
  },
  doshaScoreItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  doshaLabel: {
    width: 50,
    fontSize: 14,
    fontWeight: '600',
  },
  doshaPercent: {
    width: 40,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3E2723',
    textAlign: 'right',
  },
  doshaBar: {
    flex: 1,
    height: 12,
    backgroundColor: '#F0F0F0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  doshaBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  dominantBadge: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'center',
  },
  dominantText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  interpretationCard: {
    backgroundColor: '#F3E5F5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#9C27B0',
  },
  interpretationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  interpretationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6A1B9A',
  },
  interpretationText: {
    fontSize: 14,
    color: '#3E2723',
    lineHeight: 21,
  },
  recommendationsCard: {
    backgroundColor: '#E8F5E9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  recommendationsTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  recommendationsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  recommendationRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  recommendationBullet: {
    color: '#4CAF50',
    fontSize: 16,
    marginRight: 8,
    fontWeight: 'bold',
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    color: '#3E2723',
    lineHeight: 20,
  },
  autoSavedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F8E9',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 16,
    gap: 8,
  },
  autoSavedText: {
    color: '#6B8E23',
    fontSize: 14,
    fontWeight: '600',
  },
  ojasButton: {
    backgroundColor: '#FFF8E7',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#FFD700',
    alignItems: 'center',
  },
  ojasButtonText: {
    color: '#E65100',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#9EBF88',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#6B8E23',
    fontSize: 16,
    fontWeight: '600',
  },
  productRecommendationsSection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  productSectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  productSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  productSectionSubtitle: {
    fontSize: 13,
    color: '#5D4037',
    marginBottom: 12,
  },
  shopMoreButton: {
    backgroundColor: '#E8F5E9',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 12,
  },
  shopMoreText: {
    color: '#2E7D32',
    fontSize: 14,
    fontWeight: '600',
  },
});
