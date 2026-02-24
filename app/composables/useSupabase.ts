import { createClient } from '@supabase/supabase-js'
import type { Database } from '~/shared/types/database'

let client: ReturnType<typeof createClient<Database>> | null = null

export const useSupabase = () => {
  if (client) return client

  const config = useRuntimeConfig()
  const url = config.public.supabaseUrl || 'https://placeholder.supabase.co'
  const key = config.public.supabaseAnonKey || 'placeholder-key'

  client = createClient<Database>(url, key, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
  })
  return client
}
