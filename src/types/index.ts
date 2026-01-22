// Core Types for Ayurveda Knowledge UI

export interface Manuscript {
  id: string;
  title: string;
  source: string;
  sourceUrl: string;
  sanskritText?: string;
  englishText: string;
  category: string;
  keywords: string[];
  relatedManuscripts: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: SourceReference[];
  timestamp: Date;
}

export interface SourceReference {
  manuscriptId: string;
  manuscriptTitle: string;
  sourceUrl: string;
  excerpt: string;
  confidence: number;
}

export interface Recommendation {
  id: string;
  type: 'herb' | 'treatment' | 'diet' | 'lifestyle';
  title: string;
  description: string;
  sources: SourceReference[];
  agreementLevel: 'high' | 'medium' | 'low';
}

export interface DoshaResult {
  vata: number;
  pitta: number;
  kapha: number;
  dominant: 'vata' | 'pitta' | 'kapha';
}

export interface Bookmark {
  id: string;
  type: 'chat' | 'manuscript' | 'recommendation';
  data: ChatMessage | Manuscript | Recommendation;
  savedAt: Date;
}

export interface Symptom {
  id: string;
  name: string;
  category: string;
  relatedConditions: string[];
}

export interface BodyPart {
  id: string;
  name: string;
  commonIssues: string[];
}
