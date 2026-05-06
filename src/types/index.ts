export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  priceUSD: number;
  originalPrice?: number;
  images: string[];
  category: string;
  stock: number;
  rating: number;
  reviewCount: number;
  isAffiliate: boolean;
  affiliateLink?: string;
  isActive: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  discount?: number;
  featured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  slug: string;
  productCount?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  isAdmin: boolean;
  addresses: Address[];
  createdAt: Date;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  country: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  currency: 'HTG' | 'USD';
  status: 'en_attente' | 'confirme' | 'en_cours' | 'livre' | 'annule';
  paymentMethod: string;
  paymentStatus: 'en_attente' | 'paye' | 'rembourse';
  address: Address;
  notes?: string;
  promoCode?: string;
  createdAt: Date;
  updatedAt: Date;
  trackingNumber?: string;
  deliveryType: 'standard' | 'express';
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface PromoCode {
  id: string;
  code: string;
  type: 'percent' | 'fixed';
  value: number;
  minOrder?: number;
  maxUses?: number;
  usedCount: number;
  isActive: boolean;
  expiresAt?: Date;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  isActive: boolean;
  order: number;
}

export interface Notification {
  id: string;
  type: 'order' | 'payment' | 'stock' | 'general';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

export type Currency = 'HTG' | 'USD';

export interface FilterState {
  category: string;
  minPrice: number;
  maxPrice: number;
  sort: 'newest' | 'price_asc' | 'price_desc' | 'popular' | 'rating';
  search: string;
}
