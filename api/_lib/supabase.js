import { createClient } from '@supabase/supabase-js'

export const TABLE = 'invitados'

let client = null

/**
 * Cliente de Supabase con la service_role key. Ignora RLS, así que solo debe
 * usarse dentro de /api (nunca desde el frontend). Se memoiza para reutilizar
 * la conexión entre invocaciones que caen en la misma instancia.
 */
export function db() {
  if (client) return client

  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error('Faltan las variables SUPABASE_URL y/o SUPABASE_SERVICE_ROLE_KEY')
  }

  client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
  return client
}
