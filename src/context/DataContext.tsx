import React, { createContext, useContext, useState, useEffect } from 'react';
import { Service, Category, Booking, Review, FilterOptions } from '../types';
import { serviceService, categoryService, bookingService, reviewService, userService } from '../services/database';
import { useAuth } from './AuthContext';

interface DataContextType {
  // Services
  services: Service[];
  categories: Category[];
  filteredServices: Service[];
  isLoadingServices: boolean;
  
  // Bookings
  userBookings: Booking[];
  isLoadingBookings: boolean;
  
  // Actions
  searchServices: (filters: FilterOptions) => void;
  getServiceById: (id: string) => Service | undefined;
  refreshServices: () => Promise<void>;
  refreshBookings: () => Promise<void>;
  createBooking: (booking: Omit<Booking, 'id'>) => Promise<boolean>;
  updateBookingStatus: (bookingId: string, status: Booking['status']) => Promise<boolean>;
  
  // Reviews
  getServiceReviews: (serviceId: string) => Promise<Review[]>;
  createReview: (review: Omit<Review, 'id' | 'date'>) => Promise<boolean>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  // State
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(false);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<FilterOptions>({});

  // Load initial data
  useEffect(() => {
    loadCategories();
    loadServices();
  }, []);

  // Load user bookings when user changes
  useEffect(() => {
    if (user?.firebase_uid) {
      loadUserBookings();
    } else {
      setUserBookings([]);
    }
  }, [user?.firebase_uid]);

  // Filter services when services or filters change
  useEffect(() => {
    applyFilters();
  }, [services, currentFilters]);

  const loadCategories = async () => {
    try {
      const categoriesData = await categoryService.getAllCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadServices = async () => {
    setIsLoadingServices(true);
    try {
      console.log('DataContext: Starting to load services...');
      
      // First test the database connection
      const connectionTest = await serviceService.testConnection();
      console.log('Database connection test result:', connectionTest);
      
      if (!connectionTest.success) {
        console.warn('Database connection failed, using mock data:', connectionTest.error);
        
        // Show helpful message for configuration issues
        if (connectionTest.error?.includes('configuration missing')) {
          console.warn('🔧 SETUP REQUIRED: Create a .env file with your Supabase credentials');
          console.warn('📋 Copy .env.example to .env and fill in your Supabase project details');
          console.warn('🎯 Using mock data for now - services will work but data won\'t persist');
        }
        
        const { mockServices } = await import('../data/mockData');
        const convertedMockServices = mockServices.map(service => ({
          ...service,
          id: service.id.toString()
        }));
        setServices(convertedMockServices);
        return;
      }

      if (connectionTest.count === 0) {
        console.warn('Database is empty (no services found), using mock data');
        const { mockServices } = await import('../data/mockData');
        const convertedMockServices = mockServices.map(service => ({
          ...service,
          id: service.id.toString()
        }));
        setServices(convertedMockServices);
        return;
      }

      // Try to load services from database
      console.log('Loading services from database...');
      const servicesData = await serviceService.getAllServices();
      
      if (servicesData.length > 0) {
        console.log('Successfully loaded', servicesData.length, 'services from database');
        setServices(servicesData);
      } else {
        console.warn('No services returned from database, using mock data');
        const { mockServices } = await import('../data/mockData');
        const convertedMockServices = mockServices.map(service => ({
          ...service,
          id: service.id.toString()
        }));
        setServices(convertedMockServices);
      }
    } catch (error) {
      console.error('Error loading services:', error);
      console.log('Falling back to mock data due to error');
      
      // Fallback to mock data on error
      try {
        const { mockServices } = await import('../data/mockData');
        const convertedMockServices = mockServices.map(service => ({
          ...service,
          id: service.id.toString()
        }));
        setServices(convertedMockServices);
      } catch (mockError) {
        console.error('Error loading mock data:', mockError);
        setServices([]);
      }
    } finally {
      setIsLoadingServices(false);
    }
  };

  const loadUserBookings = async () => {
    if (!user?.firebase_uid) return;
    
    setIsLoadingBookings(true);
    try {
      console.log('Loading bookings for user with firebase_uid:', user.firebase_uid);
      // First get the user's database ID from their firebase_uid
      const dbUser = await userService.getUserByFirebaseUid(user.firebase_uid);
      if (dbUser?.id) {
        console.log('Found database user ID:', dbUser.id);
        const bookingsData = await bookingService.getUserBookings(dbUser.id);
        setUserBookings(bookingsData);
      } else {
        console.warn('No database user found for firebase_uid:', user.firebase_uid);
        setUserBookings([]);
      }
    } catch (error) {
      console.error('Error loading user bookings:', error);
      setUserBookings([]);
    } finally {
      setIsLoadingBookings(false);
    }
  };

  const searchServices = (filters: FilterOptions) => {
    setCurrentFilters(filters);
  };

  const applyFilters = () => {
    let filtered = [...services];

    // Apply text search
    if (currentFilters.query) {
      const query = currentFilters.query.toLowerCase();
      filtered = filtered.filter(service => 
        service.title.toLowerCase().includes(query) ||
        service.description.toLowerCase().includes(query) ||
        service.category.toLowerCase().includes(query) ||
        service.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply category filter
    if (currentFilters.category && currentFilters.category !== '') {
      filtered = filtered.filter(service => service.category === currentFilters.category);
    }

    // Apply location filters
    if (currentFilters.location && currentFilters.location !== '') {
      filtered = filtered.filter(service => 
        service.location.toLowerCase().includes(currentFilters.location!.toLowerCase()) ||
        service.city.toLowerCase().includes(currentFilters.location!.toLowerCase()) ||
        service.state.toLowerCase().includes(currentFilters.location!.toLowerCase())
      );
    }

    if (currentFilters.city && currentFilters.city !== '') {
      filtered = filtered.filter(service => service.city === currentFilters.city);
    }

    if (currentFilters.state && currentFilters.state !== '') {
      filtered = filtered.filter(service => service.state === currentFilters.state);
    }

    // Apply rating filter
    if (currentFilters.rating && currentFilters.rating > 0) {
      filtered = filtered.filter(service => service.rating >= currentFilters.rating!);
    }

    // Apply price range filter
    if (currentFilters.priceRange && currentFilters.priceRange !== '') {
      const [min, max] = currentFilters.priceRange.split('-').map(Number);
      if (max) {
        filtered = filtered.filter(service => service.price >= min && service.price <= max);
      } else {
        filtered = filtered.filter(service => service.price >= min);
      }
    }

    setFilteredServices(filtered);
  };

  const getServiceById = (id: string): Service | undefined => {
    return services.find(service => service.id === id);
  };

  const refreshServices = async () => {
    await loadServices();
  };

  const refreshBookings = async () => {
    await loadUserBookings();
  };

  const createBooking = async (booking: Omit<Booking, 'id'>): Promise<boolean> => {
    try {
      const newBooking = await bookingService.createBooking(booking);
      if (newBooking) {
        setUserBookings(prev => [newBooking, ...prev]);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error creating booking:', error);
      return false;
    }
  };

  const updateBookingStatus = async (bookingId: string, status: Booking['status']): Promise<boolean> => {
    try {
      const success = await bookingService.updateBookingStatus(bookingId, status);
      if (success) {
        setUserBookings(prev => 
          prev.map(booking => 
            booking.id === bookingId ? { ...booking, status } : booking
          )
        );
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating booking status:', error);
      return false;
    }
  };

  const getServiceReviews = async (serviceId: string): Promise<Review[]> => {
    try {
      return await reviewService.getServiceReviews(serviceId);
    } catch (error) {
      console.error('Error getting service reviews:', error);
      return [];
    }
  };

  const createReview = async (review: Omit<Review, 'id' | 'date'>): Promise<boolean> => {
    try {
      const newReview = await reviewService.createReview(review);
      return !!newReview;
    } catch (error) {
      console.error('Error creating review:', error);
      return false;
    }
  };

  const value: DataContextType = {
    // Services
    services,
    categories,
    filteredServices,
    isLoadingServices,
    
    // Bookings
    userBookings,
    isLoadingBookings,
    
    // Actions
    searchServices,
    getServiceById,
    refreshServices,
    refreshBookings,
    createBooking,
    updateBookingStatus,
    
    // Reviews
    getServiceReviews,
    createReview
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};