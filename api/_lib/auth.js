import crypto from 'node:crypto'

const COOKIE = 'karen_admin'
const TTL_MS = 8 * 60 * 60 * 1000 // 8 horas

function secret() {
  const s = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD
  if (!s) throw new Error('Falta ADMIN_PASSWORD (o ADMIN_SESSION_SECRET)')
  return s
}

const sign = (data) => crypto.createHmac('sha256', secret()).update(data).digest('base64url')

/** Comparación de tiempo constante: no filtra información por cuánto tarda. */
function safeEqual(a, b) {
  const ba = Buffer.from(String(a))
  const bb = Buffer.from(String(b))
  return ba.length === bb.length && crypto.timingSafeEqual(ba, bb)
}

export function checkPassword(input) {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected || typeof input !== 'string') return false
  return safeEqual(input, expected)
}

/**
 * Emite la cookie de sesión: `<expiración>.<HMAC de la expiración>`.
 * HttpOnly, así que un XSS no puede leerla; firmada, así que el cliente no
 * puede fabricar una ni extender su vigencia.
 */
export function issueSession(res) {
  const exp = String(Date.now() + TTL_MS)
  const token = `${exp}.${sign(exp)}`
  res.setHeader(
    'Set-Cookie',
    `${COOKIE}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${TTL_MS / 1000}`
  )
}

export function clearSession(res) {
  res.setHeader('Set-Cookie', `${COOKIE}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`)
}

function readCookie(req, name) {
  const raw = req.headers?.cookie
  if (!raw) return null
  for (const part of raw.split(';')) {
    const i = part.indexOf('=')
    if (i < 0) continue
    if (part.slice(0, i).trim() === name) return part.slice(i + 1).trim()
  }
  return null
}

export function isAuthed(req) {
  try {
    const token = readCookie(req, COOKIE)
    if (!token) return false
    const [exp, sig] = token.split('.')
    if (!exp || !sig) return false
    if (!safeEqual(sig, sign(exp))) return false
    return Number(exp) > Date.now()
  } catch {
    // Configuración incompleta o cookie corrupta: se trata como "sin sesión".
    return false
  }
}

/** Guard para endpoints de admin. Responde 401 y devuelve false si no hay sesión. */
export function requireAdmin(req, res) {
  if (isAuthed(req)) return true
  res.status(401).json({ error: 'No autorizado' })
  return false
}
