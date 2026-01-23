import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons, Ionicons, FontAwesome5, Feather } from '@expo/vector-icons';
import { ManuscriptColors, ManuscriptFonts, BorderPatterns } from '../components/ManuscriptConstants';
import ManuscriptCard from '../components/ManuscriptCard';

const { width } = Dimensions.get('window');

interface UserData {
  name: string;
  hasAnyData: boolean;
  pulseAnalysis: any | null;
  skinAnalysis: any | null;
  eyeAnalysis: any | null;
  nailAnalysis: any | null;
  tongueAnalysis: any | null;
  doshaResult: any | null;
  ojasScore: number | null;
  skippedDiagnostics: string[];
}

interface DiagnosticItem {
  id: string;
  name: string;
  title: string;
  subtitle: string;
  icon: string;
  iconFamily: 'MaterialCommunityIcons' | 'Ionicons';
  color: string;
  borderColor: string;
  ctaText: string;
  screen: string;
}

const diagnostics: DiagnosticItem[] = [
  {
    id: 'dosha',
    name: 'Dosha',
    title: 'Dosha Assessment',
    subtitle: 'Discover your Ayurvedic constitution',
    icon: 'clipboard-check-outline',
    iconFamily: 'MaterialCommunityIcons',
    color: '#7E57C2',
    borderColor: '#512DA8',
    ctaText: 'Take Quiz',
    screen: 'Assessment',
  },
  {
    id: 'pulse',
    name: 'Pulse',
    title: 'Digital Nadi Pariksha',
    subtitle: 'Discover your dosha from heartbeat patterns',
    icon: 'heart-pulse',
    iconFamily: 'MaterialCommunityIcons',
    color: '#FF6B6B',
    borderColor: '#D32F2F',
    ctaText: 'Measure Pulse',
    screen: 'PulseAnalysis',
  },
  {
    id: 'skin',
    name: 'Skin',
    title: 'Facial Ojas Scan',
    subtitle: 'Measure your glow for Ojas tracking',
    icon: 'face-woman-shimmer',
    iconFamily: 'MaterialCommunityIcons',
    color: '#FFB74D',
    borderColor: '#FF9800',
    ctaText: 'Take Selfie',
    screen: 'SkinAnalysis',
  },
  {
    id: 'eye',
    name: 'Eyes',
    title: 'Eye Analysis',
    subtitle: 'Netra Pariksha - Eye health & dosha',
    icon: 'eye-outline',
    iconFamily: 'Ionicons',
    color: '#64B5F6',
    borderColor: '#1976D2',
    ctaText: 'Analyze Eyes',
    screen: 'EyeAnalysis',
  },
  {
    id: 'nail',
    name: 'Nails',
    title: 'Nail Analysis',
    subtitle: 'Nakha Pariksha - Mineral & nutrient health',
    icon: 'hand-back-right-outline',
    iconFamily: 'MaterialCommunityIcons',
    color: '#BA68C8',
    borderColor: '#7B1FA2',
    ctaText: 'Analyze Nails',
    screen: 'NailAnalysis',
  },
  {
    id: 'tongue',
    name: 'Tongue',
    title: 'Tongue Diagnosis',
    subtitle: 'Jihva Pariksha - Learn tongue analysis',
    icon: 'account-voice',
    iconFamily: 'MaterialCommunityIcons',
    color: '#9EBF88',
    borderColor: '#6B8E23',
    ctaText: 'Start Diagnosis',
    screen: 'TongueDiagnosis',
  },
];

// Helper component for quick fix icons
const QuickFixIcon = ({ iconName, iconColor }: { iconName: string; iconColor: string }) => {
  return (
    <MaterialCommunityIcons name={iconName as any} size={24} color={iconColor} />
  );
};

const quickFixes = [
  {
    id: 'screentime',
    title: 'Too much screen time',
    iconName: 'cellphone-off',
    iconColor: '#5D4037',
    iconBg: '#E8F5E9',
    remedy: 'Sensory detox + triphala for eyes',
    why: 'Charaka calls this "atiyoga" - excessive sensory input depletes Ojas (vitality)',
    category: 'Digital Wellness',
  },
  {
    id: 'stress',
    title: 'Stressed & anxious',
    iconName: 'head-dots-horizontal-outline',
    iconColor: '#7B1FA2',
    iconBg: '#F3E5F5',
    remedy: 'Ashwagandha + Pranayama breathing',
    why: 'Vata imbalance from mental overload - need grounding practices',
    category: 'Mental Health',
  },
  {
    id: 'burnout',
    title: 'Burnt out & exhausted',
    iconName: 'battery-low',
    iconColor: '#D32F2F',
    iconBg: '#FFEBEE',
    remedy: 'Ojas-building foods + rest protocol',
    why: 'Pitta aggravation - your fire is consuming itself, need cooling',
    category: 'Energy',
  },
  {
    id: 'sleep',
    title: 'Can\'t sleep well',
    iconName: 'weather-night',
    iconColor: '#1565C0',
    iconBg: '#E3F2FD',
    remedy: 'Nutmeg milk + no screens after 8pm',
    why: 'Late-night Vata increases, disrupts circadian rhythm',
    category: 'Sleep',
  },
  {
    id: 'digestion',
    title: 'Digestion issues',
    iconName: 'stomach',
    iconColor: '#EF6C00',
    iconBg: '#FFF3E0',
    remedy: 'Triphala + ginger tea before meals',
    why: 'Weak Agni (digestive fire) - manuscripts teach "disease starts in gut"',
    category: 'Digestion',
  },
  {
    id: 'focus',
    title: 'Can\'t concentrate',
    iconName: 'target',
    iconColor: '#00695C',
    iconBg: '#E0F2F1',
    remedy: 'Brahmi + single-tasking practice',
    why: 'Scattered Vata energy - need mental grounding',
    category: 'Focus',
  },
  {
    id: 'weight',
    title: 'Weight gain & sluggish',
    iconName: 'scale-bathroom',
    iconColor: '#6A1B9A',
    iconBg: '#F3E5F5',
    remedy: 'Trikatu spice + morning exercise',
    why: 'Kapha accumulation - manuscripts prescribe stimulating practices',
    category: 'Metabolism',
  },
  {
    id: 'angry',
    title: 'Irritable & angry',
    iconName: 'emoticon-angry-outline',
    iconColor: '#C62828',
    iconBg: '#FFEBEE',
    remedy: 'Cooling foods + moonlight walks',
    why: 'Excess Pitta heat - need cooling to balance fire element',
    category: 'Emotions',
  },
  {
    id: 'procrastination',
    title: 'Procrastination & laziness',
    iconName: 'clock-alert-outline',
    iconColor: '#4E342E',
    iconBg: '#EFEBE9',
    remedy: 'Morning routine + stimulating spices',
    why: 'Heavy Kapha - manuscripts recommend early rising & movement',
    category: 'Motivation',
  },
  {
    id: 'overthinking',
    title: 'Racing thoughts',
    iconName: 'head-sync-outline',
    iconColor: '#303F9F',
    iconBg: '#E8EAF6',
    remedy: 'Oil massage + warm grounding foods',
    why: 'Vata in mind - manuscripts teach "like increases like, opposites balance"',
    category: 'Mental Clarity',
  },
  {
    id: 'highbp',
    title: 'High blood pressure',
    iconName: 'heart-flash',
    iconColor: '#B71C1C',
    iconBg: '#FFCDD2',
    remedy: 'Arjuna bark + reduce salt & stress',
    why: 'Pitta-Vata imbalance affecting Rakta (blood) - need cooling and calming',
    category: 'Heart Health',
  },
  {
    id: 'thyroid',
    title: 'Thyroid imbalance',
    iconName: 'account-tie-outline',
    iconColor: '#00838F',
    iconBg: '#E0F7FA',
    remedy: 'Ashwagandha + Kanchanar Guggulu',
    why: 'Kapha blockage in throat region - need to clear channels and boost metabolism',
    category: 'Hormones',
  },
  {
    id: 'backpain',
    title: 'Back pain',
    iconName: 'human-handsdown',
    iconColor: '#5D4037',
    iconBg: '#D7CCC8',
    remedy: 'Warm oil massage + gentle yoga asanas',
    why: 'Vata aggravation in bones and joints - need warmth and lubrication',
    category: 'Pain Relief',
  },
  {
    id: 'neckpain',
    title: 'Neck pain & stiffness',
    iconName: 'account-alert-outline',
    iconColor: '#37474F',
    iconBg: '#CFD8DC',
    remedy: 'Mahanarayan oil + neck stretches',
    why: 'Vata accumulation from poor posture - manuscripts recommend oil therapy',
    category: 'Pain Relief',
  },
  {
    id: 'headache',
    title: 'Headaches & migraines',
    iconName: 'head-outline',
    iconColor: '#AD1457',
    iconBg: '#F8BBD9',
    remedy: 'Brahmi oil on scalp + cooling pranayama',
    why: 'Often Pitta excess rising to head - need cooling and calming practices',
    category: 'Pain Relief',
  },
  {
    id: 'hairfall',
    title: 'Hair fall & thinning',
    iconName: 'face-woman-outline',
    iconColor: '#4A148C',
    iconBg: '#E1BEE7',
    remedy: 'Bhringraj oil + iron-rich foods',
    why: 'Pitta imbalance affecting hair roots - need nourishment and cooling',
    category: 'Hair & Skin',
  },
  {
    id: 'acidity',
    title: 'Acidity & heartburn',
    iconName: 'fire-alert',
    iconColor: '#E65100',
    iconBg: '#FFE0B2',
    remedy: 'Cooling foods + avoid spicy/sour',
    why: 'Excess Pitta in stomach - Charaka prescribes Shatavari and coconut',
    category: 'Digestion',
  },
  {
    id: 'jointpain',
    title: 'Joint pain & arthritis',
    iconName: 'bone',
    iconColor: '#795548',
    iconBg: '#D7CCC8',
    remedy: 'Guggulu + warm sesame oil massage',
    why: 'Vata in joints causing dryness - need lubrication and warmth',
    category: 'Pain Relief',
  },
  {
    id: 'diabetes',
    title: 'Blood sugar concerns',
    iconName: 'water-percent',
    iconColor: '#1565C0',
    iconBg: '#BBDEFB',
    remedy: 'Bitter gourd + fenugreek + Gymnema',
    why: 'Kapha-Pitta imbalance affecting Medas (fat tissue) - need bitter tastes',
    category: 'Metabolism',
  },
  {
    id: 'coldcough',
    title: 'Cold, cough & congestion',
    iconName: 'weather-snowy-rainy',
    iconColor: '#0277BD',
    iconBg: '#B3E5FC',
    remedy: 'Tulsi tea + ginger honey + steam',
    why: 'Kapha accumulation in respiratory channels - need warming expectorants',
    category: 'Immunity',
  },
  {
    id: 'skinissues',
    title: 'Skin problems & acne',
    iconName: 'emoticon-sad-outline',
    iconColor: '#F57C00',
    iconBg: '#FFE0B2',
    remedy: 'Neem + turmeric + blood purification',
    why: 'Pitta affecting Rakta (blood) - manuscripts recommend cooling and cleansing',
    category: 'Hair & Skin',
  },
  {
    id: 'lowimmunity',
    title: 'Weak immunity',
    iconName: 'shield-alert-outline',
    iconColor: '#2E7D32',
    iconBg: '#C8E6C9',
    remedy: 'Chyawanprash + Giloy + Amla',
    why: 'Low Ojas (vital essence) - need Rasayana (rejuvenation) therapy',
    category: 'Immunity',
  },
  {
    id: 'pcod',
    title: 'PCOD/PCOS symptoms',
    iconName: 'gender-female',
    iconColor: '#C2185B',
    iconBg: '#F8BBD9',
    remedy: 'Shatavari + lifestyle changes',
    why: 'Kapha-Vata imbalance affecting reproductive system - need hormone balance',
    category: 'Hormones',
  },
];

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [showAllFixes, setShowAllFixes] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    name: '',
    hasAnyData: false,
    pulseAnalysis: null,
    skinAnalysis: null,
    eyeAnalysis: null,
    nailAnalysis: null,
    tongueAnalysis: null,
    doshaResult: null,
    ojasScore: null,
    skippedDiagnostics: [],
  });

  const fetchUserData = async () => {
    try {
      const [
        name,
        pulseAnalysis,
        skinAnalysis,
        eyeAnalysis,
        nailAnalysis,
        tongueAnalysis,
        doshaResult,
        ojasData,
        skippedData,
      ] = await Promise.all([
        AsyncStorage.getItem('userName'),
        AsyncStorage.getItem('pulseAnalysis'),
        AsyncStorage.getItem('skinAnalysis'),
        AsyncStorage.getItem('eyeAnalysis'),
        AsyncStorage.getItem('nailAnalysis'),
        AsyncStorage.getItem('tongueAnalysis'),
        AsyncStorage.getItem('doshaResult'),
        AsyncStorage.getItem('ojasHabits'),
        AsyncStorage.getItem('skippedDiagnostics'),
      ]);

      const pulse = pulseAnalysis ? JSON.parse(pulseAnalysis) : null;
      const skin = skinAnalysis ? JSON.parse(skinAnalysis) : null;
      const eye = eyeAnalysis ? JSON.parse(eyeAnalysis) : null;
      const nail = nailAnalysis ? JSON.parse(nailAnalysis) : null;
      const tongue = tongueAnalysis ? JSON.parse(tongueAnalysis) : null;
      const dosha = doshaResult ? JSON.parse(doshaResult) : null;
      const ojas = ojasData ? JSON.parse(ojasData) : null;
      const skipped = skippedData ? JSON.parse(skippedData) : [];

      const hasAnyData = !!(pulse || skin || eye || nail || tongue || dosha);

      setUserData({
        name: name || '',
        hasAnyData,
        pulseAnalysis: pulse,
        skinAnalysis: skin,
        eyeAnalysis: eye,
        nailAnalysis: nail,
        tongueAnalysis: tongue,
        doshaResult: dosha,
        ojasScore: ojas?.score || null,
        skippedDiagnostics: skipped,
      });
    } catch (error) {
      console.log('Error fetching user data:', error);
    }
  };

  const skipDiagnostic = async (diagnosticId: string) => {
    try {
      const newSkipped = [...userData.skippedDiagnostics, diagnosticId];
      await AsyncStorage.setItem('skippedDiagnostics', JSON.stringify(newSkipped));
      setUserData(prev => ({
        ...prev,
        skippedDiagnostics: newSkipped,
      }));
    } catch (error) {
      console.log('Error skipping diagnostic:', error);
    }
  };

  const undoSkip = async (diagnosticId: string) => {
    try {
      const newSkipped = userData.skippedDiagnostics.filter(id => id !== diagnosticId);
      await AsyncStorage.setItem('skippedDiagnostics', JSON.stringify(newSkipped));
      setUserData(prev => ({
        ...prev,
        skippedDiagnostics: newSkipped,
      }));
    } catch (error) {
      console.log('Error undoing skip:', error);
    }
  };

  // Check if a diagnostic is completed
  const isDiagnosticCompleted = (id: string): boolean => {
    switch (id) {
      case 'dosha': return !!userData.doshaResult;
      case 'pulse': return !!userData.pulseAnalysis;
      case 'skin': return !!userData.skinAnalysis;
      case 'eye': return !!userData.eyeAnalysis;
      case 'nail': return !!userData.nailAnalysis;
      case 'tongue': return !!userData.tongueAnalysis;
      default: return false;
    }
  };

  // Get pending diagnostics (not completed AND not skipped)
  const pendingDiagnostics = diagnostics.filter(
    d => !isDiagnosticCompleted(d.id) && !userData.skippedDiagnostics.includes(d.id)
  );

  // Get completed diagnostics
  const completedDiagnostics = diagnostics.filter(d => isDiagnosticCompleted(d.id));

  // Get skipped diagnostics
  const skippedDiagnosticItems = diagnostics.filter(
    d => userData.skippedDiagnostics.includes(d.id) && !isDiagnosticCompleted(d.id)
  );

  useFocusEffect(
    React.useCallback(() => {
      fetchUserData();
    }, [])
  );

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Get dominant dosha from any analysis
  const getDominantDosha = () => {
    if (userData.doshaResult?.dominant) return userData.doshaResult.dominant;
    if (userData.pulseAnalysis?.doshaAnalysis?.dominant) return userData.pulseAnalysis.doshaAnalysis.dominant;
    if (userData.skinAnalysis?.dominantDosha) return userData.skinAnalysis.dominantDosha;
    if (userData.eyeAnalysis?.dominantDosha) return userData.eyeAnalysis.dominantDosha;
    if (userData.nailAnalysis?.dominantDosha) return userData.nailAnalysis.dominantDosha;
    return null;
  };

  // Count completed analyses
  const getCompletedAnalyses = () => {
    let count = 0;
    if (userData.doshaResult) count++;
    if (userData.pulseAnalysis) count++;
    if (userData.skinAnalysis) count++;
    if (userData.eyeAnalysis) count++;
    if (userData.nailAnalysis) count++;
    if (userData.tongueAnalysis) count++;
    return count;
  };

  const dominantDosha = getDominantDosha();
  const completedAnalyses = getCompletedAnalyses();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Personalized Hero Section */}
      {userData.hasAnyData ? (
        // RETURNING USER - Personalized greeting with summary
        <View style={styles.hero}>
          <Text style={styles.greeting}>{getGreeting()}, {userData.name || 'Seeker'}</Text>

          {/* Health Summary Card */}
          <View style={styles.healthSummary}>
            {dominantDosha && (
              <View style={styles.summaryItem}>
                <MaterialCommunityIcons
                  name={dominantDosha === 'Vata' ? 'weather-windy' : dominantDosha === 'Pitta' ? 'fire' : 'leaf'}
                  size={24}
                  color={dominantDosha === 'Vata' ? '#60A5FA' : dominantDosha === 'Pitta' ? '#EF4444' : '#10B981'}
                />
                <Text style={styles.summaryLabel}>Dosha</Text>
                <Text style={styles.summaryValue}>{dominantDosha}</Text>
              </View>
            )}
            <View style={styles.summaryItem}>
              <MaterialCommunityIcons name="clipboard-check-outline" size={24} color="#6B8E23" />
              <Text style={styles.summaryLabel}>Analyses</Text>
              <Text style={styles.summaryValue}>{completedAnalyses}/6</Text>
            </View>
            {userData.ojasScore !== null && (
              <View style={styles.summaryItem}>
                <MaterialCommunityIcons name="shimmer" size={24} color="#E65100" />
                <Text style={styles.summaryLabel}>Ojas</Text>
                <Text style={styles.summaryValue}>{userData.ojasScore}</Text>
              </View>
            )}
          </View>
        </View>
      ) : (
        // NEW USER - Welcome message
        <View style={styles.hero}>
          <View style={styles.heroIconContainer}>
            <Image
              source={require('../../assets/icon.png')}
              style={styles.heroLogoImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.welcomeTitle}>Welcome{userData.name ? `, ${userData.name}` : ''}!</Text>
          <Text style={styles.subtitle}>
            Let's discover your unique constitution through ancient Ayurvedic diagnostics
          </Text>
        </View>
      )}

      {/* PENDING DIAGNOSTICS - Show prominently at top until completed or skipped */}
      {pendingDiagnostics.length > 0 && (
        <View style={styles.diagnosticsSection}>
          <View style={styles.sectionHeaderRow}>
            <Feather name="activity" size={22} color={ManuscriptColors.inkBlack} />
            <Text style={styles.diagnosticsSectionTitle}>
              {userData.hasAnyData ? 'Continue Your Journey' : 'Start Your Journey'}
            </Text>
          </View>
          <Text style={styles.diagnosticsProgress}>
            {completedAnalyses} of 6 completed
          </Text>

          {pendingDiagnostics.map((diagnostic) => (
            <View key={diagnostic.id} style={[styles.diagnosticCard, { backgroundColor: diagnostic.color, borderColor: diagnostic.borderColor }]}>
              <TouchableOpacity
                style={styles.diagnosticCardContent}
                onPress={() => navigation.navigate(diagnostic.screen)}
              >
                <View style={styles.diagnosticHeader}>
                  <View style={styles.diagnosticIconContainer}>
                    {diagnostic.iconFamily === 'Ionicons' ? (
                      <Ionicons name={diagnostic.icon as any} size={36} color="#FFFFFF" />
                    ) : (
                      <MaterialCommunityIcons name={diagnostic.icon as any} size={36} color="#FFFFFF" />
                    )}
                  </View>
                  <View style={styles.diagnosticText}>
                    <Text style={styles.diagnosticTitle}>{diagnostic.title}</Text>
                    <Text style={styles.diagnosticSubtitle}>{diagnostic.subtitle}</Text>
                  </View>
                </View>
                <View style={styles.diagnosticActions}>
                  <View style={[styles.diagnosticCTA, { borderColor: diagnostic.borderColor }]}>
                    <Text style={[styles.diagnosticCTAText, { color: diagnostic.borderColor }]}>{diagnostic.ctaText}</Text>
                    <Feather name="arrow-right" size={16} color={diagnostic.borderColor} style={{ marginLeft: 6 }} />
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.skipButton}
                onPress={() => skipDiagnostic(diagnostic.id)}
              >
                <Text style={styles.skipButtonText}>Skip for now</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* Ojas Glow Tracker */}
      <TouchableOpacity
        style={styles.ojasCard}
        onPress={() => navigation.navigate('Ojas')}
      >
        <View style={styles.ojasHeader}>
          <View style={styles.ojasIconContainer}>
            <MaterialCommunityIcons name="shimmer" size={40} color={ManuscriptColors.inkBlack} />
          </View>
          <View style={styles.ojasTextContainer}>
            <Text style={styles.ojasTitle}>Track Your Ojas Glow</Text>
            <Text style={styles.ojasSubtitle}>
              {userData.ojasScore !== null
                ? `Current score: ${userData.ojasScore} - Keep building your vitality!`
                : 'Start tracking your daily vitality habits'}
            </Text>
          </View>
        </View>
        <View style={styles.ojasCTA}>
          <Text style={styles.ojasCTAText}>{userData.ojasScore !== null ? 'Continue Tracking' : 'Start Tracking'}</Text>
          <Feather name="arrow-right" size={16} color={ManuscriptColors.copperBrown} style={{ marginLeft: 6 }} />
        </View>
      </TouchableOpacity>

      {/* Quick Fixes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Fixes</Text>
        <Text style={styles.sectionSubtitle}>
          Pick what you're feeling right now
        </Text>

        <View style={styles.quickFixGrid}>
          {quickFixes.slice(0, showAllFixes ? quickFixes.length : 6).map((fix) => (
            <TouchableOpacity
              key={fix.id}
              style={styles.quickFixChip}
              onPress={() => {
                navigation.navigate('QuickFixDetail', { fixId: fix.id });
              }}
            >
              <View style={[styles.quickFixIcon, { backgroundColor: fix.iconBg }]}>
                <QuickFixIcon iconName={fix.iconName} iconColor={fix.iconColor} />
              </View>
              <Text style={styles.quickFixTitle} numberOfLines={2}>{fix.title}</Text>
              <Feather name="chevron-right" size={14} color={ManuscriptColors.fadedInk} />
            </TouchableOpacity>
          ))}
        </View>

        {!showAllFixes && quickFixes.length > 6 && (
          <TouchableOpacity
            style={styles.showMoreButton}
            onPress={() => setShowAllFixes(true)}
          >
            <Text style={styles.showMoreText}>Show {quickFixes.length - 6} more fixes...</Text>
          </TouchableOpacity>
        )}

        {showAllFixes && (
          <TouchableOpacity
            style={styles.showMoreButton}
            onPress={() => setShowAllFixes(false)}
          >
            <Text style={styles.showMoreText}>Show less</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* COMPLETED DIAGNOSTICS - Show as smaller cards */}
      {completedDiagnostics.length > 0 && (
        <View style={styles.completedSection}>
          <View style={styles.completedHeader}>
            <Feather name="check-circle" size={18} color={ManuscriptColors.indigo} />
            <Text style={styles.completedTitle}>Completed Analyses</Text>
          </View>
          <Text style={styles.completedSubtitle}>Tap to run again</Text>

          {completedDiagnostics.map((diagnostic) => (
            <TouchableOpacity
              key={diagnostic.id}
              style={[styles.miniDiagnosticCard, { borderLeftColor: diagnostic.borderColor }]}
              onPress={() => navigation.navigate(diagnostic.screen)}
            >
              <View style={[styles.miniIconContainer, { backgroundColor: diagnostic.color }]}>
                {diagnostic.iconFamily === 'Ionicons' ? (
                  <Ionicons name={diagnostic.icon as any} size={24} color="#FFFFFF" />
                ) : (
                  <MaterialCommunityIcons name={diagnostic.icon as any} size={24} color="#FFFFFF" />
                )}
              </View>
              <View style={styles.miniTextContainer}>
                <Text style={styles.miniTitle}>{diagnostic.title}</Text>
                <Text style={styles.miniSubtitle}>{diagnostic.name} analysis completed</Text>
              </View>
              <Feather name="refresh-cw" size={18} color={ManuscriptColors.fadedInk} />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* SKIPPED DIAGNOSTICS - Show as smaller cards with undo option */}
      {skippedDiagnosticItems.length > 0 && (
        <View style={styles.skippedSection}>
          <View style={styles.skippedHeader}>
            <Feather name="pause-circle" size={18} color={ManuscriptColors.fadedInk} />
            <Text style={styles.skippedTitle}>Skipped for Now</Text>
          </View>
          <Text style={styles.skippedSubtitle}>Tap to try or undo</Text>

          {skippedDiagnosticItems.map((diagnostic) => (
            <View key={diagnostic.id} style={[styles.miniDiagnosticCard, { borderLeftColor: ManuscriptColors.copperBrown, opacity: 0.8 }]}>
              <TouchableOpacity
                style={styles.miniCardTouchable}
                onPress={() => navigation.navigate(diagnostic.screen)}
              >
                <View style={[styles.miniIconContainer, { backgroundColor: ManuscriptColors.fadedInk }]}>
                  {diagnostic.iconFamily === 'Ionicons' ? (
                    <Ionicons name={diagnostic.icon as any} size={24} color="#FFFFFF" />
                  ) : (
                    <MaterialCommunityIcons name={diagnostic.icon as any} size={24} color="#FFFFFF" />
                  )}
                </View>
                <View style={styles.miniTextContainer}>
                  <Text style={styles.miniTitle}>{diagnostic.title}</Text>
                  <Text style={styles.miniSubtitle}>Tap to try this analysis</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.undoButton}
                onPress={() => undoSkip(diagnostic.id)}
              >
                <Text style={styles.undoButtonText}>Undo</Text>
              </TouchableOpacity>
            </View>
          ))}
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
  },
  hero: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: ManuscriptColors.goldLeaf,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: ManuscriptColors.inkBlack,
    marginBottom: 16,
    textAlign: 'center',
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: ManuscriptColors.inkBlack,
    textAlign: 'center',
    marginBottom: 8,
  },
  healthSummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: ManuscriptColors.parchment,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: ManuscriptColors.goldLeaf,
  },
  summaryItem: {
    alignItems: 'center',
    gap: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: ManuscriptColors.fadedInk,
    marginTop: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: ManuscriptColors.inkBlack,
  },
  heroIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: ManuscriptColors.parchment,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: ManuscriptColors.goldLeaf,
  },
  heroLogoImage: {
    width: 90,
    height: 90,
  },
  title: {
    fontSize: ManuscriptFonts.titleSize,
    fontWeight: 'bold',
    fontFamily: ManuscriptFonts.heading,
    color: ManuscriptColors.inkBlack,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: ManuscriptFonts.bodySize,
    fontFamily: ManuscriptFonts.body,
    color: ManuscriptColors.fadedInk,
    textAlign: 'center',
    paddingHorizontal: 20,
    fontStyle: 'italic',
  },
  diagnosticsSection: {
    marginBottom: 24,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  diagnosticsSectionTitle: {
    fontSize: ManuscriptFonts.subheadingSize,
    fontWeight: 'bold',
    fontFamily: ManuscriptFonts.heading,
    color: ManuscriptColors.inkBlack,
    marginLeft: 8,
  },
  diagnosticsProgress: {
    fontSize: ManuscriptFonts.captionSize,
    color: ManuscriptColors.fadedInk,
    textAlign: 'center',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  diagnosticCard: {
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 3,
    shadowColor: ManuscriptColors.scrollShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    overflow: 'hidden',
  },
  diagnosticCardContent: {
    padding: 20,
  },
  diagnosticIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  diagnosticHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  diagnosticText: {
    flex: 1,
  },
  diagnosticTitle: {
    fontSize: ManuscriptFonts.subheadingSize,
    fontWeight: 'bold',
    fontFamily: ManuscriptFonts.heading,
    color: '#FFFFFF',
    marginBottom: 6,
  },
  diagnosticSubtitle: {
    fontSize: ManuscriptFonts.captionSize,
    fontFamily: ManuscriptFonts.body,
    color: '#FFFFFF',
    opacity: 0.9,
    lineHeight: 18,
  },
  diagnosticActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  diagnosticCTA: {
    backgroundColor: ManuscriptColors.parchment,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  diagnosticCTAText: {
    fontWeight: 'bold',
    fontFamily: ManuscriptFonts.body,
    fontSize: ManuscriptFonts.captionSize,
  },
  skipButton: {
    backgroundColor: 'rgba(0,0,0,0.15)',
    paddingVertical: 10,
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#FFFFFF',
    fontSize: ManuscriptFonts.captionSize,
    fontWeight: '500',
    opacity: 0.9,
  },
  // Completed diagnostics section
  completedSection: {
    marginBottom: 24,
  },
  completedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  completedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: ManuscriptColors.indigo,
    marginLeft: 8,
  },
  completedSubtitle: {
    fontSize: ManuscriptFonts.smallSize,
    color: ManuscriptColors.fadedInk,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  // Skipped diagnostics section
  skippedSection: {
    marginBottom: 24,
  },
  skippedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  skippedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: ManuscriptColors.fadedInk,
    marginLeft: 8,
  },
  skippedSubtitle: {
    fontSize: ManuscriptFonts.smallSize,
    color: ManuscriptColors.fadedInk,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  // Mini diagnostic cards (for completed/skipped)
  miniDiagnosticCard: {
    backgroundColor: ManuscriptColors.parchment,
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: ManuscriptColors.copperBrown,
    borderLeftWidth: 5,
  },
  miniCardTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  miniIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  miniTextContainer: {
    flex: 1,
  },
  miniTitle: {
    fontSize: ManuscriptFonts.bodySize,
    fontWeight: '600',
    color: ManuscriptColors.inkBlack,
    marginBottom: 2,
  },
  miniSubtitle: {
    fontSize: ManuscriptFonts.smallSize,
    color: ManuscriptColors.fadedInk,
  },
  undoButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: ManuscriptColors.oldPaper,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: ManuscriptColors.copperBrown,
  },
  undoButtonText: {
    fontSize: ManuscriptFonts.smallSize,
    color: ManuscriptColors.copperBrown,
    fontWeight: '600',
  },
  ojasCard: {
    backgroundColor: ManuscriptColors.saffron,
    borderRadius: 8,
    padding: 20,
    marginBottom: 24,
    borderWidth: 3,
    borderColor: ManuscriptColors.turmeric,
    shadowColor: ManuscriptColors.scrollShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  ojasHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ojasIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  ojasTextContainer: {
    flex: 1,
  },
  ojasTitle: {
    fontSize: ManuscriptFonts.subheadingSize,
    fontWeight: 'bold',
    fontFamily: ManuscriptFonts.heading,
    color: ManuscriptColors.inkBlack,
    marginBottom: 6,
  },
  ojasSubtitle: {
    fontSize: ManuscriptFonts.captionSize,
    fontFamily: ManuscriptFonts.body,
    color: ManuscriptColors.inkBrown,
    lineHeight: 18,
  },
  ojasCTA: {
    backgroundColor: ManuscriptColors.parchment,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  ojasCTAText: {
    color: ManuscriptColors.copperBrown,
    fontWeight: 'bold',
    fontFamily: ManuscriptFonts.body,
    fontSize: ManuscriptFonts.captionSize,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: ManuscriptFonts.headingSize,
    fontWeight: 'bold',
    fontFamily: ManuscriptFonts.heading,
    color: ManuscriptColors.inkBlack,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: ManuscriptFonts.captionSize,
    fontFamily: ManuscriptFonts.body,
    color: ManuscriptColors.fadedInk,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  showMoreButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  showMoreText: {
    color: ManuscriptColors.indigo,
    fontSize: 14,
    fontWeight: '600',
  },
  // Compact quick fix grid
  quickFixGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickFixChip: {
    width: '48.5%',
    backgroundColor: ManuscriptColors.parchment,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: ManuscriptColors.copperBrown,
  },
  quickFixIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  quickFixTitle: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    color: ManuscriptColors.inkBlack,
    lineHeight: 17,
  },
});
