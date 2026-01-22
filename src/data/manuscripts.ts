export interface Manuscript {
  id: string;
  title: string;
  source: string;
  sourceUrl: string;
  sanskritText: string;
  englishText: string;
  category: string;
  keywords: string[];
  relatedManuscripts: string[];
}

export const manuscripts: Manuscript[] = [
  {
    id: 'charaka-1',
    title: 'Charaka Samhita - Digestive Health',
    source: 'Charaka Samhita (P.V. Sharma translation)',
    sourceUrl: 'https://archive.org/details/CharakaSamhitaTextWithEnglishTanslationP.V.Sharma',
    sanskritText: 'अग्निमांद्ये लघु आहारः। दीपनीयानि द्रव्याणि च।',
    englishText: 'For weak digestive fire (agnimandya), consume light food and digestive stimulants. Ginger, long pepper, and black pepper kindle the digestive fire. Avoid heavy, oily, and cold foods which suppress agni.',
    category: 'Digestion',
    keywords: ['agni', 'digestion', 'ginger', 'pepper', 'digestive fire', 'bloating', 'gas', 'indigestion'],
    relatedManuscripts: ['charaka-2', 'sushruta-3']
  },
  {
    id: 'charaka-2',
    title: 'Charaka Samhita - Mental Health',
    source: 'Charaka Samhita (WisdomLib.org translation)',
    sourceUrl: 'https://www.wisdomlib.org/hinduism/book/charaka-samhita-english',
    sanskritText: 'मनसः शान्तये ब्राह्मी शंखपुष्पी च।',
    englishText: 'For calming the mind and reducing stress, Brahmi (Bacopa monnieri) and Shankhapushpi are highly recommended. These herbs enhance memory, reduce anxiety, and promote mental clarity. Practice meditation and pranayama daily.',
    category: 'Mental Health',
    keywords: ['stress', 'anxiety', 'brahmi', 'meditation', 'mental clarity', 'calm', 'focus', 'memory', 'concentration'],
    relatedManuscripts: ['charaka-1', 'ashtanga-1']
  },
  {
    id: 'charaka-3',
    title: 'Charaka Samhita - General Health Principles',
    source: 'Charaka Samhita (NIIMH e-Samhita)',
    sourceUrl: 'https://niimh.nic.in/ebooks/ecaraka/',
    sanskritText: 'स्वस्थस्य स्वास्थ्य रक्षणं आतुरस्य विकार प्रशमनं च।',
    englishText: 'The twin objectives of Ayurveda are: to preserve health of the healthy and to cure diseases of the diseased. This fundamental principle guides all Ayurvedic practice.',
    category: 'General Health',
    keywords: ['health preservation', 'disease cure', 'ayurvedic principles', 'wellness', 'prevention'],
    relatedManuscripts: ['charaka-1', 'charaka-2']
  },
  {
    id: 'sushruta-1',
    title: 'Sushruta Samhita - Wound Healing',
    source: 'Sushruta Samhita (Kaviraj Kunja Lal Bhishagratna translation)',
    sourceUrl: 'https://archive.org/details/englishtranslati00susruoft',
    sanskritText: 'व्रणरोपणाय हरिद्रा च घृतम्।',
    englishText: 'For wound healing, apply turmeric with ghee. Turmeric possesses powerful antiseptic and healing properties. Clean the wound with neem water before application. Change dressing twice daily.',
    category: 'Surgery & Healing',
    keywords: ['wound', 'turmeric', 'healing', 'antiseptic', 'neem', 'cut', 'injury'],
    relatedManuscripts: ['sushruta-2']
  },
  {
    id: 'sushruta-2',
    title: 'Sushruta Samhita - Joint Pain Management',
    source: 'Sushruta Samhita (Kaviraj Kunja Lal Bhishagratna translation)',
    sourceUrl: 'https://archive.org/details/englishtranslati00susruoft',
    sanskritText: 'संधिशूले महानारायण तैलम्।',
    englishText: 'For joint pain (sandhi shula), massage with Mahanarayan oil. This oil contains ashwagandha, shatavari, and sesame oil base. Apply warm oil and massage in circular motions. Perform gentle stretching exercises.',
    category: 'Pain Management',
    keywords: ['joint pain', 'arthritis', 'mahanarayan oil', 'massage', 'ashwagandha', 'knee pain', 'back pain', 'stiffness'],
    relatedManuscripts: ['charaka-1', 'sushruta-3']
  },
  {
    id: 'sushruta-3',
    title: 'Sushruta Samhita - Gastric Disorders',
    source: 'Sushruta Samhita (Kaviraj Kunja Lal Bhishagratna translation)',
    sourceUrl: 'https://archive.org/details/englishtranslati00susruoft',
    sanskritText: 'अम्लपित्ते शीतलानि द्रव्याणि।',
    englishText: 'For acidity and gastric issues (amlapitta), consume cooling substances. Coconut water, coriander, and fennel seeds are beneficial. Avoid spicy, sour, and fermented foods. Eat at regular intervals.',
    category: 'Digestion',
    keywords: ['acidity', 'gastric', 'cooling', 'coconut water', 'fennel', 'heartburn', 'acid reflux', 'stomach'],
    relatedManuscripts: ['charaka-1']
  },
  {
    id: 'ashtanga-1',
    title: 'Ashtanga Hridayam - Sleep Disorders',
    source: 'Ashtanga Hridayam (Traditional Ayurvedic text)',
    sourceUrl: 'https://www.ayurveda.com/resources/articles/ashtanga-hridayam',
    sanskritText: 'निद्रानाशे तैल अभ्यङ्गः पादयोः।',
    englishText: 'For sleeplessness (nidranasha), massage the feet with warm sesame oil before bed. Drink warm milk with nutmeg. Avoid stimulating activities after sunset. Keep regular sleep schedule.',
    category: 'Sleep',
    keywords: ['insomnia', 'sleep', 'oil massage', 'nutmeg', 'warm milk', 'sleeplessness', 'rest', 'relaxation'],
    relatedManuscripts: ['charaka-2', 'ashtanga-2']
  },
  {
    id: 'ashtanga-2',
    title: 'Ashtanga Hridayam - Skin Health',
    source: 'Ashtanga Hridayam (Traditional Ayurvedic text)',
    sourceUrl: 'https://www.ayurveda.com/resources/articles/ashtanga-hridayam',
    sanskritText: 'त्वचारोग्याय नीम च हरिद्रा।',
    englishText: 'For healthy skin and treating skin disorders, neem and turmeric are excellent. Make a paste with neem leaves and turmeric powder. Apply to affected areas. Also consume neem tablets for blood purification.',
    category: 'Skin Health',
    keywords: ['skin', 'neem', 'turmeric', 'acne', 'blood purification', 'rash', 'eczema', 'glow'],
    relatedManuscripts: ['sushruta-1', 'ashtanga-3']
  },
  {
    id: 'ashtanga-3',
    title: 'Ashtanga Hridayam - Respiratory Health',
    source: 'Ashtanga Hridayam (Traditional Ayurvedic text)',
    sourceUrl: 'https://www.ayurveda.com/resources/articles/ashtanga-hridayam',
    sanskritText: 'कासश्वासे तुलसी मधु च।',
    englishText: 'For cough and breathing difficulties, tulsi (holy basil) with honey is recommended. Boil tulsi leaves in water, add honey when warm. Perform steam inhalation with eucalyptus. Avoid cold and damp environments.',
    category: 'Respiratory',
    keywords: ['cough', 'breathing', 'tulsi', 'honey', 'steam inhalation', 'cold', 'congestion', 'respiratory'],
    relatedManuscripts: ['charaka-1']
  },
  {
    id: 'reference-1',
    title: 'Ayurvedic Principles - Immunity (Ojas)',
    source: 'Classical Ayurvedic Texts',
    sourceUrl: 'https://ayurveda.com/blog/the-ancient-ayurvedic-writings/',
    sanskritText: 'ओजवर्धनाय अश्वगन्धा गुडूची च।',
    englishText: 'To boost immunity and vitality (ojas), take ashwagandha and guduchi (giloy). These rasayana herbs strengthen the immune system. Consume with warm milk or water twice daily. Include amla for vitamin C.',
    category: 'Immunity',
    keywords: ['immunity', 'ashwagandha', 'giloy', 'ojas', 'amla', 'rasayana', 'vitality', 'energy', 'strength'],
    relatedManuscripts: ['charaka-2', 'charaka-3']
  },
  {
    id: 'charaka-4',
    title: 'Charaka Samhita - Sensory Overload',
    source: 'Charaka Samhita Sutrasthana 11.37',
    sourceUrl: 'https://niimh.nic.in/ebooks/ecaraka/',
    sanskritText: 'अतियोगो मिथ्यायोगो योगश्च इन्द्रियार्थानाम्।',
    englishText: 'Excessive use (atiyoga), wrong use (mithyayoga), and non-use (ayoga) of the senses causes disease. This applies to screen time, constant notifications, and sensory bombardment. Practice sensory detox and moderation.',
    category: 'Digital Wellness',
    keywords: ['screen time', 'sensory', 'atiyoga', 'digital', 'phone', 'social media', 'notifications', 'overstimulation'],
    relatedManuscripts: ['charaka-2', 'charaka-5']
  },
  {
    id: 'charaka-5',
    title: 'Charaka Samhita - Crimes Against Wisdom',
    source: 'Charaka Samhita Sutrasthana',
    sourceUrl: 'https://niimh.nic.in/ebooks/ecaraka/',
    sanskritText: 'प्रज्ञापराधं च रोगकारणम्।',
    englishText: 'Prajnaparadha (crimes against wisdom) - knowing something is harmful yet doing it anyway - is a root cause of disease. This includes staying up late on screens, eating junk food despite knowing better, ignoring body signals.',
    category: 'Mental Health',
    keywords: ['prajnaparadha', 'wisdom', 'habits', 'addiction', 'self-sabotage', 'awareness', 'mindfulness'],
    relatedManuscripts: ['charaka-2', 'charaka-4']
  }
];

export const getManuscriptById = (id: string): Manuscript | undefined => {
  return manuscripts.find(m => m.id === id);
};

export const searchManuscripts = (query: string): Manuscript[] => {
  const lowerQuery = query.toLowerCase();
  return manuscripts.filter(m =>
    m.title.toLowerCase().includes(lowerQuery) ||
    m.englishText.toLowerCase().includes(lowerQuery) ||
    m.keywords.some(k => k.toLowerCase().includes(lowerQuery)) ||
    m.category.toLowerCase().includes(lowerQuery)
  );
};

export const getManuscriptsByCategory = (category: string): Manuscript[] => {
  return manuscripts.filter(m => m.category === category);
};

export const getAllCategories = (): string[] => {
  return Array.from(new Set(manuscripts.map(m => m.category)));
};
