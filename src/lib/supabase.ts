import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

/**
 * Supabase is optional. When the two public env vars are absent (local dev,
 * first deploy before the project exists) the app transparently falls back to
 * browser storage — see src/lib/storage.ts.
 */
export const supabase: SupabaseClient | null =
  url && anonKey ? createClient(url, anonKey, { auth: { persistSession: false } }) : null

export const isSupabaseConfigured = supabase !== null
