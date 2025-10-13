import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

// Supabase configuration - Use import.meta.env for Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

// Create Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Database table names
export const TABLES = {
  USERS: 'users',
  CATEGORIES: 'categories',
  SERVICES: 'services',
  BOOKINGS: 'bookings',
  REVIEWS: 'reviews'
} as const;

export default supabase;