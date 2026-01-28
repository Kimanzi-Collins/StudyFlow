import { createClient } from '@supabase/supabase-js';

// These environment variables need to be set in your .env file
// For demo purposes, we're using placeholder values that work without a real Supabase connection
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Check if we're in demo mode (no real Supabase connection)
export const isDemoMode = !import.meta.env.VITE_SUPABASE_URL;
