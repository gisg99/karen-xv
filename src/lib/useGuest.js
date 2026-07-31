import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api } from './api'

/**
 * Lee el `?id=` del enlace personalizado y trae los datos que el invitado puede
 * ver (familia, boletos, respuesta actual).
 *
 * `status`:
 *   'anonymous' → el enlace no trae ?id= (la invitación funciona igual, sin personalizar)
 *   'loading'   → consultando
 *   'ready'     → `guest` disponible
 *   'error'     → id inexistente o falla de red; se cae al flujo de WhatsApp
 */
export function useGuest() {
  const [params] = useSearchParams()
  const id = (params.get('id') || '').trim().toUpperCase()

  // El resultado guarda el id que lo originó, así `status` se puede derivar en
  // lugar de sincronizarlo con setState dentro del efecto.
  const [res, setRes] = useState(null)
  const vigente = Boolean(res && res.id === id)

  const status = !id ? 'anonymous'
    : !vigente ? 'loading'
    : res.error ? 'error'
    : 'ready'

  const guest = vigente && !res.error ? res.guest : null
  const error = vigente ? res.error : null

  useEffect(() => {
    if (!id) return
    let alive = true

    api.invitacion(id)
      .then((d) => { if (alive) setRes({ id, guest: d.invitado, error: null }) })
      .catch((e) => { if (alive) setRes({ id, guest: null, error: e.message }) })

    return () => { alive = false }
  }, [id])

  const responder = useCallback(async (asistira, boletos) => {
    const d = await api.rsvp(id, asistira, boletos)
    setRes({ id, guest: d.invitado, error: null })
  }, [id])

  return { id, guest, status, error, responder }
}
