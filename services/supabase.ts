import { createClient } from '@supabase/supabase-js';

// Access environment variables directly
// We provide fallback strings to prevent the "supabaseUrl is required" error if env vars are missing.
const supabaseUrl = process.env.SUPABASE_URL || 'https://buzfczfryzzwdfcevcqf.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1emZjemZyeXp6d2RmY2V2Y3FmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0MDUxMjcsImV4cCI6MjA3OTk4MTEyN30.XuR36TXJrMsA6FZ1t-7PYHpScIstke2b-OA7U4U-Nfk';

if (!process.env.SUPABASE_URL) {
  console.warn('Supabase credentials missing! Authentication and Database features will not work.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);