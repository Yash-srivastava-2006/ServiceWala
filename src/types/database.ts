// Supabase Database Type Definitions - Updated to match new schema
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          user_id: string;
          firebase_uid: string | null;
          name: string;
          email: string;
          phone: string | null;
          avatar: string | null;
          role: 'client' | 'provider';
          location: string | null;
          city: string | null;
          state: string | null;
          verified: boolean;
          bio: string | null;
          experience_years: number;
          specialties: string[] | null;
          skills: string[] | null;
          completed_jobs: number;
          rating: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id?: string;
          firebase_uid?: string | null;
          name: string;
          email: string;
          phone?: string | null;
          avatar?: string | null;
          role: 'client' | 'provider';
          location?: string | null;
          city?: string | null;
          state?: string | null;
          verified?: boolean;
          bio?: string | null;
          experience_years?: number;
          specialties?: string[] | null;
          skills?: string[] | null;
          completed_jobs?: number;
          rating?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          firebase_uid?: string | null;
          name?: string;
          email?: string;
          phone?: string | null;
          avatar?: string | null;
          role?: 'client' | 'provider';
          location?: string | null;
          city?: string | null;
          state?: string | null;
          verified?: boolean;
          bio?: string | null;
          experience_years?: number;
          specialties?: string[] | null;
          skills?: string[] | null;
          completed_jobs?: number;
          rating?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          category_id: string;
          name: string;
          description: string | null;
          icon: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          category_id?: string;
          name: string;
          description?: string | null;
          icon?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          category_id?: string;
          name?: string;
          description?: string | null;
          icon?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
      };
      services: {
        Row: {
          service_id: string;
          provider_id: string;
          category_id: string;
          title: string;
          description: string;
          price: number;
          price_type: 'fixed' | 'hourly';
          duration: string | null;
          images: string[] | null;
          availability: string[] | null;
          location: string;
          city: string | null;
          state: string | null;
          tags: string[] | null;
          rating: number;
          review_count: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          service_id?: string;
          provider_id: string;
          category_id: string;
          title: string;
          description: string;
          price: number;
          price_type: 'fixed' | 'hourly';
          duration?: string | null;
          images?: string[] | null;
          availability?: string[] | null;
          location: string;
          city?: string | null;
          state?: string | null;
          tags?: string[] | null;
          rating?: number;
          review_count?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          service_id?: string;
          provider_id?: string;
          category_id?: string;
          title?: string;
          description?: string;
          price?: number;
          price_type?: 'fixed' | 'hourly';
          duration?: string | null;
          images?: string[] | null;
          availability?: string[] | null;
          location?: string;
          city?: string | null;
          state?: string | null;
          tags?: string[] | null;
          rating?: number;
          review_count?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      bookings: {
        Row: {
          booking_id: string;
          user_id: string;
          service_id: string;
          provider_id: string;
          service_name: string;
          provider_name: string;
          customer_name: string | null;
          booking_date: string;
          booking_time: string;
          status: 'pending' | 'approved' | 'rejected' | 'in_progress' | 'completed' | 'cancelled';
          price: number;
          image: string | null;
          location: string;
          special_instructions: string | null;
          estimated_duration: number | null;
          requested_at: string | null;
          responded_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          booking_id?: string;
          user_id: string;
          service_id: string;
          provider_id: string;
          service_name: string;
          provider_name: string;
          customer_name?: string | null;
          booking_date: string;
          booking_time: string;
          status?: 'pending' | 'approved' | 'rejected' | 'in_progress' | 'completed' | 'cancelled';
          price: number;
          image?: string | null;
          location: string;
          special_instructions?: string | null;
          estimated_duration?: number | null;
          requested_at?: string | null;
          responded_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          booking_id?: string;
          user_id?: string;
          service_id?: string;
          provider_id?: string;
          service_name?: string;
          provider_name?: string;
          customer_name?: string | null;
          booking_date?: string;
          booking_time?: string;
          status?: 'pending' | 'approved' | 'rejected' | 'in_progress' | 'completed' | 'cancelled';
          price?: number;
          image?: string | null;
          location?: string;
          special_instructions?: string | null;
          estimated_duration?: number | null;
          requested_at?: string | null;
          responded_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      reviews: {
        Row: {
          review_id: string;
          user_id: string;
          provider_id: string;
          service_id: string | null;
          booking_id: string | null;
          rating: number;
          comment: string | null;
          user_name: string;
          user_avatar: string | null;
          verified: boolean;
          created_at: string;
        };
        Insert: {
          review_id?: string;
          user_id: string;
          provider_id: string;
          service_id?: string | null;
          booking_id?: string | null;
          rating: number;
          comment?: string | null;
          user_name: string;
          user_avatar?: string | null;
          verified?: boolean;
          created_at?: string;
        };
        Update: {
          review_id?: string;
          user_id?: string;
          provider_id?: string;
          service_id?: string | null;
          booking_id?: string | null;
          rating?: number;
          comment?: string | null;
          user_name?: string;
          user_avatar?: string | null;
          verified?: boolean;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: 'client' | 'provider';
      booking_status: 'pending' | 'approved' | 'rejected' | 'in_progress' | 'completed' | 'cancelled';
      price_type: 'fixed' | 'hourly';
    };
  };
}