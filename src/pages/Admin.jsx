import { useState, useEffect, useMemo, useCallback } from 'react'
import './Admin.css'
import { api } from '../lib/api'

/* Rutas de los dos diseños, para armar el enlace que se le manda al invitado */
const DISENOS = [
  { path: '/',        label: 'Opción 3' },
  { path: '/clasico', label: 'Clásico' },
]

const FILTROS = [
  { key: 'todos',      label: 'Todos' },
  { key: 'confirmado', label: 'Confirmados' },
  { key: 'rechazado',  label: 'No asisten' },
  { key: 'pendiente',  label: 'Sin responder' },
]

const estadoDe = (inv) =>
  inv.asistira === true ? 'confirmado' : inv.asistira === false ? 'rechazado' : 'pendiente'

const ETIQUETA = { confirmado: 'Asistirá', rechazado: 'No asistirá', pendiente: 'Sin responder' }

/* ------------------------------------------------------------------ Login */
function Login({ onOk }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await api.login(password)
      onOk()
    } catch (err) {
      setError(err.message)
      setPassword('')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="adm-gate">
      <form className="adm-gate__box" onSubmit={submit}>
        <h1 className="adm-gate__title">Panel de invitados</h1>
        <p className="adm-gate__sub">Karen Elizabeth · XV Años</p>
        <input
          className="adm-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          autoFocus
          autoComplete="current-password"
        />
        {error && <p className="adm-gate__error">{error}</p>}
        <button className="adm-btn adm-btn--primary" type="submit" disabled={busy || !password}>
          {busy ? 'Verificando…' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}

/* --------------------------------------------------------- Alta de invitado */
function Formulario({ onCreado }) {
  const [nombre, setNombre] = useState('')
  const [familia, setFamilia] = useState('')
  const [boletos, setBoletos] = useState('2')
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      const { invitado } = await api.crearInvitado({
        nombre: nombre.trim(),
        familia: familia.trim(),
        boletos: Number(boletos),
      })
      onCreado(invitado)
      setNombre('')
      setFamilia('')
      setBoletos('2')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="adm-form" onSubmit={submit}>
      <div className="adm-field">
        <label htmlFor="f-nombre">Nombre <span>(solo tú lo ves)</span></label>
        <input
          id="f-nombre"
          className="adm-input"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          maxLength={100}
          placeholder="Tío Beto y esposa"
          required
        />
      </div>

      <div className="adm-field">
        <label htmlFor="f-familia">Familia <span>(aparece en la invitación)</span></label>
        <input
          id="f-familia"
          className="adm-input"
          value={familia}
          onChange={(e) => setFamilia(e.target.value)}
          maxLength={100}
          placeholder="Familia Ramírez Solís"
          required
        />
      </div>

      <div className="adm-field adm-field--sm">
        <label htmlFor="f-boletos">Boletos</label>
        <input
          id="f-boletos"
          className="adm-input"
          type="number"
          min={1}
          max={20}
          value={boletos}
          onChange={(e) => setBoletos(e.target.value)}
          required
        />
      </div>

      <button className="adm-btn adm-btn--primary" type="submit" disabled={busy}>
        {busy ? 'Guardando…' : 'Agregar invitado'}
      </button>

      {error && <p className="adm-form__error">{error}</p>}
    </form>
  )
}

/* ---------------------------------------------------------------- Panel */
function Panel({ onLogout }) {
  // `null` = todavía en la carga inicial
  const [invitados, setInvitados] = useState(null)
  const [refrescando, setRefrescando] = useState(false)
  const [error, setError] = useState(null)
  const [filtro, setFiltro] = useState('todos')
  const [diseno, setDiseno] = useState(DISENOS[0].path)
  const [copiado, setCopiado] = useState(null)
  const [borrando, setBorrando] = useState(null)

  // Carga inicial
  useEffect(() => {
    let alive = true
    api.listInvitados()
      .then((d) => { if (alive) setInvitados(d.invitados) })
      .catch((e) => { if (alive) { setInvitados([]); setError(e.message) } })
    return () => { alive = false }
  }, [])

  const refrescar = useCallback(async () => {
    setRefrescando(true)
    setError(null)
    try {
      const { invitados } = await api.listInvitados()
      setInvitados(invitados)
    } catch (err) {
      setError(err.message)
    } finally {
      setRefrescando(false)
    }
  }, [])

  const lista = useMemo(() => invitados ?? [], [invitados])

  const stats = useMemo(() => {
    const base = { invitaciones: lista.length, boletos: 0, confirmado: 0, rechazado: 0, pendiente: 0, boletosConfirmados: 0 }
    for (const inv of lista) {
      base.boletos += inv.boletos
      base[estadoDe(inv)] += 1
      // Usa los boletos que el invitado confirmó; para respuestas viejas sin
      // ese dato, cae en los que tiene asignados.
      if (inv.asistira === true) base.boletosConfirmados += inv.boletos_confirmados ?? inv.boletos
    }
    return base
  }, [lista])

  const visibles = useMemo(
    () => (filtro === 'todos' ? lista : lista.filter((inv) => estadoDe(inv) === filtro)),
    [lista, filtro]
  )

  const enlaceDe = (id) => `${window.location.origin}${diseno}?id=${id}`

  const copiar = async (id) => {
    const url = enlaceDe(id)
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      // clipboard requiere HTTPS + permiso; si falla, mostramos el enlace
      window.prompt('Copia el enlace:', url)
    }
    setCopiado(id)
    window.setTimeout(() => setCopiado((c) => (c === id ? null : c)), 1800)
  }

  const eliminar = async (inv) => {
    if (!window.confirm(`¿Eliminar a "${inv.nombre}"? Su enlace dejará de funcionar.`)) return
    setBorrando(inv.id)
    try {
      await api.borrarInvitado(inv.id)
      setInvitados((prev) => prev.filter((x) => x.id !== inv.id))
    } catch (err) {
      setError(err.message)
    } finally {
      setBorrando(null)
    }
  }

  const salir = async () => {
    try { await api.logout() } finally { onLogout() }
  }

  return (
    <div className="adm">
      <header className="adm-head">
        <div>
          <h1 className="adm-head__title">Gestión de invitados</h1>
          <p className="adm-head__sub">Karen Elizabeth · XV Años · 29 de agosto de 2026</p>
        </div>
        <button className="adm-btn adm-btn--ghost" onClick={salir}>Salir</button>
      </header>

      <section className="adm-stats">
        <div className="adm-stat"><span className="adm-stat__num">{stats.invitaciones}</span><span className="adm-stat__lbl">Invitaciones</span></div>
        <div className="adm-stat"><span className="adm-stat__num">{stats.boletos}</span><span className="adm-stat__lbl">Boletos dados</span></div>
        <div className="adm-stat adm-stat--ok"><span className="adm-stat__num">{stats.confirmado}</span><span className="adm-stat__lbl">Confirmados</span></div>
        <div className="adm-stat adm-stat--no"><span className="adm-stat__num">{stats.rechazado}</span><span className="adm-stat__lbl">No asisten</span></div>
        <div className="adm-stat adm-stat--wait"><span className="adm-stat__num">{stats.pendiente}</span><span className="adm-stat__lbl">Sin responder</span></div>
        <div className="adm-stat adm-stat--ok"><span className="adm-stat__num">{stats.boletosConfirmados}</span><span className="adm-stat__lbl">Asistentes confirmados</span></div>
      </section>

      <section className="adm-card">
        <h2 className="adm-card__title">Nuevo invitado</h2>
        <Formulario onCreado={(inv) => setInvitados((prev) => [inv, ...prev])} />
      </section>

      <section className="adm-card">
        <div className="adm-card__head">
          <h2 className="adm-card__title">
            Lista <span className="adm-count">{visibles.length}</span>
          </h2>

          <div className="adm-toolbar">
            <div className="adm-tabs">
              {FILTROS.map((f) => (
                <button
                  key={f.key}
                  className={`adm-tab${filtro === f.key ? ' adm-tab--on' : ''}`}
                  onClick={() => setFiltro(f.key)}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <label className="adm-select">
              Enlace del diseño
              <select value={diseno} onChange={(e) => setDiseno(e.target.value)}>
                {DISENOS.map((d) => <option key={d.path} value={d.path}>{d.label}</option>)}
              </select>
            </label>

            <button className="adm-btn adm-btn--ghost" onClick={refrescar} disabled={refrescando}>
              {refrescando ? 'Actualizando…' : 'Actualizar'}
            </button>
          </div>
        </div>

        {error && <p className="adm-error">{error}</p>}

        {invitados === null ? (
          <p className="adm-empty">Cargando…</p>
        ) : !visibles.length ? (
          <p className="adm-empty">
            {lista.length ? 'Ningún invitado en este filtro.' : 'Aún no hay invitados. Agrega el primero arriba.'}
          </p>
        ) : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre (interno)</th>
                  <th>Familia (invitación)</th>
                  <th className="adm-num">Boletos</th>
                  <th>Asistirá</th>
                  <th className="adm-acts">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {visibles.map((inv) => {
                  const estado = estadoDe(inv)
                  return (
                    <tr key={inv.id}>
                      <td><code className="adm-id">{inv.id}</code></td>
                      <td>{inv.nombre}</td>
                      <td>{inv.familia}</td>
                      <td className="adm-num">
                        {inv.boletos}
                        {inv.asistira === true && inv.boletos_confirmados != null && inv.boletos_confirmados !== inv.boletos && (
                          <span className="adm-num__conf"> · usa {inv.boletos_confirmados}</span>
                        )}
                      </td>
                      <td><span className={`adm-badge adm-badge--${estado}`}>{ETIQUETA[estado]}</span></td>
                      <td className="adm-acts">
                        <button className="adm-btn adm-btn--xs" onClick={() => copiar(inv.id)}>
                          {copiado === inv.id ? '¡Copiado!' : 'Copiar enlace'}
                        </button>
                        <a className="adm-btn adm-btn--xs" href={enlaceDe(inv.id)} target="_blank" rel="noopener noreferrer">
                          Abrir
                        </a>
                        <button
                          className="adm-btn adm-btn--xs adm-btn--danger"
                          onClick={() => eliminar(inv)}
                          disabled={borrando === inv.id}
                        >
                          {borrando === inv.id ? '…' : 'Eliminar'}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

/* ---------------------------------------------------------------- Página */
export default function Admin() {
  // 'checking' evita el flash del login al recargar con sesión viva
  const [authed, setAuthed] = useState('checking')

  useEffect(() => {
    api.session()
      .then((d) => setAuthed(Boolean(d.authed)))
      .catch(() => setAuthed(false))
  }, [])

  useEffect(() => {
    document.title = 'Invitados · Karen XV'
  }, [])

  if (authed === 'checking') return <div className="adm-gate"><p className="adm-empty">Cargando…</p></div>
  if (!authed) return <Login onOk={() => setAuthed(true)} />
  return <Panel onLogout={() => setAuthed(false)} />
}
