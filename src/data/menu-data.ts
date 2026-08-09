export type MenuContext = 'dine-in' | 'takeaway';
export type Availability = 'daily' | 'weekend-only';

export interface MenuItem {
  id: string;
  name: string;
  hindiName: string;
  price: number;
  context: MenuContext;
  category: MenuCategory;
  section: MenuSection;
  description?: string;
  includedItems?: string[];
  availability?: Availability;
  isSignature?: boolean;
  imageType: ImageType;
  imageUrl?: string;
  imageAlt?: string;
}

export type MenuSection =
  | 'sada-thali-dinein'
  | 'morning-breakfast'
  | 'breakfast-combos'
  | 'additional-packing-1'
  | 'packing-thali'
  | 'packing-combo'
  | 'additional-packing-2'
  | 'maharaja-thali-dinein';

export type MenuCategory =
  | 'thali'
  | 'breakfast'
  | 'combo'
  | 'packing'
  | 'takeaway-thali'
  | 'takeaway-combo'
  | 'additional';

export type ImageType =
  | 'thali'
  | 'maharaja-thali'
  | 'maharani-thali'
  | 'ghee-thali'
  | 'dal-baati'
  | 'paratha'
  | 'poha'
  | 'chana'
  | 'puri'
  | 'kachori'
  | 'chilla'
  | 'idli'
  | 'sandwich'
  | 'vermicelli'
  | 'upma'
  | 'tea'
  | 'coffee'
  | 'lassi'
  | 'roti'
  | 'bati'
  | 'dal'
  | 'kadhi'
  | 'rice'
  | 'raita'
  | 'sabji'
  | 'mithai'
  | 'tikkar'
  | 'minithali';

export const FOOD_IMAGES: Partial<Record<ImageType, string>> = {
  'thali': '/images/menu/thali-1.jpg',
  'maharaja-thali': '/images/menu/thali-2.jpg',
  'maharani-thali': '/images/menu/thali-3.jpg',
  'ghee-thali': '/images/menu/thali-4.jpg',
  'dal-baati': '/images/menu/dal-baati.jpg',
  'paratha': '/images/menu/paratha-1.jpg',
  'poha': '/images/menu/poha.jpg',
  'chana': '/images/menu/chana.jpg',
  'puri': '/images/menu/puri.jpg',
  'kachori': '/images/menu/kachori.jpg',
  'chilla': '/images/menu/chilla.jpg',
  'idli': '/images/menu/idli.jpg',
  'sandwich': '/images/menu/sandwich.jpg',
  'vermicelli': '/images/menu/vermicelli.jpg',
  'upma': '/images/menu/upma.jpg',
  'tea': '/images/menu/chai.jpg',
  'coffee': '/images/menu/coffee.jpg',
  'lassi': '/images/menu/lassi.jpg',
  'roti': '/images/menu/roti.jpg',
  'bati': '/images/menu/bati.jpg',
  'dal': '/images/menu/dal.jpg',
  'kadhi': '/images/menu/kadhi.jpg',
  'rice': '/images/menu/rice.jpg',
  'raita': '/images/menu/raita.jpg',
  'sabji': '/images/menu/sabji.jpg',
  'mithai': '/images/menu/mithai.jpg',
  'tikkar': '/images/menu/tikkar.jpg',
  'minithali': '/images/menu/thali-5.jpg',
};

export interface ResolvedImage {
  src: string;
  alt?: string;
}

/**
 * Resolves the image source for a menu item with strict priority:
 *   1. Database-managed `imageUrl` (custom upload via Admin CMS)
 *   2. Static `FOOD_IMAGES` fallback keyed by `imageType`
 *   3. null (caller falls back to the SVG illustration)
 */
export function resolveMenuItemImage(
  imageUrl: string | null | undefined,
  imageAlt: string | null | undefined,
  imageType: ImageType
): ResolvedImage | null {
  if (imageUrl) {
    return { src: imageUrl, alt: imageAlt || undefined }
  }
  const fallback = FOOD_IMAGES[imageType]
  if (fallback) {
    return { src: fallback, alt: imageAlt || undefined }
  }
  return null
}

export interface MenuSectionData {
  id: MenuSection;
  title: string;
  subtitle: string;
  context: MenuContext;
  timing?: string;
  rules?: string[];
  address?: string;
}

export const MENU_SECTIONS: MenuSectionData[] = [
  {
    id: 'sada-thali-dinein',
    title: 'सादा थाली',
    subtitle: 'Dine-In Thali',
    context: 'dine-in',
  },
  {
    id: 'morning-breakfast',
    title: 'Morning Breakfast',
    subtitle: 'नाश्ता',
    context: 'dine-in',
    timing: '8:30 AM – 11:00 AM',
  },
  {
    id: 'breakfast-combos',
    title: 'Breakfast Combos',
    subtitle: 'कॉम्बो मेनू',
    context: 'dine-in',
  },
  {
    id: 'additional-packing-1',
    title: 'Additional Packing',
    subtitle: 'अतिरिक्त पैकिंग',
    context: 'takeaway',
  },
  {
    id: 'packing-thali',
    title: 'Thali Menu',
    subtitle: 'पैकिंग / टेकअवे / डिलीवरी',
    context: 'takeaway',
    timing: '11:00 AM – 3:30 PM · 7:00 PM – 10:30 PM',
    address: '1/48, राजामण्डी स्टेशन रोड, देहली गेट, आगरा',
  },
  {
    id: 'packing-combo',
    title: 'Combo & Thali Menu',
    subtitle: 'पैकिंग / टेकअवे / डिलीवरी',
    context: 'takeaway',
    timing: '11:00 AM – 3:30 PM · 7:00 PM – 10:30 PM',
  },
  {
    id: 'additional-packing-2',
    title: 'Additional Packing',
    subtitle: 'अतिरिक्त पैकिंग',
    context: 'takeaway',
  },
  {
    id: 'maharaja-thali-dinein',
    title: 'महाराजा थाली',
    subtitle: 'Dine-In Thali',
    context: 'dine-in',
    rules: [
      'एक थाली में एक ही व्यक्ति भोजन कर सकेगा (शेयरिंग करने की अनुमति नहीं है।)',
      'थाली में दाल, सब्जियाँ, रोटी, चटनी के अतिरिक्त अन्य सामान एक ही बार दिया जावेगा। अन्य सामान पुनः लेने पर अतिरिक्त चार्ज होगा।',
    ],
  },
];

// ═══════════ A. SADA THALI — DINE-IN ═══════════

const SADA_THALI_DINEIN: MenuItem = {
  id: 'sada-thali-dinein',
  name: 'Sada Thali',
  hindiName: 'सादा थाली',
  price: 220,
  context: 'dine-in',
  category: 'thali',
  section: 'sada-thali-dinein',
  description: 'Simple and wholesome traditional vegetarian thali.',
  includedItems: [
    'छाछ', 'चटनी', 'सलाद', 'रायता', 'सूखी सब्जी', 'रसेदार सब्जी',
    'दाल', 'चावल', 'खीर', 'बिना घी चुपड़ी रोटी', 'गेहूँ की रोटी',
    'मिस्सी रोटी', 'पापड़', 'ग्वार फली',
  ],
  isSignature: true,
  imageType: 'thali',
};

const SADA_THALI_RULES = [
  'एक थाली में एक ही व्यक्ति भोजन कर सकेगा (शेयरिंग करने की अनुमति नहीं है।)',
  'थाली में दाल, सब्जियाँ, रोटी, चटनी के अतिरिक्त अन्य सामान एक ही बार दिया जावेगा। अन्य सामान पुनः लेने पर अतिरिक्त चार्ज होगा।',
];

// ═══════════ B. MORNING BREAKFAST ═══════════

const MORNING_BREAKFAST: MenuItem[] = [
  { id: 'b-poha', name: 'Poha', hindiName: 'पोहा', price: 60, context: 'dine-in', category: 'breakfast', section: 'morning-breakfast', imageType: 'poha' },
  { id: 'b-chana', name: 'Chana', hindiName: 'चना', price: 60, context: 'dine-in', category: 'breakfast', section: 'morning-breakfast', imageType: 'chana' },
  { id: 'b-sada-paratha', name: 'Sada Paratha', hindiName: 'सादा पराठा', price: 90, context: 'dine-in', category: 'breakfast', section: 'morning-breakfast', imageType: 'paratha' },
  { id: 'b-aloo-paratha', name: 'Aloo Paratha', hindiName: 'आलू पराठा', price: 90, context: 'dine-in', category: 'breakfast', section: 'morning-breakfast', imageType: 'paratha' },
  { id: 'b-mix-paratha', name: 'Mix Paratha', hindiName: 'मिक्स पराठा', price: 90, context: 'dine-in', category: 'breakfast', section: 'morning-breakfast', imageType: 'paratha' },
  { id: 'b-gobhi-paratha', name: 'Gobhi Paratha', hindiName: 'गोभी पराठा', price: 90, context: 'dine-in', category: 'breakfast', section: 'morning-breakfast', imageType: 'paratha' },
  { id: 'b-muli-paratha', name: 'Muli Paratha', hindiName: 'मूली पराठा', price: 90, context: 'dine-in', category: 'breakfast', section: 'morning-breakfast', imageType: 'paratha' },
  { id: 'b-masala-paratha', name: 'Masala Paratha', hindiName: 'मसाला पराठा', price: 90, context: 'dine-in', category: 'breakfast', section: 'morning-breakfast', imageType: 'paratha' },
  { id: 'b-matar-paratha', name: 'Matar Paratha', hindiName: 'मटर पराठा', price: 90, context: 'dine-in', category: 'breakfast', section: 'morning-breakfast', imageType: 'paratha' },
  { id: 'b-puri-sabji', name: 'Puri Sabji', hindiName: 'पूरी सब्जी', price: 90, context: 'dine-in', category: 'breakfast', section: 'morning-breakfast', imageType: 'puri' },
  { id: 'b-kadi-kachauri', name: 'Kadi Kachauri', hindiName: 'कढ़ी कचौरी', price: 80, context: 'dine-in', category: 'breakfast', section: 'morning-breakfast', imageType: 'kachori' },
  { id: 'b-besan-chilla', name: 'Besan Chilla', hindiName: 'बेसन चिल्ला', price: 70, context: 'dine-in', category: 'breakfast', section: 'morning-breakfast', imageType: 'chilla' },
  { id: 'b-sandwich', name: 'Sandwich', hindiName: 'सैंडविच', price: 80, context: 'dine-in', category: 'breakfast', section: 'morning-breakfast', imageType: 'sandwich' },
  { id: 'b-idli-sambar', name: 'Idli Sambar', hindiName: 'इडली सांभर', price: 90, context: 'dine-in', category: 'breakfast', section: 'morning-breakfast', imageType: 'idli' },
  { id: 'b-sambar-bada', name: 'Sambar Bada', hindiName: 'सांभर बड़ा', price: 90, context: 'dine-in', category: 'breakfast', section: 'morning-breakfast', imageType: 'idli' },
  { id: 'b-fried-idli', name: 'Fried Idli', hindiName: 'फ्राइड इडली', price: 80, context: 'dine-in', category: 'breakfast', section: 'morning-breakfast', imageType: 'idli' },
  { id: 'b-fried-masala-bread', name: 'Fried Masala Bread', hindiName: 'फ्राइड मसाला ब्रेड', price: 50, context: 'dine-in', category: 'breakfast', section: 'morning-breakfast', imageType: 'paratha' },
  { id: 'b-vermicelli', name: 'Vermicelli', hindiName: 'वर्मिसेली', price: 70, context: 'dine-in', category: 'breakfast', section: 'morning-breakfast', imageType: 'vermicelli' },
  { id: 'b-upma', name: 'Upma', hindiName: 'उपमा', price: 60, context: 'dine-in', category: 'breakfast', section: 'morning-breakfast', imageType: 'upma' },
  { id: 'b-tea', name: 'Tea', hindiName: 'चाय', price: 30, context: 'dine-in', category: 'breakfast', section: 'morning-breakfast', imageType: 'tea' },
  { id: 'b-coffee', name: 'Coffee', hindiName: 'कॉफ़ी', price: 40, context: 'dine-in', category: 'breakfast', section: 'morning-breakfast', imageType: 'coffee' },
  { id: 'b-lassi', name: 'Lassi', hindiName: 'लस्सी', price: 50, context: 'dine-in', category: 'breakfast', section: 'morning-breakfast', imageType: 'lassi' },
];

// ═══════════ C. BREAKFAST COMBOS ═══════════

const BREAKFAST_COMBOS: MenuItem[] = [
  {
    id: 'c-dal-bati-combo', name: 'Dal Baati Combo', hindiName: 'दाल बाटी कॉम्बो', price: 99, context: 'dine-in', category: 'combo', section: 'breakfast-combos',
    includedItems: ['चटनी', 'पंचमेल दाल', 'दो बाटी'],
    isSignature: true, imageType: 'dal-baati',
  },
  {
    id: 'c-dal-roti-combo', name: 'Dal Roti Combo', hindiName: 'दाल - रोटी कॉम्बो', price: 90, context: 'dine-in', category: 'combo', section: 'breakfast-combos',
    includedItems: ['घी चुपड़ी रोटी 5 गेहूँ की', 'दाल अरहर', 'सलाद', 'अचार', 'माउथ फ्रेशनर'],
    imageType: 'dal',
  },
  {
    id: 'c-kadhi-chawal-combo', name: 'Kadhi Chawal Combo', hindiName: 'कढ़ी - चावल कॉम्बो', price: 90, context: 'dine-in', category: 'combo', section: 'breakfast-combos',
    includedItems: ['कढ़ी-चावल', 'सलाद', 'अचार', 'माउथ फ्रेशनर'],
    imageType: 'kadhi',
  },
  {
    id: 'c-dal-chawal-combo', name: 'Dal Chawal Combo', hindiName: 'दाल - चावल कॉम्बो', price: 90, context: 'dine-in', category: 'combo', section: 'breakfast-combos',
    includedItems: ['दाल-चावल', 'सलाद', 'अचार', 'माउथ फ्रेशनर'],
    imageType: 'dal',
  },
  {
    id: 'c-aloo-paratha-combo', name: 'Aloo Paratha Combo', hindiName: 'आलू पराठा - कॉम्बो', price: 90, context: 'dine-in', category: 'combo', section: 'breakfast-combos',
    includedItems: ['एक आलू पराठा', 'आलू सब्जी', 'अचार', 'माउथ फ्रेशनर'],
    imageType: 'paratha',
  },
  {
    id: 'c-kadhi-kachori', name: 'Kadhi Kachori', hindiName: 'कढ़ी - कचौड़ी', price: 70, context: 'dine-in', category: 'combo', section: 'breakfast-combos',
    includedItems: ['दो राजस्थानी दाल कचौड़ी', 'कढ़ी', 'अदरक', 'मिर्च', 'नींबू', 'माउथ फ्रेशनर'],
    imageType: 'kachori',
  },
  {
    id: 'c-sada-paratha-combo', name: 'Sada Paratha Sabji Combo', hindiName: 'सादा पराठा - सब्जी कॉम्बो', price: 90, context: 'dine-in', category: 'combo', section: 'breakfast-combos',
    includedItems: ['दो सादा पराठा', 'आलू सब्जी', 'अचार', 'माउथ फ्रेशनर'],
    imageType: 'paratha',
  },
  {
    id: 'c-masala-paratha-combo', name: 'Masala Paratha Sabji Combo', hindiName: 'मसाला पराठा - सब्जी कॉम्बो', price: 90, context: 'dine-in', category: 'combo', section: 'breakfast-combos',
    includedItems: ['दो मसाला पराठा', 'आलू सब्जी', 'अचार', 'माउथ फ्रेशनर'],
    imageType: 'paratha',
  },
  {
    id: 'c-matar-paratha-combo', name: 'Matar Paratha Sabji Combo', hindiName: 'मटर पराठा - सब्जी कॉम्बो', price: 90, context: 'dine-in', category: 'combo', section: 'breakfast-combos',
    includedItems: ['एक मटर पराठा', 'आलू सब्जी', 'अचार', 'माउथ फ्रेशनर'],
    imageType: 'paratha',
  },
  {
    id: 'c-puri-sabji-combo', name: 'Puri Sabji Combo', hindiName: 'पूड़ी - सब्जी कॉम्बो', price: 90, context: 'dine-in', category: 'combo', section: 'breakfast-combos',
    includedItems: ['6 पूड़ी', 'आलू सब्जी', 'सलाद', 'अचार', 'माउथ फ्रेशनर'],
    imageType: 'puri',
  },
  {
    id: 'c-roti-sabji-combo', name: 'Roti Sabji Combo', hindiName: 'रोटी - सब्जी कॉम्बो', price: 90, context: 'dine-in', category: 'combo', section: 'breakfast-combos',
    includedItems: ['5 रोटी', 'आलू सब्जी', 'सलाद', 'अचार', 'माउथ फ्रेशनर'],
    imageType: 'roti',
  },
];

// ═══════════ D. ADDITIONAL PACKING — FIRST PRICE LIST ═══════════

const ADDITIONAL_PACKING_1: MenuItem[] = [
  { id: 'd-sada-roti', name: 'Sada Roti', hindiName: 'सादा रोटी', price: 6, context: 'takeaway', category: 'additional', section: 'additional-packing-1', imageType: 'roti' },
  { id: 'd-ghi-roti', name: 'Ghee Roti', hindiName: 'घी रोटी', price: 7, context: 'takeaway', category: 'additional', section: 'additional-packing-1', imageType: 'roti' },
  { id: 'd-missi-sada-roti', name: 'Missi Sada Roti', hindiName: 'मिस्सी सादा रोटी', price: 7, context: 'takeaway', category: 'additional', section: 'additional-packing-1', imageType: 'roti' },
  { id: 'd-missi-ghi-roti', name: 'Missi Ghee Roti', hindiName: 'मिस्सी घी रोटी', price: 8, context: 'takeaway', category: 'additional', section: 'additional-packing-1', imageType: 'roti' },
  { id: 'd-bati', name: 'Bati', hindiName: 'बाटी', price: 30, context: 'takeaway', category: 'additional', section: 'additional-packing-1', imageType: 'bati' },
  { id: 'd-mithai', name: 'Mithai (Kheer, Churma)', hindiName: 'मिठाई (खीर, चूरमा)', price: 30, context: 'takeaway', category: 'additional', section: 'additional-packing-1', imageType: 'mithai' },
  { id: 'd-tikkar', name: 'Tikkar', hindiName: 'टिक्कड़', price: 10, context: 'takeaway', category: 'additional', section: 'additional-packing-1', imageType: 'tikkar' },
  { id: 'd-dal', name: 'Dal', hindiName: 'दाल', price: 50, context: 'takeaway', category: 'additional', section: 'additional-packing-1', imageType: 'dal' },
  { id: 'd-chawal', name: 'Chawal', hindiName: 'चावल', price: 40, context: 'takeaway', category: 'additional', section: 'additional-packing-1', imageType: 'rice' },
  { id: 'd-sabji', name: 'Sabji (per)', hindiName: 'सब्जियाँ (प्रति)', price: 50, context: 'takeaway', category: 'additional', section: 'additional-packing-1', imageType: 'sabji' },
  { id: 'd-raita-boondi', name: 'Raita Boondi', hindiName: 'रायता बूंदी', price: 30, context: 'takeaway', category: 'additional', section: 'additional-packing-1', imageType: 'raita' },
];

// ═══════════ E1. PACKING THALI MENU ═══════════

const PACKING_THALI: MenuItem[] = [
  {
    id: 'e1-sada-thali', name: 'Sada Thali', hindiName: 'सादा थाली', price: 190, context: 'takeaway', category: 'takeaway-thali', section: 'packing-thali',
    includedItems: ['चटनी', 'सलाद', 'रायता', 'सूखी सब्जी', 'रसेदार सब्जी', 'दाल', 'चावल', 'खीर', 'बिना घी चुपड़ी रोटी', '4 गेहूँ की', '2 मिस्सी', 'पापड़', 'ग्वार फली'],
    isSignature: true, imageType: 'thali',
  },
  {
    id: 'e1-ghi-thali', name: 'Ghee Thali', hindiName: 'घी थाली', price: 200, context: 'takeaway', category: 'takeaway-thali', section: 'packing-thali',
    includedItems: ['चटनी', 'सलाद', 'रायता', 'सूखी सब्जी', 'रसेदार सब्जी', 'दाल', 'चावल', 'खीर', 'घी चुपड़ी रोटी', '4 गेहूँ की', '2 मिस्सी', 'पापड़', 'ग्वार फली'],
    isSignature: true, imageType: 'ghee-thali',
  },
  {
    id: 'e1-maharaja-thali', name: 'Maharaja Thali', hindiName: 'महाराजा थाली', price: 270, context: 'takeaway', category: 'takeaway-thali', section: 'packing-thali',
    includedItems: ['चटनी', 'लोंजी', 'सलाद', 'रायता', 'दो रसेदार सब्जी', 'सूखी सब्जी', 'कढ़ी', 'दाल', 'चावल नमकीन', 'खीर', 'मिठाई', 'घी चुपड़ी रोटी', '8 गेहूँ की', '2 मिस्सी', 'पापड़', 'ग्वार फली'],
    isSignature: true, imageType: 'maharaja-thali',
  },
  {
    id: 'e1-maharani-thali', name: 'Maharani Thali', hindiName: 'महारानी थाली', price: 300, context: 'takeaway', category: 'takeaway-thali', section: 'packing-thali',
    availability: 'weekend-only',
    includedItems: ['चटनी', 'लोंजी', 'कचूमर सलाद', 'रायता', 'सूखी सब्जी', 'रसेदार सब्जी', 'गट्टे की सब्जी', 'पंचमेल दाल', 'कढ़ी', 'गट्टा चावल', 'खीर', 'चूरमा', 'एक बाटी', 'एक टिक्कड़', 'एक कचौड़ी', 'घी चुपड़ी रोटी', '3 गेहूँ की', '2 मिस्सी', 'चना पापड़', 'ग्वार फली'],
    isSignature: true, imageType: 'maharani-thali',
  },
  {
    id: 'e1-dal-bati-thali', name: 'Dal Baati Thali', hindiName: 'दाल बाटी थाली', price: 170, context: 'takeaway', category: 'takeaway-thali', section: 'packing-thali',
    availability: 'weekend-only',
    includedItems: ['चटनी', 'पंचमेल दाल', 'चूरमा', 'दो बाटी', 'आलू सब्जी'],
    isSignature: true, imageType: 'dal-baati',
  },
];

// ═══════════ F. PACKING COMBO & THALI MENU ═══════════

const PACKING_COMBO: MenuItem[] = [
  {
    id: 'f-dal-roti-combo', name: 'Dal Roti Combo', hindiName: 'दाल - रोटी कॉम्बो', price: 110, context: 'takeaway', category: 'takeaway-combo', section: 'packing-combo',
    includedItems: ['घी चुपड़ी रोटी 5 गेहूँ की', 'दाल अरहर', 'सलाद', 'अचार', 'माउथ फ्रेशनर'],
    imageType: 'dal',
  },
  {
    id: 'f-roti-sabji-combo', name: 'Roti Sabji Combo', hindiName: 'रोटी - सब्जी कॉम्बो', price: 110, context: 'takeaway', category: 'takeaway-combo', section: 'packing-combo',
    includedItems: ['घी चुपड़ी रोटी 5 गेहूँ की', 'आलू सब्जी', 'सलाद', 'अचार', 'माउथ फ्रेशनर'],
    imageType: 'roti',
  },
  {
    id: 'f-kadhi-chawal-combo', name: 'Kadhi Chawal Combo', hindiName: 'कढ़ी - चावल कॉम्बो', price: 110, context: 'takeaway', category: 'takeaway-combo', section: 'packing-combo',
    includedItems: ['कढ़ी-चावल', 'सलाद', 'अचार', 'माउथ फ्रेशनर'],
    imageType: 'kadhi',
  },
  {
    id: 'f-dal-chawal-combo', name: 'Dal Chawal Combo', hindiName: 'दाल - चावल कॉम्बो', price: 110, context: 'takeaway', category: 'takeaway-combo', section: 'packing-combo',
    includedItems: ['अरहर दाल-चावल', 'सलाद', 'अचार', 'माउथ फ्रेशनर'],
    imageType: 'dal',
  },
  {
    id: 'f-kadhi-kachori', name: 'Kadhi Kachori', hindiName: 'कढ़ी - कचौड़ी', price: 100, context: 'takeaway', category: 'takeaway-combo', section: 'packing-combo',
    includedItems: ['दो राजस्थानी दाल कचौड़ी', 'कढ़ी', 'अदरक', 'मिर्च', 'नींबू', 'माउथ फ्रेशनर'],
    imageType: 'kachori',
  },
  {
    id: 'f-puri-sabji-combo', name: 'Puri Sabji Combo', hindiName: 'पूड़ी - सब्जी कॉम्बो', price: 120, context: 'takeaway', category: 'takeaway-combo', section: 'packing-combo',
    includedItems: ['5 पूड़ी', 'आलू सब्जी', 'अचार', 'माउथ फ्रेशनर'],
    imageType: 'puri',
  },
  {
    id: 'f-sada-paratha-combo', name: 'Sada Paratha Sabji Combo', hindiName: 'सादा पराठा सब्जी कॉम्बो', price: 120, context: 'takeaway', category: 'takeaway-combo', section: 'packing-combo',
    includedItems: ['दो सादा पराठा', 'आलू सब्जी', 'अचार', 'माउथ फ्रेशनर'],
    imageType: 'paratha',
  },
  {
    id: 'f-aloo-paratha-combo', name: 'Aloo Paratha Combo', hindiName: 'आलू - पराठा कॉम्बो', price: 120, context: 'takeaway', category: 'takeaway-combo', section: 'packing-combo',
    includedItems: ['एक आलू पराठा', 'आलू सब्जी', 'अचार', 'माउथ फ्रेशनर'],
    imageType: 'paratha',
  },
  {
    id: 'f-mix-paratha-combo', name: 'Mix Paratha Sabji Combo', hindiName: 'मिक्स पराठा सब्जी कॉम्बो', price: 120, context: 'takeaway', category: 'takeaway-combo', section: 'packing-combo',
    includedItems: ['एक मिक्स पराठा', 'आलू सब्जी', 'अचार', 'माउथ फ्रेशनर'],
    imageType: 'paratha',
  },
  {
    id: 'f-matar-paratha-combo', name: 'Matar Paratha Sabji Combo', hindiName: 'मटर पराठा सब्जी कॉम्बो', price: 120, context: 'takeaway', category: 'takeaway-combo', section: 'packing-combo',
    includedItems: ['एक मटर पराठा', 'आलू सब्जी', 'अचार', 'माउथ फ्रेशनर'],
    imageType: 'paratha',
  },
  {
    id: 'f-mini-thali', name: 'Mini Thali', hindiName: 'मिनी थाली', price: 190, context: 'takeaway', category: 'takeaway-combo', section: 'packing-combo',
    includedItems: ['अचार', 'सलाद', 'दाल', 'चावल', 'दो सब्जी', '5 घी रोटी'],
    imageType: 'minithali',
  },
  {
    id: 'f-dal-bati-combo', name: 'Dal Baati Combo', hindiName: 'दाल - बाटी कॉम्बो', price: 130, context: 'takeaway', category: 'takeaway-combo', section: 'packing-combo',
    includedItems: ['चटनी', 'पंचमेल दाल', 'दो बाटी'],
    isSignature: true, imageType: 'dal-baati',
  },
];

// ═══════════ G. ADDITIONAL PACKING — SECOND PRICE LIST ═══════════

const ADDITIONAL_PACKING_2: MenuItem[] = [
  { id: 'g-sada-roti', name: 'Sada Roti', hindiName: 'सादा रोटी', price: 8, context: 'takeaway', category: 'additional', section: 'additional-packing-2', imageType: 'roti' },
  { id: 'g-ghi-roti', name: 'Ghee Roti', hindiName: 'घी रोटी', price: 10, context: 'takeaway', category: 'additional', section: 'additional-packing-2', imageType: 'roti' },
  { id: 'g-missi-sada-roti', name: 'Missi Sada Roti', hindiName: 'मिस्सी सादा रोटी', price: 11, context: 'takeaway', category: 'additional', section: 'additional-packing-2', imageType: 'roti' },
  { id: 'g-missi-ghi-roti', name: 'Missi Ghee Roti', hindiName: 'मिस्सी घी रोटी', price: 12, context: 'takeaway', category: 'additional', section: 'additional-packing-2', imageType: 'roti' },
  { id: 'g-bati', name: 'Bati', hindiName: 'बाटी', price: 40, context: 'takeaway', category: 'additional', section: 'additional-packing-2', imageType: 'bati' },
  { id: 'g-mithai', name: 'Mithai (Kheer, Churma)', hindiName: 'मिठाई (खीर, चूरमा)', price: 40, context: 'takeaway', category: 'additional', section: 'additional-packing-2', imageType: 'mithai' },
  { id: 'g-tikkar', name: 'Tikkar', hindiName: 'टिक्कड़', price: 15, context: 'takeaway', category: 'additional', section: 'additional-packing-2', imageType: 'tikkar' },
  { id: 'g-dal', name: 'Dal', hindiName: 'दाल', price: 70, context: 'takeaway', category: 'additional', section: 'additional-packing-2', imageType: 'dal' },
  { id: 'g-chawal', name: 'Chawal', hindiName: 'चावल', price: 60, context: 'takeaway', category: 'additional', section: 'additional-packing-2', imageType: 'rice' },
  { id: 'g-raita-boondi', name: 'Raita Boondi', hindiName: 'रायता बूंदी', price: 30, context: 'takeaway', category: 'additional', section: 'additional-packing-2', imageType: 'raita' },
  { id: 'g-sabji', name: 'Sabji', hindiName: 'सब्जी', price: 70, context: 'takeaway', category: 'additional', section: 'additional-packing-2', imageType: 'sabji' },
  { id: 'g-matar-paneer', name: 'Matar Paneer', hindiName: 'मटर पनीर', price: 80, context: 'takeaway', category: 'additional', section: 'additional-packing-2', imageType: 'sabji' },
];

// ═══════════ H. MAHARAJA THALI — DINE-IN ═══════════

const MAHARAJA_THALI_DINEIN: MenuItem = {
  id: 'maharaja-thali-dinein',
  name: 'Maharaja Thali',
  hindiName: 'महाराजा थाली',
  price: 310,
  context: 'dine-in',
  category: 'thali',
  section: 'maharaja-thali-dinein',
  description: 'Grand vegetarian thali featuring an assortment of royal Rajasthani delicacies.',
  includedItems: [
    'छाछ', 'चटनी', 'लोंजी', 'सलाद', 'रायता', 'सूखी सब्जी', 'दो रसेदार सब्जी',
    'कढ़ी', 'दाल', 'चावल नमकीन', 'खीर', 'मिठाई', 'घी चुपड़ी रोटी',
    'गेहूँ की', 'मिस्सी', 'पापड़', 'ग्वार फली',
  ],
  isSignature: true,
  imageType: 'maharaja-thali',
};

// ═══════════ ALL ITEMS ═══════════

export const ALL_MENU_ITEMS: MenuItem[] = [
  SADA_THALI_DINEIN,
  ...MORNING_BREAKFAST,
  ...BREAKFAST_COMBOS,
  ...ADDITIONAL_PACKING_1,
  ...PACKING_THALI,
  ...PACKING_COMBO,
  ...ADDITIONAL_PACKING_2,
  MAHARAJA_THALI_DINEIN,
];

export const SADA_THALI_RULES_TEXT = SADA_THALI_RULES;

// Filter categories for the UI
export const FILTER_CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'thali', label: 'Thali' },
  { key: 'breakfast', label: 'Breakfast' },
  { key: 'combo', label: 'Combos' },
  { key: 'takeaway', label: 'Takeaway & Delivery' },
  { key: 'additional', label: 'Additional Packing' },
] as const;

export type FilterCategory = typeof FILTER_CATEGORIES[number]['key'];
