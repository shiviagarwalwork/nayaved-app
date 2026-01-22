import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons, Feather, Ionicons } from '@expo/vector-icons';
import { ManuscriptColors, ManuscriptFonts } from '../components/ManuscriptConstants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAyurvedicConsultation, isApiConfigured, ChatMessage } from '../services/aiService';

// Import knowledge base
import { blogPosts, BlogPost } from '../data/blogs';
import { quickFixDetails, QuickFixDetail } from '../data/quickFixDetails';
import { manuscripts, Manuscript } from '../data/manuscripts';
import { doshaGuides, DoshaGuide } from '../data/doshaGuides';

// Type for modern imbalance issue
interface ModernImbalance {
  issue: string;
  cause: string;
  solution: string;
}

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  sources?: SearchResult[];
  timestamp: Date;
}

interface SearchResult {
  type: 'blog' | 'quickfix' | 'manuscript' | 'dosha';
  title: string;
  excerpt: string;
  relevance: number;
  source?: string;
  id: string;
}

// Keyword mappings for better search - more specific mappings
const keywordMappings: { [key: string]: string[] } = {
  'anxious': ['anxiety', 'worried', 'nervous'],
  'anxiety': ['anxious', 'worried', 'stress'],
  'sleep': ['insomnia', 'sleeplessness', 'rest'],
  'insomnia': ['sleep', 'sleeplessness'],
  'tired': ['fatigue', 'exhausted', 'drained'],
  'fatigue': ['tired', 'exhausted', 'energy'],
  'stomach': ['digestion', 'digestive', 'bloating'],
  'digestion': ['stomach', 'digestive', 'agni'],
  'acidity': ['acid reflux', 'heartburn', 'gastric'],
  'heartburn': ['acidity', 'acid reflux'],
  'skin': ['acne', 'rash', 'complexion'],
  'acne': ['skin', 'pimple'],
  'weight': ['obesity', 'fat', 'heavy'],
  'focus': ['concentration', 'attention', 'memory'],
  'concentration': ['focus', 'attention'],
  'angry': ['irritable', 'anger', 'frustration'],
  'irritable': ['angry', 'anger'],
  'sad': ['depression', 'low mood'],
  'depression': ['sad', 'depressed', 'low'],
  'phone': ['screen', 'digital', 'scrolling'],
  'screen': ['phone', 'digital', 'eyes'],
  'headache': ['head pain', 'migraine'],
  'cold': ['cough', 'congestion'],
  'cough': ['cold', 'respiratory'],
  'joint': ['arthritis', 'stiffness'],
  'back pain': ['spine', 'back'],
  'stress': ['stressed', 'tension', 'pressure'],
};

// Expand query with related terms - more conservative expansion
const expandQuery = (query: string): string[] => {
  const words = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  const expanded = new Set<string>(words);

  // Only expand on exact word matches
  words.forEach(word => {
    if (keywordMappings[word]) {
      keywordMappings[word].forEach(s => expanded.add(s));
    }
  });

  return Array.from(expanded);
};

// Search through all knowledge bases
const searchKnowledgeBase = (query: string): SearchResult[] => {
  const results: SearchResult[] = [];
  const expandedTerms = expandQuery(query);
  const lowerQuery = query.toLowerCase();
  const queryWords = lowerQuery.split(/\s+/).filter(w => w.length > 2);

  // Search blogs - prioritize exact matches
  blogPosts.forEach((blog: BlogPost) => {
    let relevance = 0;
    const titleLower = blog.title.toLowerCase();
    const excerptLower = blog.excerpt.toLowerCase();
    const tagsLower = blog.tags.join(' ').toLowerCase();

    // Exact phrase match in title - highest priority
    if (titleLower.includes(lowerQuery)) relevance += 100;

    // Word matches in title
    queryWords.forEach(word => {
      if (titleLower.includes(word)) relevance += 30;
    });

    // Word matches in excerpt
    queryWords.forEach(word => {
      if (excerptLower.includes(word)) relevance += 15;
    });

    // Tag matches
    queryWords.forEach(word => {
      if (tagsLower.includes(word)) relevance += 20;
    });

    // Expanded term matches (lower weight)
    expandedTerms.forEach(term => {
      if (!queryWords.includes(term)) {
        if (titleLower.includes(term)) relevance += 10;
        if (excerptLower.includes(term)) relevance += 5;
      }
    });

    if (relevance >= 15) {
      results.push({
        type: 'blog',
        title: blog.title,
        excerpt: blog.excerpt.substring(0, 150) + '...',
        relevance,
        id: blog.id,
      });
    }
  });

  // Search quick fixes - these are most actionable
  quickFixDetails.forEach((fix: QuickFixDetail) => {
    let relevance = 0;
    const problemLower = fix.problem.toLowerCase();
    const remedyLower = fix.remedy.toLowerCase();
    const whyLower = fix.why.toLowerCase();

    // Exact phrase match in problem - highest priority
    if (problemLower.includes(lowerQuery)) relevance += 120;

    // Word matches in problem
    queryWords.forEach(word => {
      if (problemLower.includes(word)) relevance += 40;
    });

    // Word matches in remedy
    queryWords.forEach(word => {
      if (remedyLower.includes(word)) relevance += 20;
    });

    // Word matches in explanation
    queryWords.forEach(word => {
      if (whyLower.includes(word)) relevance += 10;
    });

    // Expanded term matches
    expandedTerms.forEach(term => {
      if (!queryWords.includes(term)) {
        if (problemLower.includes(term)) relevance += 15;
        if (remedyLower.includes(term)) relevance += 8;
      }
    });

    if (relevance >= 20) {
      results.push({
        type: 'quickfix',
        title: fix.problem,
        excerpt: fix.remedy,
        relevance,
        source: fix.manuscript,
        id: fix.id,
      });
    }
  });

  // Search manuscripts
  manuscripts.forEach(manuscript => {
    let relevance = 0;
    const textLower = manuscript.englishText.toLowerCase();
    const keywordsLower = manuscript.keywords.join(' ').toLowerCase();

    // Keyword exact matches - high priority for manuscripts
    manuscript.keywords.forEach(keyword => {
      if (lowerQuery.includes(keyword)) relevance += 50;
      queryWords.forEach(word => {
        if (keyword.includes(word) || word.includes(keyword)) relevance += 25;
      });
    });

    // Word matches in text
    queryWords.forEach(word => {
      if (textLower.includes(word)) relevance += 15;
    });

    // Expanded term matches
    expandedTerms.forEach(term => {
      if (!queryWords.includes(term) && keywordsLower.includes(term)) {
        relevance += 10;
      }
    });

    if (relevance >= 25) {
      results.push({
        type: 'manuscript',
        title: manuscript.title,
        excerpt: manuscript.englishText.substring(0, 150) + '...',
        relevance,
        source: manuscript.source,
        id: manuscript.id,
      });
    }
  });

  // Search dosha guides - match specific imbalances
  for (const dosha of doshaGuides) {
    let relevance = 0;
    let matchedIssueTitle = '';
    let matchedIssueSolution = '';

    // Check modern imbalances for specific matches
    for (const issue of dosha.modernImbalances) {
      const issueLower = issue.issue.toLowerCase();
      const causeLower = issue.cause.toLowerCase();

      for (const word of queryWords) {
        if (issueLower.includes(word)) {
          relevance += 35;
          matchedIssueTitle = issue.issue;
          matchedIssueSolution = issue.solution;
        }
        if (causeLower.includes(word)) {
          relevance += 20;
          if (!matchedIssueTitle) {
            matchedIssueTitle = issue.issue;
            matchedIssueSolution = issue.solution;
          }
        }
      }
    }

    // Check whenImbalanced symptoms
    for (const symptom of dosha.whenImbalanced) {
      const symptomLower = symptom.toLowerCase();
      for (const word of queryWords) {
        if (symptomLower.includes(word)) relevance += 15;
      }
    }

    if (relevance >= 30 && matchedIssueTitle) {
      results.push({
        type: 'dosha',
        title: `${dosha.name} Dosha - ${matchedIssueTitle}`,
        excerpt: matchedIssueSolution,
        relevance,
        id: dosha.id,
      });
    }
  }

  // Sort by relevance
  return results.sort((a, b) => b.relevance - a.relevance).slice(0, 5);
};

// Generate response based on search results
const generateResponse = (query: string, results: SearchResult[]): string => {
  if (results.length === 0) {
    return "I couldn't find specific guidance for \"" + query + "\" in our Ayurvedic knowledge base.\n\n**Recommendation:** Please consult with a qualified Ayurvedic practitioner (Vaidya) who can assess your unique constitution and provide personalized guidance.\n\nYou can also try:\n- Our diagnostic tools to understand your dosha\n- The Learn section for general wellness practices\n- Asking about specific symptoms like sleep, digestion, or stress";
  }

  // Get the top result for main recommendation
  const topResult = results[0];
  let response = "";

  // Generate different response formats based on result type
  if (topResult.type === 'quickfix') {
    response = `**For "${topResult.title}":**\n\n`;
    response += `**Ayurvedic Remedy:** ${topResult.excerpt}\n\n`;
    if (topResult.source) {
      response += `*Referenced in: ${topResult.source}*\n\n`;
    }
  } else if (topResult.type === 'manuscript') {
    response = `**Ancient Wisdom on this topic:**\n\n`;
    response += `${topResult.excerpt}\n\n`;
    if (topResult.source) {
      response += `*From: ${topResult.source}*\n\n`;
    }
  } else if (topResult.type === 'dosha') {
    response = `**${topResult.title}:**\n\n`;
    response += `${topResult.excerpt}\n\n`;
    response += `This appears to be related to dosha imbalance. Consider taking the Dosha Quiz for personalized recommendations.\n\n`;
  } else if (topResult.type === 'blog') {
    response = `**Understanding "${topResult.title.replace(/[📱🔥💤⚡🧘‍♀️🌿]/g, '').trim()}":**\n\n`;
    response += `${topResult.excerpt}\n\n`;
    response += `Read the full article in the Learn section for detailed guidance.\n\n`;
  }

  // Add secondary recommendation if available and different type
  const secondResult = results.find(r => r.type !== topResult.type && r.relevance > 20);
  if (secondResult) {
    if (secondResult.type === 'quickfix') {
      response += `**Quick Fix:** ${secondResult.excerpt}\n\n`;
    } else if (secondResult.type === 'manuscript') {
      response += `**Classical Reference:** ${secondResult.title}\n\n`;
    }
  }

  response += "*This is educational guidance based on Ayurvedic texts. For persistent issues, please consult a practitioner.*";

  return response;
};

export default function ConsultationScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      type: 'assistant',
      content: "Namaste! I'm your Ayurvedic guide, powered by ancient wisdom from the Charaka Samhita and other classical texts.\n\n**How I can help:**\n- Describe any health concern or symptom\n- Ask about Ayurvedic remedies\n- Learn about your dosha imbalances\n- Get lifestyle and diet recommendations\n\n*Note: I only provide guidance found in authentic Ayurvedic texts. For conditions not covered, I'll recommend consulting a practitioner.*\n\nWhat's troubling you today?",
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const [useAI, setUseAI] = useState(false);
  const [userDosha, setUserDosha] = useState<string | undefined>(undefined);

  // Check if API is configured on mount and load user dosha
  useEffect(() => {
    checkApiAndLoadDosha();
  }, []);

  const checkApiAndLoadDosha = async () => {
    const apiConfigured = await isApiConfigured();
    setUseAI(apiConfigured);

    // Try to load user's dosha from assessment
    try {
      const assessmentData = await AsyncStorage.getItem('doshaAssessment');
      if (assessmentData) {
        const parsed = JSON.parse(assessmentData);
        if (parsed.dominantDosha) {
          setUserDosha(parsed.dominantDosha);
        }
      }
    } catch (error) {
      console.log('Could not load dosha:', error);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputText.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputText.trim();
    setInputText('');
    setIsSearching(true);

    try {
      // Check if we should use AI
      const apiConfigured = await isApiConfigured();

      if (apiConfigured) {
        // Use Claude AI for response
        try {
          // Build conversation history for context
          const conversationHistory: ChatMessage[] = messages
            .filter(m => m.id !== '0') // Skip initial greeting
            .map(m => ({
              role: m.type === 'user' ? 'user' : 'assistant',
              content: m.content,
            }));

          const aiResponse = await getAyurvedicConsultation(
            currentInput,
            conversationHistory,
            userDosha
          );

          // Also search local knowledge base for sources
          const results = searchKnowledgeBase(currentInput);

          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            type: 'assistant',
            content: aiResponse,
            sources: results.length > 0 ? results : undefined,
            timestamp: new Date(),
          };

          setMessages(prev => [...prev, assistantMessage]);
        } catch (aiError: any) {
          console.log('AI error, falling back to local search:', aiError);
          // Fall back to local search
          performLocalSearch(currentInput);
        }
      } else {
        // Use local knowledge base search
        performLocalSearch(currentInput);
      }
    } catch (error) {
      console.log('Error in handleSend:', error);
      performLocalSearch(currentInput);
    } finally {
      setIsSearching(false);
    }
  };

  const performLocalSearch = (query: string) => {
    const results = searchKnowledgeBase(query);
    const response = generateResponse(query, results);

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: response,
      sources: results,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, assistantMessage]);
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const renderMessage = (message: Message) => {
    const isUser = message.type === 'user';

    return (
      <View
        key={message.id}
        style={[
          styles.messageContainer,
          isUser ? styles.userMessageContainer : styles.assistantMessageContainer,
        ]}
      >
        {!isUser && (
          <View style={styles.avatarContainer}>
            <MaterialCommunityIcons name="spa" size={24} color={ManuscriptColors.vermillion} />
          </View>
        )}
        <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.assistantBubble]}>
          <Text style={[styles.messageText, isUser && styles.userMessageText]}>
            {message.content}
          </Text>
          {message.sources && message.sources.length > 0 && (
            <View style={styles.sourcesContainer}>
              <Text style={styles.sourcesLabel}>Sources found:</Text>
              {message.sources.slice(0, 3).map((source, idx) => (
                <View key={idx} style={styles.sourceItem}>
                  <View style={[styles.sourceIcon, { backgroundColor:
                    source.type === 'quickfix' ? '#E8F5E9' :
                    source.type === 'manuscript' ? '#FFF3E0' :
                    source.type === 'dosha' ? '#E3F2FD' : '#F3E5F5'
                  }]}>
                    <Feather
                      name={
                        source.type === 'quickfix' ? 'zap' :
                        source.type === 'manuscript' ? 'book-open' :
                        source.type === 'dosha' ? 'sun' : 'file-text'
                      }
                      size={12}
                      color={ManuscriptColors.inkBrown}
                    />
                  </View>
                  <Text style={styles.sourceTitle}>{source.title}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
        {isUser && (
          <View style={styles.userAvatarContainer}>
            <Ionicons name="person" size={20} color={ManuscriptColors.parchment} />
          </View>
        )}
      </View>
    );
  };

  const suggestedQueries = [
    "I can't sleep at night",
    "Feeling anxious and stressed",
    "Digestion problems",
    "Too much screen time",
    "Low energy and fatigue",
  ];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        keyboardShouldPersistTaps="handled"
      >
        {messages.map(renderMessage)}

        {isSearching && (
          <View style={styles.searchingContainer}>
            <View style={styles.avatarContainer}>
              <MaterialCommunityIcons name="spa" size={24} color={ManuscriptColors.vermillion} />
            </View>
            <View style={styles.searchingBubble}>
              <ActivityIndicator size="small" color={ManuscriptColors.vermillion} />
              <Text style={styles.searchingText}>
                {useAI ? 'Consulting the Vaidya...' : 'Searching ancient texts...'}
              </Text>
            </View>
          </View>
        )}

        {messages.length === 1 && (
          <View style={styles.suggestionsContainer}>
            <Text style={styles.suggestionsTitle}>Try asking about:</Text>
            {suggestedQueries.map((query, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.suggestionChip}
                onPress={() => setInputText(query)}
              >
                <Text style={styles.suggestionText}>{query}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Describe what's troubling you..."
          placeholderTextColor={ManuscriptColors.fadedInk}
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!inputText.trim() || isSearching}
        >
          <Feather name="send" size={22} color={inputText.trim() ? '#FFFFFF' : ManuscriptColors.fadedInk} />
        </TouchableOpacity>
      </View>

      <View style={[styles.disclaimer, useAI && styles.aiDisclaimer]}>
        <Feather name={useAI ? 'cpu' : 'info'} size={14} color={useAI ? '#4CAF50' : ManuscriptColors.fadedInk} />
        <Text style={[styles.disclaimerText, useAI && styles.aiDisclaimerText]}>
          {useAI
            ? 'AI-powered Vaidya consultation. Not a substitute for medical advice.'
            : 'Educational guidance only. Add Claude API key in Settings for AI responses.'}
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ManuscriptColors.palmLeaf,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 24,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  assistantMessageContainer: {
    justifyContent: 'flex-start',
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: ManuscriptColors.parchment,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 2,
    borderColor: ManuscriptColors.goldLeaf,
  },
  userAvatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: ManuscriptColors.indigo,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 14,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: ManuscriptColors.indigo,
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: ManuscriptColors.parchment,
    borderBottomLeftRadius: 4,
    borderWidth: 2,
    borderColor: ManuscriptColors.copperBrown,
  },
  messageText: {
    fontSize: 15,
    color: ManuscriptColors.inkBlack,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  sourcesContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: ManuscriptColors.copperBrown,
  },
  sourcesLabel: {
    fontSize: 12,
    color: ManuscriptColors.fadedInk,
    marginBottom: 8,
    fontWeight: '600',
  },
  sourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  sourceIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  sourceTitle: {
    fontSize: 13,
    color: ManuscriptColors.inkBrown,
    flex: 1,
  },
  searchingContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  searchingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ManuscriptColors.parchment,
    padding: 14,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    borderWidth: 2,
    borderColor: ManuscriptColors.copperBrown,
  },
  searchingText: {
    marginLeft: 10,
    fontSize: 14,
    color: ManuscriptColors.fadedInk,
    fontStyle: 'italic',
  },
  suggestionsContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: ManuscriptColors.oldPaper,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: ManuscriptColors.goldLeaf,
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: ManuscriptColors.inkBrown,
    marginBottom: 12,
  },
  suggestionChip: {
    backgroundColor: ManuscriptColors.parchment,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: ManuscriptColors.copperBrown,
  },
  suggestionText: {
    fontSize: 14,
    color: ManuscriptColors.inkBlack,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    backgroundColor: ManuscriptColors.parchment,
    borderTopWidth: 2,
    borderTopColor: ManuscriptColors.copperBrown,
  },
  input: {
    flex: 1,
    backgroundColor: ManuscriptColors.oldPaper,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: ManuscriptColors.inkBlack,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: ManuscriptColors.copperBrown,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: ManuscriptColors.vermillion,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  sendButtonDisabled: {
    backgroundColor: ManuscriptColors.oldPaper,
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: ManuscriptColors.oldPaper,
  },
  disclaimerText: {
    fontSize: 11,
    color: ManuscriptColors.fadedInk,
    marginLeft: 6,
    fontStyle: 'italic',
  },
  aiDisclaimer: {
    backgroundColor: '#E8F5E9',
  },
  aiDisclaimerText: {
    color: '#2E7D32',
  },
});
