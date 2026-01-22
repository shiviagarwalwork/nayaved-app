export interface DoshaGuide {
  id: string;
  name: string;
  subtitle: string;
  elements: string[];
  color: string;
  icon: string;
  westernEquivalent: string;

  // Physical Characteristics
  physical: {
    bodyType: string;
    skin: string;
    hair: string;
    eyes: string;
    appetite: string;
    digestion: string;
    sleep: string;
    energy: string;
  };

  // Mental & Emotional Traits
  mental: {
    thinking: string;
    learning: string;
    memory: string;
    creativity: string;
    under_stress: string;
  };

  // Balance vs Imbalance
  whenBalanced: string[];
  whenImbalanced: string[];

  // Modern Issues
  modernImbalances: {
    issue: string;
    cause: string;
    solution: string;
  }[];

  // Diet Guidelines
  foods: {
    favor: string[];
    reduce: string[];
    tastes: string[];
  };

  // Lifestyle Practices
  lifestyle: {
    exercise: string;
    yoga: string;
    routine: string;
    self_care: string;
    environment: string;
  };

  // Quick Fixes
  quickFixes: {
    title: string;
    practice: string;
    timing: string;
  }[];

  // Herbs & Supplements
  herbs: {
    name: string;
    benefit: string;
    dosage: string;
  }[];
}

export const doshaGuides: DoshaGuide[] = [
  {
    id: 'vata',
    name: 'Vata',
    subtitle: 'Air + Space',
    elements: ['Air', 'Space'],
    color: '#60A5FA',
    icon: 'weather-windy',
    westernEquivalent: 'Type A personality meets artist - Creative, fast-thinking, always moving',

    physical: {
      bodyType: 'Thin, light frame, hard to gain weight',
      skin: 'Dry, rough, cool to touch, prone to dryness',
      hair: 'Dry, brittle, thin, frizzy',
      eyes: 'Small, dry, active',
      appetite: 'Irregular, sometimes forget to eat',
      digestion: 'Variable, prone to gas and bloating',
      sleep: 'Light, restless, trouble falling asleep',
      energy: 'Comes in bursts, crashes easily'
    },

    mental: {
      thinking: 'Quick, creative, abstract, many ideas at once',
      learning: 'Learns quickly but forgets quickly',
      memory: 'Short-term great, long-term spotty',
      creativity: 'Highly creative, innovative, artistic',
      under_stress: 'Anxious, worried, scattered, overwhelmed'
    },

    whenBalanced: [
      'Creative and enthusiastic',
      'Energetic and adaptable',
      'Quick-thinking and innovative',
      'Excellent communicator',
      'Spiritual and intuitive',
      'Joyful and vibrant'
    ],

    whenImbalanced: [
      'Anxious and worried',
      'Restless and scattered',
      'Insomnia and irregular sleep',
      'Digestive issues (gas, bloating, constipation)',
      'Dry skin and hair',
      'Cold hands and feet',
      'Difficulty making decisions',
      'Racing thoughts'
    ],

    modernImbalances: [
      {
        issue: 'Anxiety & Racing Thoughts',
        cause: 'Overstimulation, irregular schedule, too much screen time',
        solution: 'Establish routine, warm oil massage, meditation, grounding exercises'
      },
      {
        issue: 'Insomnia',
        cause: 'Late nights, blue light, mental overstimulation',
        solution: 'Bed by 10 PM, no screens after 8 PM, warm milk with nutmeg, foot massage'
      },
      {
        issue: 'IBS & Digestive Issues',
        cause: 'Eating on the go, cold/raw foods, stress',
        solution: 'Warm cooked meals, regular meal times, ginger tea, slow eating'
      },
      {
        issue: 'Burnout & Exhaustion',
        cause: 'Overcommitting, multitasking, lack of rest',
        solution: 'Say no more, single-task, prioritize sleep, nourishing foods'
      }
    ],

    foods: {
      favor: [
        'Warm, cooked, nourishing foods',
        'Sweet, sour, and salty tastes',
        'Root vegetables (sweet potato, carrots, beets)',
        'Whole grains (rice, oats, quinoa)',
        'Healthy fats (ghee, sesame oil, avocado)',
        'Warm milk with spices',
        'Soups and stews',
        'Nuts and seeds (soaked)'
      ],
      reduce: [
        'Cold, raw, dry foods',
        'Salads and smoothies',
        'Crackers and dry snacks',
        'Beans (causes gas)',
        'Caffeine and stimulants',
        'Leftovers',
        'Ice cream and cold drinks'
      ],
      tastes: ['Sweet', 'Sour', 'Salty']
    },

    lifestyle: {
      exercise: 'Gentle, grounding - Yin yoga, walking, swimming, tai chi. Avoid intense cardio.',
      yoga: 'Slow, grounding poses - Forward folds, hip openers, restorative',
      routine: 'CRITICAL - Same wake/sleep/meal times daily. Routine calms Vata.',
      self_care: 'Daily oil massage (Abhyanga) with warm sesame oil, warm baths, foot massage',
      environment: 'Warm, cozy, stable. Minimize clutter. Soft lighting. Calming music.'
    },

    quickFixes: [
      {
        title: 'Morning Grounding',
        practice: 'Warm water with ginger, 10 min oil massage, warm breakfast',
        timing: '6-8 AM daily'
      },
      {
        title: 'Anxiety Reset',
        practice: 'Feet on ground barefoot for 10 min, slow deep breaths, warm tea',
        timing: 'Whenever anxious'
      },
      {
        title: 'Sleep Protocol',
        practice: 'Warm milk with nutmeg, foot massage with oil, no screens',
        timing: '9 PM nightly'
      }
    ],

    herbs: [
      {
        name: 'Ashwagandha',
        benefit: 'Calms anxiety, improves sleep, grounds energy',
        dosage: '300-500mg twice daily'
      },
      {
        name: 'Brahmi',
        benefit: 'Reduces mental chatter, improves focus',
        dosage: '300mg daily'
      },
      {
        name: 'Triphala',
        benefit: 'Regulates digestion and elimination',
        dosage: '1 tsp before bed'
      }
    ]
  },

  {
    id: 'pitta',
    name: 'Pitta',
    subtitle: 'Fire + Water',
    elements: ['Fire', 'Water'],
    color: '#EF4444',
    icon: 'fire',
    westernEquivalent: 'The CEO personality - Driven, organized, sharp intellect, natural leader',

    physical: {
      bodyType: 'Medium build, muscular, athletic',
      skin: 'Warm, soft, prone to rashes and inflammation',
      hair: 'Fine, oily, early graying or balding',
      eyes: 'Sharp, penetrating gaze, sensitive to light',
      appetite: 'Strong, gets "hangry" if meals delayed',
      digestion: 'Strong but prone to acidity and heartburn',
      sleep: 'Moderate, may wake up hot',
      energy: 'Steady, intense, driven'
    },

    mental: {
      thinking: 'Sharp, logical, analytical, organized',
      learning: 'Learns systematically, likes to master subjects',
      memory: 'Excellent, especially for details and facts',
      creativity: 'Problem-solving, strategic thinking',
      under_stress: 'Irritable, critical, angry, impatient'
    },

    whenBalanced: [
      'Sharp intellect and focus',
      'Natural leadership abilities',
      'Strong digestion and metabolism',
      'Warm and friendly',
      'Courageous and confident',
      'Goal-oriented and driven'
    ],

    whenImbalanced: [
      'Irritable and angry',
      'Perfectionism and criticism',
      'Acid reflux and heartburn',
      'Inflammatory conditions',
      'Skin rashes and acne',
      'Burnout from overwork',
      'Impatient and controlling',
      'Overheating easily'
    ],

    modernImbalances: [
      {
        issue: 'Burnout & Overwork',
        cause: 'Working too hard, skipping breaks, competitive pressure',
        solution: 'Schedule downtime, cooling practices, work-life boundaries, nature time'
      },
      {
        issue: 'Anger & Irritability',
        cause: 'Overheating, stress, perfectionism, high expectations',
        solution: 'Cool down physically, moonlight walks, swimming, reduce spicy foods'
      },
      {
        issue: 'Acid Reflux & Inflammation',
        cause: 'Spicy foods, alcohol, coffee, stress',
        solution: 'Cooling foods, avoid triggers, aloe vera juice, coconut water'
      },
      {
        issue: 'Skin Issues (Acne, Rashes)',
        cause: 'Internal heat, inflammatory diet, hormonal imbalance',
        solution: 'Cooling diet, reduce sugar/dairy, neem, turmeric, stress management'
      }
    ],

    foods: {
      favor: [
        'Cool, refreshing foods',
        'Sweet, bitter, and astringent tastes',
        'Fresh fruits (melons, coconut, berries)',
        'Leafy greens and vegetables',
        'Whole grains (rice, barley, oats)',
        'Cooling herbs (mint, cilantro, fennel)',
        'Coconut water and aloe vera',
        'Room temperature or cool (not ice cold)'
      ],
      reduce: [
        'Spicy, sour, salty foods',
        'Alcohol and caffeine',
        'Red meat and fried foods',
        'Tomatoes, garlic, onions (in excess)',
        'Vinegar and fermented foods',
        'Hot peppers and chilies'
      ],
      tastes: ['Sweet', 'Bitter', 'Astringent']
    },

    lifestyle: {
      exercise: 'Moderate intensity - Swimming, cycling, gentle yoga. Avoid competitive sports.',
      yoga: 'Cooling poses - Forward folds, twists, moon salutations',
      routine: 'Important but allow flexibility. Schedule breaks and downtime.',
      self_care: 'Cool coconut oil massage, moonlight walks, nature time, laughter',
      environment: 'Cool, airy, natural light. Blues and greens. Minimize clutter.'
    },

    quickFixes: [
      {
        title: 'Cool Down Fast',
        practice: 'Coconut water, walk in nature, swimming, cool shower',
        timing: 'When feeling heated/angry'
      },
      {
        title: 'Burnout Prevention',
        practice: 'Schedule breaks, say no to extra work, moonlight walk, early dinner',
        timing: 'Daily boundaries'
      },
      {
        title: 'Acid Reflux Relief',
        practice: 'Aloe vera juice, avoid triggers, eat earlier, raise bed head',
        timing: 'Before symptoms arise'
      }
    ],

    herbs: [
      {
        name: 'Aloe Vera',
        benefit: 'Cools inflammation, soothes digestion',
        dosage: '2 oz juice before meals'
      },
      {
        name: 'Brahmi',
        benefit: 'Calms mental intensity, reduces anger',
        dosage: '300mg daily'
      },
      {
        name: 'Neem',
        benefit: 'Clears skin, purifies blood, cooling',
        dosage: '500mg twice daily'
      }
    ]
  },

  {
    id: 'kapha',
    name: 'Kapha',
    subtitle: 'Earth + Water',
    elements: ['Earth', 'Water'],
    color: '#10B981',
    icon: 'leaf',
    westernEquivalent: 'The steady rock - Calm, nurturing, loyal, stable and dependable',

    physical: {
      bodyType: 'Solid, heavy build, gains weight easily',
      skin: 'Thick, oily, smooth, radiant',
      hair: 'Thick, lustrous, wavy, oily',
      eyes: 'Large, beautiful, calm',
      appetite: 'Steady but can skip meals easily',
      digestion: 'Slow, heavy, prone to sluggishness',
      sleep: 'Deep, heavy, hard to wake up',
      energy: 'Steady and enduring, slow starter'
    },

    mental: {
      thinking: 'Slow, methodical, thorough',
      learning: 'Learns slowly but retains forever',
      memory: 'Excellent long-term memory',
      creativity: 'Practical, implementer, finisher',
      under_stress: 'Withdrawn, depressed, lethargic'
    },

    whenBalanced: [
      'Calm and stable',
      'Loving and compassionate',
      'Strong immunity',
      'Steady energy and endurance',
      'Patient and forgiving',
      'Grounded and supportive'
    ],

    whenImbalanced: [
      'Weight gain and fluid retention',
      'Lethargy and depression',
      'Congestion and mucus',
      'Oversleeping and grogginess',
      'Resistance to change',
      'Emotional eating',
      'Possessiveness and attachment',
      'Mental and physical heaviness'
    ],

    modernImbalances: [
      {
        issue: 'Weight Gain & Sluggishness',
        cause: 'Sedentary lifestyle, heavy foods, emotional eating',
        solution: 'Daily exercise, light diet, spicy foods, wake up early'
      },
      {
        issue: 'Depression & Lethargy',
        cause: 'Lack of stimulation, isolation, oversleeping',
        solution: 'Morning exercise, social connection, new activities, bright light'
      },
      {
        issue: 'Congestion & Mucus',
        cause: 'Dairy, cold foods, lack of movement, damp environment',
        solution: 'Reduce dairy, warming spices, steam therapy, dry environment'
      },
      {
        issue: 'Resistance to Change',
        cause: 'Attachment to routine, comfort zone, fear',
        solution: 'Small changes daily, new experiences, challenge yourself'
      }
    ],

    foods: {
      favor: [
        'Light, warm, spicy foods',
        'Bitter, pungent, and astringent tastes',
        'Fresh vegetables (steamed or roasted)',
        'Light grains (quinoa, millet, barley)',
        'Warming spices (ginger, pepper, turmeric)',
        'Honey (raw, in moderation)',
        'Light fruits (apples, pears, berries)',
        'Herbal teas (ginger, cinnamon)'
      ],
      reduce: [
        'Heavy, oily, cold foods',
        'Dairy products',
        'Wheat and rice (in excess)',
        'Sweets and desserts',
        'Fried foods',
        'Bananas and avocados',
        'Ice cream and cold drinks',
        'Red meat'
      ],
      tastes: ['Pungent', 'Bitter', 'Astringent']
    },

    lifestyle: {
      exercise: 'Vigorous and stimulating - Running, dancing, HIIT, hot yoga. Move daily!',
      yoga: 'Energizing poses - Sun salutations, backbends, inversions',
      routine: 'Vary it up! Avoid getting stuck in comfort zone.',
      self_care: 'Dry brushing, vigorous massage, steam sauna, stimulation',
      environment: 'Bright, airy, minimal. Warm colors. Avoid clutter and dampness.'
    },

    quickFixes: [
      {
        title: 'Morning Energy Boost',
        practice: 'Wake early (before 6 AM), hot water with lemon, 20 min vigorous exercise',
        timing: 'Every morning'
      },
      {
        title: 'Beat Sluggishness',
        practice: 'Spicy chai, dance break, cold shower, stimulating music',
        timing: 'Whenever feeling heavy'
      },
      {
        title: 'Congestion Relief',
        practice: 'Steam inhalation, ginger tea, avoid dairy, dry brushing',
        timing: 'As needed'
      }
    ],

    herbs: [
      {
        name: 'Trikatu',
        benefit: 'Stimulates metabolism, clears congestion',
        dosage: '1/4 tsp before meals'
      },
      {
        name: 'Guggulu',
        benefit: 'Supports weight loss, detoxification',
        dosage: '500mg twice daily'
      },
      {
        name: 'Turmeric',
        benefit: 'Reduces inflammation, supports metabolism',
        dosage: '1 tsp in warm milk'
      }
    ]
  }
];

export const getDoshaGuide = (doshaId: string): DoshaGuide | undefined => {
  return doshaGuides.find(d => d.id === doshaId);
};
