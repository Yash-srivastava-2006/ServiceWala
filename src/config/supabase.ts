import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

// Supabase configuration - Use import.meta.env for Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key';

// Create Supabase client (for general use)
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Create Supabase admin client (bypasses RLS - for dev/testing booking operations)
// WARNING: This uses service role key client-side. For production, move to server-side API.
export const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey);

// Database table names
export const TABLES = {
  USERS: 'users',
  CATEGORIES: 'categories',
  SERVICES: 'services',
  BOOKINGS: 'bookings',
  REVIEWS: 'reviews'
} as const;

export default supabase;