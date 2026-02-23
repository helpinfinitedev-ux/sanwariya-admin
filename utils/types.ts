export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Category {
  _id: string;
  name: string;
  description?: string;
}

export interface Product {
  _id: string;
  name: string;
  description?: string;
  images: string[];
  price: number;
  category: Category | string;
  sold?: number;
  createdAt: string;
}

export interface Testimonial {
  _id: string;
  rating: number;
  comment: string;
  images?: string[];
  createdAt: string;
  title?: string;
  url?: string;
}
