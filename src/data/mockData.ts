import { Store, Product } from '../types';

export const MOCK_STORES: Store[] = [
  {
    id: 'store-1',
    name: 'Metropolis Wear',
    category: 'Contemporary',
    rating: 4.8,
    address: 'High Street, Lower Parel',
    location: { lat: 18.99, lng: 72.82 },
    image: 'https://picsum.photos/seed/urban-shop/800/600'
  },
  {
    id: 'store-2',
    name: 'Denim Depot',
    category: 'Streetwear',
    rating: 4.5,
    address: 'Hill Road, Bandra West',
    location: { lat: 19.05, lng: 72.83 },
    image: 'https://picsum.photos/seed/storefront/800/600'
  },
  {
    id: 'store-3',
    name: 'Classic Cuts',
    category: 'Luxury',
    rating: 4.9,
    address: 'Fort, South Mumbai',
    location: { lat: 18.93, lng: 72.83 },
    image: 'https://picsum.photos/seed/luxury-facade/800/600'
  },
  {
    id: 'store-4',
    name: 'Everyday Style',
    category: 'Contemporary',
    rating: 4.2,
    address: 'Colaba Causeway',
    location: { lat: 18.91, lng: 72.83 },
    image: 'https://picsum.photos/seed/boutique-building/800/600'
  },
  {
    id: 'store-5',
    name: 'Sneaker Station',
    category: 'Streetwear',
    rating: 4.4,
    address: 'Juhu Tara Road',
    location: { lat: 19.10, lng: 72.82 },
    image: 'https://picsum.photos/seed/modern-shop/800/600'
  },
  {
    id: 'store-6',
    name: 'Regal Fashions',
    category: 'Luxury',
    rating: 4.7,
    address: 'Worli Sea Face',
    location: { lat: 19.01, lng: 72.81 },
    image: 'https://picsum.photos/seed/elegant-store/800/600'
  }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    storeId: 'store-1',
    name: 'Cotton Shirt',
    description: 'Black slim-fit cotton shirt.',
    price: 2500,
    images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=600'],
    sizes: ['S', 'M', 'L'],
    category: 'Tops',
    inStock: true
  },
  {
    id: 'p2',
    storeId: 'store-1',
    name: 'Blue Jeans',
    description: 'Straight-leg denim jeans.',
    price: 4500,
    images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=600'],
    sizes: ['30', '32', '34'],
    category: 'Bottoms',
    inStock: true
  },
  {
    id: 'p3',
    storeId: 'store-2',
    name: 'White T-Shirt',
    description: 'Oversized heavy cotton tee.',
    price: 1500,
    images: ['https://images.unsplash.com/photo-1521572267360-ee072958f233?auto=format&fit=crop&q=80&w=600'],
    sizes: ['M', 'L', 'XL'],
    category: 'Tops',
    inStock: true
  },
  {
    id: 'p4',
    storeId: 'store-2',
    name: 'Cargo Pants',
    description: 'Green multi-pocket trousers.',
    price: 3800,
    images: ['https://images.unsplash.com/photo-1603953721323-eb1c303126be?auto=format&fit=crop&q=80&w=600'],
    sizes: ['S', 'M', 'L'],
    category: 'Bottoms',
    inStock: true
  },
  {
    id: 'p5',
    storeId: 'store-3',
    name: 'Evening Dress',
    description: 'Silk midi dress for events.',
    price: 8500,
    images: ['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=600'],
    sizes: ['XS', 'S', 'M'],
    category: 'Dresses',
    inStock: true
  },
  {
    id: 'p6',
    storeId: 'store-3',
    name: 'Leather Belt',
    description: 'Genuine brown leather belt.',
    price: 1800,
    images: ['https://images.unsplash.com/photo-1624222247344-550fb80f02d4?auto=format&fit=crop&q=80&w=600'],
    sizes: ['32', '34', '36'],
    category: 'Accessories',
    inStock: true
  },
  {
    id: 'p7',
    storeId: 'store-4',
    name: 'Casual Jacket',
    description: 'Beige lightweight harrington jacket.',
    price: 5500,
    images: ['https://images.unsplash.com/photo-1591047139829-d91aec36beea?auto=format&fit=crop&q=80&w=600'],
    sizes: ['M', 'L', 'XL'],
    category: 'Outerwear',
    inStock: true
  },
  {
    id: 'p8',
    storeId: 'store-5',
    name: 'White Sneakers',
    description: 'Clean minimalist low-top sneakers.',
    price: 6500,
    images: ['https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=600'],
    sizes: ['8', '9', '10', '11'],
    category: 'Footwear',
    inStock: true
  },
  {
    id: 'p9',
    storeId: 'store-6',
    name: 'Formal Suit',
    description: 'Dark grey two-piece tailored suit.',
    price: 15000,
    images: ['https://images.unsplash.com/photo-1594932224010-379e4a30e8c7?auto=format&fit=crop&q=80&w=600'],
    sizes: ['40', '42', '44'],
    category: 'Formal',
    inStock: true
  },
  {
    id: 'p10',
    storeId: 'store-1',
    name: 'Winter Coat',
    description: 'Wool blend overcoat in camel.',
    price: 12000,
    images: ['https://images.unsplash.com/photo-1539533377240-6239f509a25d?auto=format&fit=crop&q=80&w=600'],
    sizes: ['M', 'L'],
    category: 'Outerwear',
    inStock: true
  }
];
