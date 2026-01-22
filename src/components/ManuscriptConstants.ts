/**
 * Manuscript UI Design System
 * Inspired by ancient Ayurvedic texts: Charaka Samhita, Sushruta Samhita, Ashtanga Hridayam
 */

export const ManuscriptColors = {
  // Parchment/Palm Leaf Background Colors
  parchment: '#F5EFE0',
  oldPaper: '#E8DCC4',
  palmLeaf: '#D4C5A9',

  // Text Colors (Ancient Ink)
  inkBlack: '#2D2416',
  inkBrown: '#5C4033',
  fadedInk: '#796752',

  // Accent Colors (Natural Pigments)
  vermillion: '#C7522A', // Red ochre - used for important markings
  turmeric: '#E5B80B', // Golden yellow - sacred color
  indigo: '#4B6B8A', // Blue from indigo plant
  henna: '#A0522D', // Reddish brown from henna
  saffron: '#F4C430', // Sacred saffron color

  // Border/Decorative Colors
  goldLeaf: '#D4AF37',
  copperBrown: '#B87333',
  silverGrey: '#C0C0C0',

  // Shadow/Depth
  scrollShadow: 'rgba(0, 0, 0, 0.15)',
  textShadow: 'rgba(0, 0, 0, 0.3)',
};

export const ManuscriptFonts = {
  // Use system fonts that evoke ancient manuscripts
  heading: 'Georgia', // Serif font with classic feel
  body: 'Georgia',
  sanskrit: 'Cochin', // For Sanskrit transliterations
  decorative: 'Palatino', // For special quotes

  // Font sizes
  titleSize: 28,
  headingSize: 22,
  subheadingSize: 18,
  bodySize: 16,
  captionSize: 14,
  smallSize: 12,
};

export const ManuscriptSpacing = {
  borderWidth: 3,
  borderRadius: 8,
  padding: {
    small: 12,
    medium: 16,
    large: 24,
  },
  margin: {
    small: 8,
    medium: 16,
    large: 24,
  },
};

/**
 * Decorative border patterns
 * Using Unicode box-drawing characters to create borders
 */
export const BorderPatterns = {
  top: '═══════════════════════════════════',
  bottom: '═══════════════════════════════════',
  vertical: '║',
  corner: {
    topLeft: '╔',
    topRight: '╗',
    bottomLeft: '╚',
    bottomRight: '╝',
  },
  ornament: '◈', // Diamond ornament
  leaf: '❦', // Leaf ornament
  lotus: '✿', // Lotus flower
  om: 'ॐ', // Om symbol
};

/**
 * Sanskrit numerals (Devanagari)
 */
export const SanskritNumerals = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
