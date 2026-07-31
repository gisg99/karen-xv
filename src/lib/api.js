/** Cliente de las funciones serverless en /api. Mismo dominio, cookie incluida. */
async function request(path, options = {}) {
  const res = await fetch(`/api${path}`, {
    credentials: 'same-origin',
    ...options,
    headers: options.body
      ? { 'Content-Type': 'application/json', ...options.headers }
      : options.headers,
  })

  let body = null
  try { body = await res.json() } catch { /* respuesta sin cuerpo JSON */ }

  if (!res.ok) throw new Error(body?.error || `Error ${res.status}`)
  return body ?? {}
}

export const api = {
  // Admin
  session:        ()        => request('/login'),
  login:          (password) => request('/login', { method: 'POST', body: JSON.stringify({ password }) }),
  logout:         ()        => request('/login', { method: 'DELETE' }),
  listInvitados:  ()        => request('/invitados'),
  crearInvitado:  (datos)   => request('/invitados', { method: 'POST', body: JSON.stringify(datos) }),
  borrarInvitado: (id)      => request(`/invitados/${encodeURIComponent(id)}`, { method: 'DELETE' }),

  // Público
  invitacion:     (id)      => request(`/invitacion/${encodeURIComponent(id)}`),
  rsvp:           (id, asistira, boletos) => request('/rsvp', { method: 'POST', body: JSON.stringify({ id, asistira, boletos }) }),
}
