import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { doshaQuestions, symptoms } from '../data/symptoms';
import { DoshaResult } from '../types';
import ManuscriptCard from '../components/ManuscriptCard';
import ManuscriptQuote from '../components/ManuscriptQuote';
import { ManuscriptColors, ManuscriptFonts } from '../components/ManuscriptConstants';

const { width } = Dimensions.get('window');

export default function AssessmentScreen() {
  const navigation = useNavigation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{[key: string]: { dosha: string; points: number }}>({});
  const [result, setResult] = useState<DoshaResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [showSymptomSelection, setShowSymptomSelection] = useState(false);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  const handleAnswer = (questionId: string, dosha: string, points: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: { dosha, points } }));

    if (currentQuestion < doshaQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowSymptomSelection(true);
    }
  };

  const toggleSymptom = (symptomName: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptomName)
        ? prev.filter(s => s !== symptomName)
        : [...prev, symptomName]
    );
  };

  const completeAssessment = async () => {
    await calculateResult(answers);
    await AsyncStorage.setItem('userSymptoms', JSON.stringify(selectedSymptoms));
    setShowSymptomSelection(false);
  };

  const calculateResult = async (allAnswers: {[key: string]: { dosha: string; points: number }}) => {
    const scores = { vata: 0, pitta: 0, kapha: 0 };

    Object.values(allAnswers).forEach(answer => {
      if (answer.dosha === 'vata') scores.vata += answer.points;
      if (answer.dosha === 'pitta') scores.pitta += answer.points;
      if (answer.dosha === 'kapha') scores.kapha += answer.points;
    });

    const total = scores.vata + scores.pitta + scores.kapha;
    const dominant = scores.vata > scores.pitta && scores.vata > scores.kapha ? 'vata' :
                     scores.pitta > scores.kapha ? 'pitta' : 'kapha';

    const doshaResult: DoshaResult = {
      vata: Math.round((scores.vata / total) * 100),
      pitta: Math.round((scores.pitta / total) * 100),
      kapha: Math.round((scores.kapha / total) * 100),
      dominant
    };

    // Save dosha result to AsyncStorage so PlanScreen can access it
    await AsyncStorage.setItem('doshaResult', JSON.stringify(doshaResult));

    setResult(doshaResult);
    setShowResults(true);
  };

  const resetAssessment = async () => {
    setCurrentQuestion(0);
    setAnswers({});
    setResult(null);
    setShowResults(false);
    setShowSymptomSelection(false);
    setSelectedSymptoms([]);
    await AsyncStorage.removeItem('userSymptoms');
    await AsyncStorage.removeItem('doshaResult');
  };

  // Symptom Selection Screen
  if (showSymptomSelection) {
    const commonSymptoms = symptoms.filter(s =>
      s.category === 'Digestive' || s.category === 'Mental/Emotional' || s.category === 'Physical'
    );

    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Almost done!</Text>
          <MaterialCommunityIcons name="target" size={24} color="#3E2723" />
        </View>
        <Text style={styles.subtitle}>
          Select any current symptoms (optional)
        </Text>

        <View style={styles.symptomGrid}>
          {commonSymptoms.map(symptom => (
            <TouchableOpacity
              key={symptom.id}
              onPress={() => toggleSymptom(symptom.name)}
              style={[
                styles.symptomCard,
                selectedSymptoms.includes(symptom.name) && styles.symptomCardSelected
              ]}
            >
              <Text style={[
                styles.symptomText,
                selectedSymptoms.includes(symptom.name) && styles.symptomTextSelected
              ]}>
                {symptom.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedSymptoms.length > 0 && (
          <View style={styles.selectedContainer}>
            <Text style={styles.selectedTitle}>
              Selected ({selectedSymptoms.length})
            </Text>
            <View style={styles.selectedSymptoms}>
              {selectedSymptoms.map(symptom => (
                <View key={symptom} style={styles.selectedBadge}>
                  <Text style={styles.selectedBadgeText}>{symptom}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={completeAssessment}
        >
          <Text style={styles.primaryButtonText}>
            {selectedSymptoms.length > 0 ? 'Continue with Symptoms' : 'Skip & See Results'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // Results Screen
  if (showResults && result) {
    const doshaInfo = {
      vata: { icon: 'weather-windy', title: 'Vata (Air & Space)', color: '#60A5FA', bgColor: '#E3F2FD', description: 'The energy of movement and change' },
      pitta: { icon: 'fire', title: 'Pitta (Fire & Water)', color: '#EF4444', bgColor: '#FFEBEE', description: 'The energy of transformation and metabolism' },
      kapha: { icon: 'leaf', title: 'Kapha (Earth & Water)', color: '#10B981', bgColor: '#E8F5E9', description: 'The energy of structure and lubrication' }
    };

    const dominant = doshaInfo[result.dominant as keyof typeof doshaInfo];

    return (
      <ScrollView style={styles.manuscriptContainer} contentContainerStyle={styles.content}>
        <Text style={styles.manuscriptTitle}>Your Dosha Constitution</Text>
        <Text style={styles.manuscriptSubtitle}>Prakriti Analysis</Text>

        {/* Ancient Quote */}
        <ManuscriptQuote
          quote="The doshas - Vata, Pitta, and Kapha - are the three fundamental principles that govern all physiological and psychological functions."
          source="Charaka Samhita, Sutrasthana 1.57"
          style={{ marginBottom: 20 }}
        />

        {/* Dosha Percentages */}
        <ManuscriptCard title="Your Dosha Balance" ornament="om">
          <View style={styles.doshaRow}>
            <View style={styles.doshaLabelRow}>
              <MaterialCommunityIcons name="weather-windy" size={18} color="#60A5FA" />
              <Text style={styles.doshaLabel}>Vata</Text>
            </View>
            <Text style={styles.doshaPercentage}>{result.vata}%</Text>
          </View>
          <View style={[styles.progressBar, { width: `${result.vata}%`, backgroundColor: '#60A5FA' }]} />

          <View style={styles.doshaRow}>
            <View style={styles.doshaLabelRow}>
              <MaterialCommunityIcons name="fire" size={18} color="#EF4444" />
              <Text style={styles.doshaLabel}>Pitta</Text>
            </View>
            <Text style={styles.doshaPercentage}>{result.pitta}%</Text>
          </View>
          <View style={[styles.progressBar, { width: `${result.pitta}%`, backgroundColor: '#EF4444' }]} />

          <View style={styles.doshaRow}>
            <View style={styles.doshaLabelRow}>
              <MaterialCommunityIcons name="leaf" size={18} color="#10B981" />
              <Text style={styles.doshaLabel}>Kapha</Text>
            </View>
            <Text style={styles.doshaPercentage}>{result.kapha}%</Text>
          </View>
          <View style={[styles.progressBar, { width: `${result.kapha}%`, backgroundColor: '#10B981' }]} />
        </ManuscriptCard>

        {/* Dominant Dosha */}
        <ManuscriptCard ornament="lotus" style={{ marginTop: 16 }}>
          <View style={styles.dominantContent}>
            <View style={[styles.dominantIconContainer, { backgroundColor: dominant.bgColor }]}>
              <MaterialCommunityIcons name={dominant.icon as any} size={40} color={dominant.color} />
            </View>
            <Text style={styles.dominantTitle}>Your Dominant Dosha</Text>
            <Text style={[styles.dominantName, { color: dominant.color }]}>{dominant.title}</Text>
            <Text style={styles.dominantDescription}>{dominant.description}</Text>
          </View>
        </ManuscriptCard>

        {/* CTA */}
        <TouchableOpacity
          style={styles.manuscriptButton}
          onPress={() => {
            navigation.navigate('Plan' as never);
          }}
        >
          <Text style={styles.manuscriptButtonText}>View My Daily Plan →</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryManuscriptButton}
          onPress={resetAssessment}
        >
          <Text style={styles.secondaryManuscriptButtonText}>Take Assessment Again</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // Quiz Question Screen
  const question = doshaQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / doshaQuestions.length) * 100;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Dosha Assessment</Text>
      <Text style={styles.subtitle}>
        Question {currentQuestion + 1} of {doshaQuestions.length}
      </Text>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>

      {/* Question */}
      <View style={styles.questionCard}>
        <Text style={styles.questionText}>{question.question}</Text>

        <View style={styles.optionsContainer}>
          {question.options.map((option, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.optionButton}
              onPress={() => handleAnswer(question.id, option.dosha, option.points)}
            >
              <View style={styles.radio} />
              <Text style={styles.optionText}>{option.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Navigation */}
      {currentQuestion > 0 && (
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setCurrentQuestion(prev => prev - 1)}
        >
          <Text style={styles.backButtonText}>← Previous Question</Text>
        </TouchableOpacity>
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
    paddingBottom: 32,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3E2723',
  },
  subtitle: {
    fontSize: 14,
    color: '#5D4037',
    marginBottom: 24,
  },
  progressContainer: {
    height: 8,
    backgroundColor: '#D7CCC8',
    borderRadius: 4,
    marginBottom: 24,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#9EBF88',
    borderRadius: 4,
  },
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3E2723',
    marginBottom: 20,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F5F1E8',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#D7CCC8',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#9EBF88',
    marginRight: 12,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: '#3E2723',
  },
  backButton: {
    padding: 12,
  },
  backButtonText: {
    color: '#9EBF88',
    fontSize: 16,
    fontWeight: '600',
  },
  symptomGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  symptomCard: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#D7CCC8',
  },
  symptomCardSelected: {
    borderColor: '#9EBF88',
    backgroundColor: '#E8F5E9',
  },
  symptomText: {
    fontSize: 14,
    color: '#3E2723',
  },
  symptomTextSelected: {
    color: '#6B8E23',
    fontWeight: '600',
  },
  selectedContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  selectedTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3E2723',
    marginBottom: 12,
  },
  selectedSymptoms: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectedBadge: {
    backgroundColor: '#9EBF88',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  selectedBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: '#9EBF88',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D7CCC8',
  },
  secondaryButtonText: {
    color: '#3E2723',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  doshaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  doshaLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  doshaLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3E2723',
  },
  doshaPercentage: {
    fontSize: 16,
    color: '#5D4037',
  },
  progressBar: {
    height: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  dominantCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 3,
  },
  dominantIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  dominantTitle: {
    fontSize: 14,
    color: '#5D4037',
    marginBottom: 4,
  },
  dominantName: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  manuscriptContainer: {
    flex: 1,
    backgroundColor: ManuscriptColors.palmLeaf,
  },
  manuscriptTitle: {
    fontSize: ManuscriptFonts.titleSize,
    fontWeight: 'bold',
    fontFamily: ManuscriptFonts.heading,
    color: ManuscriptColors.inkBlack,
    textAlign: 'center',
    marginBottom: 4,
  },
  manuscriptSubtitle: {
    fontSize: ManuscriptFonts.captionSize,
    fontFamily: ManuscriptFonts.sanskrit,
    color: ManuscriptColors.fadedInk,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 20,
  },
  dominantContent: {
    alignItems: 'center',
  },
  dominantDescription: {
    fontSize: ManuscriptFonts.bodySize,
    fontFamily: ManuscriptFonts.body,
    color: ManuscriptColors.inkBrown,
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  manuscriptButton: {
    backgroundColor: ManuscriptColors.vermillion,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 24,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: ManuscriptColors.goldLeaf,
    shadowColor: ManuscriptColors.scrollShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  manuscriptButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: ManuscriptFonts.body,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  secondaryManuscriptButton: {
    backgroundColor: ManuscriptColors.oldPaper,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: ManuscriptColors.copperBrown,
  },
  secondaryManuscriptButtonText: {
    color: ManuscriptColors.inkBrown,
    fontSize: 16,
    fontFamily: ManuscriptFonts.body,
    fontWeight: '600',
    textAlign: 'center',
  },
});
