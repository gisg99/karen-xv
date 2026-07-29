import { requireAdmin } from '../_lib/auth.js'
import { db, TABLE } from '../_lib/supabase.js'
import { newId } from '../_lib/id.js'

const UNIQUE_VIOLATION = '23505'
const MAX_INTENTOS_ID = 5

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return

  try {
    if (req.method === 'GET') {
      const { data, error } = await db()
        .from(TABLE)
        .select('id, nombre, familia, boletos, asistira, respondido_en, creado_en')
        .order('creado_en', { ascending: false })
      if (error) throw error
      return res.status(200).json({ invitados: data })
    }

    if (req.method === 'POST') {
      const nombre = String(req.body?.nombre ?? '').trim()
      const familia = String(req.body?.familia ?? '').trim()
      const boletos = Number(req.body?.boletos)

      if (!nombre || nombre.length > 100) {
        return res.status(400).json({ error: 'El nombre es obligatorio (máx. 100 caracteres)' })
      }
      if (!familia || familia.length > 100) {
        return res.status(400).json({ error: 'La familia es obligatoria (máx. 100 caracteres)' })
      }
      if (!Number.isInteger(boletos) || boletos < 1 || boletos > 20) {
        return res.status(400).json({ error: 'Los boletos deben ser un entero entre 1 y 20' })
      }

      // El id es aleatorio, así que reintentamos si choca con uno ya existente.
      for (let intento = 0; intento < MAX_INTENTOS_ID; intento++) {
        const { data, error } = await db()
          .from(TABLE)
          .insert({ id: newId(), nombre, familia, boletos })
          .select('id, nombre, familia, boletos, asistira, respondido_en, creado_en')
          .single()

        if (!error) return res.status(201).json({ invitado: data })
        if (error.code !== UNIQUE_VIOLATION) throw error
      }

      return res.status(500).json({ error: 'No se pudo generar un ID único, intenta de nuevo' })
    }

    return res.status(405).json({ error: 'Método no permitido' })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
