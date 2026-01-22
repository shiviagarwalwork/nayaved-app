export interface Product {
  id: string;
  name: string;
  brand: string;
  category: 'herb' | 'oil' | 'powder' | 'tea';
  description: string;
  price: string;
  doshas: ('vata' | 'pitta' | 'kapha')[];
  benefits: string[];
  usage: string;
  affiliateLink: string; // In production, these would be real affiliate URLs
  image?: string;
}

export const products: Product[] = [
  // Vata-balancing products
  {
    id: 'ashwagandha-1',
    name: 'Organic Ashwagandha',
    brand: 'Banyan Botanicals',
    category: 'herb',
    description: 'Premium ashwagandha root powder for stress relief and grounding',
    price: '$24.99',
    doshas: ['vata'],
    benefits: [
      'Reduces stress and anxiety',
      'Grounds Vata energy',
      'Improves sleep quality',
      'Builds strength and immunity',
    ],
    usage: '1/2 tsp with warm milk before bed',
    affiliateLink: 'https://www.banyanbotanicals.com/ashwagandha-powder',
  },
  {
    id: 'sesame-oil-1',
    name: 'Organic Sesame Oil',
    brand: 'Banyan Botanicals',
    category: 'oil',
    description: 'Warm, grounding oil perfect for Vata abhyanga (self-massage)',
    price: '$16.99',
    doshas: ['vata'],
    benefits: [
      'Deeply nourishing for dry skin',
      'Calms nervous system',
      'Improves circulation',
      'Supports joints and muscles',
    ],
    usage: 'Warm and massage onto body daily',
    affiliateLink: 'https://www.banyanbotanicals.com/sesame-oil-organic',
  },
  {
    id: 'vata-tea-1',
    name: 'Vata Tea',
    brand: 'Organic India',
    category: 'tea',
    description: 'Warming herbal blend to calm Vata imbalances',
    price: '$8.99',
    doshas: ['vata'],
    benefits: [
      'Calms anxiety and restlessness',
      'Supports healthy digestion',
      'Promotes grounding',
      'Warms the body',
    ],
    usage: 'Steep 1 tea bag in hot water for 5-10 minutes',
    affiliateLink: 'https://www.organicindia.com/vata-tea',
  },

  // Pitta-balancing products
  {
    id: 'brahmi-1',
    name: 'Brahmi (Gotu Kola)',
    brand: 'Himalaya Wellness',
    category: 'herb',
    description: 'Cooling herb for mental clarity and Pitta balance',
    price: '$18.99',
    doshas: ['pitta'],
    benefits: [
      'Enhances memory and focus',
      'Cools excess heat',
      'Reduces inflammation',
      'Promotes mental calm',
    ],
    usage: '1 capsule twice daily with water',
    affiliateLink: 'https://himalayausa.com/products/brahmi',
  },
  {
    id: 'coconut-oil-1',
    name: 'Organic Coconut Oil',
    brand: 'Banyan Botanicals',
    category: 'oil',
    description: 'Cooling oil for Pitta types, excellent for massage and cooking',
    price: '$14.99',
    doshas: ['pitta'],
    benefits: [
      'Cools inflammation',
      'Soothes sensitive skin',
      'Calms excess heat',
      'Nourishes hair and skin',
    ],
    usage: 'Use for self-massage or in cooking',
    affiliateLink: 'https://www.banyanbotanicals.com/coconut-oil-organic',
  },
  {
    id: 'pitta-tea-1',
    name: 'Pitta Tea',
    brand: 'Organic India',
    category: 'tea',
    description: 'Cooling herbal blend to pacify Pitta',
    price: '$8.99',
    doshas: ['pitta'],
    benefits: [
      'Cools excess heat',
      'Soothes irritability',
      'Supports healthy digestion',
      'Promotes emotional balance',
    ],
    usage: 'Steep 1 tea bag in hot water, let cool slightly',
    affiliateLink: 'https://www.organicindia.com/pitta-tea',
  },
  {
    id: 'aloe-vera-1',
    name: 'Aloe Vera Juice',
    brand: 'Himalaya Wellness',
    category: 'herb',
    description: 'Pure aloe vera juice for cooling and digestive support',
    price: '$12.99',
    doshas: ['pitta'],
    benefits: [
      'Cools internal heat',
      'Soothes digestive inflammation',
      'Supports liver function',
      'Balances acidity',
    ],
    usage: '2 tbsp diluted in water, twice daily',
    affiliateLink: 'https://himalayausa.com/products/aloe-vera-juice',
  },

  // Kapha-balancing products
  {
    id: 'triphala-1',
    name: 'Triphala Powder',
    brand: 'Banyan Botanicals',
    category: 'powder',
    description: 'Three-fruit formula for detoxification and metabolism',
    price: '$19.99',
    doshas: ['kapha', 'vata', 'pitta'],
    benefits: [
      'Supports healthy elimination',
      'Boosts metabolism',
      'Detoxifies the body',
      'Promotes weight management',
    ],
    usage: '1/2 tsp with warm water before bed',
    affiliateLink: 'https://www.banyanbotanicals.com/triphala-powder',
  },
  {
    id: 'trikatu-1',
    name: 'Trikatu Churna',
    brand: 'Organic India',
    category: 'powder',
    description: 'Warming digestive blend to kindle Agni',
    price: '$16.99',
    doshas: ['kapha'],
    benefits: [
      'Stimulates digestion',
      'Burns excess Kapha',
      'Supports metabolism',
      'Clears congestion',
    ],
    usage: '1/4 tsp with honey before meals',
    affiliateLink: 'https://www.organicindia.com/trikatu',
  },
  {
    id: 'kapha-tea-1',
    name: 'Kapha Tea',
    brand: 'Organic India',
    category: 'tea',
    description: 'Stimulating herbal blend to energize Kapha',
    price: '$8.99',
    doshas: ['kapha'],
    benefits: [
      'Increases energy and motivation',
      'Supports healthy metabolism',
      'Clears congestion',
      'Promotes mental clarity',
    ],
    usage: 'Steep 1 tea bag in hot water for 5-10 minutes',
    affiliateLink: 'https://www.organicindia.com/kapha-tea',
  },
  {
    id: 'guggulu-1',
    name: 'Guggulu (Triphala Guggulu)',
    brand: 'Himalaya Wellness',
    category: 'herb',
    description: 'Traditional formula for metabolism and weight management',
    price: '$21.99',
    doshas: ['kapha'],
    benefits: [
      'Supports healthy weight',
      'Boosts metabolism',
      'Promotes detoxification',
      'Reduces excess Kapha',
    ],
    usage: '2 tablets twice daily with water',
    affiliateLink: 'https://himalayausa.com/products/guggulu',
  },

  // Universal/Multi-dosha products
  {
    id: 'turmeric-1',
    name: 'Organic Turmeric',
    brand: 'Organic India',
    category: 'herb',
    description: 'Golden spice for inflammation and overall health',
    price: '$22.99',
    doshas: ['vata', 'pitta', 'kapha'],
    benefits: [
      'Powerful anti-inflammatory',
      'Supports joint health',
      'Boosts immunity',
      'Promotes healthy digestion',
    ],
    usage: '1 capsule twice daily with food',
    affiliateLink: 'https://www.organicindia.com/turmeric-formula',
  },
  {
    id: 'tulsi-1',
    name: 'Holy Basil (Tulsi)',
    brand: 'Organic India',
    category: 'tea',
    description: 'Sacred herb for stress relief and immunity',
    price: '$9.99',
    doshas: ['vata', 'pitta', 'kapha'],
    benefits: [
      'Reduces stress and anxiety',
      'Supports immune function',
      'Promotes mental clarity',
      'Adaptogenic properties',
    ],
    usage: 'Steep 1-2 tea bags in hot water',
    affiliateLink: 'https://www.organicindia.com/tulsi-tea',
  },
];

/**
 * Get product recommendations based on dominant dosha
 */
export function getRecommendedProducts(dosha: 'vata' | 'pitta' | 'kapha', limit = 3): Product[] {
  return products
    .filter(product => product.doshas.includes(dosha))
    .slice(0, limit);
}

/**
 * Get products by category
 */
export function getProductsByCategory(category: Product['category']): Product[] {
  return products.filter(product => product.category === category);
}
