import { useState, useEffect, useMemo, useRef } from 'react'
import '../App.css'
import OptionSwitcher from '../components/OptionSwitcher'
import { SONG, useAudioPlayer } from '../audio'
import { useGuest } from '../lib/useGuest'

const EVENT_DATE = new Date('2026-08-29T17:00:00')
const PLAYLIST_INVITE = 'https://open.spotify.com/playlist/5j0IZEXjaocvi9L0r9imxb?si=WVkdC6K_TdavUgDXtHwyLA&utm_source=copy-link&pt=54eccddb35e655639329c43d4c540c57&pi=31CjinzkQZaEg'

function useFadeIn() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add('is-visible') },
      { threshold: 0.12 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}

const NAV_LINKS = [
  { href: '#inicio',       label: 'Inicio' },
  { href: '#evento',       label: 'Evento' },
  { href: '#lugar',        label: 'Lugar' },
  { href: '#itinerario',   label: 'Itinerario' },
  { href: '#vestimenta',   label: 'Vestimenta' },
  { href: '#musica',       label: 'Música' },
  { href: '#regalos',      label: 'Regalos' },
  { href: '#confirmacion', label: 'RSVP' },
]

function Nav() {
  const [solid, setSolid] = useState(false)
  useEffect(() => {
    const handle = () => setSolid(window.scrollY > 60)
    window.addEventListener('scroll', handle, { passive: true })
    return () => window.removeEventListener('scroll', handle)
  }, [])
  return (
    <nav className={`nav${solid ? ' nav--solid' : ''}`}>
      <div className="nav__inner">
        {NAV_LINKS.map(({ href, label }) => (
          <a key={href} href={href} className="nav__link">{label}</a>
        ))}
      </div>
    </nav>
  )
}

function Hero() {
  const particles = useMemo(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id:    i,
      left:  `${(i * 3.47 + 1.9) % 100}%`,
      dur:   `${8 + (i * 0.83) % 10}s`,
      delay: `-${(i * 0.67) % 12}s`,
      size:  `${1.4 + (i * 0.28) % 2.2}px`,
    })), []
  )
  return (
    <section className="hero" id="inicio">
      <div className="hero__ring hero__ring--1" aria-hidden="true" />
      <div className="hero__ring hero__ring--2" aria-hidden="true" />
      <div className="hero__ring hero__ring--3" aria-hidden="true" />
      <div className="hero__particles" aria-hidden="true">
        {particles.map(p => (
          <span key={p.id} className="hero__particle" style={{ left: p.left, animationDuration: p.dur, animationDelay: p.delay, width: p.size, height: p.size }} />
        ))}
      </div>
      <div className="hero__content">
        <div className="hero__portrait">
          <img className="hero__portrait-img" src="/karen-portrait.webp" alt="Karen Elizabeth" />
          <span className="hero__portrait-glass" aria-hidden="true" />
        </div>
        <p className="hero__eyebrow">Mis Quince · 2026</p>
        <h1 className="hero__name">Karen Elizabeth</h1>
        <p className="hero__xv">— XV Años —</p>
        <div className="hero__rule" aria-hidden="true" />
        <p className="hero__date">Sábado, 29 de Agosto de 2026</p>
        <p className="hero__city">El Salto, Jalisco · México</p>
      </div>
      <div className="hero__scroll" aria-label="Desplázate hacia abajo">Descubre</div>
    </section>
  )
}

function Countdown() {
  const [t, setT] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  useEffect(() => {
    const tick = () => {
      const diff = EVENT_DATE - Date.now()
      if (diff <= 0) return
      setT({
        days:    Math.floor(diff / 86400000),
        hours:   Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000)  / 60000),
        seconds: Math.floor((diff % 60000)    / 1000),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  const pad = (n, len = 2) => String(n).padStart(len, '0')
  return (
    <section className="countdown" id="cuenta-regresiva">
      <p className="label label--gold">La celebración comienza en</p>
      <h2 className="title title--light">Cuenta Regresiva</h2>
      <div className="ornament ornament--dim" aria-hidden="true"><span>✦</span></div>
      <div className="countdown__grid">
        <div className="countdown__item"><span className="countdown__num">{pad(t.days, 3)}</span><span className="countdown__lbl">Días</span></div>
        <span className="countdown__sep" aria-hidden="true">:</span>
        <div className="countdown__item"><span className="countdown__num">{pad(t.hours)}</span><span className="countdown__lbl">Horas</span></div>
        <span className="countdown__sep" aria-hidden="true">:</span>
        <div className="countdown__item"><span className="countdown__num">{pad(t.minutes)}</span><span className="countdown__lbl">Minutos</span></div>
        <span className="countdown__sep" aria-hidden="true">:</span>
        <div className="countdown__item"><span className="countdown__num">{pad(t.seconds)}</span><span className="countdown__lbl">Segundos</span></div>
      </div>
    </section>
  )
}

function EventCard({ icon, type, name, address, city, time }) {
  return (
    <article className="event-card">
      <span className="event-card__icon">{icon}</span>
      <p className="event-card__type">{type}</p>
      <h3 className="event-card__name">{name}</h3>
      <p className="event-card__addr">{address}</p>
      <p className="event-card__addr">{city}</p>
      <p className="event-card__time">{time}</p>
    </article>
  )
}

function Events() {
  const ref = useFadeIn()
  return (
    <section className="events" id="evento">
      <p className="label">El gran día</p>
      <h2 className="title">Detalles del Evento</h2>
      <p className="subtitle">Acompáñame en este día tan especial</p>
      <div className="ornament" aria-hidden="true"><span>✦</span></div>
      <div className="events__grid fade-in" ref={ref}>
        <EventCard icon="⛪" type="Ceremonia Religiosa" name="Parroquia Madre Admirable" address="Manuel Acuña 32, Centro" city="45680 El Salto, Jalisco" time="5:00 PM" />
        <EventCard icon="✨" type="Recepción & Fiesta" name="Aura Lounge Salón de eventos" address="Constitución 501, Potrero Nuevo" city="45680 El Salto, Jalisco" time="7:00 PM" />
      </div>
    </section>
  )
}

function Maps() {
  const ref = useFadeIn()
  return (
    <section className="maps" id="lugar">
      <p className="label">¿Cómo llegar?</p>
      <h2 className="title">Ubicaciones</h2>
      <div className="ornament" aria-hidden="true"><span>✦</span></div>
      <div className="maps__grid fade-in" ref={ref}>
        <div className="map-card">
          <iframe title="Mapa Iglesia" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3736.7004633024944!2d-103.1798849240877!3d20.518501881006213!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x842f4a7459787c1f%3A0x3044b914080c0df!2sParroquia%20Madre%20Admirable!5e0!3m2!1ses!2smx!4v1784688669003!5m2!1ses!2smx" loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
          <div className="map-card__info">
            <h3>⛪ La Iglesia</h3>
            <p>Parroquia Madre Admirable<br />Manuel Acuña 32, Centro, 45680 El Salto, Jal.</p>
            <a href="https://www.google.com/maps/search/Parroquia+Madre+Admirable+Manuel+Acu%C3%B1a+32+Centro+El+Salto+Jalisco" target="_blank" rel="noopener noreferrer" className="btn">Ver en Google Maps</a>
          </div>
        </div>
        <div className="map-card">
          <iframe title="Mapa Salón" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d467.09829442130024!2d-103.19114144325877!3d20.514982567088513!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x842f4a6ca58fce89%3A0x455566a86e8c526d!2sConstituci%C3%B3n%20501%2C%20Potrero%20Nuevo%2C%2045680%20El%20Salto%2C%20Jal.!5e0!3m2!1ses!2smx!4v1784688502095!5m2!1ses!2smx" loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
          <div className="map-card__info">
            <h3>✨ El Salón</h3>
            <p>Aura Lounge Salón de eventos<br />Constitución 501, Potrero Nuevo, 45680 El Salto, Jal.</p>
            <a href="https://www.google.com/maps/search/Aura+Lounge+Sal%C3%B3n+de+eventos+Constituci%C3%B3n+501+Potrero+Nuevo+El+Salto+Jalisco" target="_blank" rel="noopener noreferrer" className="btn">Ver en Google Maps</a>
          </div>
        </div>
      </div>
    </section>
  )
}

const ITINERARY = [
  { time: '5:00 PM',  label: 'Misa',            icon: '⛪' },
  { time: '6:30 PM',  label: 'Sesión de fotos', icon: '📸' },
  { time: '7:00 PM',  label: 'Recepción',       icon: '🥂' },
  { time: '8:00 PM',  label: 'Cena',            icon: '🍽️' },
  { time: '9:00 PM',  label: 'Vals',            icon: '💃' },
  { time: '9:30 PM',  label: 'Brindis',         icon: '🍾' },
  { time: '10:00 PM', label: 'Pastel',          icon: '🎂' },
  { time: '2:00 AM',  label: 'Despedida',       icon: '🎆' },
]

function Itinerary() {
  const ref = useFadeIn()
  return (
    <section className="itinerary" id="itinerario">
      <p className="label">El orden de la noche</p>
      <h2 className="title">Itinerario</h2>
      <p className="subtitle">Así viviremos esta celebración</p>
      <div className="ornament" aria-hidden="true"><span>✦</span></div>
      <div className="timeline fade-in" ref={ref}>
        {ITINERARY.map(it => (
          <div className="timeline__item" key={it.label}>
            <span className="timeline__icon" aria-hidden="true">{it.icon}</span>
            <div className="timeline__content">
              <span className="timeline__time">{it.time}</span>
              <span className="timeline__label">{it.label}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

const SWATCHES = [
  { hex: '#C9A96E', name: 'Dorado' },
  { hex: '#B76E79', name: 'Rosa Oro' },
  { hex: '#7D9B76', name: 'Verde Salvia' },
  { hex: '#8B7BA8', name: 'Lavanda' },
  { hex: '#4A7C9E', name: 'Azul Acero' },
  { hex: '#2C1810', name: 'Chocolate' },
]

const DRESS_ITEMS = [
  { icon: '👗', type: 'Damas',      desc: 'Vestido de noche o coctel. Por favor evitar el color azul marino, reservados para la festejada.' },
  { icon: '🤵', type: 'Caballeros', desc: 'Traje formal oscuro o smoking. Corbata o moño en tonos que complementen la paleta del evento.' },
  { icon: '🌸', type: 'Niños',      desc: 'Ropa de vestir acorde a su edad. Niñas en vestido; niños en pantalón de vestir y camisa.' },
]

function DressCode() {
  const ref = useFadeIn()
  const [tip, setTip] = useState(null)
  return (
    <section className="dresscode" id="vestimenta">
      <p className="label label--gold">Por favor tomar en cuenta</p>
      <h2 className="title title--light">Código de Vestimenta</h2>
      <p className="dresscode__format">Formal Elegante</p>
      <div className="ornament ornament--dim" aria-hidden="true"><span>✦</span></div>
      <div className="dresscode__grid fade-in" ref={ref}>
        {DRESS_ITEMS.map(item => (
          <div key={item.type} className="dress-card">
            <span className="dress-card__icon">{item.icon}</span>
            <p className="dress-card__type">{item.type}</p>
            <p className="dress-card__desc">{item.desc}</p>
          </div>
        ))}
      </div>
      <div className="dresscode__palette-wrap">
        <p className="dresscode__palette-lbl">Paleta de colores sugerida</p>
        <div className="color-palette">
          {SWATCHES.map(s => (
            <div key={s.hex} className="swatch" style={{ background: s.hex }} onMouseEnter={() => setTip(s.name)} onMouseLeave={() => setTip(null)} title={s.name}>
              {tip === s.name && <span className="swatch__tip">{s.name}</span>}
            </div>
          ))}
        </div>
        <p className="dresscode__note">
          Se solicita amablemente no utilizar{' '}
          <strong>azul marino ni azules claros</strong>,<br />
          reservados para la quinceañera y su corte de honor.
        </p>
      </div>
    </section>
  )
}

function FeaturedSong() {
  const { playing, progress, toggle, seek, restart } = useAudioPlayer(SONG.src, { fallback: SONG.fallback })
  const barRef = useRef(null)
  const onSeek = (e) => {
    const el = barRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    seek((e.clientX - r.left) / r.width)
  }
  const pct = `${Math.round(progress * 100)}%`
  const p = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' }
  return (
    <div className="song">
      <div
        className="song__bar"
        ref={barRef}
        onClick={onSeek}
        role="slider"
        aria-label="Progreso de la canción"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
      >
        <span className="song__fill" style={{ width: pct }} />
        <span className="song__dot" style={{ left: pct }} />
      </div>
      <div className="song__ctrls">
        <button type="button" className="song__btn" aria-label="Aleatorio">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path {...p} d="M3 7h3.5l3 5m0 0 3 5H19" /><path {...p} d="M3 17h3.5l9-10H19" /><path {...p} d="M16.5 4.5 19.5 7l-3 2.5M16.5 14.5 19.5 17l-3 2.5" /></svg>
        </button>
        <button type="button" className="song__btn" onClick={restart} aria-label="Reiniciar">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6v12l-8.5-6L18 6Z" fill="currentColor" /><rect x="6" y="6" width="1.8" height="12" rx="0.7" fill="currentColor" /></svg>
        </button>
        <button type="button" className="song__play" onClick={toggle} aria-label={playing ? 'Pausar' : 'Reproducir'}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            {playing
              ? <g fill="currentColor"><rect x="7" y="5" width="3.4" height="14" rx="1.1" /><rect x="13.6" y="5" width="3.4" height="14" rx="1.1" /></g>
              : <path fill="currentColor" d="M8 5.5v13l11-6.5-11-6.5Z" />}
          </svg>
        </button>
        <button type="button" className="song__btn" onClick={restart} aria-label="Siguiente">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6v12l8.5-6L6 6Z" fill="currentColor" /><rect x="16.2" y="6" width="1.8" height="12" rx="0.7" fill="currentColor" /></svg>
        </button>
        <button type="button" className="song__btn" aria-label="Repetir">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path {...p} d="M4 9V8a3 3 0 0 1 3-3h9" /><path {...p} d="M20 15v1a3 3 0 0 1-3 3H8" /><path {...p} d="m14 2.5 2.5 2.5L14 7.5M10 16.5 7.5 19l2.5 2.5" /></svg>
        </button>
      </div>
    </div>
  )
}

function Spotify() {
  const ref = useFadeIn()
  return (
    <section className="spotify" id="musica">
      <p className="label">El soundtrack de esta noche</p>
      <h2 className="title">Mi Playlist</h2>
      <p className="subtitle">Las canciones que me acompañarán en este día especial</p>
      <div className="ornament" aria-hidden="true"><span>✦</span></div>
      <FeaturedSong />
      <div className="spotify__wrap fade-in" ref={ref}>
        <iframe
          title="Playlist Karen Elizabeth XV"
          style={{ borderRadius: 12 }}
          src="https://open.spotify.com/embed/playlist/5j0IZEXjaocvi9L0r9imxb?utm_source=generator&theme=0"
          width="100%"
          height="480"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        />
      </div>
      <p className="spotify__invite">
        ¿Tienes una canción que no puede faltar? ¡Agrégala a la playlist y que suene en la fiesta!
      </p>
      <a className="btn btn--spotify" href={PLAYLIST_INVITE} target="_blank" rel="noopener noreferrer">
        Agregar canciones en Spotify
      </a>
    </section>
  )
}

function Gifts() {
  const ref = useFadeIn()
  return (
    <section className="gifts" id="regalos">
      <p className="label">Mesa de Regalos</p>
      <h2 className="title">Si deseas hacerme un regalo</h2>
      <div className="ornament" aria-hidden="true"><span>✦</span></div>
      <div className="gifts__inner fade-in" ref={ref}>
        <p className="gifts__quote">
          "Tu presencia es el mejor regalo que puedo recibir.
          Sin embargo, si deseas obsequiarme algo,
          he preparado una selección con artículos
          que llenan mi corazón de ilusión."
        </p>
        <div className="gifts__buttons">
          <a href="#" className="btn btn--filled">Liverpool →</a>
          <a href="#" className="btn">Amazon Wishlist →</a>
        </div>
        <div className="gifts__bank">
          <p>O realiza un depósito directo:</p>
          <p><strong>BBVA · Karen Elizabeth Gonzalez Osorio</strong></p>
          <p>No. Cuenta: <strong>1234 5678 9012 3456</strong></p>
          <p>CLABE: <strong>012 580 01234567890 1</strong></p>
        </div>
      </div>
    </section>
  )
}

const RSVP_WHATSAPP = '5218100000000' // ← reemplazar por el número real de confirmación

function RSVP() {
  const ref = useFadeIn()
  const { guest, status, responder } = useGuest()
  const [saving, setSaving] = useState(null)
  const [saveError, setSaveError] = useState(null)

  const enviar = async (asistira) => {
    setSaving(asistira)
    setSaveError(null)
    try {
      await responder(asistira)
    } catch (e) {
      setSaveError(e.message)
    } finally {
      setSaving(null)
    }
  }

  // Sin enlace personalizado (o si falla la consulta) se mantiene el WhatsApp
  const wa = `https://wa.me/${RSVP_WHATSAPP}?text=${encodeURIComponent('¡Hola! Confirmo mi asistencia a los XV años de Karen Elizabeth.')}`

  return (
    <section className="rsvp" id="confirmacion">
      <p className="label">Confirmación de Asistencia</p>
      <h2 className="title">¿Nos acompañas?</h2>
      <p className="subtitle">Confirma tu asistencia antes del 22 de agosto de 2026</p>
      <div className="ornament" aria-hidden="true"><span>✦</span></div>

      <div className="rsvp__box fade-in" ref={ref}>
        {status === 'loading' && <p className="rsvp__cta-text">Cargando tu invitación…</p>}

        {status === 'ready' && guest && (
          <>
            <p className="rsvp__familia">{guest.familia}</p>
            <p className="rsvp__boletos">
              Tienes <strong>{guest.boletos}</strong> {guest.boletos === 1 ? 'lugar reservado' : 'lugares reservados'}
            </p>

            <div className="rsvp__choices">
              <button
                type="button"
                className={`rsvp__choice rsvp__choice--yes${guest.asistira === true ? ' rsvp__choice--on' : ''}`}
                onClick={() => enviar(true)}
                disabled={saving !== null}
              >
                {saving === true ? 'Guardando…' : 'Asistiré'}
              </button>
              <button
                type="button"
                className={`rsvp__choice rsvp__choice--no${guest.asistira === false ? ' rsvp__choice--on' : ''}`}
                onClick={() => enviar(false)}
                disabled={saving !== null}
              >
                {saving === false ? 'Guardando…' : 'No asistiré'}
              </button>
            </div>

            {guest.asistira === true && (
              <p className="rsvp__status rsvp__status--ok">
                ¡Gracias por confirmar! Te esperamos con mucho gusto ♡
              </p>
            )}
            {guest.asistira === false && (
              <p className="rsvp__status">Gracias por avisarnos. Te vamos a extrañar.</p>
            )}
            {guest.asistira !== null && (
              <p className="rsvp__hint">Puedes cambiar tu respuesta cuando quieras.</p>
            )}
            {saveError && <p className="rsvp__error">{saveError}</p>}
          </>
        )}

        {(status === 'anonymous' || status === 'error') && (
          <>
            <p className="rsvp__cta-text">Da clic en el botón y confírmame por WhatsApp</p>
            <a className="rsvp__wa" href={wa} target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" d="M4 20l1.3-4A8 8 0 1 1 8 18.7L4 20Z" />
                <path fill="currentColor" d="M9.2 8.6c.2-.5.4-.5.7-.5h.5c.2 0 .4 0 .6.5l.7 1.6c.1.2 0 .4-.1.5l-.5.6c-.1.2-.2.3 0 .6.4.7 1.2 1.5 2 1.9.3.1.4.1.6-.1l.5-.6c.2-.2.3-.2.6-.1l1.5.7c.3.1.4.3.4.5 0 .8-.6 1.5-1.4 1.6-.7.1-1.5.2-3.6-.9-2-1-3.3-3.1-3.4-3.3-.1-.2-.8-1.1-.8-2.1 0-1 .5-1.5.7-1.7Z" />
              </svg>
              Confirmar por WhatsApp
            </a>
          </>
        )}
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <span className="footer__name">Karen Elizabeth</span>
      <div className="ornament ornament--muted" aria-hidden="true"><span>✦</span></div>
      <p className="footer__date">Sábado, 29 de Agosto de 2026 · El Salto, Jalisco</p>
      <p className="footer__love">Con todo mi amor los espero ♡</p>
    </footer>
  )
}

export default function Classic() {
  return (
    <>
      <Nav />
      <Hero />
      <Countdown />
      <Events />
      <Maps />
      <Itinerary />
      <DressCode />
      <Spotify />
      <Gifts />
      <RSVP />
      <Footer />
      <OptionSwitcher />
    </>
  )
}
