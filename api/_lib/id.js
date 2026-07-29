import crypto from 'node:crypto'

// Sin 0/O ni 1/I/L: así el código se puede dictar por teléfono sin confusiones.
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'

/** ID alfanumérico de 8 caracteres. 31^8 ≈ 8.5e11 combinaciones. */
export function newId(len = 8) {
  const bytes = crypto.randomBytes(len)
  let out = ''
  for (let i = 0; i < len; i++) out += ALPHABET[bytes[i] % ALPHABET.length]
  return out
}

export const ID_RE = /^[A-Z0-9]{8}$/

/** Normaliza un id que viene del cliente. Devuelve null si no tiene forma válida. */
export function parseId(raw) {
  const id = String(raw ?? '').trim().toUpperCase()
  return ID_RE.test(id) ? id : null
}
