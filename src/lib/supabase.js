import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL || 'https://your-project-url.supabase.co',
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'
);
