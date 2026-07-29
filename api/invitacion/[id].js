import { db, TABLE } from '../_lib/supabase.js'
import { parseId } from '../_lib/id.js'

/**
 * Endpoint PÚBLICO: los datos que el invitado puede ver de su propia invitación.
 * Selecciona campos explícitamente y deja fuera `nombre`, que es de control
 * interno. Sin sesión de admin no hay forma de listar a los demás invitados:
 * hay que conocer el id exacto de 8 caracteres.
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Método no permitido' })

  const id = parseId(req.query?.id)
  if (!id) return res.status(400).json({ error: 'ID inválido' })

  try {
    const { data, error } = await db()
      .from(TABLE)
      .select('id, familia, boletos, asistira')
      .eq('id', id)
      .maybeSingle()

    if (error) throw error
    if (!data) return res.status(404).json({ error: 'Invitación no encontrada' })

    res.setHeader('Cache-Control', 'no-store')
    return res.status(200).json({ invitado: data })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
