export interface User {
    id: string;
    name: string;
    email: string;
    type: 'provider' | 'customer';
    avatar?: string;
    phone?: string;
    location?: string;
  }
  
  export interface Service {
    id: string;
    title: string;
    description: string;
    category: string;
    price: number;
    priceType: 'hour' | 'fixed' | 'day';
    providerId: string;
    provider: ServiceProvider;
    images: string[];
    rating: number;
    reviewCount: number;
    availability: string[];
    location: string;
    tags: string[];
  }
  
  export interface ServiceProvider {
    id: string;
    name: string;
    avatar: string;
    bio: string;
    rating: number;
    reviewCount: number;
    yearsExperience: number;
    location: string;
    verified: boolean;
    specialties: string[];
    completedJobs: number;
  }
  
  export interface Booking {
    id: string;
    serviceId: string;
    customerId: string;
    providerId: string;
    date: string;
    time: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    message?: string;
    totalAmount: number;
  }
  
  export interface Review {
    id: string;
    serviceId: string;
    customerId: string;
    customerName: string;
    rating: number;
    comment: string;
    date: string;
  }