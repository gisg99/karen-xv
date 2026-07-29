import { checkPassword, issueSession, clearSession, isAuthed } from './_lib/auth.js'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

export default async function handler(req, res) {
  // GET → ¿sigue viva la sesión? Permite recargar /admin sin volver a teclear.
  if (req.method === 'GET') return res.status(200).json({ authed: isAuthed(req) })

  if (req.method === 'DELETE') {
    clearSession(res)
    return res.status(200).json({ authed: false })
  }

  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' })

  if (!process.env.ADMIN_PASSWORD) {
    return res.status(500).json({ error: 'ADMIN_PASSWORD no está configurada en el servidor' })
  }

  if (!checkPassword(req.body?.password)) {
    // Penalización fija en cada fallo. No es un rate limit real (las funciones
    // serverless no comparten estado), pero encarece bastante un ataque por
    // fuerza bruta contra un password corto.
    await sleep(600)
    return res.status(401).json({ error: 'Contraseña incorrecta' })
  }

  issueSession(res)
  return res.status(200).json({ authed: true })
}
