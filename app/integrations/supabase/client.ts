import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Database } from './types';
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://pudnioxihqsrhgezezsj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1ZG5pb3hpaHFzcmhnZXplenNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1MDA5NDIsImV4cCI6MjA4MjA3Njk0Mn0.uuYt-FgXcPqIYB_FTZ2s6ZJYMjiXWTIWV6bvKPM8cjY";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
