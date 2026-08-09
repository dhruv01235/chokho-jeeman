export const RESTAURANT = {
  name: 'Chokho Jeeman',
  hindiName: 'चोखो जीमण',
  tagline: 'मारवाड़ी जैन भोजनालय',
  fullHindiName: 'चोखो जीमण (मारवाड़ी जैन भोजनालय)',
  description: 'Authentic vegetarian Rajasthani, Marwari, and Jain food in Agra.',

  address: {
    street: '1/48, राजामण्डी स्टेशन रोड',
    area: 'देहली गेट',
    city: 'आगरा',
    state: 'Uttar Pradesh',
    full: '1/48, राजामण्डी स्टेशन रोड, देहली गेट, आगरा, Uttar Pradesh',
    english: '1/48 Raja Mandi Station Road, Delhi Gate, Agra, Uttar Pradesh',
    googleMaps: 'https://maps.google.com/?q=1/48+Raja+Mandi+Station+Road+Delhi+Gate+Agra',
  },

  phones: [
    { number: '0562-4040338', display: '0562-4040338', tel: 'tel:05624040338' },
    { number: '0562-4309670', display: '0562-4309670', tel: 'tel:05624309670' },
    { number: '8392883997', display: '8392883997', tel: 'tel:8392883997' },
  ],

  email: 'chokhojeeman@gmail.com',

  facebook: {
    url: 'https://www.facebook.com/chokhoJeemanAgra/',
    display: 'www.facebook.com/chokhoJeemanAgra/',
  },

  delivery: {
    lunch: { start: '11:00 AM', end: '3:30 PM' },
    dinner: { start: '7:00 PM', end: '10:30 PM' },
    display: ['11:00 AM – 3:30 PM', '7:00 PM – 10:30 PM'],
  },

  payments: ['Debit Card', 'Credit Card', 'Paytm', 'PhonePe'] as const,

  cuisine: ['Rajasthani', 'Marwari', 'Jain', 'Vegetarian'] as const,

  rating: {
    value: 4.2,
    reviews: 6351,
  },
} as const;
