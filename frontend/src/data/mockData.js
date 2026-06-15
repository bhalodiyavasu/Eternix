import suitImg from '@/assets/extracted/image1_2_63.jpg';
import coatImg from '@/assets/extracted/image10_2_63.jpg';
import jacketImg from '@/assets/extracted/image11_2_63.jpg';
import item1 from '@/assets/extracted/image7_2_63.jpg';
import item2 from '@/assets/extracted/image6_2_63.jpg';
import item3 from '@/assets/extracted/image8_2_63.jpg';
import item4 from '@/assets/extracted/image9_2_63.jpg';
import photo1 from '@/assets/extracted/image4_2_63.jpg';
import photo2 from '@/assets/extracted/image3_2_63.jpg';
import photo3 from '@/assets/extracted/image1_2_63.jpg';

// Gallery images
import gall1 from '@/assets/extracted/image2_2_63.jpg';
import gall2 from '@/assets/extracted/image3_2_63.jpg';
import gall3 from '@/assets/extracted/image4_2_63.jpg';
import gall4 from '@/assets/extracted/image5_2_63.png';

// ─── All Products ───────────────────────────────────────────────
export const ALL_PRODUCTS = [
  {
    id: 1,
    name: 'LINEN TRENCH COAT',
    price: 199,
    category: 'COATS',
    gender: 'men',
    color: 'beige',
    colors: [
      { name: 'beige', hex: '#ebe7db' },
      { name: 'grey', hex: '#A9A9A9' },
      { name: 'charcoal', hex: '#1E1E1E' }
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    status: 'NEW',
    rating: 5,
    image: coatImg,
    images: [coatImg, gall1, gall2, gall3, gall4],
    description: 'Relaxed-fitted regular collar trench coat in structured linen. Short sleeves with button-up front closure. Clean finished hem with minimal stitching details.',
    tag: 'NEW IN / COATS'
  },
  {
    id: 2,
    name: 'DOUBLE BREASTED WOOL SUIT',
    price: 249,
    category: 'SUITS',
    gender: 'women',
    color: 'black',
    colors: [
      { name: 'charcoal', hex: '#1E1E1E' },
      { name: 'black', hex: '#000000' },
      { name: 'grey', hex: '#A9A9A9' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    status: 'BEST SELLER',
    rating: 5,
    image: suitImg,
    images: [suitImg, gall1, gall2, gall3, gall4],
    description: 'Double breasted structured wool suit designed for a sharp, tailored silhouette. Features peak lapels, flap pockets, and single back vent.',
    tag: 'WOMEN / SUITS'
  },
  {
    id: 3,
    name: 'STRUCTURED OVERSIZED JACKET',
    price: 189,
    category: 'JACKETS',
    gender: 'women',
    color: 'beige',
    colors: [
      { name: 'beige', hex: '#ebe7db' },
      { name: 'mint', hex: '#A6D6CA' },
      { name: 'white', hex: '#FFFFFF' }
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    status: 'NEW',
    rating: 4,
    image: jacketImg,
    images: [jacketImg, gall1, gall2, gall3, gall4],
    description: 'Oversized profile utility jacket in heavy washed denim-cotton. Finished with a silver-tone button-up front and industrial patch pockets.',
    tag: 'WOMEN / OUTERWEAR'
  },
  {
    id: 4,
    name: 'EMBROIDERED SEERSUCKER SHIRT',
    price: 99,
    category: 'SHIRTS',
    gender: 'men',
    color: 'beige',
    colors: [
      { name: 'beige', hex: '#ebe7db' },
      { name: 'grey', hex: '#A9A9A9' },
      { name: 'charcoal', hex: '#1E1E1E' },
      { name: 'mint', hex: '#A6D6CA' },
      { name: 'white', hex: '#FFFFFF' },
      { name: 'lavender', hex: '#B9C1E8' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    status: 'NEW',
    rating: 4,
    image: item1,
    images: [item1, gall1, gall2, gall3, gall4],
    description: 'Relaxed-fitted regular collar shirt with short sleeves. Features a clean button-up front and a premium abstract print texture overlay.',
    tag: 'NEW IN / SHIRTS'
  },
  {
    id: 5,
    name: 'CASUAL OVERSIZED LINEN BLAZER',
    price: 149,
    category: 'JACKETS',
    gender: 'women',
    color: 'black',
    colors: [
      { name: 'black', hex: '#000000' },
      { name: 'charcoal', hex: '#1E1E1E' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    status: 'BEST SELLER',
    rating: 5,
    image: item2,
    images: [item2, gall1, gall2, gall3, gall4],
    description: 'Unstructured linen blazer with an relaxed oversized fit. Breathable summer weight weave with neat notch lapels and patch pockets.',
    tag: 'NEW IN / JACKETS'
  },
  {
    id: 6,
    name: 'RELAXED COTTON DRAWSTRING TROUSERS',
    price: 89,
    category: 'JEANS',
    gender: 'men',
    color: 'beige',
    colors: [
      { name: 'beige', hex: '#ebe7db' },
      { name: 'grey', hex: '#A9A9A9' }
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    status: 'NEW',
    rating: 4,
    image: item3,
    images: [item3, gall1, gall2, gall3, gall4],
    description: 'Comfort-fit trousers in heavy cotton twill. Featuring a flexible drawstring waistband, zip fly, and button fastening with side slip pockets.',
    tag: 'NEW IN / PANTS'
  },
  {
    id: 7,
    name: 'CLASSIC LEATHER STRAP SANDALS',
    price: 120,
    category: 'SHORTS',
    gender: 'women',
    color: 'black',
    colors: [
      { name: 'black', hex: '#000000' },
      { name: 'charcoal', hex: '#1E1E1E' }
    ],
    sizes: ['36', '37', '38', '39', '40', '41'],
    status: 'NEW',
    rating: 3,
    image: item4,
    images: [item4, gall1, gall2, gall3, gall4],
    description: 'Flat leather strap sandals crafted in Spain from premium calfskin. Styled with cross-over straps, gold-tone metal buckles, and a contoured footbed.',
    tag: 'NEW IN / ACCESSORIES'
  },
  {
    id: 8,
    name: 'TEXTURED CAMP COLLAR SHIRT',
    price: 79,
    category: 'POLOS',
    gender: 'men',
    color: 'beige',
    colors: [
      { name: 'beige', hex: '#ebe7db' },
      { name: 'white', hex: '#FFFFFF' }
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    status: 'BEST SELLER',
    rating: 5,
    image: photo1,
    images: [photo1, gall1, gall2, gall3, gall4],
    description: 'Camp collar shirt in a light waffle textured cotton weave. Short sleeves, boxy crop shape, and tonal buttons along the front.',
    tag: 'NEW IN / POLOS'
  },
  {
    id: 9,
    name: 'RELAXED LINEN TROUSERS',
    price: 110,
    category: 'JEANS',
    gender: 'women',
    color: 'beige',
    colors: [
      { name: 'beige', hex: '#ebe7db' },
      { name: 'white', hex: '#FFFFFF' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    status: 'NEW',
    rating: 4,
    image: photo2,
    images: [photo2, gall1, gall2, gall3, gall4],
    description: 'Wide leg trousers in pure lightweight Belgian linen. High-rise fit, belt loops, side slant pockets, and a button closure.',
    tag: 'NEW IN / PANTS'
  },
  {
    id: 10,
    name: 'FINE KNIT POLO SWEATER',
    price: 130,
    category: 'SWEATER',
    gender: 'men',
    color: 'black',
    colors: [
      { name: 'black', hex: '#000000' },
      { name: 'charcoal', hex: '#1E1E1E' }
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    status: 'BEST SELLER',
    rating: 4,
    image: photo3,
    images: [photo3, gall1, gall2, gall3, gall4],
    description: 'Long-sleeve polo knit sweater in ultra-soft merino wool. Features a classic collar, button placket, ribbed cuffs, and hem.',
    tag: 'MEN / SWEATER'
  }
];

// ─── Carousel Products (subset of ALL_PRODUCTS for home carousel) ───
export const CAROUSEL_PRODUCT_IDS = [4, 5, 6, 7, 8, 9];

// ─── Filter Options ─────────────────────────────────────────────
export const FILTER_SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL'];

export const FILTER_COLORS = [
  { name: 'beige', hex: '#ebe7db' },
  { name: 'grey', hex: '#A9A9A9' },
  { name: 'charcoal', hex: '#1E1E1E' },
  { name: 'black', hex: '#000000' },
  { name: 'mint', hex: '#A6D6CA' },
  { name: 'white', hex: '#FFFFFF' },
  { name: 'lavender', hex: '#B9C1E8' }
];

// ─── Cart Items (dummy defaults) ────────────────────────────────
export const INITIAL_CART_ITEMS = [
  { productId: 4, size: 'M', color: 'beige', quantity: 1 },
  { productId: 6, size: 'M', color: 'beige', quantity: 1 },
  { productId: 7, size: '37', color: 'black', quantity: 1 }
];

// Helper to resolve cart items with product data
export const getCartItemsWithProducts = () => {
  return INITIAL_CART_ITEMS
    .map(item => {
      const product = ALL_PRODUCTS.find(p => p.id === item.productId);
      if (!product) return null;
      return { product, size: item.size, color: item.color, quantity: item.quantity };
    })
    .filter(Boolean);
};

// ─── Default Order Data (fallback for PaymentSuccessPage) ───────
export const DEFAULT_ORDER_DATA = {
  orderId: 'NIX-308420',
  email: 'info@eternix.com',
  customerName: 'VASU BHALODIYA',
  phone: '+91 98765 43210',
  address: '45 Fashion Blvd, Design District, Gujarat - 360001, India',
  cartTotal: 308,
  cartItems: getCartItemsWithProducts()
};
