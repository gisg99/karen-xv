import { db, TABLE } from './_lib/supabase.js'
import { parseId } from './_lib/id.js'

/**
 * Endpoint PÚBLICO: guarda la respuesta del invitado.
 * Solo puede tocar la fila cuyo id de 8 caracteres ya conoce, y solo las
 * columnas `asistira` / `boletos_confirmados` / `respondido_en`. No puede
 * cambiar nombre ni el número de boletos asignados.
 *
 * Cuando confirma asistencia manda además `boletos`: cuántos de sus lugares
 * usará. Se valida contra los boletos que tiene asignados (1..boletos), así
 * nadie puede confirmar más lugares de los que le dieron.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' })

  const id = parseId(req.body?.id)
  const asistira = req.body?.asistira

  if (!id) return res.status(400).json({ error: 'ID inválido' })
  if (typeof asistira !== 'boolean') {
    return res.status(400).json({ error: 'La respuesta debe ser true o false' })
  }

  // Solo tiene sentido pedir un número de boletos cuando sí va a asistir.
  let boletosConfirmados = null
  if (asistira) {
    const n = Number(req.body?.boletos)
    if (!Number.isInteger(n) || n < 1) {
      return res.status(400).json({ error: 'Indica cuántos boletos usarás (mínimo 1)' })
    }
    boletosConfirmados = n
  }

  try {
    // Necesitamos saber cuántos boletos tiene asignados para no dejar que
    // confirme más de los que le corresponden.
    const { data: actual, error: readError } = await db()
      .from(TABLE)
      .select('boletos')
      .eq('id', id)
      .maybeSingle()

    if (readError) throw readError
    if (!actual) return res.status(404).json({ error: 'Invitación no encontrada' })

    if (asistira && boletosConfirmados > actual.boletos) {
      return res.status(400).json({
        error: `Solo tienes ${actual.boletos} ${actual.boletos === 1 ? 'boleto' : 'boletos'} asignados`,
      })
    }

    const { data, error } = await db()
      .from(TABLE)
      .update({
        asistira,
        boletos_confirmados: boletosConfirmados,
        respondido_en: new Date().toISOString(),
      })
      .eq('id', id)
      .select('id, familia, boletos, asistira, boletos_confirmados')
      .maybeSingle()

    if (error) throw error
    if (!data) return res.status(404).json({ error: 'Invitación no encontrada' })

    return res.status(200).json({ invitado: data })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
