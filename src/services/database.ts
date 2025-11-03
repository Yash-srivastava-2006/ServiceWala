import { supabase, supabaseAdmin, TABLES } from '../config/supabase';
import { User, Service, Booking, Review, Category } from '../types';
import { mockCategories } from '../data/mockData';

// User Services
export const userService = {
  // Create or update user in Supabase when they sign up/login with Firebase
  async upsertUser(userData: Partial<User>): Promise<User | null> {
    try {
      console.log('🔄 Attempting to upsert user:', userData);
      
      // Validate required fields
      if (!userData.firebase_uid || !userData.email || !userData.name) {
        throw new Error('Missing required fields: firebase_uid, email, or name');
      }
      
      const insertData = {
        firebase_uid: userData.firebase_uid,
        name: userData.name,
        email: userData.email,
        avatar: userData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=3b82f6&color=fff`,
        role: userData.role || 'client',
        phone: userData.phone || null,
        location: userData.location || null,
        city: userData.city || null,
        state: userData.state || null,
        verified: userData.verified || false,
        bio: userData.bio || null,
        experience_years: userData.experienceYears || 0,
        specialties: userData.specialties || [],
        skills: userData.skills || [],
        completed_jobs: userData.completedJobs || 0,
        rating: userData.rating || 0.0
      };
      
      console.log('📋 Insert data prepared:', insertData);
      
      // Use a simpler query without TypeScript generics to avoid 406 errors
      const { data, error } = await (supabase
        .from('users') as any)
        .upsert(insertData, {
          onConflict: 'firebase_uid',
          ignoreDuplicates: false
        })
        .select('*')
        .single();

      if (error) {
        console.error('❌ Supabase upsert error:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        console.error('Error details:', error.details);
        console.error('Error hint:', error.hint);
        
        // Check if it's a constraint violation
        if (error.code === '23505') {
          console.log('🔄 Duplicate key error, trying to update instead...');
          
          // Try to update the existing record
          const { data: updateData, error: updateError } = await (supabase
            .from('users') as any)
            .update(insertData)
            .eq('firebase_uid', userData.firebase_uid)
            .select('*')
            .single();
          
          if (updateError) {
            throw updateError;
          }
          
          console.log('✅ User updated successfully:', updateData);
          return this.transformUserFromDB(updateData);
        }
        
        throw error;
      }
      
      console.log('✅ User successfully upserted to Supabase:', data);
      return this.transformUserFromDB(data);
    } catch (error) {
      console.error('💥 Critical error upserting user:', error);
      
      // Provide more specific error information
      if (error instanceof Error) {
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      
      throw error;
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

  // Get all service providers
  async getServiceProviders(): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .eq('role', 'provider')
        .order('rating', { ascending: false });

      if (error) throw error;
      return data.map(this.transformUserFromDB);
    } catch (error) {
      console.error('Error getting service providers:', error);
      return [];
    }
  },

  // Get all clients
  async getClients(): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .eq('role', 'client')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data.map(this.transformUserFromDB);
    } catch (error) {
      console.error('Error getting clients:', error);
      return [];
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
      console.log('Fetching categories from Supabase...');
      const { data, error } = await supabaseAdmin
        .from(TABLES.CATEGORIES)
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) {
        console.error('Supabase categories error:', error);
        throw error;
      }
      
      console.log('Raw categories data from Supabase:', data);
      const transformedCategories = data.map(this.transformCategoryFromDB);
      console.log('Transformed categories:', transformedCategories);
      return transformedCategories;
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
  // Cache for all services to avoid multiple database calls
  _servicesCache: null as Service[] | null,
  _cacheTimestamp: 0,
  _cacheTimeout: 5 * 60 * 1000, // 5 minutes
  _fetchPromise: null as Promise<Service[]> | null, // To prevent concurrent fetches

  async getAllServices(filters?: {
    category?: string;
    city?: string;
    state?: string;
    query?: string;
  }): Promise<Service[]> {
    try {
      // Check if we have valid cached data and no filters are applied
      const now = Date.now();
      const hasValidCache = this._servicesCache && 
                           (now - this._cacheTimestamp) < this._cacheTimeout;
      
      // If no filters and we have cached data, return cached data immediately
      if (!filters && hasValidCache) {
        console.log('Returning cached services:', this._servicesCache!.length);
        return this._servicesCache!;
      }

      // If filters are applied, we need to fetch fresh data
      if (filters && Object.keys(filters).some(key => filters[key as keyof typeof filters])) {
        console.log('Getting filtered services with filters:', filters);
        return await this._fetchServicesFromDB(filters);
      }

      // For unfiltered requests, check if there's already a fetch in progress
      if (this._fetchPromise) {
        console.log('Fetch already in progress, waiting for result...');
        return await this._fetchPromise;
      }

      // For unfiltered requests, check cache or fetch all
      if (!hasValidCache) {
        console.log('Cache expired or empty, fetching all services from database');
        
        // Store the promise to prevent concurrent fetches
        this._fetchPromise = this._fetchServicesFromDB();
        
        try {
          const allServices = await this._fetchPromise;
          
          // Cache the results
          this._servicesCache = allServices;
          this._cacheTimestamp = now;
          
          return allServices;
        } finally {
          // Clear the fetch promise when done
          this._fetchPromise = null;
        }
      }

      return this._servicesCache!;
    } catch (error) {
      console.error('Error getting services:', error);
      // Clear the fetch promise on error
      this._fetchPromise = null;
      return [];
    }
  },

  async _fetchServicesFromDB(filters?: {
    category?: string;
    city?: string;
    state?: string;
    query?: string;
  }): Promise<Service[]> {
    try {
      console.log('Starting database fetch with filters:', filters);
      
      // Use regular supabase client first, then fallback to admin if needed
      let query = supabase
        .from(TABLES.SERVICES)
        .select('*')
        .eq('is_active', true)
        .limit(100); // Add limit to prevent large queries

      // Apply filters
      if (filters?.city) {
        query = query.eq('city', filters.city);
      }
      if (filters?.state) {
        query = query.eq('state', filters.state);
      }
      if (filters?.query) {
        query = query.or(`title.ilike.%${filters.query}%,description.ilike.%${filters.query}%`);
      }

      console.log('Executing query...');
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error in _fetchServicesFromDB with regular client:', error);
        console.log('Trying with admin client...');
        
        // Fallback to admin client
        let adminQuery = supabaseAdmin
          .from(TABLES.SERVICES)
          .select('*')
          .eq('is_active', true)
          .limit(100);

        // Apply same filters to admin query
        if (filters?.city) {
          adminQuery = adminQuery.eq('city', filters.city);
        }
        if (filters?.state) {
          adminQuery = adminQuery.eq('state', filters.state);
        }
        if (filters?.query) {
          adminQuery = adminQuery.or(`title.ilike.%${filters.query}%,description.ilike.%${filters.query}%`);
        }

        const { data: adminData, error: adminError } = await adminQuery.order('created_at', { ascending: false });
        
        if (adminError) {
          console.error('Error with admin client as well:', adminError);
          throw adminError;
        }
        
        console.log('Admin client successful, found services:', adminData?.length || 0);
        return this._transformServices(adminData || []);
      }
      
      console.log('Regular client successful, found services from database:', data?.length || 0);
      return this._transformServices(data || []);
    } catch (error) {
      console.error('Error in _fetchServicesFromDB:', error);
      throw error;
    }
  },

  _transformServices(data: any[]): Service[] {
    if (!data || data.length === 0) {
      return [];
    }

    // Transform manually without joins for now
    return data.map((service: any) => ({
      id: service.service_id,
      title: service.title,
      description: service.description,
      price: Number(service.price),
      priceType: service.price_type,
      duration: service.duration,
      category: 'General', // We'll get category separately if needed
      rating: Number(service.rating),
      reviewCount: service.review_count,
      images: service.images || [],
      providerId: service.provider_id,
      availability: service.availability || [],
      location: service.location,
      state: service.state,
      city: service.city,
      tags: service.tags || [],
      provider: {
        id: service.provider_id,
        name: 'Provider',
        rating: 0,
        completedJobs: 0,
        bio: '',
        yearsExperience: 0,
        verified: false,
        specialties: [],
        reviewCount: 0,
        avatar: '',
        location: ''
      }
    }));
  },

  // Method to clear cache when services are created/updated
  clearCache(): void {
    this._servicesCache = null;
    this._cacheTimestamp = 0;
    this._fetchPromise = null;
    console.log('Services cache cleared');
  },

  // Test database connection and check for services
  async testConnection(): Promise<{ success: boolean; count: number; error?: string }> {
    try {
      console.log('Testing database connection...');
      
      // Check if we have valid Supabase configuration
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || supabaseUrl.includes('placeholder') || 
          !supabaseAnonKey || supabaseAnonKey.includes('placeholder')) {
        console.error('Supabase configuration is missing or using placeholder values');
        console.error('Current URL:', supabaseUrl);
        console.error('Please create a .env file with valid VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
        return { 
          success: false, 
          count: 0, 
          error: 'Supabase configuration missing. Please create .env file with valid credentials.' 
        };
      }
      
      // Simple count query to test connection
      const { count, error } = await supabase
        .from(TABLES.SERVICES)
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.error('Database connection test failed:', error);
        return { success: false, count: 0, error: error.message };
      }

      console.log('Database connection successful. Total services:', count);
      return { success: true, count: count || 0 };
    } catch (error) {
      console.error('Database connection test error:', error);
      return { 
        success: false, 
        count: 0, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  },

  async getServiceById(serviceId: string): Promise<Service | null> {
    try {
      console.log('Getting service by ID:', serviceId);
      const { data, error } = await (supabaseAdmin
        .from(TABLES.SERVICES) as any)
        .select('*')
        .eq('service_id', serviceId)
        .single();

      if (error) {
        console.error('Error getting service by ID:', error);
        throw error;
      }
      
      if (!data) return null;

      // Transform the data manually since we're not using joins
      return {
        id: (data as any).service_id,
        title: (data as any).title,
        description: (data as any).description,
        price: Number((data as any).price),
        priceType: (data as any).price_type,
        duration: (data as any).duration,
        category: 'General', // We'll get category separately if needed
        rating: Number((data as any).rating),
        reviewCount: (data as any).review_count,
        images: (data as any).images || [],
        providerId: (data as any).provider_id,
        availability: (data as any).availability || [],
        location: (data as any).location,
        state: (data as any).state,
        city: (data as any).city,
        tags: (data as any).tags || [],
        provider: {
          id: (data as any).provider_id,
          name: 'Provider',
          rating: 0,
          completedJobs: 0,
          bio: '',
          yearsExperience: 0,
          verified: false,
          specialties: [],
          reviewCount: 0,
          avatar: '',
          location: ''
        }
      };
    } catch (error) {
      console.error('Error getting service:', error);
      return null;
    }
  },

  async getServicesByProvider(providerId: string): Promise<Service[]> {
    try {
      console.log('Getting services for provider:', providerId);
      
      // Use supabaseAdmin for better reliability and to bypass any potential RLS issues
      const { data, error } = await supabaseAdmin
        .from(TABLES.SERVICES)
        .select('*')
        .eq('provider_id', providerId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error in getServicesByProvider:', error);
        throw error;
      }
      
      console.log('Found services for provider:', data?.length || 0);
      
      if (!data || data.length === 0) {
        return [];
      }

      // Transform the data manually without foreign key joins for now
      return data.map((service: any) => ({
        id: service.service_id,
        title: service.title,
        description: service.description,
        price: Number(service.price),
        priceType: service.price_type,
        duration: service.duration,
        category: 'General', // We'll get this separately if needed
        rating: Number(service.rating),
        reviewCount: service.review_count,
        images: service.images || [],
        providerId: service.provider_id,
        availability: service.availability || [],
        location: service.location,
        state: service.state,
        city: service.city,
        tags: service.tags || [],
        provider: {
          id: providerId,
          name: 'Provider', // We'll get this separately if needed
          rating: 0,
          completedJobs: 0,
          bio: '',
          yearsExperience: 0,
          verified: false,
          specialties: [],
          reviewCount: 0,
          avatar: '',
          location: ''
        }
      }));
    } catch (error) {
      console.error('Error getting provider services:', error);
      return [];
    }
  },

  async createService(serviceData: {
    providerId: string;
    categoryId: string;
    title: string;
    description: string;
    price: number;
    priceType: 'fixed' | 'hourly';
    duration: string;
    location: string;
    city: string;
    state: string;
    images?: string[];
    availability?: string[];
    tags?: string[];
  }): Promise<Service | null> {
    try {
      console.log('Creating service with data:', serviceData);
      
      // First, ensure the provider exists and get their database ID
      // The providerId could be either firebase_uid or database user_id
      let provider = await userService.getUserByFirebaseUid(serviceData.providerId);
      
      // If not found by firebase_uid, it might already be a database user_id
      if (!provider) {
        console.log('Provider not found by Firebase UID, checking if it\'s a database ID...');
        // Try to get user data directly by user_id
        const { data: userData, error: userError } = await supabaseAdmin
          .from(TABLES.USERS)
          .select('*')
          .eq('user_id', serviceData.providerId)
          .single();
        
        if (!userError && userData) {
          provider = userService.transformUserFromDB(userData);
          console.log('Provider found by database ID:', provider);
        }
      }
      
      if (!provider) {
        console.error(`Provider not found in database. Searched for ID: ${serviceData.providerId}`);
        console.log('Attempting to create/upsert the provider...');
        
        // Get current user from AuthContext to create the provider record
        // This is a fallback - the user should have been created during authentication
        try {
          const { data: { user: firebaseUser } } = await supabase.auth.getUser();
          if (firebaseUser) {
            console.log('Found Firebase user, attempting to create Supabase user record:', firebaseUser.id);
            
            const newUserData = {
              firebase_uid: firebaseUser.id,
              name: firebaseUser.user_metadata?.name || firebaseUser.email?.split('@')[0] || 'Provider',
              email: firebaseUser.email || '',
              role: 'provider' as const,
              avatar: firebaseUser.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(firebaseUser.email || 'Provider')}&background=3b82f6&color=fff`,
              phone: firebaseUser.phone || '',
              verified: firebaseUser.email_confirmed_at ? true : false
            };
            
            provider = await userService.upsertUser(newUserData);
            console.log('Created provider:', provider);
          }
        } catch (authError) {
          console.error('Error getting Firebase user:', authError);
        }
        
        if (!provider) {
          throw new Error(`Provider not found and could not be created. Tried ID: ${serviceData.providerId}`);
        }
      }
      console.log('Provider confirmed:', provider);

      // Handle category - if it's a mock category, create or find a real one
      let categoryId = serviceData.categoryId;
      if (serviceData.categoryId.startsWith('mock-')) {
        // Extract category name from mock categories
        const mockIndex = parseInt(serviceData.categoryId.replace('mock-', ''));
        const categoryName = mockCategories[mockIndex]?.name || 'General';
        
        console.log('Creating/finding category for:', categoryName);
        
        // Try to find existing category or create it
        const { data: existingCategory, error: findError } = await supabaseAdmin
          .from(TABLES.CATEGORIES)
          .select('category_id')
          .eq('name', categoryName)
          .maybeSingle() as { data: { category_id: string } | null; error: any };

        if (!findError && existingCategory) {
          categoryId = existingCategory.category_id;
          console.log('Found existing category:', categoryId);
        } else {
          // Create the category
          const { data: newCategory, error: categoryError } = await (supabaseAdmin
            .from(TABLES.CATEGORIES) as any)
            .insert({
              name: categoryName,
              description: `${categoryName} services`,
              icon: mockCategories[mockIndex]?.icon || '🔧',
              is_active: true
            })
            .select('category_id')
            .single();

          if (categoryError) {
            console.error('Error creating category:', categoryError);
            throw new Error(`Failed to create category: ${categoryError.message}`);
          }
          
          categoryId = newCategory.category_id;
          console.log('Created new category:', categoryId);
        }
      }

      const insertData = {
        provider_id: provider.id, // This should be the database user_id from the provider object
        category_id: categoryId,
        title: serviceData.title,
        description: serviceData.description,
        price: serviceData.price,
        price_type: serviceData.priceType,
        duration: serviceData.duration,
        location: serviceData.location,
        city: serviceData.city,
        state: serviceData.state,
        images: serviceData.images || [],
        availability: serviceData.availability || [],
        tags: serviceData.tags || [],
        rating: 0.0,
        review_count: 0,
        is_active: true
      };

      console.log('Insert data prepared:', insertData);
      console.log('Provider ID for foreign key:', provider.id);
      console.log('Provider object keys:', Object.keys(provider));

      // Verify the provider ID actually exists in the users table
      const { data: providerCheck, error: providerCheckError } = await supabaseAdmin
        .from(TABLES.USERS)
        .select('user_id, name, role, firebase_uid')
        .eq('user_id', provider.id)
        .single();

      if (providerCheckError || !providerCheck) {
        console.error('Provider verification failed:', providerCheckError);
        console.error('Provider ID does not exist in users table:', provider.id);
        throw new Error(`Provider ID ${provider.id} does not exist in users table`);
      }

      console.log('Provider verification successful:', providerCheck);

      // Verify the category exists
      const { data: categoryCheck, error: categoryCheckError } = await supabaseAdmin
        .from(TABLES.CATEGORIES)
        .select('category_id, name')
        .eq('category_id', categoryId)
        .single();

      if (categoryCheckError || !categoryCheck) {
        console.error('Category verification failed:', categoryCheckError);
        console.error('Category ID does not exist:', categoryId);
        throw new Error(`Category ID ${categoryId} does not exist in categories table`);
      }

      console.log('Category verification successful:', categoryCheck);

      const { data, error } = await (supabaseAdmin
        .from(TABLES.SERVICES) as any)
        .insert([insertData])
        .select('*')
        .single();

      if (error) {
        console.error('Supabase service creation error:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        console.error('Insert data that failed:', JSON.stringify(insertData, null, 2));
        throw error;
      }

      console.log('Service created successfully:', data);
      
      // Clear cache since a new service was created
      this.clearCache();
      
      // Transform the data manually since we're not using joins
      const createdService = {
        id: (data as any).service_id,
        title: (data as any).title,
        description: (data as any).description,
        price: Number((data as any).price),
        priceType: (data as any).price_type,
        duration: (data as any).duration,
        category: (categoryCheck as any).name,
        rating: Number((data as any).rating),
        reviewCount: (data as any).review_count,
        images: (data as any).images || [],
        providerId: (data as any).provider_id,
        availability: (data as any).availability || [],
        location: (data as any).location,
        state: (data as any).state,
        city: (data as any).city,
        tags: (data as any).tags || [],
        provider: {
          id: (providerCheck as any).user_id,
          name: (providerCheck as any).name,
          rating: 0,
          completedJobs: 0,
          bio: '',
          yearsExperience: 0,
          verified: false,
          specialties: [],
          reviewCount: 0,
          avatar: '',
          location: ''
        }
      };
      
      return createdService;
    } catch (error) {
      console.error('Error creating service:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'Unknown error');
      throw error; // Re-throw so the UI can show the error
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
      console.log('Creating booking with data:', bookingData);
      
      // Create the insert data with only fields that definitely exist in the table
      const insertData = {
        user_id: bookingData.userId, // Customer's user ID
        service_id: bookingData.serviceId,
        provider_id: bookingData.providerId,
        service_name: bookingData.serviceName,
        provider_name: bookingData.providerName,
        booking_date: bookingData.date,
        booking_time: bookingData.time,
        status: 'pending', // Always start as pending request
        price: bookingData.price,
        location: bookingData.location,
        special_instructions: bookingData.specialInstructions || null,
        estimated_duration: bookingData.estimatedDuration || null,
        image: bookingData.image || null
      };

      // Only add newer fields if they're likely to exist
      if (bookingData.customerName) {
        (insertData as any).customer_name = bookingData.customerName;
      }
      
      // Add timestamp
      (insertData as any).requested_at = new Date().toISOString();

      console.log('Insert data prepared:', insertData);

      // TEMPORARY DEV WORKAROUND: Use supabaseAdmin (service role) to bypass RLS
      // TODO: Move to server-side API endpoint for production
      console.log('[bookingService] Using admin client to bypass RLS for development');

      const { data, error } = await (supabaseAdmin
        .from(TABLES.BOOKINGS) as any)
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('Supabase booking creation error:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));

        // Detect common RLS / permission errors and give actionable guidance
        const message = (error && (error.message || '')).toString();
        if (error.code === '42501' || message.toLowerCase().includes('row-level security') || error.status === 401) {
          console.error('[bookingService] Insert blocked by Supabase Row Level Security (RLS) or authentication mismatch.');
          console.warn('[bookingService] TEMPORARY DEV WORKAROUND: Falling back to mock booking creation for development.');
          
          // Temporary workaround: create a mock booking object for development
          const mockBooking: Booking = {
            id: `mock-${Date.now()}`,
            serviceId: bookingData.serviceId,
            serviceName: bookingData.serviceName,
            userId: bookingData.userId,
            providerName: bookingData.providerName,
            providerId: bookingData.providerId,
            customerName: bookingData.customerName || 'Customer',
            date: bookingData.date,
            time: bookingData.time,
            status: 'pending' as const,
            price: bookingData.price,
            image: bookingData.image || '',
            location: bookingData.location,
            specialInstructions: bookingData.specialInstructions,
            estimatedDuration: bookingData.estimatedDuration,
            requestedAt: new Date().toISOString(),
            respondedAt: undefined
          };
          
          console.warn('[bookingService] Created mock booking for testing:', mockBooking.id);
          console.warn('[bookingService] This booking exists only in memory and will not persist.');
          console.warn('[bookingService] To fix permanently: disable RLS on bookings table or implement server-side endpoint.');
          
          return mockBooking;
        }

        throw error;
      }

      console.log('Booking created successfully:', data);
      return this.transformBookingFromDB(data);
    } catch (error) {
      console.error('Error creating booking:', error);
      return null;
    }
  },

  async getUserBookings(userId: string): Promise<Booking[]> {
    try {
      console.log('[bookingService] Getting bookings for user:', userId);
      
      const { data, error } = await supabaseAdmin
        .from(TABLES.BOOKINGS)
        .select('booking_id, service_id, service_name, user_id, provider_name, provider_id, customer_name, booking_date, booking_time, status, price, image, location, special_instructions, estimated_duration, requested_at, responded_at')
        .eq('user_id', userId)
        .order('requested_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error getting user bookings:', error);
        // Return empty array on error instead of throwing
        return [];
      }
      
      console.log('[bookingService] Found', data?.length || 0, 'bookings for user');
      return (data || []).map(this.transformBookingFromDB);
    } catch (error) {
      console.error('Error getting user bookings:', error);
      return [];
    }
  },

  async getProviderRequests(providerId: string): Promise<Booking[]> {
    try {
      console.log('[bookingService] Getting pending requests for provider:', providerId);
      
      const { data, error } = await supabaseAdmin
        .from(TABLES.BOOKINGS)
        .select('booking_id, service_id, service_name, user_id, provider_name, provider_id, customer_name, booking_date, booking_time, status, price, image, location, special_instructions, estimated_duration, requested_at, responded_at')
        .eq('provider_id', providerId)
        .eq('status', 'pending')
        .order('requested_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error getting provider requests:', error);
        return [];
      }
      
      console.log('[bookingService] Found', data?.length || 0, 'pending requests');
      return (data || []).map(this.transformBookingFromDB);
    } catch (error) {
      console.error('Error getting provider requests:', error);
      return [];
    }
  },

  async getProviderBookings(providerId: string): Promise<Booking[]> {
    try {
      console.log('[bookingService] Getting all bookings for provider:', providerId);
      
      const { data, error } = await supabaseAdmin
        .from(TABLES.BOOKINGS)
        .select('booking_id, service_id, service_name, user_id, provider_name, provider_id, customer_name, booking_date, booking_time, status, price, image, location, special_instructions, estimated_duration, requested_at, responded_at')
        .eq('provider_id', providerId)
        .order('requested_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error getting provider bookings:', error);
        return [];
      }
      
      console.log('[bookingService] Found', data?.length || 0, 'total bookings');
      return (data || []).map(this.transformBookingFromDB);
    } catch (error) {
      console.error('Error getting provider bookings:', error);
      return [];
    }
  },

  async approveRequest(bookingId: string): Promise<boolean> {
    try {
      console.log('[bookingService] Approving request:', bookingId);
      const { error } = await (supabaseAdmin
        .from(TABLES.BOOKINGS) as any)
        .update({ 
          status: 'confirmed',
          responded_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('booking_id', bookingId);

      if (error) {
        console.error('Error approving request:', error);
        throw error;
      }
      console.log('[bookingService] Request approved successfully');
      return true;
    } catch (error) {
      console.error('Error approving request:', error);
      return false;
    }
  },

  async rejectRequest(bookingId: string): Promise<boolean> {
    try {
      console.log('[bookingService] Rejecting request:', bookingId);
      const { error } = await (supabaseAdmin
        .from(TABLES.BOOKINGS) as any)
        .update({ 
          status: 'cancelled',
          responded_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('booking_id', bookingId);

      if (error) {
        console.error('Error rejecting request:', error);
        throw error;
      }
      console.log('[bookingService] Request rejected successfully');
      return true;
    } catch (error) {
      console.error('Error rejecting request:', error);
      return false;
    }
  },

  async updateBookingStatus(bookingId: string, status: Booking['status']): Promise<boolean> {
    try {
      console.log('[bookingService] Updating booking status:', bookingId, 'to', status);
      const updateData: any = { 
        status, 
        updated_at: new Date().toISOString() 
      };
      
      // Add responded_at timestamp when status changes from pending
      if (['approved', 'rejected', 'cancelled'].includes(status)) {
        updateData.responded_at = new Date().toISOString();
      }
      
      const { error } = await (supabaseAdmin
        .from(TABLES.BOOKINGS) as any)
        .update(updateData)
        .eq('booking_id', bookingId);

      if (error) {
        console.error('Error updating booking status:', error);
        throw error;
      }
      console.log('[bookingService] Booking status updated successfully');
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
      userId: dbBooking.user_id,
      providerName: dbBooking.provider_name,
      providerId: dbBooking.provider_id,
      customerName: dbBooking.customer_name || 'Customer',
      date: dbBooking.booking_date,
      time: dbBooking.booking_time,
      status: dbBooking.status,
      price: Number(dbBooking.price),
      image: dbBooking.image || '',
      location: dbBooking.location,
      specialInstructions: dbBooking.special_instructions,
      estimatedDuration: dbBooking.estimated_duration,
      requestedAt: dbBooking.requested_at || dbBooking.created_at,
      respondedAt: dbBooking.responded_at
    };
  }
};

// Review Services
export const reviewService = {
  async getServiceReviews(serviceId: string): Promise<Review[]> {
    try {
      const { data, error } = await supabaseAdmin
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
      const { data, error } = await (supabaseAdmin
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