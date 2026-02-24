import { createClient } from '@supabase/supabase-js'
import type { Database } from '../../shared/types/database'

let adminClient: ReturnType<typeof createClient<Database>> | null = null

export const useSupabaseAdmin = () => {
  if (adminClient) return adminClient

  const config = useRuntimeConfig()
  const url = config.public.supabaseUrl || 'https://placeholder.supabase.co'
  const key = config.supabaseServiceKey || 'placeholder-key'

  adminClient = createClient<Database>(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
  return adminClient
}
