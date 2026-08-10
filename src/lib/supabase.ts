import { createClient, SupabaseClient } from '@supabase/supabase-js'

export const BUCKET = 'clothes'

let client: SupabaseClient | null = null

function getClient(): SupabaseClient {
  if (client) return client

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    throw new Error(
      'Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local'
    )
  }

  client = createClient(url, serviceKey, { auth: { persistSession: false } })
  return client
}

// Built lazily so `next build` does not need the env vars present.
// Service role key: server-side only. Never import this file from a client component.
export const supabase = new Proxy({} as SupabaseClient, {
  get: (_target, prop) => {
    const real = getClient()
    const value = Reflect.get(real, prop, real)
    return typeof value === 'function' ? value.bind(real) : value
  },
})
