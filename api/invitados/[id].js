import { requireAdmin } from '../_lib/auth.js'
import { db, TABLE } from '../_lib/supabase.js'
import { parseId } from '../_lib/id.js'

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return
  if (req.method !== 'DELETE') return res.status(405).json({ error: 'Método no permitido' })

  const id = parseId(req.query?.id)
  if (!id) return res.status(400).json({ error: 'ID inválido' })

  try {
    const { data, error } = await db().from(TABLE).delete().eq('id', id).select('id')
    if (error) throw error
    if (!data.length) return res.status(404).json({ error: 'Invitado no encontrado' })
    return res.status(200).json({ ok: true, id })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
