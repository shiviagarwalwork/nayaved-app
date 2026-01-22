import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  Image,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons, Feather } from '@expo/vector-icons';
import { ManuscriptColors, ManuscriptFonts } from '../components/ManuscriptConstants';

const { width } = Dimensions.get('window');

type ComponentType = 'doshas' | 'dhatus' | 'agni' | 'srotas';

interface BodyRegion {
  id: string;
  name: string;
  doshas: { dominant: string; subdoshas: string[]; function: string };
  dhatus: string[];
  agni: string[];
  srotas: string[];
  commonIssues: string[];
  remedies: string[];
}

const bodyRegions: { [key: string]: BodyRegion } = {
  head: {
    id: 'head',
    name: 'Head & Brain',
    doshas: {
      dominant: 'Prana Vata (governs brain, mind, senses)',
      subdoshas: ['Prana Vata', 'Alochaka Pitta', 'Tarpaka Kapha'],
      function: 'Controls thought, perception, and sensory function',
    },
    dhatus: ['Majja (marrow/nervous tissue)', 'Asthi (bone/skull)'],
    agni: ['Buddhi Agni (intelligence fire)'],
    srotas: [
      'Pranavaha (respiratory/oxygen to brain)',
      'Manovaha (mental/thought channels)',
    ],
    commonIssues: ['Headaches', 'Brain fog', 'Poor memory', 'Anxiety'],
    remedies: [
      'Brahmi for memory',
      'Meditation to calm Prana Vata',
      'Nasya (nasal oil) therapy',
    ],
  },
  eyes: {
    id: 'eyes',
    name: 'Eyes',
    doshas: {
      dominant: 'Alochaka Pitta (visual perception)',
      subdoshas: ['Alochaka Pitta', 'Prana Vata', 'Tarpaka Kapha'],
      function: 'Governs sight, color perception, eye health',
    },
    dhatus: ['Rasa (fluid)', 'Rakta (blood vessels)'],
    agni: ['Alochaka Agni (visual fire)'],
    srotas: ['Drishti Vaha (vision channels)'],
    commonIssues: ['Strain', 'Redness', 'Dryness', 'Pitta inflammation'],
    remedies: [
      'Rose water eye drops',
      'Triphala ghee for Pitta',
      'Trataka (candle gazing)',
    ],
  },
  throat: {
    id: 'throat',
    name: 'Throat & Neck',
    doshas: {
      dominant: 'Udana Vata (speech, swallowing)',
      subdoshas: ['Udana Vata', 'Bodhaka Kapha'],
      function: 'Controls speech, swallowing, thyroid',
    },
    dhatus: ['Rasa (lymph)', 'Mamsa (muscles)'],
    agni: ['Agni (thyroid metabolism)'],
    srotas: ['Annavaha (food passage)', 'Pranavaha (breath)'],
    commonIssues: ['Sore throat', 'Thyroid issues', 'Voice problems'],
    remedies: [
      'Licorice tea for throat',
      'Guggulu for thyroid',
      'Ujjayi breathing',
    ],
  },
  chest: {
    id: 'chest',
    name: 'Heart & Lungs',
    doshas: {
      dominant: 'Vyana Vata (circulation), Avalambaka Kapha (lubrication)',
      subdoshas: ['Vyana Vata', 'Sadhaka Pitta', 'Avalambaka Kapha'],
      function: 'Heart pumping, breathing, emotional processing',
    },
    dhatus: ['Rasa (plasma)', 'Rakta (blood)', 'Ojas (immunity)'],
    agni: ['Sadhaka Agni (emotional fire)'],
    srotas: ['Pranavaha (respiratory)', 'Rasavaha (circulation)'],
    commonIssues: ['Anxiety', 'Breathlessness', 'Heart palpitations', 'Asthma'],
    remedies: [
      'Arjuna for heart',
      'Pranayama for lungs',
      'Ashwagandha for stress',
    ],
  },
  stomach: {
    id: 'stomach',
    name: 'Stomach & Upper Digestion',
    doshas: {
      dominant: 'Pachaka Pitta (digestive fire), Samana Vata',
      subdoshas: ['Pachaka Pitta', 'Samana Vata', 'Kledaka Kapha'],
      function: 'Main digestive fire, food breakdown',
    },
    dhatus: ['Rasa (chyme formation)'],
    agni: ['Jatharagni (main digestive fire - MOST IMPORTANT)'],
    srotas: ['Annavaha (food channel)', 'Udakavaha (water absorption)'],
    commonIssues: ['Acidity', 'Indigestion', 'Ulcers', 'Low appetite'],
    remedies: [
      'Ginger before meals',
      'CCF tea (cumin, coriander, fennel)',
      'Avoid cold drinks',
    ],
  },
  intestines: {
    id: 'intestines',
    name: 'Sacral Center (Svadhisthana)',
    doshas: {
      dominant: 'Apana Vata (downward flow), Kapha (fluidity)',
      subdoshas: ['Apana Vata', 'Avalambaka Kapha', 'Ranjaka Pitta'],
      function: 'Reproduction, creativity, emotions, sexuality',
    },
    dhatus: ['Shukra (reproductive tissue)', 'Rasa (fluids)', 'Rakta (blood)'],
    agni: ['Shukra Agni (reproductive fire)'],
    srotas: ['Shukravaha (reproductive)', 'Artavavaha (menstrual)', 'Mutravaha (urinary)'],
    commonIssues: ['Menstrual issues', 'Low libido', 'Creativity blocks', 'Emotional instability', 'Bladder issues'],
    remedies: [
      'Shatavari for reproductive health',
      'Hip-opening yoga poses',
      'Creative expression activities',
      'Warm sesame oil massage on lower abdomen',
    ],
  },
  liver: {
    id: 'liver',
    name: 'Liver (Right Side)',
    doshas: {
      dominant: 'Ranjaka Pitta (blood formation)',
      subdoshas: ['Ranjaka Pitta', 'Pachaka Pitta'],
      function: 'Blood purification, metabolism, detoxification',
    },
    dhatus: ['Rakta (blood formation)'],
    agni: ['Bhutagni (metabolic transformation)'],
    srotas: ['Raktavaha (blood circulation)', 'Pittavaha (bile)'],
    commonIssues: ['Jaundice', 'Fatty liver', 'Anger', 'Skin rashes'],
    remedies: [
      'Neem for detox',
      'Aloe vera juice',
      'Avoid alcohol and fried foods',
    ],
  },
  kidneys: {
    id: 'kidneys',
    name: 'Kidneys (Both Sides)',
    doshas: {
      dominant: 'Apana Vata (fluid elimination)',
      subdoshas: ['Apana Vata', 'Avalambaka Kapha'],
      function: 'Water balance, waste filtration, blood pressure',
    },
    dhatus: ['Rasa (fluid)', 'Rakta (blood)'],
    agni: ['Water metabolism'],
    srotas: ['Udakavaha (water)', 'Mutravaha (urine)'],
    commonIssues: ['UTI', 'Kidney stones', 'Water retention', 'Edema'],
    remedies: [
      'Drink 2-3L water daily',
      'Punarnava for kidneys',
      'Avoid excess salt',
    ],
  },
  pelvis: {
    id: 'pelvis',
    name: 'Root Center (Muladhara)',
    doshas: {
      dominant: 'Apana Vata (elimination, grounding)',
      subdoshas: ['Apana Vata', 'Kapha (earth stability)'],
      function: 'Grounding, stability, survival, elimination, foundation',
    },
    dhatus: ['Asthi (bones/skeleton)', 'Mamsa (muscles of legs/pelvis)', 'Meda (fat storage)'],
    agni: ['Apana Agni (elimination fire)', 'Asthi Agni (bone metabolism)'],
    srotas: ['Purishavaha (elimination)', 'Asthivaha (bone formation)', 'Mamsavaha (muscle)'],
    commonIssues: ['Constipation', 'Leg weakness', 'Anxiety/fear', 'Feeling ungrounded', 'Lower back pain', 'Sciatica'],
    remedies: [
      'Grounding meditation and earthing',
      'Root vegetables (beets, carrots, potatoes)',
      'Ashwagandha for stability',
      'Walking barefoot on earth',
      'Warm sesame oil massage on feet and legs',
    ],
  },
  bones: {
    id: 'bones',
    name: 'Bones & Joints',
    doshas: {
      dominant: 'Vata (in joints), Kapha (in bones)',
      subdoshas: ['Vyana Vata', 'Shleshaka Kapha'],
      function: 'Structure, movement, joint lubrication',
    },
    dhatus: ['Asthi (bone tissue)', 'Majja (marrow)'],
    agni: ['Asthi Agni (bone metabolism)'],
    srotas: ['Asthivaha (bone formation)'],
    commonIssues: ['Arthritis', 'Osteoporosis', 'Joint pain', 'Stiffness'],
    remedies: [
      'Sesame oil massage',
      'Ashwagandha for bones',
      'Calcium-rich foods',
    ],
  },
  skin: {
    id: 'skin',
    name: 'Skin (All Over)',
    doshas: {
      dominant: 'Bhrajaka Pitta (skin color/luster)',
      subdoshas: ['Bhrajaka Pitta', 'Vyana Vata', 'Kapha (moisture)'],
      function: 'Glow, complexion, temperature regulation',
    },
    dhatus: ['Rasa (lymph)', 'Rakta (blood)', 'Mamsa (muscles below)'],
    agni: ['Bhrajaka Agni (skin metabolism)'],
    srotas: ['Swedavaha (sweat)', 'Raktavaha (blood to skin)'],
    commonIssues: ['Acne', 'Eczema', 'Psoriasis', 'Dryness', 'Rashes'],
    remedies: [
      'Neem for Pitta skin',
      'Turmeric and sandalwood',
      'Oil massage',
    ],
  },
};

export default function BodyMapScreen() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [activeComponent, setActiveComponent] = useState<ComponentType>('doshas');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const region = selectedRegion ? bodyRegions[selectedRegion] : null;

  // Fade in animation for details panel
  useEffect(() => {
    if (selectedRegion) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [selectedRegion]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIconRow}>
          <MaterialCommunityIcons name="human" size={32} color="#6B8E23" />
          <Text style={styles.title}> 4-Component Body Map</Text>
        </View>
        <Text style={styles.subtitle}>
          Interactive Ayurvedic Anatomy Explorer
        </Text>
      </View>

      {/* Info Card */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>How to Use:</Text>
        <Text style={styles.infoText}>
          1. Tap any body part below{'\n'}
          2. Switch between 4 components (tabs){'\n'}
          3. Learn which doshas, tissues, channels govern that area
        </Text>
      </View>

      {/* Body Diagram with Chakras Image */}
      <View style={styles.bodyDiagramContainer}>
        <Text style={styles.bodyTitle}>Interactive Body Map</Text>
        <Text style={styles.bodySubtitle}>Tap any chakra/region to explore</Text>

        <View style={styles.bodyImageContainer}>
          <Image
            source={require('../../assets/chakras.png')}
            style={styles.bodyImage}
            resizeMode="contain"
          />

          {/* Interactive Overlays for specific body parts */}
          {/* Head - Top */}
          <TouchableOpacity
            style={[styles.hotspot, styles.hotspotHead]}
            onPress={() => setSelectedRegion('head')}
            activeOpacity={0.7}
          >
            <Animated.View
              style={[
                styles.hotspotHighlight,
                {
                  opacity: selectedRegion === 'head' ? fadeAnim : 0.4,
                  backgroundColor: '#9370DB',
                },
              ]}
            />
          </TouchableOpacity>

          {/* Eyes - Upper face */}
          <TouchableOpacity
            style={[styles.hotspot, styles.hotspotEyes]}
            onPress={() => setSelectedRegion('eyes')}
            activeOpacity={0.7}
          >
            <Animated.View
              style={[
                styles.hotspotHighlight,
                {
                  opacity: selectedRegion === 'eyes' ? fadeAnim : 0.4,
                  backgroundColor: '#4169E1',
                },
              ]}
            />
          </TouchableOpacity>

          {/* Throat */}
          <TouchableOpacity
            style={[styles.hotspot, styles.hotspotThroat]}
            onPress={() => setSelectedRegion('throat')}
            activeOpacity={0.7}
          >
            <Animated.View
              style={[
                styles.hotspotHighlight,
                {
                  opacity: selectedRegion === 'throat' ? fadeAnim : 0.4,
                  backgroundColor: '#00CED1',
                },
              ]}
            />
          </TouchableOpacity>

          {/* Chest (Heart) */}
          <TouchableOpacity
            style={[styles.hotspot, styles.hotspotChest]}
            onPress={() => setSelectedRegion('chest')}
            activeOpacity={0.7}
          >
            <Animated.View
              style={[
                styles.hotspotHighlight,
                {
                  opacity: selectedRegion === 'chest' ? fadeAnim : 0.4,
                  backgroundColor: '#32CD32',
                },
              ]}
            />
          </TouchableOpacity>

          {/* Stomach (Solar Plexus) */}
          <TouchableOpacity
            style={[styles.hotspot, styles.hotspotStomach]}
            onPress={() => setSelectedRegion('stomach')}
            activeOpacity={0.7}
          >
            <Animated.View
              style={[
                styles.hotspotHighlight,
                {
                  opacity: selectedRegion === 'stomach' ? fadeAnim : 0.4,
                  backgroundColor: '#FFD700',
                },
              ]}
            />
          </TouchableOpacity>


          {/* Intestines (Lower abdomen) */}
          <TouchableOpacity
            style={[styles.hotspot, styles.hotspotIntestines]}
            onPress={() => setSelectedRegion('intestines')}
            activeOpacity={0.7}
          >
            <Animated.View
              style={[
                styles.hotspotHighlight,
                {
                  opacity: selectedRegion === 'intestines' ? fadeAnim : 0.4,
                  backgroundColor: '#FF6347',
                },
              ]}
            />
          </TouchableOpacity>

          {/* Pelvis (Sacral chakra) */}
          <TouchableOpacity
            style={[styles.hotspot, styles.hotspotPelvis]}
            onPress={() => setSelectedRegion('pelvis')}
            activeOpacity={0.7}
          >
            <Animated.View
              style={[
                styles.hotspotHighlight,
                {
                  opacity: selectedRegion === 'pelvis' ? fadeAnim : 0.4,
                  backgroundColor: '#FF4500',
                },
              ]}
            />
          </TouchableOpacity>

        </View>

        {/* Helper Text */}
        {!selectedRegion && (
          <Text style={styles.helperText}>
            Tap on any chakra or body region above to explore its Ayurvedic components
          </Text>
        )}

        {selectedRegion && (
          <View style={styles.selectedBadge}>
            <Text style={styles.selectedBadgeText}>
              Selected: {bodyRegions[selectedRegion]?.name}
            </Text>
          </View>
        )}

        {/* Internal Organs & Full Body Systems */}
        <Text style={styles.fullBodyTitle}>Internal Organs</Text>
        <View style={styles.fullBodyButtons}>
          <TouchableOpacity
            style={[
              styles.fullBodyButton,
              selectedRegion === 'liver' && styles.fullBodyButtonActive
            ]}
            onPress={() => setSelectedRegion('liver')}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="hexagon-outline" size={28} color={selectedRegion === 'liver' ? '#FFFFFF' : '#D32F2F'} />
            <Text style={[
              styles.fullBodyButtonTitle,
              selectedRegion === 'liver' && styles.fullBodyButtonTitleActive
            ]}>
              Liver
            </Text>
            <Text style={[
              styles.fullBodyButtonSubtitle,
              selectedRegion === 'liver' && styles.fullBodyButtonSubtitleActive
            ]}>
              Detox
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.fullBodyButton,
              selectedRegion === 'kidneys' && styles.fullBodyButtonActive
            ]}
            onPress={() => setSelectedRegion('kidneys')}
            activeOpacity={0.8}
          >
            <Ionicons name="water" size={28} color={selectedRegion === 'kidneys' ? '#FFFFFF' : '#2196F3'} />
            <Text style={[
              styles.fullBodyButtonTitle,
              selectedRegion === 'kidneys' && styles.fullBodyButtonTitleActive
            ]}>
              Kidneys
            </Text>
            <Text style={[
              styles.fullBodyButtonSubtitle,
              selectedRegion === 'kidneys' && styles.fullBodyButtonSubtitleActive
            ]}>
              Filtration
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.fullBodyTitle}>Full Body Systems</Text>
        <View style={styles.fullBodyButtons}>
          <TouchableOpacity
            style={[
              styles.fullBodyButton,
              selectedRegion === 'skin' && styles.fullBodyButtonActive
            ]}
            onPress={() => setSelectedRegion('skin')}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="face-woman-shimmer" size={28} color={selectedRegion === 'skin' ? '#FFFFFF' : '#FF9800'} />
            <Text style={[
              styles.fullBodyButtonTitle,
              selectedRegion === 'skin' && styles.fullBodyButtonTitleActive
            ]}>
              Skin
            </Text>
            <Text style={[
              styles.fullBodyButtonSubtitle,
              selectedRegion === 'skin' && styles.fullBodyButtonSubtitleActive
            ]}>
              Surface
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.fullBodyButton,
              selectedRegion === 'bones' && styles.fullBodyButtonActive
            ]}
            onPress={() => setSelectedRegion('bones')}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="bone" size={28} color={selectedRegion === 'bones' ? '#FFFFFF' : '#5D4037'} />
            <Text style={[
              styles.fullBodyButtonTitle,
              selectedRegion === 'bones' && styles.fullBodyButtonTitleActive
            ]}>
              Bones
            </Text>
            <Text style={[
              styles.fullBodyButtonSubtitle,
              selectedRegion === 'bones' && styles.fullBodyButtonSubtitleActive
            ]}>
              Structure
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Selected Region Details */}
      {region && (
        <Animated.View
          style={[
            styles.detailsSection,
            { opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0]
            })}] }
          ]}
        >
          <Text style={styles.regionTitle}>{region.name}</Text>

          {/* Component Tabs */}
          <View style={styles.componentTabs}>
            <TouchableOpacity
              style={[styles.tab, activeComponent === 'doshas' && styles.tabActive]}
              onPress={() => setActiveComponent('doshas')}
            >
              <Text style={[styles.tabText, activeComponent === 'doshas' && styles.tabTextActive]}>
                Doshas
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeComponent === 'dhatus' && styles.tabActive]}
              onPress={() => setActiveComponent('dhatus')}
            >
              <Text style={[styles.tabText, activeComponent === 'dhatus' && styles.tabTextActive]}>
                Dhatus
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeComponent === 'agni' && styles.tabActive]}
              onPress={() => setActiveComponent('agni')}
            >
              <Text style={[styles.tabText, activeComponent === 'agni' && styles.tabTextActive]}>
                Agni
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeComponent === 'srotas' && styles.tabActive]}
              onPress={() => setActiveComponent('srotas')}
            >
              <Text style={[styles.tabText, activeComponent === 'srotas' && styles.tabTextActive]}>
                Srotas
              </Text>
            </TouchableOpacity>
          </View>

          {/* Component Details */}
          <View style={styles.componentDetails}>
            {activeComponent === 'doshas' && (
              <View style={styles.detailCard}>
                <View style={styles.detailTitleRow}>
                  <MaterialCommunityIcons name="yin-yang" size={20} color="#B87333" />
                  <Text style={styles.detailTitle}> Doshas in {region.name}</Text>
                </View>
                <Text style={styles.detailSubtitle}>Dominant:</Text>
                <Text style={styles.detailText}>{region.doshas.dominant}</Text>
                <Text style={styles.detailSubtitle}>Function:</Text>
                <Text style={styles.detailText}>{region.doshas.function}</Text>
                <Text style={styles.detailSubtitle}>Subdoshas Present:</Text>
                {region.doshas.subdoshas.map((subdosha, idx) => (
                  <Text key={idx} style={styles.bulletText}>• {subdosha}</Text>
                ))}
              </View>
            )}

            {activeComponent === 'dhatus' && (
              <View style={styles.detailCard}>
                <View style={styles.detailTitleRow}>
                  <MaterialCommunityIcons name="dna" size={20} color="#B87333" />
                  <Text style={styles.detailTitle}> Dhatus (Tissues) in {region.name}</Text>
                </View>
                <Text style={styles.detailSubtitle}>7 Tissues of the Body:</Text>
                <Text style={styles.helpText}>
                  Rasa → Rakta → Mamsa → Meda → Asthi → Majja → Shukra
                </Text>
                <Text style={styles.detailSubtitle}>Present in this region:</Text>
                {region.dhatus.map((dhatu, idx) => (
                  <Text key={idx} style={styles.bulletText}>• {dhatu}</Text>
                ))}
              </View>
            )}

            {activeComponent === 'agni' && (
              <View style={styles.detailCard}>
                <View style={styles.detailTitleRow}>
                  <MaterialCommunityIcons name="fire" size={20} color="#FF6347" />
                  <Text style={styles.detailTitle}> Agni (Digestive Fire) in {region.name}</Text>
                </View>
                <Text style={styles.detailSubtitle}>Types of Agni:</Text>
                <Text style={styles.helpText}>
                  1 Jatharagni (main), 5 Bhutagni (elemental), 7 Dhatvagni (tissue)
                </Text>
                <Text style={styles.detailSubtitle}>Active in this region:</Text>
                {region.agni.map((agni, idx) => (
                  <Text key={idx} style={styles.bulletText}>• {agni}</Text>
                ))}
              </View>
            )}

            {activeComponent === 'srotas' && (
              <View style={styles.detailCard}>
                <View style={styles.detailTitleRow}>
                  <MaterialCommunityIcons name="waves" size={20} color="#2196F3" />
                  <Text style={styles.detailTitle}> Srotas (Channels) in {region.name}</Text>
                </View>
                <Text style={styles.detailSubtitle}>Body's Transport System:</Text>
                <Text style={styles.helpText}>
                  Channels carry nutrients, waste, and vital energy throughout body
                </Text>
                <Text style={styles.detailSubtitle}>Channels in this region:</Text>
                {region.srotas.map((srota, idx) => (
                  <Text key={idx} style={styles.bulletText}>• {srota}</Text>
                ))}
              </View>
            )}
          </View>

          {/* Common Issues */}
          <View style={styles.issuesCard}>
            <View style={styles.issuesTitleRow}>
              <Ionicons name="warning" size={18} color="#C62828" />
              <Text style={styles.issuesTitle}> Common Imbalances</Text>
            </View>
            {region.commonIssues.map((issue, idx) => (
              <Text key={idx} style={styles.issueText}>• {issue}</Text>
            ))}
          </View>

          {/* Remedies */}
          <View style={styles.remediesCard}>
            <View style={styles.remediesTitleRow}>
              <Feather name="check-circle" size={18} color="#2E7D32" />
              <Text style={styles.remediesTitle}> Ayurvedic Remedies</Text>
            </View>
            {region.remedies.map((remedy, idx) => (
              <Text key={idx} style={styles.remedyText}>• {remedy}</Text>
            ))}
          </View>
        </Animated.View>
      )}

      {!region && (
        <View style={styles.promptCard}>
          <View style={styles.promptContent}>
            <MaterialCommunityIcons name="hand-pointing-up" size={22} color="#1976D2" />
            <Text style={styles.promptText}>
              Tap any body part above to explore its Ayurvedic components
            </Text>
          </View>
        </View>
      )}

      {/* Educational Footer */}
      <View style={styles.educationCard}>
        <View style={styles.educationTitleRow}>
          <MaterialCommunityIcons name="book-open-variant" size={20} color="#B87333" />
          <Text style={styles.educationTitle}> The 4 Components Explained</Text>
        </View>

        <View style={styles.componentHeaderRow}>
          <MaterialCommunityIcons name="yin-yang" size={18} color="#3E2723" />
          <Text style={styles.componentHeader}> 1. Doshas (Bio-Energies)</Text>
        </View>
        <Text style={styles.educationText}>
          Vata (movement), Pitta (transformation), Kapha (structure). Every body part is
          governed by specific doshas and their 15 subdoshas.
        </Text>

        <View style={styles.componentHeaderRow}>
          <MaterialCommunityIcons name="dna" size={18} color="#3E2723" />
          <Text style={styles.componentHeader}> 2. Dhatus (7 Tissues)</Text>
        </View>
        <Text style={styles.educationText}>
          Rasa → Rakta → Mamsa → Meda → Asthi → Majja → Shukra. Each tissue is formed
          from the previous one, ending in Ojas (vitality).
        </Text>

        <View style={styles.componentHeaderRow}>
          <MaterialCommunityIcons name="fire" size={18} color="#FF6347" />
          <Text style={styles.componentHeader}> 3. Agni (Digestive Fire)</Text>
        </View>
        <Text style={styles.educationText}>
          13 types: 1 Jatharagni (main), 5 Bhutagni (elemental), 7 Dhatvagni (tissue).
          Transforms food into tissues and energy.
        </Text>

        <View style={styles.componentHeaderRow}>
          <MaterialCommunityIcons name="waves" size={18} color="#2196F3" />
          <Text style={styles.componentHeader}> 4. Srotas (Channels)</Text>
        </View>
        <Text style={styles.educationText}>
          16 major channels transport nutrients, waste, and prana. Blockages cause disease.
        </Text>

        <Text style={styles.manuscriptQuote}>
          "The body is composed of doshas, dhatus, and malas (waste). Health is their balance.
          Disease is their imbalance. The wise physician understands the interplay of all components."
        </Text>
        <Text style={styles.manuscriptSource}>- Charaka Samhita</Text>
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
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontStyle: 'italic',
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: '#E3F2FD',
    padding: 14,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#64B5F6',
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#3E2723',
    lineHeight: 20,
  },
  bodyDiagramContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  bodyImageContainer: {
    width: width * 0.85,
    height: 500,
    marginVertical: 16,
  },
  bodyImage: {
    width: '100%',
    height: '100%',
  },
  hotspot: {
    position: 'absolute',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hotspotHighlight: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  // Position hotspots over chakras - all aligned vertically at 27% from left
  // Top 3 moved down, bottom 3 moved up to align with chakra symbols
  hotspotHead: {
    // Crown Chakra (purple) - top of head
    top: '8%',
    left: '27%',
    width: 42,
    height: 42,
    zIndex: 10,
  },
  hotspotEyes: {
    // Third Eye Chakra (indigo) - forehead area
    top: '15%',
    left: '27%',
    width: 40,
    height: 40,
    zIndex: 10,
  },
  hotspotThroat: {
    // Throat Chakra (light blue) - neck/throat
    top: '23%',
    left: '27%',
    width: 40,
    height: 40,
    zIndex: 10,
  },
  hotspotChest: {
    // Heart Chakra (green) - chest area
    top: '33%',
    left: '27%',
    width: 42,
    height: 42,
    zIndex: 10,
  },
  hotspotStomach: {
    // Solar Plexus Chakra (yellow) - upper abdomen
    top: '41%',
    left: '27%',
    width: 42,
    height: 42,
    zIndex: 10,
  },
  hotspotIntestines: {
    // Sacral Chakra area (orange) - lower abdomen
    top: '47%',
    left: '27%',
    width: 42,
    height: 42,
    zIndex: 10,
  },
  hotspotPelvis: {
    // Root Chakra (red) - base of spine
    top: '54%',
    left: '27%',
    width: 42,
    height: 42,
    zIndex: 10,
  },
  fullBodyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: ManuscriptColors.inkBrown,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 10,
  },
  fullBodyButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  fullBodyButton: {
    alignItems: 'center',
    backgroundColor: ManuscriptColors.parchment,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: ManuscriptColors.copperBrown,
    minWidth: 100,
  },
  fullBodyButtonActive: {
    backgroundColor: '#9EBF88',
    borderColor: '#6B8E23',
  },
  fullBodyButtonIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  fullBodyButtonTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: ManuscriptColors.inkBlack,
    marginBottom: 2,
  },
  fullBodyButtonTitleActive: {
    color: '#FFFFFF',
  },
  fullBodyButtonSubtitle: {
    fontSize: 11,
    color: ManuscriptColors.fadedInk,
  },
  fullBodyButtonSubtitleActive: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  helperText: {
    fontSize: 13,
    color: '#5D4037',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 12,
    paddingHorizontal: 20,
  },
  selectedBadge: {
    backgroundColor: '#9EBF88',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginTop: 12,
  },
  selectedBadgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  bodyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3E2723',
    marginBottom: 4,
    textAlign: 'center',
  },
  bodySubtitle: {
    fontSize: 13,
    color: '#5D4037',
    marginBottom: 20,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  detailsSection: {
    marginBottom: 20,
  },
  regionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3E2723',
    marginBottom: 16,
    textAlign: 'center',
  },
  componentTabs: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D7CCC8',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  tabActive: {
    backgroundColor: '#9EBF88',
    borderColor: '#6B8E23',
    shadowColor: '#9EBF88',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    transform: [{ scale: 1.05 }],
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5D4037',
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  componentDetails: {
    marginBottom: 16,
  },
  detailCard: {
    backgroundColor: '#FFF9E6',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  detailTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#B87333',
  },
  detailSubtitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3E2723',
    marginTop: 10,
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#5D4037',
    lineHeight: 20,
    marginBottom: 8,
  },
  bulletText: {
    fontSize: 13,
    color: '#5D4037',
    marginBottom: 4,
    paddingLeft: 8,
  },
  helpText: {
    fontSize: 12,
    color: '#9E9E9E',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  issuesCard: {
    backgroundColor: '#FFEBEE',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#EF5350',
  },
  issuesTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  issuesTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#C62828',
  },
  issueText: {
    fontSize: 13,
    color: '#3E2723',
    marginBottom: 4,
  },
  remediesCard: {
    backgroundColor: '#E8F5E9',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  remediesTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  remediesTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  remedyText: {
    fontSize: 13,
    color: '#3E2723',
    marginBottom: 4,
  },
  promptCard: {
    backgroundColor: '#E3F2FD',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  promptContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  promptText: {
    fontSize: 15,
    color: '#1976D2',
    textAlign: 'center',
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  educationCard: {
    backgroundColor: '#F5E6D3',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D4A574',
  },
  educationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  educationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#B87333',
  },
  componentHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 6,
  },
  componentHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3E2723',
  },
  educationText: {
    fontSize: 13,
    color: '#5D4037',
    lineHeight: 20,
    marginBottom: 8,
  },
  manuscriptQuote: {
    fontSize: 13,
    color: '#5D4037',
    fontStyle: 'italic',
    marginTop: 16,
    marginBottom: 8,
    paddingLeft: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#D4A574',
    lineHeight: 20,
  },
  manuscriptSource: {
    fontSize: 12,
    color: '#B87333',
    fontStyle: 'italic',
    textAlign: 'right',
  },
});
