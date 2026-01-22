import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons, Ionicons, Feather } from '@expo/vector-icons';
import { getQuickFixDetail } from '../data/quickFixDetails';
import { ManuscriptColors, ManuscriptFonts } from '../components/ManuscriptConstants';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function QuickFixDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { fixId } = route.params as { fixId: string };

  // Collapsible sections state - all collapsed by default
  const [showWhy, setShowWhy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showSource, setShowSource] = useState(false);

  const toggleSection = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setter(prev => !prev);
  };

  const detail = getQuickFixDetail(fixId);

  if (!detail) {
    return (
      <View style={styles.container}>
        <Text>Quick fix not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: detail.iconBg }]}>
          <MaterialCommunityIcons name={detail.icon as any} size={40} color={detail.iconColor} />
        </View>
        <Text style={styles.title}>{detail.title}</Text>
      </View>

      {/* Problem */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>The Problem</Text>
        <Text style={styles.text}>{detail.problem}</Text>
      </View>

      {/* Remedy */}
      <View style={[styles.section, styles.remedySection]}>
        <View style={styles.sectionTitleRow}>
          <MaterialCommunityIcons name="check-circle" size={20} color="#6B8E23" />
          <Text style={styles.sectionTitle}>The Remedy</Text>
        </View>
        <Text style={[styles.text, styles.remedyText]}>{detail.remedy}</Text>
      </View>

      {/* Why - Collapsible */}
      <TouchableOpacity
        style={styles.collapsibleHeader}
        onPress={() => toggleSection(setShowWhy)}
        activeOpacity={0.7}
      >
        <View style={styles.collapsibleTitleRow}>
          <MaterialCommunityIcons name="lightbulb-outline" size={18} color="#B87333" />
          <Text style={styles.collapsibleTitle}>Why This Works</Text>
        </View>
        <Feather name={showWhy ? "chevron-up" : "chevron-down"} size={20} color="#B87333" />
      </TouchableOpacity>
      {showWhy && (
        <View style={styles.whySection}>
          <Text style={styles.whyText}>{detail.why}</Text>
        </View>
      )}

      {/* Terms Explained - Collapsible */}
      <TouchableOpacity
        style={styles.collapsibleHeader}
        onPress={() => toggleSection(setShowTerms)}
        activeOpacity={0.7}
      >
        <View style={styles.collapsibleTitleRow}>
          <MaterialCommunityIcons name="book-open-variant" size={18} color="#5D4037" />
          <Text style={styles.collapsibleTitle}>Terms Explained</Text>
          <Text style={styles.collapsibleCount}>({detail.terms.length})</Text>
        </View>
        <Feather name={showTerms ? "chevron-up" : "chevron-down"} size={20} color="#5D4037" />
      </TouchableOpacity>
      {showTerms && (
        <View style={styles.collapsibleContent}>
          {detail.terms.map((term, idx) => (
            <View key={idx} style={styles.termCard}>
              <Text style={styles.termTitle}>{term.term}</Text>
              <Text style={styles.termText}>{term.explanation}</Text>
            </View>
          ))}
        </View>
      )}

      {/* How To */}
      <View style={styles.section}>
        <View style={styles.sectionTitleRow}>
          <MaterialCommunityIcons name="target" size={20} color="#3E2723" />
          <Text style={styles.sectionTitle}>How To Do It</Text>
        </View>
        {detail.howTo.map((guide, idx) => (
          <View key={idx} style={styles.howToCard}>
            <Text style={styles.howToTitle}>{guide.title}</Text>
            {guide.steps.map((step, stepIdx) => (
              <View key={stepIdx} style={styles.stepRow}>
                <Text style={styles.stepNumber}>{stepIdx + 1}.</Text>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>

      {/* Manuscript Reference - Collapsible */}
      <TouchableOpacity
        style={styles.collapsibleHeader}
        onPress={() => toggleSection(setShowSource)}
        activeOpacity={0.7}
      >
        <View style={styles.collapsibleTitleRow}>
          <MaterialCommunityIcons name="script-text" size={18} color="#B87333" />
          <Text style={styles.collapsibleTitle}>Ancient Source</Text>
        </View>
        <Feather name={showSource ? "chevron-up" : "chevron-down"} size={20} color="#B87333" />
      </TouchableOpacity>
      {showSource && (
        <View style={styles.manuscriptSection}>
          <Text style={styles.manuscriptText}>{detail.manuscript}</Text>
        </View>
      )}

      {/* Dosha Link */}
      <View style={styles.doshaSection}>
        <Text style={styles.doshaText}>Related to: {detail.doshaLink}</Text>
      </View>
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
  backButton: {
    marginBottom: 16,
  },
  backButtonText: {
    color: '#9EBF88',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#9EBF88',
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3E2723',
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3E2723',
  },
  text: {
    fontSize: 15,
    color: '#3E2723',
    lineHeight: 22,
  },
  remedySection: {
    backgroundColor: '#E8F5E9',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#9EBF88',
  },
  remedyText: {
    fontWeight: '600',
    color: '#6B8E23',
  },
  collapsibleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#D7CCC8',
  },
  collapsibleTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  collapsibleTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#3E2723',
  },
  collapsibleCount: {
    fontSize: 13,
    color: '#5D4037',
  },
  collapsibleContent: {
    marginBottom: 16,
  },
  whySection: {
    backgroundColor: '#FFF9E6',
    borderLeftWidth: 4,
    borderLeftColor: '#DAA520',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  whyText: {
    fontSize: 14,
    color: '#5D4037',
    lineHeight: 21,
    fontStyle: 'italic',
  },
  termCard: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#D7CCC8',
  },
  termTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#9EBF88',
    marginBottom: 6,
  },
  termText: {
    fontSize: 14,
    color: '#3E2723',
    lineHeight: 20,
  },
  howToCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#9EBF88',
  },
  howToTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3E2723',
    marginBottom: 12,
  },
  stepRow: {
    flexDirection: 'row',
    marginBottom: 10,
    paddingLeft: 4,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#9EBF88',
    marginRight: 8,
    minWidth: 20,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: '#3E2723',
    lineHeight: 20,
  },
  manuscriptSection: {
    backgroundColor: '#F5E6D3',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#D4A574',
  },
  manuscriptText: {
    fontSize: 13,
    color: '#5D4037',
    lineHeight: 19,
    fontStyle: 'italic',
  },
  doshaSection: {
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  doshaText: {
    fontSize: 14,
    color: '#6B8E23',
    fontWeight: '600',
  },
});
