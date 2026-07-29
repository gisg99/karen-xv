import { db, TABLE } from './_lib/supabase.js'
import { parseId } from './_lib/id.js'

/**
 * Endpoint PÚBLICO: guarda la respuesta del invitado.
 * Solo puede tocar la fila cuyo id de 8 caracteres ya conoce, y solo las
 * columnas `asistira` / `respondido_en`. No puede cambiar nombre ni boletos.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' })

  const id = parseId(req.body?.id)
  const asistira = req.body?.asistira

  if (!id) return res.status(400).json({ error: 'ID inválido' })
  if (typeof asistira !== 'boolean') {
    return res.status(400).json({ error: 'La respuesta debe ser true o false' })
  }

  try {
    const { data, error } = await db()
      .from(TABLE)
      .update({ asistira, respondido_en: new Date().toISOString() })
      .eq('id', id)
      .select('id, familia, boletos, asistira')
      .maybeSingle()

    if (error) throw error
    if (!data) return res.status(404).json({ error: 'Invitación no encontrada' })

    return res.status(200).json({ invitado: data })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
