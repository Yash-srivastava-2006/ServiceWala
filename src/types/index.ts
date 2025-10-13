export interface Service {
  id: string | number;
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
  name: string;
  email: string;
  avatar?: string;
  role: 'client' | 'provider';
  phone?: string;
  location?: string;
  joinedDate?: string;
  verified?: boolean;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role: 'client' | 'provider') => Promise<void>;
  logout: () => Promise<void> | void;
  updateProfile: (updates: Partial<User>) => void;
  isLoading: boolean;
  useFirebase?: boolean;
  toggleAuthMode?: () => void;
}

export interface FilterOptions {
  category: string;
  priceRange: string;
  rating: number;
  location: string;
}

export interface Booking {
  id: string;
  serviceId: string;
  serviceName: string;
  providerName: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  price: number;
  image: string;
  location: string;
}

export interface State {
  name: string;
  cities: string[];
}