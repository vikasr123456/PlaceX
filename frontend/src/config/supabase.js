// Supabase configuration for PlaceX
export const supabaseConfig = {
  // Client-side keys (public)
  url: import.meta.env.SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL,
  anonKey: import.meta.env.SUPABASE_PUBLISHABLE_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  anonKey2: import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  
  // Server-side keys (secure)
  fullUrl: import.meta.env.SUPABASE_URL,
  publishableKey: import.meta.env.SUPABASE_PUBLISHABLE_KEY,
  secretKey: import.meta.env.SUPABASE_SECRET_KEY,
  jwksUrl: import.meta.env.SUPABASE_JWKS_URL,
};

// Validate required environment variables
if (!supabaseConfig.url) {
  throw new Error('Missing SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL in environment variables');
}

if (!supabaseConfig.publishableKey) {
  throw new Error('Missing SUPABASE_PUBLISHABLE_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in environment variables');
}

if (!supabaseConfig.secretKey) {
  throw new Error('Missing SUPABASE_SECRET_KEY in environment variables');
}

if (!supabaseConfig.jwksUrl) {
  throw new Error('Missing SUPABASE_JWKS_URL in environment variables');
}

export default supabaseConfig;

// Validate required environment variables
if (!supabaseConfig.url) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL in environment variables');
}

if (!supabaseConfig.anonKey && !supabaseConfig.anonKey2) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY in environment variables');
}

if (!supabaseConfig.fullUrl) {
  throw new Error('Missing SUPABASE_URL in environment variables');
}

if (!supabaseConfig.publishableKey) {
  throw new Error('Missing SUPABASE_PUBLISHABLE_KEY in environment variables');
}

export default supabaseConfig;