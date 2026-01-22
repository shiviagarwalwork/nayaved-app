import { Symptom, BodyPart } from '../types';

export const symptoms: Symptom[] = [
  { id: 's1', name: 'Headache', category: 'Pain', relatedConditions: ['stress', 'migraine', 'dehydration'] },
  { id: 's2', name: 'Fatigue', category: 'Energy', relatedConditions: ['low immunity', 'poor sleep', 'weak digestion'] },
  { id: 's3', name: 'Indigestion', category: 'Digestive', relatedConditions: ['weak agni', 'acidity', 'bloating'] },
  { id: 's4', name: 'Anxiety', category: 'Mental', relatedConditions: ['stress', 'vata imbalance', 'insomnia'] },
  { id: 's5', name: 'Joint Pain', category: 'Pain', relatedConditions: ['arthritis', 'vata imbalance', 'ama'] },
  { id: 's6', name: 'Skin Rash', category: 'Skin', relatedConditions: ['pitta imbalance', 'allergies', 'toxins'] },
  { id: 's7', name: 'Insomnia', category: 'Sleep', relatedConditions: ['vata imbalance', 'stress', 'irregular routine'] },
  { id: 's8', name: 'Constipation', category: 'Digestive', relatedConditions: ['vata imbalance', 'low fiber', 'dehydration'] },
  { id: 's9', name: 'Cough', category: 'Respiratory', relatedConditions: ['kapha imbalance', 'cold', 'weak immunity'] },
  { id: 's10', name: 'Hair Fall', category: 'Hair', relatedConditions: ['pitta imbalance', 'stress', 'nutritional deficiency'] },
  { id: 's11', name: 'Acidity', category: 'Digestive', relatedConditions: ['pitta imbalance', 'spicy food', 'stress'] },
  { id: 's12', name: 'Low Immunity', category: 'Immunity', relatedConditions: ['weak ojas', 'poor diet', 'lack of sleep'] }
];

export const bodyParts: BodyPart[] = [
  { id: 'head', name: 'Head', commonIssues: ['Headache', 'Migraine', 'Hair Fall', 'Mental Stress'] },
  { id: 'eyes', name: 'Eyes', commonIssues: ['Eye Strain', 'Dry Eyes', 'Vision Problems'] },
  { id: 'throat', name: 'Throat', commonIssues: ['Sore Throat', 'Cough', 'Voice Problems'] },
  { id: 'chest', name: 'Chest', commonIssues: ['Breathing Issues', 'Cough', 'Heart Palpitations'] },
  { id: 'stomach', name: 'Stomach', commonIssues: ['Indigestion', 'Acidity', 'Bloating', 'Pain'] },
  { id: 'joints', name: 'Joints', commonIssues: ['Joint Pain', 'Stiffness', 'Arthritis', 'Inflammation'] },
  { id: 'skin', name: 'Skin', commonIssues: ['Rash', 'Acne', 'Dryness', 'Itching'] },
  { id: 'back', name: 'Back', commonIssues: ['Back Pain', 'Stiffness', 'Muscle Tension'] }
];

export const doshaQuestions = [
  {
    id: 'q1',
    question: 'How would you describe your body frame?',
    options: [
      { text: 'Thin, light, hard to gain weight', dosha: 'vata', points: 2 },
      { text: 'Medium, muscular build', dosha: 'pitta', points: 2 },
      { text: 'Large, heavy, easy to gain weight', dosha: 'kapha', points: 2 }
    ]
  },
  {
    id: 'q2',
    question: 'How is your appetite?',
    options: [
      { text: 'Irregular, varies day to day', dosha: 'vata', points: 2 },
      { text: 'Strong, gets irritable if hungry', dosha: 'pitta', points: 2 },
      { text: 'Steady, can skip meals easily', dosha: 'kapha', points: 2 }
    ]
  },
  {
    id: 'q3',
    question: 'How do you handle stress?',
    options: [
      { text: 'Anxious, worried, restless', dosha: 'vata', points: 2 },
      { text: 'Irritable, frustrated, angry', dosha: 'pitta', points: 2 },
      { text: 'Calm, withdrawn, depressed', dosha: 'kapha', points: 2 }
    ]
  },
  {
    id: 'q4',
    question: 'How is your sleep?',
    options: [
      { text: 'Light, interrupted, restless', dosha: 'vata', points: 2 },
      { text: 'Moderate, good quality', dosha: 'pitta', points: 2 },
      { text: 'Deep, long, hard to wake up', dosha: 'kapha', points: 2 }
    ]
  },
  {
    id: 'q5',
    question: 'How is your skin type?',
    options: [
      { text: 'Dry, rough, thin', dosha: 'vata', points: 2 },
      { text: 'Warm, oily, prone to rashes', dosha: 'pitta', points: 2 },
      { text: 'Thick, moist, smooth', dosha: 'kapha', points: 2 }
    ]
  },
  {
    id: 'q6',
    question: 'How is your energy level?',
    options: [
      { text: 'Comes in bursts, fluctuating', dosha: 'vata', points: 2 },
      { text: 'Moderate, consistent', dosha: 'pitta', points: 2 },
      { text: 'Steady, but slow to start', dosha: 'kapha', points: 2 }
    ]
  },
  {
    id: 'q7',
    question: 'How do you learn new things?',
    options: [
      { text: 'Quick to learn, quick to forget', dosha: 'vata', points: 2 },
      { text: 'Sharp, focused learner', dosha: 'pitta', points: 2 },
      { text: 'Slow to learn, long retention', dosha: 'kapha', points: 2 }
    ]
  },
  {
    id: 'q8',
    question: 'What is your preferred temperature?',
    options: [
      { text: 'Prefer warmth, dislike cold', dosha: 'vata', points: 2 },
      { text: 'Prefer cool, dislike heat', dosha: 'pitta', points: 2 },
      { text: 'Adaptable, prefer moderate', dosha: 'kapha', points: 2 }
    ]
  }
];
