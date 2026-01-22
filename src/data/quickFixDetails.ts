export interface QuickFixDetail {
  id: string;
  title: string;
  icon: string;
  iconColor: string;
  iconBg: string;
  problem: string;
  remedy: string;
  why: string;
  terms: {
    term: string;
    explanation: string;
  }[];
  howTo: {
    title: string;
    steps: string[];
  }[];
  manuscript: string;
  doshaLink: string;
}

export const quickFixDetails: QuickFixDetail[] = [
  {
    id: 'screentime',
    title: 'Too much screen time',
    icon: 'cellphone',
    iconColor: '#1976D2',
    iconBg: '#E3F2FD',
    problem: 'Eyes feel tired, mind feels scattered, trouble sleeping, constant scrolling',
    remedy: 'Sensory detox + Triphala for eyes',
    why: 'Charaka Samhita calls this "atiyoga" - excessive sensory input. When eyes (the seat of Pitta) are overstimulated, they deplete Ojas (your vital essence/immunity). Digital screens emit artificial light that confuses your circadian rhythm.',
    terms: [
      {
        term: 'Atiyoga',
        explanation: 'Excessive use of senses. Charaka teaches that disease comes from 3 causes: overuse (atiyoga), underuse (ayoga), or wrong use (mithyāyoga) of senses.',
      },
      {
        term: 'Ojas',
        explanation: 'Your vital essence - the subtle energy that gives immunity, glow, and mental clarity. Think of it as your "life battery". Screen time drains it.',
      },
      {
        term: 'Sensory Detox',
        explanation: 'Giving your senses a break. Like fasting for your eyes and ears. Reduces input to let your nervous system reset.',
      },
      {
        term: 'Triphala',
        explanation: 'A blend of 3 fruits (Amalaki, Bibhitaki, Haritaki). Cleanses and rejuvenates the body. Specifically helps eye strain when used as eye wash.',
      },
    ],
    howTo: [
      {
        title: 'Sensory Detox (Do This Daily)',
        steps: [
          'Set a 30-minute timer',
          'Turn off ALL screens (phone, computer, TV)',
          'Close your eyes or look at nature',
          'Sit in silence or listen to instrumental music',
          'Do this 2x daily: morning and before bed',
        ],
      },
      {
        title: 'Triphala Eye Wash',
        steps: [
          'Mix 1/2 tsp Triphala powder in 1 cup warm water',
          'Let it sit overnight',
          'Strain in the morning',
          'Use an eye cup to wash each eye',
          'OR: Splash your closed eyes with this water',
          'Do this every morning',
        ],
      },
      {
        title: 'Screen Rules',
        steps: [
          'No screens 1 hour before bed',
          'Use blue light filters after sunset',
          'Every 20 min: look 20 feet away for 20 seconds',
          'Keep screens at arm\'s length',
          'Blink consciously 15x every hour',
        ],
      },
    ],
    manuscript: 'Charaka Samhita - Sutrasthana 11.37: "Atiyogo Ayogo Mithaāyogah Indriyāṇāṃ Sambahddhāh Ca Rogāḥ" - Diseases arise from excessive, deficient, or wrong use of senses.',
    doshaLink: 'Vata imbalance (nervous system overload)',
  },
  {
    id: 'stress',
    title: 'Stressed & anxious',
    icon: 'meditation',
    iconColor: '#7B1FA2',
    iconBg: '#F3E5F5',
    problem: 'Racing thoughts, can\'t relax, tight chest, shallow breathing',
    remedy: 'Ashwagandha + Pranayama breathing',
    why: 'Vata dosha (air element) is aggravated - your mind is like wind, constantly moving. Charaka says: "Vata, when disturbed, creates fear and anxiety." Ashwagandha literally means "smell of a horse" - it gives you the strength and calm of a horse.',
    terms: [
      {
        term: 'Vata Dosha',
        explanation: 'The air/space element in your body. Controls movement, breathing, and thoughts. When disturbed: anxiety, worry, racing mind. When balanced: creativity, enthusiasm.',
      },
      {
        term: 'Ashwagandha',
        explanation: 'The king of Ayurvedic herbs. Adaptogen that calms stress hormones (cortisol). Grounds Vata energy. Builds strength without stimulation.',
      },
      {
        term: 'Pranayama',
        explanation: 'Breath control. "Prana" = life force, "Ayama" = extension. Conscious breathing that directly calms your nervous system in 60 seconds.',
      },
      {
        term: 'Grounding',
        explanation: 'Opposite of spacey/scattered. Bringing your energy down from your head to your body. Like plugging into the earth.',
      },
    ],
    howTo: [
      {
        title: 'Take Ashwagandha',
        steps: [
          '300-500mg twice daily (morning and night)',
          'Mix powder in warm milk with honey',
          'Or take capsules with food',
          'Takes 2-4 weeks to feel full effect',
          'Brands: Himalaya, Organic India, Banyan Botanicals',
        ],
      },
      {
        title: '4-7-8 Breathing (Instant Calm)',
        steps: [
          'Sit comfortably, close eyes',
          'Breathe in through nose for 4 counts',
          'Hold breath for 7 counts',
          'Exhale through mouth for 8 counts (make whoosh sound)',
          'Repeat 4 times',
          'Do this anytime anxiety hits',
        ],
      },
      {
        title: 'Grounding Practice',
        steps: [
          'Walk barefoot on grass for 10 minutes',
          'Feel your feet on the ground',
          'Eat warm, heavy foods (not cold salads)',
          'Oil massage your feet before bed',
          'Keep a routine - same sleep/wake times',
        ],
      },
    ],
    manuscript: 'Charaka Samhita - Sutrasthana 12: "Vatāt Bhayam" - From disturbed Vata arises fear.',
    doshaLink: 'Vata imbalance',
  },
  {
    id: 'burnout',
    title: 'Burnt out & exhausted',
    icon: 'fire',
    iconColor: '#D32F2F',
    iconBg: '#FFEBEE',
    problem: 'No energy, doing too much, feeling fried, irritable',
    remedy: 'Ojas-building foods + rest protocol',
    why: 'Your Pitta fire is consuming itself. Like a candle burning at both ends. Charaka teaches that we have limited "Tejas" (metabolic fire) - if we overwork, it burns our tissues and Ojas.',
    terms: [
      {
        term: 'Pitta Dosha',
        explanation: 'Fire/water element. Controls metabolism, digestion, and transformation. When balanced: sharp intellect, drive. When excessive: burnout, anger, inflammation.',
      },
      {
        term: 'Ojas-Building',
        explanation: 'Foods and practices that REBUILD your vital essence. Think: rest, nourishing foods, joy, connection. Opposite of depleting activities.',
      },
      {
        term: 'Tejas',
        explanation: 'Your metabolic fire. The subtle fire that digests food and thoughts. Can be depleted by overwork, multitasking, anger.',
      },
      {
        term: 'Rest Protocol',
        explanation: 'Structured rest. Not just sleep - but deep relaxation, doing nothing, being vs. doing.',
      },
    ],
    howTo: [
      {
        title: 'Ojas-Building Foods (Eat Daily)',
        steps: [
          'Warm milk with saffron and cardamom',
          'Ghee (clarified butter) on every meal',
          'Sweet fruits: dates, figs, raisins',
          'Whole grains: rice, oats',
          'Almonds soaked overnight (10-12)',
          'Avoid: coffee, alcohol, processed food',
        ],
      },
      {
        title: 'Rest Protocol (Non-Negotiable)',
        steps: [
          'Sleep 7-8 hours (10 PM - 6 AM)',
          'One full day off per week (no work)',
          '20-min nap at 2 PM if exhausted',
          'Say "no" to 50% of requests',
          'Do NOTHING for 30 min/day (literally sit)',
        ],
      },
      {
        title: 'Cooling Practices',
        steps: [
          'Walk in nature after sunset',
          'Swim or take cool showers',
          'Avoid spicy food and alcohol',
          'Listen to calming music',
          'Laugh and play (not compete)',
        ],
      },
    ],
    manuscript: 'Charaka Samhita - Sutrasthana 17: "Ojas is the essence of all tissues. When depleted, life cannot be sustained."',
    doshaLink: 'Pitta aggravation - fire consuming tissues',
  },
  {
    id: 'sleep',
    title: 'Can\'t sleep well',
    icon: 'sleep',
    iconColor: '#5C6BC0',
    iconBg: '#E8EAF6',
    problem: 'Trouble falling asleep, waking up at night, mind racing',
    remedy: 'Nutmeg milk + no screens after 8pm',
    why: 'Vata increases at night (2-6 AM is Vata time). Screen light suppresses melatonin. Charaka says: "Those who stay awake at night disturb all doshas and invite disease."',
    terms: [
      {
        term: 'Vata Time',
        explanation: '2-6 AM and 2-6 PM. Periods when air element dominates. Early morning Vata can wake you with anxiety if you go to bed too late.',
      },
      {
        term: 'Nutmeg (Jaiphal)',
        explanation: 'A nervous system sedative. Very small amounts (pinch) induce deep sleep. Too much can be toxic - use sparingly!',
      },
      {
        term: 'Melatonin',
        explanation: 'Your natural sleep hormone. Produced when it gets dark. Blue light from screens stops its production.',
      },
      {
        term: 'Sleep Hygiene',
        explanation: 'Practices that prepare your body for sleep. Like training your nervous system to wind down.',
      },
    ],
    howTo: [
      {
        title: 'Nutmeg Milk Recipe',
        steps: [
          'Heat 1 cup whole milk',
          'Add TINY pinch of nutmeg powder (size of match head)',
          'Add 1 tsp honey after removing from heat',
          'Drink 30 min before bed',
          'Start with tiny amounts - nutmeg is powerful!',
        ],
      },
      {
        title: 'Evening Routine (8 PM Onward)',
        steps: [
          '8 PM: Turn off all screens',
          '8:30 PM: Dim all lights',
          '9 PM: Warm bath or foot massage with oil',
          '9:30 PM: Read physical book',
          '10 PM: In bed, lights off',
        ],
      },
      {
        title: 'If You Wake Up at Night',
        steps: [
          'Don\'t check phone!',
          'Do 4-7-8 breathing',
          'Massage your feet',
          'Think of 3 things you\'re grateful for',
          'Trust you\'ll fall back asleep',
        ],
      },
    ],
    manuscript: 'Charaka Samhita - Sutrasthana 21: "Rātrau Jāgaranam Sarva Dosha Prakopakam" - Staying awake at night aggravates all doshas.',
    doshaLink: 'Vata imbalance - mobile mind',
  },
  {
    id: 'digestion',
    title: 'Digestion issues',
    icon: 'stomach',
    iconColor: '#388E3C',
    iconBg: '#E8F5E9',
    problem: 'Bloating, gas, constipation, acid reflux, feeling heavy after meals',
    remedy: 'Triphala + ginger tea before meals',
    why: 'Your Agni (digestive fire) is weak or irregular. Charaka teaches: "All disease begins in the gut." When Agni is low, food ferments instead of being digested, creating Ama (toxins).',
    terms: [
      {
        term: 'Agni',
        explanation: 'Your digestive fire. Like a furnace that transforms food into energy. When strong: good appetite, clear mind. When weak: bloating, fatigue, foggy thinking.',
      },
      {
        term: 'Ama',
        explanation: 'Toxic residue from undigested food. Sticky, heavy substance that clogs channels. Causes bad breath, coated tongue, joint pain, lethargy.',
      },
      {
        term: 'Triphala',
        explanation: 'Three-fruit formula (Amalaki, Bibhitaki, Haritaki). Gently cleanses entire digestive tract. Balances all three doshas. Safe for daily use.',
      },
      {
        term: 'CCF Tea',
        explanation: 'Cumin-Coriander-Fennel tea. The digestive reset drink of Ayurveda. Kindles Agni without increasing Pitta.',
      },
    ],
    howTo: [
      {
        title: 'Triphala Protocol',
        steps: [
          'Take 1/2 tsp Triphala powder in warm water',
          'Best time: 30 min before bed',
          'Or take 2 capsules before bed',
          'Start with small dose - increase gradually',
          'Use for 2-3 months, then take a break',
        ],
      },
      {
        title: 'Ginger Tea Before Meals',
        steps: [
          'Slice fresh ginger (1 inch piece)',
          'Steep in hot water for 5 minutes',
          'Add pinch of salt and squeeze of lemon',
          'Drink 15-20 min before meals',
          'This "kindles" your digestive fire',
        ],
      },
      {
        title: 'Eating Rules for Strong Agni',
        steps: [
          'Eat only when hungry (not by clock)',
          'Eat largest meal at lunch (noon)',
          'No cold drinks with meals',
          'Chew each bite 30 times',
          'Stop eating when 75% full',
          'No snacking between meals',
        ],
      },
    ],
    manuscript: 'Charaka Samhita - Chikitsasthana 15: "Rogāḥ Sarve Api Mandāgnau" - All diseases arise from weak digestive fire.',
    doshaLink: 'Agni imbalance - weak digestive fire',
  },
  {
    id: 'focus',
    title: "Can't concentrate",
    icon: 'head-lightbulb',
    iconColor: '#F57C00',
    iconBg: '#FFF3E0',
    problem: 'Mind jumping everywhere, can\'t finish tasks, easily distracted, mental fog',
    remedy: 'Brahmi + single-tasking practice',
    why: 'Vata dosha is scattered in the mind. Modern multitasking and constant notifications fragment your attention. Charaka says the mind needs "ekāgratā" (one-pointedness) for clarity.',
    terms: [
      {
        term: 'Brahmi',
        explanation: 'The brain tonic herb. Enhances memory, focus, and learning. Calms Vata in the mind. Used by ancient scholars for studying scriptures.',
      },
      {
        term: 'Ekāgratā',
        explanation: 'One-pointedness. The ability to focus on one thing completely. Opposite of scattered attention. The foundation of meditation.',
      },
      {
        term: 'Prana Vata',
        explanation: 'The type of Vata that governs the mind and senses. When disturbed: scattered thoughts. When balanced: sharp focus, creativity.',
      },
      {
        term: 'Single-Tasking',
        explanation: 'Doing ONE thing at a time with full attention. The antidote to modern multitasking. Trains your brain to focus deeply.',
      },
    ],
    howTo: [
      {
        title: 'Take Brahmi Daily',
        steps: [
          '300-500mg Brahmi extract twice daily',
          'Or 1 tsp Brahmi powder in warm milk',
          'Best taken morning and evening',
          'Takes 4-6 weeks for full effect',
          'Combine with Shankhpushpi for extra benefit',
        ],
      },
      {
        title: 'Single-Tasking Practice',
        steps: [
          'Choose ONE task to work on',
          'Set timer for 25 minutes (Pomodoro)',
          'Close all other tabs and apps',
          'Phone on airplane mode',
          'Work on ONLY that task',
          'Take 5-min break, then repeat',
        ],
      },
      {
        title: 'Morning Focus Ritual',
        steps: [
          'Wake up and sit in silence for 5 min',
          'No phone for first 1 hour',
          'Do 10 rounds of alternate nostril breathing',
          'Write down your 3 priorities for the day',
          'Start with hardest task first',
        ],
      },
    ],
    manuscript: 'Charaka Samhita - Sharirasthana 1: "Manas Ekam" - The mind should be unified and one-pointed for optimal function.',
    doshaLink: 'Vata imbalance - scattered Prana Vata',
  },
  {
    id: 'weight',
    title: 'Weight gain & sluggish',
    icon: 'scale-bathroom',
    iconColor: '#00796B',
    iconBg: '#E0F2F1',
    problem: 'Gaining weight easily, feeling heavy, sluggish metabolism, water retention',
    remedy: 'Trikatu spice + morning exercise',
    why: 'Kapha dosha is accumulated. Kapha is earth + water elements - heavy, slow, stable. When excessive, metabolism slows down and tissues accumulate. Charaka prescribes "langhana" (lightening therapy).',
    terms: [
      {
        term: 'Kapha Dosha',
        explanation: 'Earth/water element. Provides structure, stability, lubrication. When balanced: strong, calm, loving. When excessive: weight gain, lethargy, attachment.',
      },
      {
        term: 'Trikatu',
        explanation: '"Three pungents" - Black pepper, Long pepper, Ginger. Powerful metabolism booster. Burns Ama and kindles Agni. Takes without causing Pitta imbalance.',
      },
      {
        term: 'Langhana',
        explanation: 'Lightening therapy. Anything that makes you lighter: fasting, exercise, dry foods, stimulating herbs. Opposite of building/nourishing.',
      },
      {
        term: 'Meda Dhatu',
        explanation: 'Fat tissue. One of 7 body tissues. Healthy Meda provides cushioning and warmth. Excess Meda causes obesity and blocks channels.',
      },
    ],
    howTo: [
      {
        title: 'Trikatu Before Meals',
        steps: [
          'Mix equal parts: black pepper, ginger, long pepper (or use capsules)',
          'Take 1/4 tsp with honey before meals',
          'Or take 1-2 capsules before lunch',
          'Avoid if you have acid reflux or ulcers',
          'Use for 1-2 months, then assess',
        ],
      },
      {
        title: 'Morning Exercise (Non-Negotiable)',
        steps: [
          'Exercise BEFORE 10 AM (Kapha time)',
          'Do vigorous exercise until you sweat',
          'Aim for 30-45 minutes daily',
          'Best: brisk walking, running, sun salutations',
          'Exercise on empty stomach for fat burning',
        ],
      },
      {
        title: 'Kapha-Balancing Diet',
        steps: [
          'Eat light breakfast or skip it',
          'Favor warm, cooked, spicy foods',
          'Reduce dairy, wheat, sugar, oily foods',
          'Drink warm/hot water (never cold)',
          'Eat largest meal at lunch, light dinner',
          'No eating after 7 PM',
        ],
      },
    ],
    manuscript: 'Charaka Samhita - Sutrasthana 21: "Guru Shīta Manda Snigdha" - Kapha is heavy, cold, slow, and oily. Counter with opposite qualities.',
    doshaLink: 'Kapha imbalance - excess earth and water',
  },
  {
    id: 'angry',
    title: 'Irritable & angry',
    icon: 'emoticon-angry',
    iconColor: '#C62828',
    iconBg: '#FFCDD2',
    problem: 'Quick to anger, impatient, critical of others, feeling hot, skin issues',
    remedy: 'Cooling foods + moonlight walks',
    why: 'Pitta dosha (fire element) is aggravated. Your internal fire is too high, burning through patience and compassion. Charaka says: "Pittāt Krodha" - from excess Pitta comes anger.',
    terms: [
      {
        term: 'Pitta Dosha',
        explanation: 'Fire/water element. Controls digestion, metabolism, and transformation. When balanced: sharp intellect, courage, leadership. When excess: anger, criticism, inflammation.',
      },
      {
        term: 'Cooling Foods',
        explanation: 'Foods that reduce internal heat: sweet fruits, coconut, milk, cucumber, leafy greens. Opposite of spicy, sour, salty.',
      },
      {
        term: 'Moonlight (Chandrama)',
        explanation: 'Ayurveda considers moonlight cooling and soothing. Walking under moonlight pacifies Pitta and calms the mind.',
      },
      {
        term: 'Sheetali Pranayama',
        explanation: 'Cooling breath. Inhale through curled tongue, exhale through nose. Instantly cools the body and calms anger.',
      },
    ],
    howTo: [
      {
        title: 'Cooling Food Protocol',
        steps: [
          'Start day with sweet fruits (not citrus)',
          'Drink coconut water daily',
          'Add ghee to every meal',
          'Eat cucumber, melon, leafy greens',
          'Avoid: spicy food, alcohol, coffee, fermented foods',
          'Reduce red meat, garlic, onions',
        ],
      },
      {
        title: 'Moonlight Walk Practice',
        steps: [
          'Walk outside after sunset',
          'Ideally under moonlight (full moon best)',
          'Walk slowly for 15-20 minutes',
          'Breathe deeply and look at the sky',
          'Let the cool night air calm your fire',
        ],
      },
      {
        title: 'Instant Anger Relief',
        steps: [
          'Stop and take 10 slow breaths',
          'Splash cold water on face and wrists',
          'Do Sheetali breath: inhale through curled tongue',
          'Drink cool (not ice) water',
          'Walk away from situation for 5 minutes',
          'Ask: "Will this matter in 5 years?"',
        ],
      },
    ],
    manuscript: 'Charaka Samhita - Sutrasthana 12: "Pittāt Krodham" - From aggravated Pitta arises anger.',
    doshaLink: 'Pitta imbalance - excess fire element',
  },
  {
    id: 'procrastination',
    title: 'Procrastination & laziness',
    icon: 'sofa',
    iconColor: '#795548',
    iconBg: '#EFEBE9',
    problem: 'Can\'t get started, putting things off, feeling stuck, excessive sleeping',
    remedy: 'Morning routine + stimulating spices',
    why: 'Kapha is dominant, especially in the morning (6-10 AM is Kapha time). Heavy, slow qualities make it hard to initiate action. Charaka prescribes waking before sunrise to avoid Kapha accumulation.',
    terms: [
      {
        term: 'Kapha Time',
        explanation: '6-10 AM and 6-10 PM. When earth/water elements dominate. If you sleep during this time, you absorb heaviness. Wake before 6 AM to avoid it.',
      },
      {
        term: 'Tamas',
        explanation: 'The quality of inertia, darkness, and stagnation. One of three mental qualities (gunas). Procrastination is a tamasic state.',
      },
      {
        term: 'Stimulating Spices',
        explanation: 'Spices that kindle Agni and move energy: ginger, black pepper, cinnamon, cardamom. Counter Kapha heaviness.',
      },
      {
        term: 'Dinacharya',
        explanation: 'Daily routine. Ayurveda\'s most powerful tool. Following nature\'s rhythms creates energy and prevents disease.',
      },
    ],
    howTo: [
      {
        title: 'Anti-Procrastination Morning Routine',
        steps: [
          'Wake BEFORE 6 AM (critical!)',
          'Immediately get out of bed (no snooze)',
          'Splash cold water on face',
          'Drink warm water with lemon and ginger',
          'Do 10 minutes of movement (sun salutations)',
          'No phone for first hour',
        ],
      },
      {
        title: 'Stimulating Spice Protocol',
        steps: [
          'Morning: Ginger tea with honey',
          'Add black pepper to breakfast',
          'Chew fennel seeds after meals',
          'Use cinnamon in your coffee/tea',
          'Take Trikatu before lunch if very sluggish',
        ],
      },
      {
        title: 'Beat Procrastination Tricks',
        steps: [
          'Use "2-minute rule" - if it takes 2 min, do it now',
          'Start with the smallest possible step',
          'Work standing up if you feel heavy',
          'Change your environment (go to cafe)',
          'Tell someone your commitment (accountability)',
          'Reward yourself after completing tasks',
        ],
      },
    ],
    manuscript: 'Charaka Samhita - Sutrasthana 21: "Brāhme Muhūrte Uttiṣṭhet" - One should wake during Brahma Muhurta (before sunrise) for health.',
    doshaLink: 'Kapha imbalance - excess heaviness and inertia',
  },
  {
    id: 'overthinking',
    title: 'Racing thoughts',
    icon: 'head-sync',
    iconColor: '#0097A7',
    iconBg: '#E0F7FA',
    problem: 'Mind won\'t stop, ruminating on past, worrying about future, mental exhaustion',
    remedy: 'Oil massage + warm grounding foods',
    why: 'Vata dosha is aggravated in the mind. Wind element creates constant movement of thoughts. Charaka teaches: "Like increases like, opposites balance." Vata is dry, light, mobile - counter with oily, heavy, stable.',
    terms: [
      {
        term: 'Vata in Mind',
        explanation: 'When air element dominates your mental space. Creates: racing thoughts, anxiety, creativity without completion, scattered energy.',
      },
      {
        term: 'Abhyanga',
        explanation: 'Self-oil massage. Applying warm oil calms Vata immediately. Oil is heavy, warm, and grounding - opposite of Vata qualities.',
      },
      {
        term: 'Grounding Foods',
        explanation: 'Warm, cooked, moist, slightly oily foods. Root vegetables, soups, stews, ghee. Opposite of raw, cold, dry foods.',
      },
      {
        term: 'Pratipaksha Bhavana',
        explanation: 'Cultivating the opposite thought. When negative thought arises, consciously replace with positive. Ancient mind-training technique.',
      },
    ],
    howTo: [
      {
        title: 'Self Oil Massage (Abhyanga)',
        steps: [
          'Warm sesame oil (or coconut in summer)',
          'Apply oil to entire body before shower',
          'Massage scalp, ears, and feet especially',
          'Use long strokes on limbs, circular on joints',
          'Leave on 15-20 minutes, then shower',
          'Do this every morning for Vata types',
        ],
      },
      {
        title: 'Grounding Food Protocol',
        steps: [
          'Eat warm, cooked meals (no raw/cold)',
          'Include healthy fats: ghee, olive oil, avocado',
          'Root vegetables: sweet potato, carrots, beets',
          'Warm soups and stews',
          'Warm milk with nutmeg before bed',
          'Avoid: caffeine, dried foods, crackers',
        ],
      },
      {
        title: 'Mind Calming Practices',
        steps: [
          'Write worries in a journal (get them out)',
          'Do "brain dump" - write everything on mind',
          'Practice alternate nostril breathing',
          'Repeat a mantra when thoughts race',
          'Walk barefoot on earth for 10 minutes',
          'Limit news and social media intake',
        ],
      },
    ],
    manuscript: 'Charaka Samhita - Sutrasthana 12: "Samāna Guṇa Vṛddhiḥ, Viparīta Guṇa Kṣayaḥ" - Like increases like, opposites decrease.',
    doshaLink: 'Vata imbalance - excess air element in mind',
  },
  {
    id: 'highbp',
    title: 'High blood pressure',
    icon: 'heart-flash',
    iconColor: '#B71C1C',
    iconBg: '#FFCDD2',
    problem: 'Elevated blood pressure, headaches, feeling stressed, flushed face',
    remedy: 'Arjuna bark + reduce salt & stress',
    why: 'In Ayurveda, high BP is a Pitta-Vata imbalance affecting Rakta Dhatu (blood tissue). Pitta heats the blood, Vata creates pressure. Charaka recommends herbs that cool blood and calm the mind.',
    terms: [
      {
        term: 'Arjuna',
        explanation: 'The heart tonic tree bark. Strengthens heart muscle, regulates blood pressure, reduces cholesterol. Called "guardian of the heart" in Ayurveda.',
      },
      {
        term: 'Rakta Dhatu',
        explanation: 'Blood tissue - one of seven body tissues. When Pitta enters Rakta, it causes heat, inflammation, and increased pressure.',
      },
      {
        term: 'Raktamokshana',
        explanation: 'Blood purification therapy. Traditionally done through various methods. Modern equivalent: blood-cooling herbs and diet.',
      },
      {
        term: 'Sheetala (Cooling)',
        explanation: 'The quality of coolness. Essential for balancing Pitta in blood. Found in certain foods, herbs, and lifestyle practices.',
      },
    ],
    howTo: [
      {
        title: 'Arjuna Protocol',
        steps: [
          'Take 500mg Arjuna bark powder twice daily',
          'Mix with warm water or milk',
          'Best taken morning and evening',
          'Continue for 3-6 months minimum',
          'Monitor BP regularly while using',
        ],
      },
      {
        title: 'Diet for Blood Pressure',
        steps: [
          'Reduce salt intake significantly',
          'Avoid spicy, sour, and fermented foods',
          'Eat more: cucumber, coconut water, leafy greens',
          'Include garlic (1-2 cloves daily)',
          'Drink hibiscus tea (proven to lower BP)',
          'Avoid caffeine and alcohol',
        ],
      },
      {
        title: 'Lifestyle Changes',
        steps: [
          'Practice Sheetali pranayama (cooling breath) daily',
          'Walk in nature for 30 minutes',
          'Avoid heated arguments and stress',
          'Practice meditation for 20 minutes daily',
          'Sleep by 10 PM - avoid late nights',
          'Reduce screen time and mental strain',
        ],
      },
    ],
    manuscript: 'Charaka Samhita - Chikitsasthana: "Raktapitta is caused by excessive heat entering the blood. Treat with cooling herbs and lifestyle."',
    doshaLink: 'Pitta-Vata imbalance affecting Rakta (blood)',
  },
  {
    id: 'thyroid',
    title: 'Thyroid imbalance',
    icon: 'account-tie-outline',
    iconColor: '#00838F',
    iconBg: '#E0F7FA',
    problem: 'Fatigue, weight changes, hair loss, mood swings, irregular metabolism',
    remedy: 'Ashwagandha + Kanchanar Guggulu',
    why: 'Thyroid issues relate to Kapha blocking the channels in the throat region, combined with Vata irregularity. Ayurveda treats this as a Galaganda (goiter/neck swelling) condition requiring channel-clearing herbs.',
    terms: [
      {
        term: 'Galaganda',
        explanation: 'Ayurvedic term for thyroid disorders and neck swellings. Literally means "lump in the throat." Treated with specific herbs and lifestyle changes.',
      },
      {
        term: 'Kanchanar Guggulu',
        explanation: 'Classical formula for thyroid and lymphatic issues. Kanchanar bark clears Kapha, Guggulu scrapes blockages. Very effective for hypothyroid.',
      },
      {
        term: 'Ashwagandha',
        explanation: 'Adaptogen that supports thyroid function. Studies show it increases T3 and T4 hormones. Also reduces stress (a major thyroid disruptor).',
      },
      {
        term: 'Agni (Metabolism)',
        explanation: 'Thyroid controls metabolic fire. When thyroid is low, Agni is low. Need to kindle both together for healing.',
      },
    ],
    howTo: [
      {
        title: 'Herb Protocol for Thyroid',
        steps: [
          'Ashwagandha: 500mg twice daily',
          'Kanchanar Guggulu: 2 tablets twice daily',
          'Take with warm water after meals',
          'Continue for 3-6 months minimum',
          'Monitor thyroid levels every 3 months',
        ],
      },
      {
        title: 'Thyroid-Supporting Diet',
        steps: [
          'Avoid raw cruciferous vegetables (cook them)',
          'Include selenium: Brazil nuts, fish',
          'Include iodine: seaweed, iodized salt',
          'Avoid soy products',
          'Eat warm, cooked, easy-to-digest foods',
          'Reduce gluten and dairy if sensitive',
        ],
      },
      {
        title: 'Lifestyle for Thyroid Health',
        steps: [
          'Practice neck stretches and shoulder stands',
          'Do Ujjayi pranayama (throat breathing)',
          'Massage throat area with warm sesame oil',
          'Reduce stress - it impacts thyroid directly',
          'Exercise moderately - not too intense',
          'Ensure adequate sleep (7-8 hours)',
        ],
      },
    ],
    manuscript: 'Sushruta Samhita - Nidanasthana: "Galaganda arises from Kapha blocking the channels of the neck. Treat with Kanchanar and purification."',
    doshaLink: 'Kapha-Vata imbalance in throat region',
  },
  {
    id: 'backpain',
    title: 'Back pain',
    icon: 'human-handsdown',
    iconColor: '#5D4037',
    iconBg: '#D7CCC8',
    problem: 'Lower back pain, stiffness, difficulty bending, chronic discomfort',
    remedy: 'Warm oil massage + gentle yoga asanas',
    why: 'Back pain is primarily Vata disorder - dryness and degeneration in spine and muscles. Charaka describes it as Kati Shula (lumbar pain) caused by Vata aggravation. Oil therapy is the primary treatment.',
    terms: [
      {
        term: 'Kati Shula',
        explanation: 'Lumbar/lower back pain. Kati = waist/lower back, Shula = pain. Primarily a Vata disorder requiring warmth and lubrication.',
      },
      {
        term: 'Kati Basti',
        explanation: 'Special oil pooling treatment for back. Warm medicated oil is held in a dam on the lower back for 30-45 minutes. Very effective for chronic pain.',
      },
      {
        term: 'Asthi Dhatu',
        explanation: 'Bone tissue. When Vata enters bones and joints, it causes pain, cracking, and degeneration. Oil massage nourishes Asthi.',
      },
      {
        term: 'Mahanarayan Oil',
        explanation: 'Classical medicated oil with 50+ herbs. Specific for musculoskeletal pain. Penetrates deep into tissues to relieve pain.',
      },
    ],
    howTo: [
      {
        title: 'Oil Massage for Back Pain',
        steps: [
          'Warm Mahanarayan or sesame oil',
          'Apply generously to entire back',
          'Massage with firm, long strokes',
          'Focus extra time on painful areas',
          'Leave oil on for 30 minutes minimum',
          'Follow with warm shower (not hot)',
          'Do daily for chronic pain',
        ],
      },
      {
        title: 'Yoga for Back Pain',
        steps: [
          'Cat-Cow pose: 10 rounds',
          'Child\'s pose: hold 1-2 minutes',
          'Sphinx pose: hold 30 seconds',
          'Supine twist: both sides',
          'Legs up the wall: 5-10 minutes',
          'Avoid: forward bends when acute pain',
        ],
      },
      {
        title: 'Daily Prevention',
        steps: [
          'Sit with lumbar support',
          'Stand and stretch every 30 minutes',
          'Sleep on firm mattress with pillow between knees',
          'Avoid lifting heavy objects',
          'Stay warm - cold aggravates Vata',
          'Take warm baths with Epsom salt',
        ],
      },
    ],
    manuscript: 'Charaka Samhita - Chikitsasthana: "Kati Shula is caused by Vata. Treat with oil massage, warm fomentation, and gentle exercise."',
    doshaLink: 'Vata imbalance in spine and muscles',
  },
  {
    id: 'neckpain',
    title: 'Neck pain & stiffness',
    icon: 'account-alert-outline',
    iconColor: '#37474F',
    iconBg: '#CFD8DC',
    problem: 'Stiff neck, pain turning head, tension headaches from neck, shoulder tightness',
    remedy: 'Mahanarayan oil + neck stretches',
    why: 'Neck pain is Vata accumulation from poor posture, stress, and screen use. Called Manyastambha (neck stiffness) in Ayurveda. Modern desk work and phone use greatly aggravate this condition.',
    terms: [
      {
        term: 'Manyastambha',
        explanation: 'Stiffness of neck. Manya = neck, Stambha = stiffness. A classic Vata disorder requiring oil therapy and gentle movement.',
      },
      {
        term: 'Greeva Basti',
        explanation: 'Oil pooling treatment for neck. Like Kati Basti but for cervical region. Deeply nourishes neck muscles and vertebrae.',
      },
      {
        term: 'Nasya',
        explanation: 'Nasal oil therapy. Oil dropped in nose travels to head and neck, lubricating the entire region. Very effective for neck issues.',
      },
      {
        term: 'Vishwachi',
        explanation: 'Cervical radiculopathy - when neck pain radiates to arms. More serious Vata disorder requiring consistent treatment.',
      },
    ],
    howTo: [
      {
        title: 'Neck Oil Massage',
        steps: [
          'Warm Mahanarayan or sesame oil',
          'Apply to neck, shoulders, and upper back',
          'Massage with circular motions',
          'Pay attention to base of skull',
          'Leave on 20-30 minutes',
          'Apply warm towel over oil for deeper penetration',
        ],
      },
      {
        title: 'Neck Stretches (Do Every 2 Hours)',
        steps: [
          'Chin tucks: pull chin back, hold 5 seconds, 10 reps',
          'Ear to shoulder: hold 30 seconds each side',
          'Slow neck circles: 5 in each direction',
          'Look up, hold 10 seconds, look down, hold 10 seconds',
          'Shoulder rolls: 10 forward, 10 backward',
        ],
      },
      {
        title: 'Posture & Prevention',
        steps: [
          'Keep screen at eye level',
          'Use phone holder - don\'t look down at phone',
          'Take breaks every 30 minutes',
          'Sleep with proper pillow (not too high/low)',
          'Avoid carrying heavy bags on one shoulder',
          'Practice Nasya: 2 drops warm oil in each nostril daily',
        ],
      },
    ],
    manuscript: 'Charaka Samhita - Chikitsasthana: "Manyastambha is Vata disorder. Treat with oil massage, Nasya, and gentle movement."',
    doshaLink: 'Vata accumulation in neck and shoulders',
  },
  {
    id: 'headache',
    title: 'Headaches & migraines',
    icon: 'head-outline',
    iconColor: '#AD1457',
    iconBg: '#F8BBD9',
    problem: 'Frequent headaches, migraines, tension headaches, sensitivity to light',
    remedy: 'Brahmi oil on scalp + cooling pranayama',
    why: 'Headaches can be all three doshas: Vata (throbbing), Pitta (burning, with light sensitivity), Kapha (dull, heavy). Most modern headaches are Pitta - excess heat rising to the head. Cooling therapies are essential.',
    terms: [
      {
        term: 'Shiroroga',
        explanation: 'Head diseases. Shira = head, Roga = disease. Ayurveda classifies 11 types of headaches based on dosha involvement.',
      },
      {
        term: 'Shiro Abhyanga',
        explanation: 'Head oil massage. Calms Vata, cools Pitta, clears Kapha in the head. One of the most soothing treatments in Ayurveda.',
      },
      {
        term: 'Brahmi Oil',
        explanation: 'Medicated oil with Brahmi herb. Specifically for head and brain. Cools Pitta, calms mind, prevents headaches.',
      },
      {
        term: 'Sheetali',
        explanation: 'Cooling breath. Inhale through curled tongue. Instantly cools the head and reduces Pitta headaches.',
      },
    ],
    howTo: [
      {
        title: 'Brahmi Oil Head Massage',
        steps: [
          'Warm Brahmi oil slightly',
          'Apply to scalp and massage thoroughly',
          'Focus on temples, forehead, and crown',
          'Massage for 10-15 minutes',
          'Leave on overnight if possible',
          'Do 2-3 times per week for prevention',
        ],
      },
      {
        title: 'During a Headache',
        steps: [
          'Apply sandalwood or brahmi oil to temples',
          'Do Sheetali breath: 10 rounds',
          'Place cold cloth on forehead',
          'Lie down in dark, quiet room',
          'Press point between thumb and index finger',
          'Drink water - dehydration causes headaches',
        ],
      },
      {
        title: 'Prevention Protocol',
        steps: [
          'Regular sleep schedule (10 PM - 6 AM)',
          'Don\'t skip meals - eat regularly',
          'Avoid triggers: bright lights, loud sounds, strong smells',
          'Stay hydrated - 8 glasses water daily',
          'Reduce screen brightness',
          'Practice Nasya with Anu taila daily',
        ],
      },
    ],
    manuscript: 'Sushruta Samhita - Uttaratantra: "Shiroroga is treated according to dosha. Pitta type requires cooling, Vata type requires oil, Kapha type requires drying."',
    doshaLink: 'Often Pitta excess rising to head; can be any dosha',
  },
  {
    id: 'hairfall',
    title: 'Hair fall & thinning',
    icon: 'face-woman-outline',
    iconColor: '#4A148C',
    iconBg: '#E1BEE7',
    problem: 'Excessive hair fall, thinning hair, premature greying, dry scalp',
    remedy: 'Bhringraj oil + iron-rich foods',
    why: 'Hair is a byproduct of Asthi Dhatu (bone tissue). When Pitta is excess in scalp, it burns hair roots. Bhringraj literally means "king of hair" - it cools Pitta and nourishes roots.',
    terms: [
      {
        term: 'Bhringraj',
        explanation: 'The "king of hair" herb. Eclipta alba. Cools Pitta, darkens hair, prevents greying, promotes growth. Used internally and externally.',
      },
      {
        term: 'Khalitya',
        explanation: 'Ayurvedic term for hair loss. Caused by Pitta burning hair follicles. Requires cooling herbs and oil therapy.',
      },
      {
        term: 'Asthi Dhatu',
        explanation: 'Bone tissue. Hair and nails are byproducts. When Asthi is weak or Pitta enters it, hair suffers.',
      },
      {
        term: 'Kesha (Hair)',
        explanation: 'Considered a mirror of overall health in Ayurveda. Healthy hair = healthy tissues and balanced doshas.',
      },
    ],
    howTo: [
      {
        title: 'Bhringraj Oil Treatment',
        steps: [
          'Warm Bhringraj oil (or Bhringraj + coconut oil)',
          'Apply generously to scalp',
          'Massage with fingertips for 10 minutes',
          'Leave on minimum 1 hour (overnight is best)',
          'Wash with mild herbal shampoo',
          'Do 2-3 times per week',
        ],
      },
      {
        title: 'Diet for Hair Health',
        steps: [
          'Iron-rich foods: spinach, dates, pomegranate',
          'Protein: lentils, almonds, milk',
          'Vitamin C for iron absorption: amla, citrus',
          'Biotin: eggs, nuts, whole grains',
          'Avoid: excessive spicy, sour, salty foods',
          'Stay hydrated',
        ],
      },
      {
        title: 'Internal Herbs',
        steps: [
          'Bhringraj powder: 1/2 tsp with warm water daily',
          'Amla powder: 1/2 tsp daily (vitamin C)',
          'Triphala at night for digestion (hair needs nutrients)',
          'Iron supplement if deficient',
          'Ashwagandha for stress-related hair loss',
        ],
      },
    ],
    manuscript: 'Charaka Samhita - Chikitsasthana: "Khalitya (hair loss) is caused by Pitta entering hair roots. Treat with cooling oils and herbs."',
    doshaLink: 'Pitta imbalance affecting hair roots',
  },
  {
    id: 'acidity',
    title: 'Acidity & heartburn',
    icon: 'fire-alert',
    iconColor: '#E65100',
    iconBg: '#FFE0B2',
    problem: 'Burning sensation, acid reflux, sour taste in mouth, discomfort after eating',
    remedy: 'Cooling foods + avoid spicy/sour',
    why: 'Called Amlapitta in Ayurveda - literally "sour Pitta". Excess digestive fire causes acid to rise. Charaka says to pacify with sweet, bitter, and astringent tastes.',
    terms: [
      {
        term: 'Amlapitta',
        explanation: 'Acid-Pitta condition. Amla = sour, Pitta = fire. When Pitta is excessive and sour, it creates burning, reflux, and inflammation.',
      },
      {
        term: 'Shatavari',
        explanation: 'The cooling, soothing herb. Coats and heals digestive tract. Reduces acid. Especially good for Pitta constitutions.',
      },
      {
        term: 'Pitta-Shamaka',
        explanation: 'That which pacifies Pitta. Cool, sweet, bitter tastes. Opposite of hot, spicy, sour.',
      },
      {
        term: 'Amalaki (Amla)',
        explanation: 'Indian gooseberry. Despite being sour, it actually cools Pitta. Heals digestive tract. Best taken as juice or powder.',
      },
    ],
    howTo: [
      {
        title: 'Immediate Relief',
        steps: [
          'Drink cold milk (without sugar)',
          'Chew fennel seeds',
          'Eat banana or cucumber',
          'Drink coconut water',
          'Aloe vera juice: 2 tbsp before meals',
          'Avoid lying down - stay upright',
        ],
      },
      {
        title: 'Daily Protocol',
        steps: [
          'Shatavari: 1/2 tsp with milk twice daily',
          'Amla powder: 1/2 tsp with water before meals',
          'Licorice (Yashtimadhu): 1/4 tsp after meals',
          'Cold milk at bedtime',
          'Gulkand (rose petal jam): 1 tsp daily',
        ],
      },
      {
        title: 'Foods to Avoid',
        steps: [
          'Spicy foods, chilies, hot peppers',
          'Sour foods: citrus, tomatoes, vinegar',
          'Fermented foods: alcohol, pickles',
          'Coffee and caffeinated drinks',
          'Fried and oily foods',
          'Eating late at night',
        ],
      },
    ],
    manuscript: 'Charaka Samhita - Chikitsasthana 15: "Amlapitta is Pitta aggravation. Treat with cooling, sweet, bitter substances."',
    doshaLink: 'Pitta excess in stomach',
  },
  {
    id: 'jointpain',
    title: 'Joint pain & arthritis',
    icon: 'bone',
    iconColor: '#795548',
    iconBg: '#D7CCC8',
    problem: 'Stiff, painful joints, cracking sounds, swelling, reduced mobility',
    remedy: 'Guggulu + warm sesame oil massage',
    why: 'Called Sandhivata in Ayurveda - Vata in the joints. Vata dries out synovial fluid, causing friction and degeneration. Guggulu is the king herb for joints - it scrapes deposits and lubricates.',
    terms: [
      {
        term: 'Sandhivata',
        explanation: 'Vata in joints. Sandhi = joint, Vata = air element. Causes dryness, cracking, pain, and degeneration of joint tissue.',
      },
      {
        term: 'Guggulu',
        explanation: 'Resin from Commiphora mukul tree. Scrapes Ama from joints, reduces inflammation, lubricates. The premier joint herb in Ayurveda.',
      },
      {
        term: 'Shleshaka Kapha',
        explanation: 'The lubricating aspect of Kapha in joints. When depleted, joints become dry and painful. Oil therapy restores it.',
      },
      {
        term: 'Asthi-Majja Dhatu',
        explanation: 'Bone and marrow tissues. Arthritis affects these deeply. Requires long-term treatment to nourish.',
      },
    ],
    howTo: [
      {
        title: 'Guggulu Protocol',
        steps: [
          'Yogaraj Guggulu: 2 tablets twice daily',
          'Or Simhanada Guggulu for more severe cases',
          'Take with warm water after meals',
          'Continue for 3-6 months minimum',
          'Avoid during pregnancy',
        ],
      },
      {
        title: 'Oil Massage for Joints',
        steps: [
          'Warm sesame oil or Mahanarayan oil',
          'Apply to all painful joints',
          'Massage in circular motions',
          'Pay extra attention to knees, fingers, spine',
          'Follow with warm towel compression',
          'Do daily for chronic arthritis',
        ],
      },
      {
        title: 'Diet & Lifestyle',
        steps: [
          'Avoid cold, dry, raw foods',
          'Include ghee in every meal',
          'Drink warm water throughout day',
          'Gentle exercise - yoga, swimming',
          'Avoid over-exertion and heavy lifting',
          'Take warm baths with ginger',
        ],
      },
    ],
    manuscript: 'Charaka Samhita - Chikitsasthana: "Sandhivata is Vata entering the joints. Treat with oil massage, Guggulu, and warm therapies."',
    doshaLink: 'Vata accumulation in joints',
  },
  {
    id: 'diabetes',
    title: 'Blood sugar concerns',
    icon: 'water-percent',
    iconColor: '#1565C0',
    iconBg: '#BBDEFB',
    problem: 'High blood sugar, frequent urination, excessive thirst, fatigue',
    remedy: 'Bitter gourd + fenugreek + Gymnema',
    why: 'Called Prameha/Madhumeha in Ayurveda. Kapha-Pitta imbalance affecting fat tissue (Meda Dhatu). Bitter taste is medicine - it scrapes fat and regulates sugar. Gymnema is called "sugar destroyer".',
    terms: [
      {
        term: 'Madhumeha',
        explanation: 'Literally "honey urine" - diabetes. Madhu = honey, Meha = urinary disorder. Caused by excess Kapha and sweetness in the body.',
      },
      {
        term: 'Gymnema (Gurmar)',
        explanation: '"Destroyer of sugar". Blocks sweet taste receptors. Helps regulate blood sugar. Traditional diabetes herb.',
      },
      {
        term: 'Meda Dhatu',
        explanation: 'Fat tissue. When excess, it blocks channels and disrupts sugar metabolism. Diabetes is fundamentally a Meda disorder.',
      },
      {
        term: 'Tikta Rasa',
        explanation: 'Bitter taste. The medicine for diabetes. Reduces Kapha, scrapes fat, regulates sugar. Found in bitter gourd, fenugreek, turmeric.',
      },
    ],
    howTo: [
      {
        title: 'Herbal Protocol',
        steps: [
          'Gymnema: 400mg twice daily before meals',
          'Fenugreek: 1 tsp soaked seeds every morning',
          'Bitter gourd: juice or vegetable regularly',
          'Turmeric: 1/2 tsp with warm water',
          'Amla: 1 tsp powder daily',
        ],
      },
      {
        title: 'Diet Guidelines',
        steps: [
          'Emphasize bitter and astringent tastes',
          'Reduce sweet, sour, and salty',
          'Eat barley, millet instead of rice',
          'Green leafy vegetables at every meal',
          'Avoid: sugar, refined carbs, fruit juices',
          'Eat small, frequent meals',
        ],
      },
      {
        title: 'Lifestyle Changes',
        steps: [
          'Exercise daily - walking 30-45 minutes',
          'Yoga: sun salutations, twists',
          'No daytime sleeping',
          'Wake before sunrise',
          'Reduce stress - it spikes blood sugar',
          'Monitor blood sugar regularly',
        ],
      },
    ],
    manuscript: 'Charaka Samhita - Nidanasthana 4: "Prameha arises from excess Kapha, sweet taste, and sedentary lifestyle. Treat with bitter herbs and exercise."',
    doshaLink: 'Kapha-Pitta imbalance affecting Meda Dhatu',
  },
  {
    id: 'coldcough',
    title: 'Cold, cough & congestion',
    icon: 'weather-snowy-rainy',
    iconColor: '#0277BD',
    iconBg: '#B3E5FC',
    problem: 'Runny nose, cough, congestion, sore throat, body aches',
    remedy: 'Tulsi tea + ginger honey + steam',
    why: 'Called Pratishyaya (cold) and Kasa (cough) in Ayurveda. Kapha accumulation in respiratory channels. Need warming, drying, expectorant therapies to clear mucus.',
    terms: [
      {
        term: 'Pratishyaya',
        explanation: 'Common cold. Caused by Kapha blocking nasal channels. Treat with warming, drying herbs and therapies.',
      },
      {
        term: 'Kasa',
        explanation: 'Cough. Can be dry (Vata), productive (Kapha), or with yellow phlegm (Pitta). Treatment varies by type.',
      },
      {
        term: 'Tulsi (Holy Basil)',
        explanation: 'The queen of herbs. Clears respiratory channels, boosts immunity, fights infection. Sacred plant in India.',
      },
      {
        term: 'Kapha-Hara',
        explanation: 'That which removes Kapha. Warming, drying, stimulating substances. Essential for colds and congestion.',
      },
    ],
    howTo: [
      {
        title: 'Tulsi-Ginger Tea',
        steps: [
          'Boil 5-6 tulsi leaves in water',
          'Add 1 inch fresh ginger, sliced',
          'Boil for 5 minutes',
          'Strain and add 1 tsp honey (when warm, not hot)',
          'Add pinch of black pepper',
          'Drink 3-4 times daily',
        ],
      },
      {
        title: 'Steam Inhalation',
        steps: [
          'Boil water in pot',
          'Add eucalyptus oil or tulsi leaves',
          'Cover head with towel over pot',
          'Inhale steam for 10-15 minutes',
          'Do 2-3 times daily',
          'Be careful - don\'t burn yourself',
        ],
      },
      {
        title: 'Other Remedies',
        steps: [
          'Gargle with warm salt water',
          'Honey + ginger juice for cough',
          'Turmeric milk at bedtime',
          'Sitopaladi churna for cough: 1/2 tsp with honey',
          'Rest and stay warm',
          'Avoid cold drinks and dairy',
        ],
      },
    ],
    manuscript: 'Charaka Samhita - Chikitsasthana 8: "Kasa and Pratishyaya are Kapha disorders. Treat with warming, expectorant herbs."',
    doshaLink: 'Kapha accumulation in respiratory system',
  },
  {
    id: 'skinissues',
    title: 'Skin problems & acne',
    icon: 'emoticon-sad-outline',
    iconColor: '#F57C00',
    iconBg: '#FFE0B2',
    problem: 'Acne, rashes, eczema, psoriasis, itching, dull skin',
    remedy: 'Neem + turmeric + blood purification',
    why: 'Skin reflects the state of Rakta Dhatu (blood tissue). When Pitta enters blood, it manifests on skin. Neem and turmeric are the supreme skin herbs - they cool blood and clear toxins.',
    terms: [
      {
        term: 'Kushtha',
        explanation: 'Skin diseases in Ayurveda. Caused by impure blood, Pitta aggravation, and accumulated Ama. Requires internal and external treatment.',
      },
      {
        term: 'Neem (Nimba)',
        explanation: 'The ultimate blood purifier and skin herb. Bitter, cooling, anti-inflammatory, antibacterial. Used internally and externally.',
      },
      {
        term: 'Rakta Shodhana',
        explanation: 'Blood purification. The primary treatment for skin diseases. Herbs that cleanse blood and cool Pitta.',
      },
      {
        term: 'Manjistha',
        explanation: 'Rubia cordifolia. The best blood-purifying herb. Clears skin, reduces inflammation, gives glow.',
      },
    ],
    howTo: [
      {
        title: 'Internal Protocol',
        steps: [
          'Neem: 2 capsules daily or 1/4 tsp powder',
          'Manjistha: 500mg twice daily',
          'Turmeric: 1/2 tsp with warm water',
          'Aloe vera juice: 2 tbsp morning',
          'Triphala at night for toxin removal',
        ],
      },
      {
        title: 'External Application (for acne)',
        steps: [
          'Make paste: neem + turmeric + rose water',
          'Apply to affected areas',
          'Leave for 15-20 minutes',
          'Wash with cool water',
          'Do 3-4 times per week',
          'Use neem soap for washing',
        ],
      },
      {
        title: 'Diet for Clear Skin',
        steps: [
          'Avoid: spicy, oily, fried foods',
          'Avoid: sugar, dairy (for acne)',
          'Drink plenty of water',
          'Eat bitter vegetables: bitter gourd, leafy greens',
          'Eat sweet fruits: pomegranate, grapes',
          'Include ghee for internal lubrication',
        ],
      },
    ],
    manuscript: 'Charaka Samhita - Chikitsasthana 7: "Kushtha (skin disease) arises from impure blood. Treat with blood-purifying herbs and Panchakarma."',
    doshaLink: 'Pitta imbalance affecting Rakta (blood)',
  },
  {
    id: 'lowimmunity',
    title: 'Weak immunity',
    icon: 'shield-alert-outline',
    iconColor: '#2E7D32',
    iconBg: '#C8E6C9',
    problem: 'Frequent colds, slow healing, always catching infections, low energy',
    remedy: 'Chyawanprash + Giloy + Amla',
    why: 'Immunity is Ojas in Ayurveda - your vital essence. When Ojas is low, you\'re susceptible to disease. Rasayana (rejuvenation) therapy builds Ojas and strengthens immunity from the root.',
    terms: [
      {
        term: 'Ojas',
        explanation: 'The essence of all tissues. The substance of immunity, vitality, and glow. When high: strong immunity, radiant health. When low: frequent illness, fatigue.',
      },
      {
        term: 'Rasayana',
        explanation: 'Rejuvenation therapy. Herbs and practices that build Ojas and promote longevity. Chyawanprash is the supreme Rasayana.',
      },
      {
        term: 'Chyawanprash',
        explanation: 'Ancient immunity formula with 40+ herbs. Named after sage Chyawan who regained youth using it. The best daily immune tonic.',
      },
      {
        term: 'Giloy (Guduchi)',
        explanation: 'Called "Amrita" - nectar of immortality. Powerful immunomodulator. Balances all three doshas. Especially good for recurring fevers.',
      },
    ],
    howTo: [
      {
        title: 'Daily Immunity Protocol',
        steps: [
          'Chyawanprash: 1-2 tsp morning with warm milk',
          'Giloy: 500mg capsule or fresh juice',
          'Amla: 500mg or 1 fresh fruit daily',
          'Turmeric milk at bedtime',
          'Tulsi tea throughout day',
        ],
      },
      {
        title: 'Lifestyle for Strong Immunity',
        steps: [
          'Sleep 7-8 hours (10 PM - 6 AM)',
          'Exercise moderately daily',
          'Practice pranayama (breathing exercises)',
          'Manage stress - it depletes Ojas',
          'Regular daily routine',
          'Avoid excessive fasting or overwork',
        ],
      },
      {
        title: 'Diet for Ojas',
        steps: [
          'Warm, cooked, fresh foods',
          'Ghee in every meal',
          'Dates, almonds, figs (soaked)',
          'Warm milk with saffron',
          'Honey (not heated)',
          'Avoid processed, leftover, cold foods',
        ],
      },
    ],
    manuscript: 'Charaka Samhita - Chikitsasthana 1: "Rasayana therapy increases Ojas, strength, and immunity. It is the foundation of health."',
    doshaLink: 'Low Ojas - depleted vital essence',
  },
  {
    id: 'pcod',
    title: 'PCOD/PCOS symptoms',
    icon: 'gender-female',
    iconColor: '#C2185B',
    iconBg: '#F8BBD9',
    problem: 'Irregular periods, weight gain, acne, facial hair, difficulty conceiving',
    remedy: 'Shatavari + lifestyle changes',
    why: 'PCOS is a Kapha-Vata disorder affecting Artava Dhatu (reproductive tissue). Kapha blocks channels, Vata causes irregularity. Requires hormone balancing and channel-clearing therapy.',
    terms: [
      {
        term: 'Artava Dhatu',
        explanation: 'Reproductive tissue in women. When blocked by Kapha or disturbed by Vata, menstrual irregularities occur.',
      },
      {
        term: 'Shatavari',
        explanation: '"Woman with 100 husbands" - the supreme female tonic. Balances hormones, supports fertility, nourishes reproductive system.',
      },
      {
        term: 'Artava Kshaya',
        explanation: 'Diminished or irregular menstruation. The main symptom of PCOS from Ayurvedic perspective.',
      },
      {
        term: 'Pushpagni',
        explanation: 'The fire that governs menstruation. When weak, periods become irregular. Needs to be kindled.',
      },
    ],
    howTo: [
      {
        title: 'Herbal Protocol',
        steps: [
          'Shatavari: 500mg twice daily',
          'Ashoka: 500mg twice daily (regulates periods)',
          'Kanchanar Guggulu: 2 tablets twice daily',
          'Triphala at night',
          'Aloe vera juice: 2 tbsp morning',
        ],
      },
      {
        title: 'Diet for PCOS',
        steps: [
          'Reduce sugar and refined carbs completely',
          'Avoid dairy products',
          'Eat warm, light, easy-to-digest foods',
          'Include bitter vegetables',
          'Favor barley, millet over rice/wheat',
          'No processed or packaged foods',
        ],
      },
      {
        title: 'Lifestyle Changes (Critical)',
        steps: [
          'Exercise daily - 30-45 minutes',
          'Yoga especially: twists, hip openers',
          'Maintain regular sleep schedule',
          'Manage stress - it worsens hormones',
          'No daytime sleeping',
          'Wake before sunrise',
          'Regular meal times',
        ],
      },
    ],
    manuscript: 'Charaka Samhita - Chikitsasthana 30: "Disorders of Artava arise from Kapha blocking channels. Treat with channel-clearing herbs and lifestyle."',
    doshaLink: 'Kapha-Vata imbalance affecting reproductive system',
  },
];

export const getQuickFixDetail = (id: string): QuickFixDetail | undefined => {
  return quickFixDetails.find(fix => fix.id === id);
};
