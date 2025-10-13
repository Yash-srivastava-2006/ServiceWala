import { supabase, TABLES } from '../config/supabase';
import { User, Service, Booking, Review, Category } from '../types';

// User Services
export const userService = {
  // Create or update user in Supabase when they sign up/login with Firebase
  async upsertUser(userData: Partial<User>): Promise<User | null> {
    try {
      const { data, error } = await (supabase
        .from(TABLES.USERS) as any)
        .upsert([{
          firebase_uid: userData.firebase_uid,
          name: userData.name,
          email: userData.email,
          avatar: userData.avatar,
          role: userData.role || 'client',
          phone: userData.phone,
          location: userData.location,
          city: userData.city,
          state: userData.state,
          verified: userData.verified || false,
          bio: userData.bio,
          experience_years: userData.experienceYears || 0,
          specialties: userData.specialties || [],
          skills: userData.skills || [],
          completed_jobs: userData.completedJobs || 0,
          rating: userData.rating || 0.0,
          updated_at: new Date().toISOString()
        }], {
          onConflict: 'firebase_uid'
        })
        .select()
        .single();

      if (error) throw error;
      return this.transformUserFromDB(data);
    } catch (error) {
      console.error('Error upserting user:', error);
      return null;
    }
  },

  async getUserByFirebaseUid(firebaseUid: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .eq('firebase_uid', firebaseUid)
        .single();

      if (error) throw error;
      return this.transformUserFromDB(data);
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  },

  async updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
    try {
      const { data, error } = await (supabase
        .from(TABLES.USERS) as any)
        .update({
          name: updates.name,
          phone: updates.phone,
          location: updates.location,
          city: updates.city,
          state: updates.state,
          bio: updates.bio,
          experience_years: updates.experienceYears,
          specialties: updates.specialties,
          skills: updates.skills,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return this.transformUserFromDB(data);
    } catch (error) {
      console.error('Error updating user:', error);
      return null;
    }
  },

  // Transform database user to frontend User type
  transformUserFromDB(dbUser: any): User {
    return {
      id: dbUser.user_id,
      firebase_uid: dbUser.firebase_uid,
      name: dbUser.name,
      email: dbUser.email,
      avatar: dbUser.avatar,
      role: dbUser.role,
      phone: dbUser.phone,
      location: dbUser.location,
      city: dbUser.city,
      state: dbUser.state,
      joinedDate: dbUser.created_at,
      verified: dbUser.verified,
      bio: dbUser.bio,
      experienceYears: dbUser.experience_years,
      specialties: dbUser.specialties,
      skills: dbUser.skills,
      completedJobs: dbUser.completed_jobs,
      rating: dbUser.rating
    };
  }
};

// Category Services
export const categoryService = {
  async getAllCategories(): Promise<Category[]> {
    try {
      const { data, error } = await supabase
        .from(TABLES.CATEGORIES)
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      return data.map(this.transformCategoryFromDB);
    } catch (error) {
      console.error('Error getting categories:', error);
      return [];
    }
  },

  transformCategoryFromDB(dbCategory: any): Category {
    return {
      id: dbCategory.category_id,
      name: dbCategory.name,
      description: dbCategory.description,
      icon: dbCategory.icon,
      isActive: dbCategory.is_active
    };
  }
};

// Service Services
export const serviceService = {
  async getAllServices(filters?: {
    category?: string;
    city?: string;
    state?: string;
    query?: string;
  }): Promise<Service[]> {
    try {
      let query = supabase
        .from(TABLES.SERVICES)
        .select(`
          *,
          provider:users!services_provider_id_fkey(*),
          category:categories!services_category_id_fkey(*)
        `)
        .eq('is_active', true);

      // Apply filters
      if (filters?.category) {
        query = query.eq('categories.name', filters.category);
      }
      if (filters?.city) {
        query = query.eq('city', filters.city);
      }
      if (filters?.state) {
        query = query.eq('state', filters.state);
      }
      if (filters?.query) {
        query = query.or(`title.ilike.%${filters.query}%,description.ilike.%${filters.query}%`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data.map(this.transformServiceFromDB);
    } catch (error) {
      console.error('Error getting services:', error);
      return [];
    }
  },

  async getServiceById(serviceId: string): Promise<Service | null> {
    try {
      const { data, error } = await supabase
        .from(TABLES.SERVICES)
        .select(`
          *,
          provider:users!services_provider_id_fkey(*),
          category:categories!services_category_id_fkey(*)
        `)
        .eq('service_id', serviceId)
        .single();

      if (error) throw error;
      return this.transformServiceFromDB(data);
    } catch (error) {
      console.error('Error getting service:', error);
      return null;
    }
  },

  async getServicesByProvider(providerId: string): Promise<Service[]> {
    try {
      const { data, error } = await supabase
        .from(TABLES.SERVICES)
        .select(`
          *,
          provider:users!services_provider_id_fkey(*),
          category:categories!services_category_id_fkey(*)
        `)
        .eq('provider_id', providerId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data.map(this.transformServiceFromDB);
    } catch (error) {
      console.error('Error getting provider services:', error);
      return [];
    }
  },

  transformServiceFromDB(dbService: any): Service {
    return {
      id: dbService.service_id,
      title: dbService.title,
      description: dbService.description,
      price: Number(dbService.price),
      priceType: dbService.price_type,
      duration: dbService.duration,
      category: dbService.category?.name || '',
      rating: Number(dbService.rating),
      reviewCount: dbService.review_count,
      images: dbService.images || [],
      providerId: dbService.provider_id,
      availability: dbService.availability || [],
      location: dbService.location,
      state: dbService.state,
      city: dbService.city,
      tags: dbService.tags || [],
      provider: {
        id: dbService.provider.user_id,
        name: dbService.provider.name,
        rating: Number(dbService.provider.rating),
        completedJobs: dbService.provider.completed_jobs,
        bio: dbService.provider.bio || '',
        yearsExperience: dbService.provider.experience_years,
        verified: dbService.provider.verified,
        specialties: dbService.provider.specialties || [],
        reviewCount: 0, // Calculate separately if needed
        avatar: dbService.provider.avatar || '',
        location: dbService.provider.location || ''
      }
    };
  }
};

// Booking Services
export const bookingService = {
  async createBooking(bookingData: Omit<Booking, 'id'>): Promise<Booking | null> {
    try {
      const { data, error } = await (supabase
        .from(TABLES.BOOKINGS) as any)
        .insert({
          user_id: bookingData.providerId, // This should be the actual user_id
          service_id: bookingData.serviceId,
          provider_id: bookingData.providerId,
          service_name: bookingData.serviceName,
          provider_name: bookingData.providerName,
          booking_date: bookingData.date,
          booking_time: bookingData.time,
          status: bookingData.status,
          price: bookingData.price,
          image: bookingData.image,
          location: bookingData.location,
          special_instructions: bookingData.specialInstructions,
          estimated_duration: bookingData.estimatedDuration
        })
        .select()
        .single();

      if (error) throw error;
      return this.transformBookingFromDB(data);
    } catch (error) {
      console.error('Error creating booking:', error);
      return null;
    }
  },

  async getUserBookings(userId: string): Promise<Booking[]> {
    try {
      const { data, error } = await supabase
        .from(TABLES.BOOKINGS)
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data.map(this.transformBookingFromDB);
    } catch (error) {
      console.error('Error getting user bookings:', error);
      return [];
    }
  },

  async updateBookingStatus(bookingId: string, status: Booking['status']): Promise<boolean> {
    try {
      const { error } = await (supabase
        .from(TABLES.BOOKINGS) as any)
        .update({ status, updated_at: new Date().toISOString() })
        .eq('booking_id', bookingId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating booking status:', error);
      return false;
    }
  },

  transformBookingFromDB(dbBooking: any): Booking {
    return {
      id: dbBooking.booking_id,
      serviceId: dbBooking.service_id,
      serviceName: dbBooking.service_name,
      providerName: dbBooking.provider_name,
      providerId: dbBooking.provider_id,
      date: dbBooking.booking_date,
      time: dbBooking.booking_time,
      status: dbBooking.status,
      price: Number(dbBooking.price),
      image: dbBooking.image,
      location: dbBooking.location,
      specialInstructions: dbBooking.special_instructions,
      estimatedDuration: dbBooking.estimated_duration
    };
  }
};

// Review Services
export const reviewService = {
  async getServiceReviews(serviceId: string): Promise<Review[]> {
    try {
      const { data, error } = await supabase
        .from(TABLES.REVIEWS)
        .select('*')
        .eq('service_id', serviceId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data.map(this.transformReviewFromDB);
    } catch (error) {
      console.error('Error getting reviews:', error);
      return [];
    }
  },

  async createReview(reviewData: Omit<Review, 'id' | 'date'>): Promise<Review | null> {
    try {
      const { data, error } = await (supabase
        .from(TABLES.REVIEWS) as any)
        .insert({
          user_id: reviewData.userId,
          provider_id: reviewData.providerId,
          service_id: reviewData.serviceId,
          booking_id: reviewData.bookingId,
          rating: reviewData.rating,
          comment: reviewData.comment,
          user_name: reviewData.userName,
          user_avatar: reviewData.userAvatar,
          verified: reviewData.verified || false
        })
        .select()
        .single();

      if (error) throw error;
      return this.transformReviewFromDB(data);
    } catch (error) {
      console.error('Error creating review:', error);
      return null;
    }
  },

  transformReviewFromDB(dbReview: any): Review {
    return {
      id: dbReview.review_id,
      userId: dbReview.user_id,
      providerId: dbReview.provider_id,
      serviceId: dbReview.service_id,
      bookingId: dbReview.booking_id,
      rating: dbReview.rating,
      comment: dbReview.comment,
      date: dbReview.created_at,
      userName: dbReview.user_name,
      userAvatar: dbReview.user_avatar,
      verified: dbReview.verified
    };
  }
};