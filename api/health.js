import { requireAdmin } from './_lib/auth.js'
import { db, TABLE } from './_lib/supabase.js'

/**
 * Diagnóstico de la conexión con Supabase. Protegido con la sesión de admin.
 * Nunca devuelve el valor de una variable de entorno, solo si está presente.
 */
export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return
  if (req.method !== 'GET') return res.status(405).json({ error: 'Método no permitido' })

  const url = process.env.SUPABASE_URL || ''
  const env = {
    SUPABASE_URL: Boolean(url),
    SUPABASE_SERVICE_ROLE_KEY: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    ADMIN_PASSWORD: Boolean(process.env.ADMIN_PASSWORD),
  }

  // Host sin credenciales: sirve para confirmar a qué proyecto está pegando
  let proyecto = null
  try { proyecto = new URL(url).host } catch { /* url vacía o inválida */ }

  const salida = { env, proyecto, tabla: TABLE }

  try {
    const { error, count } = await db()
      .from(TABLE)
      .select('id', { count: 'exact', head: true })

    if (error) {
      return res.status(200).json({
        ...salida,
        ok: false,
        codigo: error.code,
        mensaje: error.message,
        pista: error.code === 'PGRST205'
          ? `La conexión funciona pero no existe public.${TABLE} en este proyecto. Corre supabase/schema.sql y luego: notify pgrst, 'reload schema';`
          : 'Revisa SETUP.md, sección Notas de seguridad y puesta en marcha.',
      })
    }

    return res.status(200).json({ ...salida, ok: true, invitados: count })
  } catch (e) {
    return res.status(200).json({ ...salida, ok: false, mensaje: e.message })
  }
}
