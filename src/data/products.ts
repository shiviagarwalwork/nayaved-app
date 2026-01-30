/**
 * ============================================================
 * NayaVed Ayurvedic Products Catalog
 * ============================================================
 *
 * This file contains curated Ayurvedic product recommendations
 * with Amazon affiliate links for monetization.
 *
 * AFFILIATE SETUP:
 * - Amazon US Tag: nayaved-20 (amazon.com)
 * - Amazon India Tag: nayaved-21 (amazon.in)
 * - App auto-detects user region and uses appropriate affiliate link
 * - Use getAffiliateLink(product, isIndia) to get correct link
 *
 * ADDING NEW PRODUCTS:
 * 1. Find product on Amazon
 * 2. Get ASIN (Amazon Standard Identification Number) from URL
 * 3. Create link: https://www.amazon.com/dp/ASIN?tag=nayaved-20
 * 4. Add product to appropriate dosha category below
 *
 * @author NayaVed Team
 */

export interface Product {
  id: string;                                    // Unique product identifier
  name: string;                                  // Product display name
  brand: string;                                 // Manufacturer/brand name
  category: 'herb' | 'oil' | 'powder' | 'tea';  // Product category for filtering
  description: string;                           // Short description
  price: string;                                 // Display price (approximate USD)
  priceIN?: string;                              // Display price (approximate INR)
  doshas: ('vata' | 'pitta' | 'kapha')[];       // Which doshas this product helps balance
  benefits: string[];                            // List of health benefits
  usage: string;                                 // How to use the product
  affiliateLink: string;                         // Amazon US affiliate link (tag: nayaved-20)
  affiliateLinkIN?: string;                      // Amazon India affiliate link (tag: nayaved-21)
  image?: string;                                // Optional product image URL
}

// ============================================================
// AMAZON AFFILIATE CONFIGURATION
// ============================================================
// US Tag: nayaved-20 (amazon.com)
// India Tag: nayaved-21 (amazon.in)
//
// The app automatically detects user location and uses the
// appropriate affiliate link (US or India).
// ============================================================

export type UserRegion = 'US' | 'IN' | 'CA' | 'other';

const AMAZON_DOMAINS: Record<UserRegion, string> = {
  US: 'www.amazon.com',
  IN: 'www.amazon.in',
  CA: 'www.amazon.ca',
  other: 'www.amazon.com',
};

const AFFILIATE_TAGS: Partial<Record<UserRegion, string>> = {
  US: 'nayaved-20',
  IN: 'nayaved-21',
  CA: 'nayaved0c-20',
};

/**
 * Get the appropriate affiliate link based on user's region.
 * - US: direct product link (ASIN)
 * - India: India-specific ASIN link
 * - Canada/Other: search link with product name (US ASINs don't exist on other stores)
 */
export function getAffiliateLink(product: Product, region: UserRegion): string {
  // India has separate ASINs
  if (region === 'IN' && product.affiliateLinkIN) {
    return product.affiliateLinkIN;
  }

  // For US, use the original link as-is
  if (region === 'US') {
    return product.affiliateLink;
  }

  // For Canada and others, use a search URL since ASINs differ across stores
  const domain = AMAZON_DOMAINS[region] || AMAZON_DOMAINS.other;
  const tag = AFFILIATE_TAGS[region];
  const tagParam = tag ? `&tag=${tag}` : '';
  const searchQuery = encodeURIComponent(`${product.brand} ${product.name}`);

  return `https://${domain}/s?k=${searchQuery}${tagParam}`;
}

/**
 * Get display price based on user's region
 */
export function getDisplayPrice(product: Product, region: UserRegion): string {
  if (region === 'IN' && product.priceIN) {
    return product.priceIN;
  }
  return product.price;
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
    priceIN: '₹499',
    doshas: ['vata'],
    benefits: [
      'Reduces stress and anxiety',
      'Grounds Vata energy',
      'Improves sleep quality',
      'Builds strength and immunity',
    ],
    usage: '1/2 tsp with warm milk before bed',
    affiliateLink: 'https://www.amazon.com/dp/B0013OQEO0?tag=nayaved-20',
    affiliateLinkIN: 'https://www.amazon.in/dp/B07K2GZCFL?tag=nayaved-21',
  },
  {
    id: 'sesame-oil-1',
    name: 'Organic Sesame Oil',
    brand: 'Banyan Botanicals',
    category: 'oil',
    description: 'Warm, grounding oil perfect for Vata abhyanga (self-massage)',
    price: '$16.99',
    priceIN: '₹399',
    doshas: ['vata'],
    benefits: [
      'Deeply nourishing for dry skin',
      'Calms nervous system',
      'Improves circulation',
      'Supports joints and muscles',
    ],
    usage: 'Warm and massage onto body daily',
    affiliateLink: 'https://www.amazon.com/dp/B001VNKZNS?tag=nayaved-20',
    affiliateLinkIN: 'https://www.amazon.in/dp/B07PJV8RGQ?tag=nayaved-21',
  },
  {
    id: 'vata-tea-1',
    name: 'Vata Tea',
    brand: 'Organic India',
    category: 'tea',
    description: 'Warming herbal blend to calm Vata imbalances',
    price: '$8.99',
    priceIN: '₹299',
    doshas: ['vata'],
    benefits: [
      'Calms anxiety and restlessness',
      'Supports healthy digestion',
      'Promotes grounding',
      'Warms the body',
    ],
    usage: 'Steep 1 tea bag in hot water for 5-10 minutes',
    affiliateLink: 'https://www.amazon.com/dp/B000WLHUBY?tag=nayaved-20',
    affiliateLinkIN: 'https://www.amazon.in/dp/B00D8XDPUY?tag=nayaved-21',
  },

  // Pitta-balancing products
  {
    id: 'brahmi-1',
    name: 'Brahmi (Gotu Kola)',
    brand: 'Himalaya Wellness',
    category: 'herb',
    description: 'Cooling herb for mental clarity and Pitta balance',
    price: '$18.99',
    priceIN: '₹245',
    doshas: ['pitta'],
    benefits: [
      'Enhances memory and focus',
      'Cools excess heat',
      'Reduces inflammation',
      'Promotes mental calm',
    ],
    usage: '1 capsule twice daily with water',
    affiliateLink: 'https://www.amazon.com/dp/B0006NZPGA?tag=nayaved-20',
    affiliateLinkIN: 'https://www.amazon.in/dp/B00CIZU8TK?tag=nayaved-21',
  },
  {
    id: 'coconut-oil-1',
    name: 'Organic Coconut Oil',
    brand: 'Viva Naturals',
    category: 'oil',
    description: 'Cooling oil for Pitta types, excellent for massage and cooking',
    price: '$14.99',
    priceIN: '₹450',
    doshas: ['pitta'],
    benefits: [
      'Cools inflammation',
      'Soothes sensitive skin',
      'Calms excess heat',
      'Nourishes hair and skin',
    ],
    usage: 'Use for self-massage or in cooking',
    affiliateLink: 'https://www.amazon.com/dp/B00DS842HS?tag=nayaved-20',
    affiliateLinkIN: 'https://www.amazon.in/dp/B01LZK6UOK?tag=nayaved-21',
  },
  {
    id: 'pitta-tea-1',
    name: 'Pitta Tea',
    brand: 'Organic India',
    category: 'tea',
    description: 'Cooling herbal blend to pacify Pitta',
    price: '$8.99',
    priceIN: '₹299',
    doshas: ['pitta'],
    benefits: [
      'Cools excess heat',
      'Soothes irritability',
      'Supports healthy digestion',
      'Promotes emotional balance',
    ],
    usage: 'Steep 1 tea bag in hot water, let cool slightly',
    affiliateLink: 'https://www.amazon.com/dp/B000WLHV32?tag=nayaved-20',
    affiliateLinkIN: 'https://www.amazon.in/dp/B00D8XDQFQ?tag=nayaved-21',
  },
  {
    id: 'aloe-vera-1',
    name: 'Aloe Vera Juice',
    brand: 'Lily of the Desert',
    category: 'herb',
    description: 'Pure aloe vera juice for cooling and digestive support',
    price: '$12.99',
    priceIN: '₹350',
    doshas: ['pitta'],
    benefits: [
      'Cools internal heat',
      'Soothes digestive inflammation',
      'Supports liver function',
      'Balances acidity',
    ],
    usage: '2 tbsp diluted in water, twice daily',
    affiliateLink: 'https://www.amazon.com/dp/B00028OVXM?tag=nayaved-20',
    affiliateLinkIN: 'https://www.amazon.in/dp/B07G2HLQRP?tag=nayaved-21',
  },

  // Kapha-balancing products
  {
    id: 'triphala-1',
    name: 'Triphala Powder',
    brand: 'Banyan Botanicals',
    category: 'powder',
    description: 'Three-fruit formula for detoxification and metabolism',
    price: '$19.99',
    priceIN: '₹299',
    doshas: ['kapha', 'vata', 'pitta'],
    benefits: [
      'Supports healthy elimination',
      'Boosts metabolism',
      'Detoxifies the body',
      'Promotes weight management',
    ],
    usage: '1/2 tsp with warm water before bed',
    affiliateLink: 'https://www.amazon.com/dp/B0013OXBHW?tag=nayaved-20',
    affiliateLinkIN: 'https://www.amazon.in/dp/B00CIU1SXC?tag=nayaved-21',
  },
  {
    id: 'trikatu-1',
    name: 'Trikatu Churna',
    brand: 'Banyan Botanicals',
    category: 'powder',
    description: 'Warming digestive blend to kindle Agni',
    price: '$16.99',
    priceIN: '₹199',
    doshas: ['kapha'],
    benefits: [
      'Stimulates digestion',
      'Burns excess Kapha',
      'Supports metabolism',
      'Clears congestion',
    ],
    usage: '1/4 tsp with honey before meals',
    affiliateLink: 'https://www.amazon.com/dp/B0013OW2FE?tag=nayaved-20',
    affiliateLinkIN: 'https://www.amazon.in/dp/B07K2GZPQM?tag=nayaved-21',
  },
  {
    id: 'kapha-tea-1',
    name: 'Kapha Tea',
    brand: 'Organic India',
    category: 'tea',
    description: 'Stimulating herbal blend to energize Kapha',
    price: '$8.99',
    priceIN: '₹299',
    doshas: ['kapha'],
    benefits: [
      'Increases energy and motivation',
      'Supports healthy metabolism',
      'Clears congestion',
      'Promotes mental clarity',
    ],
    usage: 'Steep 1 tea bag in hot water for 5-10 minutes',
    affiliateLink: 'https://www.amazon.com/dp/B000WLHV3W?tag=nayaved-20',
    affiliateLinkIN: 'https://www.amazon.in/dp/B00D8XDP82?tag=nayaved-21',
  },
  {
    id: 'guggulu-1',
    name: 'Guggulu (Triphala Guggulu)',
    brand: 'Banyan Botanicals',
    category: 'herb',
    description: 'Traditional formula for metabolism and weight management',
    price: '$21.99',
    priceIN: '₹399',
    doshas: ['kapha'],
    benefits: [
      'Supports healthy weight',
      'Boosts metabolism',
      'Promotes detoxification',
      'Reduces excess Kapha',
    ],
    usage: '2 tablets twice daily with water',
    affiliateLink: 'https://www.amazon.com/dp/B0013OXDVE?tag=nayaved-20',
    affiliateLinkIN: 'https://www.amazon.in/dp/B07K2H1BQD?tag=nayaved-21',
  },

  // Universal/Multi-dosha products
  {
    id: 'turmeric-1',
    name: 'Organic Turmeric',
    brand: 'Organic India',
    category: 'herb',
    description: 'Golden spice for inflammation and overall health',
    price: '$22.99',
    priceIN: '₹399',
    doshas: ['vata', 'pitta', 'kapha'],
    benefits: [
      'Powerful anti-inflammatory',
      'Supports joint health',
      'Boosts immunity',
      'Promotes healthy digestion',
    ],
    usage: '1 capsule twice daily with food',
    affiliateLink: 'https://www.amazon.com/dp/B0019LRIUO?tag=nayaved-20',
    affiliateLinkIN: 'https://www.amazon.in/dp/B00CIU1T0Q?tag=nayaved-21',
  },
  {
    id: 'tulsi-1',
    name: 'Holy Basil (Tulsi)',
    brand: 'Organic India',
    category: 'tea',
    description: 'Sacred herb for stress relief and immunity',
    price: '$9.99',
    priceIN: '₹199',
    doshas: ['vata', 'pitta', 'kapha'],
    benefits: [
      'Reduces stress and anxiety',
      'Supports immune function',
      'Promotes mental clarity',
      'Adaptogenic properties',
    ],
    usage: 'Steep 1-2 tea bags in hot water',
    affiliateLink: 'https://www.amazon.com/dp/B000TGH82Q?tag=nayaved-20',
    affiliateLinkIN: 'https://www.amazon.in/dp/B00CIU1SFQ?tag=nayaved-21',
  },
];

/**
 * Get product recommendations based on dominant dosha
 */
export function getRecommendedProducts(dosha: 'vata' | 'pitta' | 'kapha', limit = 3): Product[] {
  const filtered = products.filter(product => product.doshas.includes(dosha));
  // Shuffle array using Fisher-Yates algorithm
  const shuffled = [...filtered];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, limit);
}

/**
 * Get products by category
 */
export function getProductsByCategory(category: Product['category']): Product[] {
  return products.filter(product => product.category === category);
}
