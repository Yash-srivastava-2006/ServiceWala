import React, { createContext, useContext, useState, useEffect } from 'react';
import { Service, Category, Booking, Review, FilterOptions } from '../types';
import { serviceService, categoryService, bookingService, reviewService } from '../services/database';
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
    if (user?.id) {
      loadUserBookings();
    } else {
      setUserBookings([]);
    }
  }, [user?.id]);

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
      const servicesData = await serviceService.getAllServices();
      setServices(servicesData);
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setIsLoadingServices(false);
    }
  };

  const loadUserBookings = async () => {
    if (!user?.id) return;
    
    setIsLoadingBookings(true);
    try {
      const bookingsData = await bookingService.getUserBookings(user.id);
      setUserBookings(bookingsData);
    } catch (error) {
      console.error('Error loading user bookings:', error);
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