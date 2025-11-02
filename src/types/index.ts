export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  priceType: 'fixed' | 'hourly';
  duration: string;
  category: string;
  rating: number;
  reviewCount: number;
  images: string[];
  providerId: string;
  availability: string[];
  location: string;
  state: string;
  city: string;
  tags: string[];
  provider: {
    id: string;
    name: string;
    rating: number;
    completedJobs: number;
    bio: string;
    yearsExperience: number;
    verified: boolean;
    specialties: string[];
    reviewCount: number;
    avatar: string;
    location: string;
  };
}

export interface User {
  id: string;
  firebase_uid?: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'client' | 'provider'; // client = customer, provider = service provider
  phone?: string;
  location?: string;
  city?: string;
  state?: string;
  joinedDate?: string;
  verified?: boolean;
  // Provider specific fields
  bio?: string;
  experienceYears?: number;
  specialties?: string[];
  skills?: string[];
  completedJobs?: number;
  rating?: number;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role?: 'client' | 'provider') => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  signup: (name: string, email: string, password: string, role: 'client' | 'provider') => Promise<void>;
  logout: () => Promise<void> | void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  isLoading: boolean;
  // Authentication is Firebase-only in production builds
}

export interface FilterOptions {
  category?: string;
  priceRange?: string;
  rating?: number;
  location?: string;
  city?: string;
  state?: string;
  query?: string;
}

export interface Booking {
  id: string;
  serviceId: string;
  serviceName: string;
  userId: string;
  providerName: string;
  providerId: string;
  date: string;
  time: string;
  status: 'pending' | 'approved' | 'rejected' | 'in_progress' | 'completed' | 'cancelled';
  price: number;
  image: string;
  location: string;
  specialInstructions?: string;
  estimatedDuration?: number;
  customerName?: string;
  requestedAt?: string;
  respondedAt?: string;
}

export interface State {
  name: string;
  cities: string[];
}

// Add these essential interfaces that match your database
export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  isActive: boolean;
}

export interface Review {
  id: string;
  userId: string;
  providerId: string;
  serviceId?: string;
  bookingId?: string;
  rating: number;
  comment: string;
  date: string;
  userName: string;
  userAvatar?: string;
  verified?: boolean;
}