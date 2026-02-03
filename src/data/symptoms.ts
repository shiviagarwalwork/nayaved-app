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

// Dosha Assessment Questions (10 Questions - Condensed Version)
// Based on AYUSH/CCRAS guidelines and traditional Prakriti assessment
// Full 16-question version saved in docs/DOSHA_QUESTIONS_FULL.md
// Covers: Physical (4), Physiological (4), Psychological (2) traits
export const doshaQuestions = [
  // PHYSICAL TRAITS (4 questions)
  {
    id: 'body_frame',
    question: 'What best describes your body frame?',
    options: [
      { text: 'Thin, light build; hard to gain weight; prominent joints', dosha: 'vata', points: 2 },
      { text: 'Medium, athletic build; can gain/lose weight easily', dosha: 'pitta', points: 2 },
      { text: 'Larger, solid build; gains weight easily, hard to lose', dosha: 'kapha', points: 2 }
    ]
  },
  {
    id: 'skin_type',
    question: 'How would you describe your skin?',
    options: [
      { text: 'Dry, rough, or thin; prone to cracking; cool to touch', dosha: 'vata', points: 2 },
      { text: 'Warm, soft; prone to redness, acne, rashes, or sunburn', dosha: 'pitta', points: 2 },
      { text: 'Smooth, moist, soft; rarely breaks out; naturally glowing', dosha: 'kapha', points: 2 }
    ]
  },
  {
    id: 'hair_type',
    question: 'What best describes your hair?',
    options: [
      { text: 'Dry, frizzy, thin, prone to split ends or dandruff', dosha: 'vata', points: 2 },
      { text: 'Fine, straight, prone to early graying or thinning', dosha: 'pitta', points: 2 },
      { text: 'Thick, wavy or curly, lustrous, slightly oily', dosha: 'kapha', points: 2 }
    ]
  },
  {
    id: 'body_temp',
    question: 'How do you experience body temperature?',
    options: [
      { text: 'Often feel cold; hands and feet are usually cold', dosha: 'vata', points: 2 },
      { text: 'Usually feel warm; sweat easily; dislike heat', dosha: 'pitta', points: 2 },
      { text: 'Comfortable in most temperatures; feel cool to touch', dosha: 'kapha', points: 2 }
    ]
  },

  // PHYSIOLOGICAL TRAITS (4 questions)
  {
    id: 'appetite',
    question: 'How is your appetite?',
    options: [
      { text: 'Irregular; sometimes hungry, sometimes not; forget to eat', dosha: 'vata', points: 2 },
      { text: 'Strong; get irritable or "hangry" if meals are delayed', dosha: 'pitta', points: 2 },
      { text: 'Steady but moderate; can skip meals without discomfort', dosha: 'kapha', points: 2 }
    ]
  },
  {
    id: 'digestion',
    question: 'How is your digestion?',
    options: [
      { text: 'Variable; prone to gas, bloating, or constipation', dosha: 'vata', points: 2 },
      { text: 'Strong; may experience acid reflux or loose stools', dosha: 'pitta', points: 2 },
      { text: 'Slow but steady; feel heavy after meals', dosha: 'kapha', points: 2 }
    ]
  },
  {
    id: 'sleep',
    question: 'How is your sleep pattern?',
    options: [
      { text: 'Light, interrupted; difficulty falling asleep; wake easily', dosha: 'vata', points: 2 },
      { text: 'Moderate; sleep well but may wake up hot', dosha: 'pitta', points: 2 },
      { text: 'Deep, long; hard to wake up; love sleeping', dosha: 'kapha', points: 2 }
    ]
  },
  {
    id: 'energy',
    question: 'How would you describe your energy levels?',
    options: [
      { text: 'Comes in bursts; fluctuates throughout the day; tire easily', dosha: 'vata', points: 2 },
      { text: 'Strong, focused; can push hard but may burn out', dosha: 'pitta', points: 2 },
      { text: 'Steady but slow to start; good stamina once going', dosha: 'kapha', points: 2 }
    ]
  },

  // PSYCHOLOGICAL TRAITS (2 questions)
  {
    id: 'mind',
    question: 'How would you describe your mind?',
    options: [
      { text: 'Active, restless; many thoughts; creative but scattered', dosha: 'vata', points: 2 },
      { text: 'Sharp, focused; analytical; can be critical', dosha: 'pitta', points: 2 },
      { text: 'Calm, steady; think before acting; can be slow to decide', dosha: 'kapha', points: 2 }
    ]
  },
  {
    id: 'stress_response',
    question: 'How do you typically respond to stress?',
    options: [
      { text: 'Anxious, worried, fearful; may have trouble sleeping', dosha: 'vata', points: 2 },
      { text: 'Irritable, frustrated, angry; may lash out', dosha: 'pitta', points: 2 },
      { text: 'Withdrawn, avoidant; may feel sad or unmotivated', dosha: 'kapha', points: 2 }
    ]
  }
];
