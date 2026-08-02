// Supabase client configuration
export const supabaseClientConfig = {
  SUPABASE_URL: import.meta.env.SUPABASE_URL || '',
  SUPABASE_PUBLISHABLE_KEY: import.meta.env.SUPABASE_PUBLISHABLE_KEY || '',
  SUPABASE_SECRET_KEY: import.meta.env.SUPABASE_SECRET_KEY || '',
  SUPABASE_JWKS_URL: import.meta.env.SUPABASE_JWKS_URL || '',
};

// Validate required environment variables
if (!supabaseClientConfig.SUPABASE_URL) {
  throw new Error('Missing SUPABASE_URL in environment variables');
}

if (!supabaseClientConfig.SUPABASE_PUBLISHABLE_KEY) {
  throw new Error('Missing SUPABASE_PUBLISHABLE_KEY in environment variables');
}

if (!supabaseClientConfig.SUPABASE_SECRET_KEY) {
  throw new Error('Missing SUPABASE_SECRET_KEY in environment variables');
}

if (!supabaseClientConfig.SUPABASE_JWKS_URL) {
  throw new Error('Missing SUPABASE_JWKS_URL in environment variables');
}

export default supabaseClientConfig;
