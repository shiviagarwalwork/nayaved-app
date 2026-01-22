// Dosha-specific daily routines (Dinacharya) based on Ayurvedic principles

export interface TimeSlot {
  time: string;
  activity: string;
  description: string;
  tips?: string[];
}

export interface MealPlan {
  meal: string;
  time: string;
  recommendations: string[];
  avoid: string[];
  recipes?: string[];
}

export interface ExerciseRoutine {
  type: string;
  duration: string;
  bestTime: string;
  activities: string[];
  avoid: string[];
}

export interface HerbProtocol {
  herb: string;
  dosage: string;
  timing: string;
  benefit: string;
}

export interface FoodGuide {
  favor: string[];
  reduce: string[];
  spices: string[];
}

export interface DoshaRoutine {
  dosha: 'Vata' | 'Pitta' | 'Kapha';
  overview: string;
  morningRoutine: TimeSlot[];
  middayRoutine: TimeSlot[];
  eveningRoutine: TimeSlot[];
  meals: MealPlan[];
  foodGuide: FoodGuide;
  exercise: ExerciseRoutine;
  herbs: HerbProtocol[];
  selfCare: string[];
  avoid: string[];
  seasonalTips: {
    summer: string[];
    winter: string[];
    monsoon: string[];
  };
}

export const doshaRoutines: DoshaRoutine[] = [
  {
    dosha: 'Vata',
    overview: 'Vata types need warmth, routine, and grounding. Your air element makes you creative but prone to anxiety and dryness. Focus on regularity, warmth, and nourishment.',
    morningRoutine: [
      {
        time: '6:00 AM',
        activity: 'Wake Gently',
        description: 'Rise slowly, avoid jumping out of bed. Take a few deep breaths.',
        tips: ['Avoid checking phone immediately', 'Stretch in bed before rising'],
      },
      {
        time: '6:15 AM',
        activity: 'Warm Oil Self-Massage (Abhyanga)',
        description: 'Apply warm sesame oil to entire body - this is essential for Vata!',
        tips: ['Use sesame oil in winter, coconut in summer', 'Focus on joints and feet', 'Leave on 15-20 minutes before shower'],
      },
      {
        time: '6:45 AM',
        activity: 'Warm Shower',
        description: 'Not too hot, not cold. Warm and soothing.',
        tips: ['Avoid cold showers - they aggravate Vata'],
      },
      {
        time: '7:00 AM',
        activity: 'Warm Water + Lemon',
        description: 'Drink warm water with lemon to stimulate digestion.',
        tips: ['Add ginger for extra warmth', 'Never drink cold water'],
      },
      {
        time: '7:15 AM',
        activity: 'Gentle Yoga & Pranayama',
        description: 'Slow, grounding poses. Alternate nostril breathing.',
        tips: ['Focus on hip openers and forward bends', 'Avoid fast, vigorous movements', 'Nadi Shodhana (alternate nostril) calms Vata'],
      },
      {
        time: '7:45 AM',
        activity: 'Meditation',
        description: '10-15 minutes of quiet sitting or guided meditation.',
        tips: ['Use grounding visualizations', 'Focus on stability and rootedness'],
      },
      {
        time: '8:00 AM',
        activity: 'Warm, Nourishing Breakfast',
        description: 'Never skip breakfast! Eat warm, cooked foods.',
        tips: ['Oatmeal with ghee and dates', 'Warm milk with cardamom', 'Avoid cold cereals and smoothies'],
      },
    ],
    middayRoutine: [
      {
        time: '10:00 AM',
        activity: 'Work Period',
        description: 'Your most creative time. Focus on important tasks.',
        tips: ['Take breaks every hour', 'Stay warm - avoid AC drafts'],
      },
      {
        time: '12:00 PM',
        activity: 'Lunch - Main Meal',
        description: 'Largest meal of the day. Warm, well-cooked, with healthy fats.',
        tips: ['Include ghee or olive oil', 'Eat in a calm environment', 'Chew thoroughly'],
      },
      {
        time: '1:00 PM',
        activity: 'Short Walk',
        description: '10-15 minute gentle walk to aid digestion.',
        tips: ['Walk slowly, not briskly', 'Avoid intense exercise after eating'],
      },
      {
        time: '3:00 PM',
        activity: 'Warm Snack + Tea',
        description: 'Light snack if hungry. Warm herbal tea.',
        tips: ['Dates with almond butter', 'Ginger tea or CCF tea', 'Avoid cold snacks'],
      },
    ],
    eveningRoutine: [
      {
        time: '6:00 PM',
        activity: 'Light Dinner',
        description: 'Eat early. Warm soup or kitchari is ideal.',
        tips: ['Finish eating by 7 PM', 'Avoid raw salads at night', 'Keep it simple and warm'],
      },
      {
        time: '7:30 PM',
        activity: 'Gentle Evening Walk',
        description: 'Short, slow walk after dinner.',
        tips: ['15-20 minutes maximum', 'Walk with awareness'],
      },
      {
        time: '8:00 PM',
        activity: 'Wind Down - No Screens',
        description: 'Turn off all screens. Read, journal, or gentle conversation.',
        tips: ['Dim lights', 'Avoid stimulating content', 'Practice gratitude'],
      },
      {
        time: '9:00 PM',
        activity: 'Foot Massage',
        description: 'Apply warm sesame oil to feet before bed.',
        tips: ['Massage in circular motions', 'Wear cotton socks after', 'Incredibly calming for Vata'],
      },
      {
        time: '9:30 PM',
        activity: 'Warm Milk',
        description: 'Drink warm milk with nutmeg and cardamom.',
        tips: ['Add a pinch of nutmeg for sleep', 'Honey after cooling slightly'],
      },
      {
        time: '10:00 PM',
        activity: 'Sleep',
        description: 'Be in bed by 10 PM. Vata needs 7-8 hours.',
        tips: ['Keep bedroom warm', 'Use heavy blankets', 'Maintain consistent sleep time'],
      },
    ],
    meals: [
      {
        meal: 'Breakfast',
        time: '7:30-8:30 AM',
        recommendations: ['Warm oatmeal with ghee, cinnamon, dates', 'Rice porridge with almonds', 'Warm milk with soaked almonds', 'Eggs with toast and avocado'],
        avoid: ['Cold cereals', 'Smoothies', 'Raw fruits', 'Coffee on empty stomach'],
        recipes: ['Vata-balancing kitchari', 'Spiced almond milk'],
      },
      {
        meal: 'Lunch',
        time: '12:00-1:00 PM',
        recommendations: ['Rice with dal and vegetables', 'Warm grain bowls with ghee', 'Soups and stews', 'Root vegetables (sweet potato, carrots)'],
        avoid: ['Cold sandwiches', 'Raw salads', 'Dry crackers', 'Iced drinks'],
      },
      {
        meal: 'Dinner',
        time: '6:00-7:00 PM',
        recommendations: ['Soup or kitchari', 'Steamed vegetables with rice', 'Warm stews', 'Light dal'],
        avoid: ['Heavy meals', 'Raw foods', 'Beans (hard to digest)', 'Eating late'],
      },
    ],
    foodGuide: {
      favor: [
        'Warm soups and stews',
        'Cooked grains: rice, oats, wheat',
        'Root vegetables: carrots, beets, sweet potatoes',
        'Ripe fruits: bananas, mangoes, papayas',
        'Warm milk with ghee',
        'Nuts and seeds (soaked)',
        'Mung dal and red lentils',
        'Healthy oils: ghee, sesame oil',
      ],
      reduce: [
        'Raw vegetables and salads',
        'Cold drinks and ice cream',
        'Dried fruits (unless soaked)',
        'Most beans (except mung)',
        'Caffeine and stimulants',
        'Crackers, chips, dry snacks',
        'Bitter greens in excess',
        'Skipping meals',
      ],
      spices: ['Ginger', 'Cumin', 'Cinnamon', 'Cardamom', 'Fennel', 'Turmeric', 'Asafoetida (hing)'],
    },
    exercise: {
      type: 'Gentle & Grounding',
      duration: '30-45 minutes',
      bestTime: 'Morning (7-8 AM)',
      activities: ['Gentle yoga', 'Walking', 'Swimming (warm pool)', 'Tai Chi', 'Light dancing', 'Restorative stretching'],
      avoid: ['High-intensity cardio', 'Running long distances', 'Excessive jumping', 'Exercising in cold/wind', 'Over-exertion'],
    },
    herbs: [
      { herb: 'Ashwagandha', dosage: '500mg', timing: 'Morning & Night with warm milk', benefit: 'Grounds Vata, reduces anxiety, builds strength' },
      { herb: 'Triphala', dosage: '1/2 tsp', timing: 'Before bed with warm water', benefit: 'Supports digestion, gentle cleansing' },
      { herb: 'Brahmi', dosage: '500mg', timing: 'Morning', benefit: 'Calms racing mind, improves focus' },
      { herb: 'Shatavari', dosage: '500mg', timing: 'Twice daily', benefit: 'Nourishes tissues, balances hormones' },
    ],
    selfCare: [
      'Daily warm oil massage (Abhyanga) - non-negotiable!',
      'Keep a regular daily routine',
      'Stay warm - avoid cold and wind',
      'Practice grounding activities',
      'Limit travel and overstimulation',
      'Nurture yourself with warmth and comfort',
    ],
    avoid: [
      'Irregular schedules',
      'Cold foods and drinks',
      'Excessive travel',
      'Too much screen time',
      'Skipping meals',
      'Cold, dry, windy environments',
      'Excessive talking or mental activity',
      'Caffeine and stimulants',
    ],
    seasonalTips: {
      summer: ['Can reduce oil massage frequency', 'Coconut oil instead of sesame', 'Slightly cooler foods are OK'],
      winter: ['Increase oil massage', 'Extra warm foods', 'Stay very warm', 'More rest'],
      monsoon: ['Keep dry', 'Light, warm foods', 'Ginger tea daily', 'Avoid dampness'],
    },
  },
  {
    dosha: 'Pitta',
    overview: 'Pitta types need cooling, moderation, and calm. Your fire element gives you drive but can lead to burnout and irritability. Focus on staying cool, both physically and mentally.',
    morningRoutine: [
      {
        time: '5:30 AM',
        activity: 'Wake Before Heat',
        description: 'Rise early before the day gets hot. This is your optimal time.',
        tips: ['Pitta wakes easily - harness this', 'Avoid sleeping past 6 AM'],
      },
      {
        time: '5:45 AM',
        activity: 'Cool Water + Rose',
        description: 'Drink room temperature water with rose water.',
        tips: ['Avoid hot water in morning', 'Rose is cooling for Pitta'],
      },
      {
        time: '6:00 AM',
        activity: 'Coconut Oil Massage',
        description: 'Apply coconut oil (cooling) to body, especially head.',
        tips: ['Focus on scalp - cools Pitta', 'Can skip on very hot days'],
      },
      {
        time: '6:30 AM',
        activity: 'Cool Shower',
        description: 'Refreshing, cool (not cold) shower.',
        tips: ['Avoid very hot showers', 'End with cool water'],
      },
      {
        time: '6:45 AM',
        activity: 'Moderate Yoga',
        description: 'Non-competitive yoga. Moon salutations, twists, forward bends.',
        tips: ['Avoid hot yoga!', 'Practice in cool space', 'Focus on surrender, not achievement'],
      },
      {
        time: '7:15 AM',
        activity: 'Cooling Pranayama',
        description: 'Sheetali (cooling breath) and left nostril breathing.',
        tips: ['Curl tongue and inhale through it', 'Very cooling for Pitta fire'],
      },
      {
        time: '7:30 AM',
        activity: 'Meditation',
        description: 'Loving-kindness or compassion meditation.',
        tips: ['Focus on softening', 'Let go of goals during meditation'],
      },
      {
        time: '8:00 AM',
        activity: 'Cooling Breakfast',
        description: 'Sweet, cooling breakfast. Never skip!',
        tips: ['Sweet fruits, oatmeal with dates', 'Avoid spicy breakfast foods', 'Coffee OK but limit to 1 cup'],
      },
    ],
    middayRoutine: [
      {
        time: '10:00 AM',
        activity: 'Focused Work',
        description: 'Channel your sharp intellect. Most productive time.',
        tips: ['Take breaks to avoid burnout', 'Don\'t skip lunch!'],
      },
      {
        time: '12:00 PM',
        activity: 'Lunch - Main Meal',
        description: 'Eat your largest meal when digestion is strongest.',
        tips: ['Include bitter and sweet tastes', 'Avoid very spicy food', 'Eat in pleasant environment'],
      },
      {
        time: '1:00 PM',
        activity: 'Rest (Not Nap)',
        description: 'Short rest period. Avoid intense work right after eating.',
        tips: ['Pitta should avoid daytime naps', '10-minute rest is enough'],
      },
      {
        time: '3:00 PM',
        activity: 'Sweet Snack',
        description: 'If hungry, have sweet, cooling snack.',
        tips: ['Sweet fruits, dates, coconut', 'Avoid salty, spicy snacks'],
      },
    ],
    eveningRoutine: [
      {
        time: '6:00 PM',
        activity: 'Moderate Dinner',
        description: 'Moderate-sized, not too heavy. Avoid very spicy.',
        tips: ['Earlier is better for Pitta', 'Include cooling foods'],
      },
      {
        time: '7:00 PM',
        activity: 'Moonlight Walk',
        description: 'Walk in the cool evening air. Look at the moon.',
        tips: ['Cooling for Pitta fire', 'Walk slowly, enjoy nature'],
      },
      {
        time: '8:00 PM',
        activity: 'Relaxing Activities',
        description: 'Non-competitive activities. Art, music, reading.',
        tips: ['Avoid work emails', 'No competitive games', 'Soft music'],
      },
      {
        time: '9:00 PM',
        activity: 'Cool Milk',
        description: 'Room temperature or slightly warm milk with cardamom.',
        tips: ['Add saffron for cooling', 'Avoid hot drinks before bed'],
      },
      {
        time: '10:00 PM',
        activity: 'Sleep',
        description: 'In bed by 10 PM. Keep room cool.',
        tips: ['Cool, dark bedroom', 'Silk or cotton sheets', 'Don\'t work in bed'],
      },
    ],
    meals: [
      {
        meal: 'Breakfast',
        time: '7:30-8:30 AM',
        recommendations: ['Sweet fruits (melons, grapes, pears)', 'Oatmeal with dates and coconut', 'Rice flakes with milk', 'Toast with ghee'],
        avoid: ['Spicy foods', 'Sour fruits (oranges, grapefruit)', 'Eggs (too heating)', 'Excessive coffee'],
      },
      {
        meal: 'Lunch',
        time: '12:00-1:00 PM',
        recommendations: ['Basmati rice with cooling vegetables', 'Salads (OK for Pitta)', 'Coconut-based curries', 'Bitter greens'],
        avoid: ['Very spicy food', 'Fermented foods', 'Red meat', 'Fried foods'],
      },
      {
        meal: 'Dinner',
        time: '6:00-7:00 PM',
        recommendations: ['Light grains with vegetables', 'Mung dal', 'Steamed vegetables', 'Cooling soups'],
        avoid: ['Heavy, oily foods', 'Spicy curries', 'Alcohol', 'Sour foods'],
      },
    ],
    foodGuide: {
      favor: [
        'Cooling foods: cucumber, melon, coconut',
        'Sweet fruits: grapes, pomegranate, pears',
        'Leafy greens and bitter vegetables',
        'Basmati rice, barley, oats',
        'Mung beans, tofu',
        'Ghee and coconut oil',
        'Fresh dairy: milk, butter',
        'Mint, cilantro, fennel',
      ],
      reduce: [
        'Spicy foods: chilies, hot peppers',
        'Sour foods: tomatoes, citrus, vinegar',
        'Fermented foods: alcohol, pickles',
        'Red meat and eggs',
        'Excess salt',
        'Coffee and caffeinated drinks',
        'Fried and oily foods',
        'Onion, garlic (in excess)',
      ],
      spices: ['Coriander', 'Fennel', 'Cardamom', 'Turmeric', 'Mint', 'Saffron', 'Cumin (moderately)'],
    },
    exercise: {
      type: 'Moderate & Cooling',
      duration: '30-45 minutes',
      bestTime: 'Morning (6-7 AM) or Evening (after 6 PM)',
      activities: ['Swimming', 'Cycling', 'Moon salutation yoga', 'Walking in nature', 'Non-competitive sports', 'Water activities'],
      avoid: ['Hot yoga', 'Running in midday sun', 'Competitive sports', 'Over-exertion', 'Exercising when angry'],
    },
    herbs: [
      { herb: 'Shatavari', dosage: '500mg', timing: 'Twice daily', benefit: 'Cools Pitta, balances hormones' },
      { herb: 'Brahmi', dosage: '500mg', timing: 'Morning', benefit: 'Cools the mind, improves focus' },
      { herb: 'Amalaki (Amla)', dosage: '500mg', timing: 'Daily', benefit: 'Cooling, rejuvenating, vitamin C' },
      { herb: 'Neem', dosage: '500mg', timing: 'Morning', benefit: 'Blood purification, cools Pitta' },
    ],
    selfCare: [
      'Stay cool - physically and emotionally',
      'Practice moderation in all things',
      'Cultivate compassion and patience',
      'Spend time near water',
      'Moon gazing in the evening',
      'Avoid overworking - take breaks',
    ],
    avoid: [
      'Excessive heat and sun',
      'Skipping meals (especially lunch)',
      'Overworking and perfectionism',
      'Hot, spicy, sour, salty foods',
      'Alcohol and fermented foods',
      'Competitive situations',
      'Anger and criticism',
      'Midday sun exposure',
    ],
    seasonalTips: {
      summer: ['Stay extra cool', 'Coconut water daily', 'Avoid sun 10 AM-4 PM', 'Light, sweet foods'],
      winter: ['Can have slightly warming foods', 'Some spices OK', 'Less strict cooling needed'],
      monsoon: ['Moderate foods', 'Avoid sour foods', 'Light exercise'],
    },
  },
  {
    dosha: 'Kapha',
    overview: 'Kapha types need stimulation, movement, and lightness. Your earth/water elements give you strength and calm but can lead to sluggishness. Focus on staying active and light.',
    morningRoutine: [
      {
        time: '5:00 AM',
        activity: 'Wake Before 6 AM!',
        description: 'Critical: Wake BEFORE Kapha time (6-10 AM) or you\'ll feel heavy all day.',
        tips: ['This is the most important rule for Kapha', 'No snooze button!', 'Get up immediately'],
      },
      {
        time: '5:15 AM',
        activity: 'Tongue Scraping + Warm Water',
        description: 'Scrape tongue, then drink warm water with lemon and ginger.',
        tips: ['Add honey for extra Kapha reduction', 'Stimulates metabolism'],
      },
      {
        time: '5:30 AM',
        activity: 'Dry Brushing',
        description: 'Dry brush body before shower to stimulate circulation.',
        tips: ['Use firm strokes toward heart', 'Very invigorating for Kapha'],
      },
      {
        time: '5:45 AM',
        activity: 'Vigorous Exercise',
        description: 'Get moving! Sweat is essential for Kapha.',
        tips: ['Sun salutations (fast pace)', 'Running, HIIT, or brisk walk', 'Exercise until you sweat'],
      },
      {
        time: '6:30 AM',
        activity: 'Invigorating Shower',
        description: 'Warm shower, finish with cool water.',
        tips: ['Cool water at end wakes you up', 'Avoid long, hot showers'],
      },
      {
        time: '6:45 AM',
        activity: 'Kapalabhati Pranayama',
        description: 'Skull-shining breath - energizing and clearing.',
        tips: ['Forceful exhales, passive inhales', 'Clears Kapha congestion'],
      },
      {
        time: '7:00 AM',
        activity: 'Light or Skip Breakfast',
        description: 'Kapha can skip breakfast or eat very light.',
        tips: ['Ginger tea with honey is enough', 'If eating: light, warm, spiced foods', 'No heavy, sweet breakfast'],
      },
    ],
    middayRoutine: [
      {
        time: '10:00 AM',
        activity: 'Active Work',
        description: 'Stay active. Change positions, walk while thinking.',
        tips: ['Don\'t sit too long', 'Standing desk if possible'],
      },
      {
        time: '12:00 PM',
        activity: 'Lunch - Main Meal',
        description: 'Make this your main meal. Light, warm, spiced.',
        tips: ['Include all 6 tastes, especially pungent and bitter', 'Smaller portions than other doshas'],
      },
      {
        time: '1:00 PM',
        activity: 'Walk - NO Napping!',
        description: 'Walk after lunch. Never nap during the day.',
        tips: ['Daytime sleep increases Kapha dramatically', '15-20 minute brisk walk'],
      },
      {
        time: '3:00 PM',
        activity: 'Stimulating Tea',
        description: 'If needed, ginger or black tea. No snacking.',
        tips: ['Avoid sweet snacks', 'Kapha can go longer without food'],
      },
    ],
    eveningRoutine: [
      {
        time: '6:00 PM',
        activity: 'Light Dinner',
        description: 'Lightest meal of the day. Soup or steamed vegetables.',
        tips: ['Eat early', 'Can skip dinner if not hungry', 'No heavy, oily foods'],
      },
      {
        time: '7:00 PM',
        activity: 'Active Evening',
        description: 'Stay active - don\'t collapse on the couch.',
        tips: ['Evening walk', 'Active hobbies', 'Social activities'],
      },
      {
        time: '8:30 PM',
        activity: 'Light Reading/Activities',
        description: 'Engaging mental activities. Avoid screens.',
        tips: ['Learn something new', 'Avoid emotional eating'],
      },
      {
        time: '9:30 PM',
        activity: 'Prepare for Bed',
        description: 'Light wind-down. No heavy snacks.',
        tips: ['Ginger tea if needed', 'NO milk with honey at night'],
      },
      {
        time: '10:00 PM',
        activity: 'Sleep',
        description: 'In bed by 10 PM. Kapha needs less sleep (6-7 hours).',
        tips: ['Don\'t oversleep!', 'Light covers', 'Well-ventilated room'],
      },
    ],
    meals: [
      {
        meal: 'Breakfast',
        time: '7:30-8:30 AM (or skip)',
        recommendations: ['Ginger tea with honey', 'Light, spiced porridge', 'Stewed apples with cinnamon', 'Can skip breakfast'],
        avoid: ['Heavy oatmeal', 'Pancakes', 'Sweet pastries', 'Dairy', 'Cold cereals'],
      },
      {
        meal: 'Lunch',
        time: '12:00-1:00 PM',
        recommendations: ['Spiced vegetables', 'Mung dal', 'Barley or millet', 'Leafy greens', 'Light curries'],
        avoid: ['Heavy rice dishes', 'Creamy sauces', 'Deep-fried foods', 'Excessive bread'],
      },
      {
        meal: 'Dinner',
        time: '6:00-7:00 PM',
        recommendations: ['Clear soups', 'Steamed vegetables', 'Light stir-fries', 'Small portions'],
        avoid: ['Heavy foods', 'Cheese', 'Desserts', 'Late eating'],
      },
    ],
    foodGuide: {
      favor: [
        'Light, warm foods',
        'Leafy greens and vegetables',
        'Legumes: lentils, chickpeas',
        'Astringent fruits: apples, pears, berries',
        'Light grains: millet, barley, buckwheat',
        'Honey (raw, unheated)',
        'Ginger tea',
        'Spicy foods in moderation',
      ],
      reduce: [
        'Dairy: milk, cheese, ice cream',
        'Heavy, fried foods',
        'Excess sweets and sugar',
        'Wheat and white rice',
        'Cold foods and drinks',
        'Red meat',
        'Excess oils and fats',
        'Bananas, avocados, coconut',
      ],
      spices: ['Black pepper', 'Ginger', 'Turmeric', 'Cayenne', 'Mustard seeds', 'Cloves', 'Fenugreek'],
    },
    exercise: {
      type: 'Vigorous & Stimulating',
      duration: '45-60 minutes',
      bestTime: 'Morning (5-7 AM) - before Kapha time',
      activities: ['Running', 'HIIT workouts', 'Cycling', 'Aerobics', 'Vigorous yoga (Vinyasa)', 'Swimming', 'Martial arts'],
      avoid: ['Gentle, slow exercise only', 'Skipping exercise', 'Exercising after 10 AM', 'Using exercise as excuse to eat more'],
    },
    herbs: [
      { herb: 'Trikatu', dosage: '1/4 tsp', timing: 'Before meals with honey', benefit: 'Kindles metabolism, burns Kapha' },
      { herb: 'Guggulu', dosage: '500mg', timing: 'Twice daily', benefit: 'Scrapes fat, clears channels' },
      { herb: 'Triphala', dosage: '1/2 tsp', timing: 'Before bed', benefit: 'Cleansing, weight management' },
      { herb: 'Punarnava', dosage: '500mg', timing: 'Twice daily', benefit: 'Reduces water retention' },
    ],
    selfCare: [
      'Wake before 6 AM - non-negotiable',
      'Exercise vigorously every day',
      'Stay active and engaged',
      'Embrace change and new experiences',
      'Dry brushing before shower',
      'Seek stimulation, not comfort',
    ],
    avoid: [
      'Sleeping past 6 AM',
      'Daytime napping',
      'Sedentary lifestyle',
      'Heavy, oily, sweet foods',
      'Excessive dairy and wheat',
      'Cold, damp environments',
      'Oversleeping (more than 7 hours)',
      'Emotional eating',
      'Excessive comfort-seeking',
    ],
    seasonalTips: {
      summer: ['Great season for Kapha', 'Stay active outdoors', 'Lighter foods naturally'],
      winter: ['Hardest season - stay warm and active', 'Extra exercise needed', 'Avoid heavy winter foods'],
      monsoon: ['Avoid cold, damp', 'Stay dry', 'Light, warm foods', 'Extra spices'],
    },
  },
];

// Get routine for specific dosha
export const getRoutineForDosha = (dosha: string): DoshaRoutine | undefined => {
  return doshaRoutines.find(r => r.dosha.toLowerCase() === dosha.toLowerCase());
};

// Generate personalized recommendations based on scan results
export interface ScanBasedRecommendation {
  category: string;
  icon: string;
  title: string;
  description: string;
  actions: string[];
}

export const generateScanRecommendations = (
  dominantDosha: string,
  skinIssues?: string[],
  eyeIssues?: string[],
  nailIssues?: string[],
  pulseIrregularities?: string[]
): ScanBasedRecommendation[] => {
  const recommendations: ScanBasedRecommendation[] = [];

  // Base dosha recommendation
  recommendations.push({
    category: 'Dosha Balance',
    icon: 'spa',
    title: `Balance Your ${dominantDosha} Dosha`,
    description: dominantDosha === 'Vata'
      ? 'Focus on warmth, routine, and grounding practices'
      : dominantDosha === 'Pitta'
      ? 'Focus on cooling, moderation, and relaxation'
      : 'Focus on stimulation, movement, and lightness',
    actions: dominantDosha === 'Vata'
      ? ['Daily warm oil massage', 'Regular meal times', 'Early bedtime']
      : dominantDosha === 'Pitta'
      ? ['Stay cool', 'Avoid overworking', 'Moonlight walks']
      : ['Wake before 6 AM', 'Vigorous exercise', 'Light meals'],
  });

  // Add more specific recommendations based on scan results...

  return recommendations;
};
