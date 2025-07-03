import { createClient } from '@supabase/supabase-js'

// Check if we're in demo mode or if environment variables are missing
const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'demo' || 
                  !process.env.NEXT_PUBLIC_SUPABASE_URL || 
                  !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Use demo/fallback values if in demo mode or environment variables are missing
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://demo.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'demo-anon-key'

// Create a Supabase client (will be non-functional in demo mode, but won't crash)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: !isDemoMode,
    persistSession: !isDemoMode,
    detectSessionInUrl: !isDemoMode,
    flowType: 'pkce',
    redirectTo: typeof window !== 'undefined' 
      ? window.location.hostname === 'localhost' 
        ? 'http://localhost:3000'
        : 'https://moghalsaif.github.io/psychotherapist.ai'
      : undefined
  }
})

// Export demo mode flag for use in other components
export { isDemoMode }

