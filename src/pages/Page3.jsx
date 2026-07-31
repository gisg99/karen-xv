import { useState, useEffect, useRef } from 'react'
import './Page3.css'
import { SONG, useAudioPlayer } from '../audio'
import { useGuest } from '../lib/useGuest'

/* ---------------------------------------------------------------- Datos */
const EVENT_DATE = new Date('2026-08-29T19:00:00')

const RSVP_WHATSAPP = '523346863267' // WhatsApp de confirmación

const MISA = {
  place: 'Parroquia Madre Admirable',
  address: 'Manuel Acuña 32, Centro · El Salto, Jalisco',
  time: '7:00 PM',
  map: 'https://www.google.com/maps/search/Parroquia+Madre+Admirable+Manuel+Acu%C3%B1a+32+Centro+El+Salto+Jalisco',
  embed: 'https://www.google.com/maps?q=Parroquia+Madre+Admirable+Manuel+Acu%C3%B1a+32+Centro+El+Salto+Jalisco&output=embed',
}
const RECEPCION = {
  place: 'Aura Lounge · Salón de eventos',
  address: 'Constitución 501, Potrero Nuevo · El Salto, Jalisco',
  time: '8:30 PM',
  map: 'https://www.google.com/maps/search/Aura+Lounge+Sal%C3%B3n+de+eventos+Constituci%C3%B3n+501+Potrero+Nuevo+El+Salto+Jalisco',
  embed: 'https://www.google.com/maps?q=Aura+Lounge+Sal%C3%B3n+de+eventos+Constituci%C3%B3n+501+Potrero+Nuevo+El+Salto+Jalisco&output=embed',
}

const ITINERARY = [
  { time: '7:00 PM',  label: 'Misa',              icon: 'church' },
  { time: '8:30 PM',  label: 'Nos reunimos en el salón', icon: 'pin' },
  { time: '9:00 PM',  label: 'Recepción',         icon: 'cheers' },
  { time: '9:30 PM',  label: 'Cena',              icon: 'dinner' },
  { time: '10:30 PM', label: 'Vals',              icon: 'dance' },
  { time: '11:00 PM', label: 'Brindis',           icon: 'champagne' },
  { time: '2:00 AM',  label: 'Despedida',         icon: 'fireworks' },
]

/* Paleta de colores sugerida (misma en ambos diseños) */
const SWATCHES = [
  { hex: '#C9A96E', name: 'Dorado' },
  { hex: '#6E1E2C', name: 'Vino Tinto' },
  { hex: '#B76E79', name: 'Rosa Oro' },
  { hex: '#1F6B4E', name: 'Esmeralda' },
  { hex: '#6B2D5C', name: 'Ciruela' },
  { hex: '#1A1A1A', name: 'Negro' },
]

/* ------------------------------------------------------- Animación fade */
function useFadeIn() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) el.classList.add('is-visible') },
      { threshold: 0.14 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}

/* ------------------------------------------------------------- Iconos */
const Icon = ({ name, className = 'p3-ic' }) => {
  const p = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' }
  const paths = {
    tiara: <><path {...p} d="M3 18h18l-1.6-9-4.4 4L12 6 9 13 4.6 9 3 18Z" /><circle cx="3" cy="8" r="1.1" fill="currentColor" stroke="none" /><circle cx="21" cy="8" r="1.1" fill="currentColor" stroke="none" /><circle cx="12" cy="4.4" r="1.2" fill="currentColor" stroke="none" /><path {...p} d="M2.4 20.4h19.2" /></>,
    play: <path d="M8 5.5v13l11-6.5-11-6.5Z" fill="currentColor" />,
    pause: <><rect x="7" y="5" width="3.4" height="14" rx="1.1" fill="currentColor" /><rect x="13.6" y="5" width="3.4" height="14" rx="1.1" fill="currentColor" /></>,
    prev: <><path d="M18 6v12l-8.5-6L18 6Z" fill="currentColor" /><rect x="6" y="6" width="1.8" height="12" rx="0.7" fill="currentColor" /></>,
    next: <><path d="M6 6v12l8.5-6L6 6Z" fill="currentColor" /><rect x="16.2" y="6" width="1.8" height="12" rx="0.7" fill="currentColor" /></>,
    shuffle: <><path {...p} d="M3 7h3.5l3 5m0 0 3 5H19" /><path {...p} d="M3 17h3.5l9-10H19" /><path {...p} d="M16.5 4.5 19.5 7l-3 2.5M16.5 14.5 19.5 17l-3 2.5" /></>,
    repeat: <><path {...p} d="M4 9V8a3 3 0 0 1 3-3h9" /><path {...p} d="M20 15v1a3 3 0 0 1-3 3H8" /><path {...p} d="m14 2.5 2.5 2.5L14 7.5M10 16.5 7.5 19l2.5 2.5" /></>,
    church: <><path {...p} d="M12 2.5v4M10 4.5h4" /><path {...p} d="M12 6.5 5.5 11v10h13V11L12 6.5Z" /><path {...p} d="M10.4 21v-3.4a1.6 1.6 0 0 1 3.2 0V21" /><path {...p} d="M12 10.6v3M10.6 12h2.8" /></>,
    cheers: <><path {...p} d="M8.5 3.5 6 10.5c-.6 1.7.4 3.2 2 3.6M6.2 21h4.2M8.3 14v7" /><path {...p} d="M15.5 3.5 18 10.5c.6 1.7-.4 3.2-2 3.6M13.6 21h4.2M15.7 14v7" /><path {...p} d="M9 4.2c1.5.9 4.5.9 6 0" /></>,
    camera: <><rect {...p} x="3" y="7" width="18" height="13" rx="2.5" /><path {...p} d="M8.5 7 10 4.5h4L15.5 7" /><circle {...p} cx="12" cy="13.5" r="3.4" /></>,
    dinner: <><circle {...p} cx="12" cy="12" r="8.2" /><circle {...p} cx="12" cy="12" r="4" /></>,
    dance: <><circle {...p} cx="9" cy="4.6" r="1.6" /><path {...p} d="M9 6.4c-1.2 0-1.8 1-1.8 2.2L6 14h1.6l.6 6h1.8" /><path {...p} d="M9 8.6c1.5 1 3 1 4.5 0" /><circle {...p} cx="16.4" cy="4.6" r="1.6" /><path {...p} d="M16.4 6.4c1.4 0 2 1.2 2 2.6L17 21h-1.8l-.6-6" /></>,
    champagne: <><path {...p} d="M12 3c-1 2-1 3.4 0 5 1-1.6 1-3 0-5Z" /><path {...p} d="M12 8v8M8.5 21h7M9.5 21c0-1.8 1.1-3 2.5-3s2.5 1.2 2.5 3" /></>,
    cake: <><path {...p} d="M4 21h16v-7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7Z" /><path {...p} d="M4 16h16" /><path {...p} d="M12 6.5V9M12 4c.7.6.7 1.6 0 2.4-.7-.8-.7-1.8 0-2.4Z" /><path {...p} d="M8 7v2M16 7v2" /></>,
    fireworks: <><path {...p} d="M12 4v4M12 16v4M4 12h4M16 12h4M6.3 6.3l2.8 2.8M14.9 14.9l2.8 2.8M17.7 6.3l-2.8 2.8M9.1 14.9l-2.8 2.8" /><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" /></>,
    gift: <><rect {...p} x="4" y="9" width="16" height="11" rx="1.5" /><path {...p} d="M3 9h18M12 9v11" /><path {...p} d="M12 9C10 9 7 8.5 7 6.4 7 5 8 4.4 9 4.4c2 0 3 2.4 3 4.6ZM12 9c2 0 5-.5 5-2.6 0-1.4-1-2-2-2-2 0-3 2.4-3 4.6Z" /></>,
    suit: <><path {...p} d="M8 3 6 5v16h12V5l-2-2" /><path {...p} d="M8 3l4 5 4-5" /><path {...p} d="M12 8v10" /><path {...p} d="M9.5 12.5v4M14.5 12.5v4" /></>,
    dress: <><path {...p} d="M9 3l3 3 3-3" /><path {...p} d="M9 3c0 2-1 3-1 3l1 3-2.5 9h11L15 9l1-3s-1-1-1-3" /><path {...p} d="M8 9h8" /></>,
    whatsapp: <><path {...p} d="M4 20l1.3-4A8 8 0 1 1 8 18.7L4 20Z" /><path {...p} d="M9.2 8.6c.2-.5.4-.5.7-.5h.5c.2 0 .4 0 .6.5l.7 1.6c.1.2 0 .4-.1.5l-.5.6c-.1.2-.2.3 0 .6.4.7 1.2 1.5 2 1.9.3.1.4.1.6-.1l.5-.6c.2-.2.3-.2.6-.1l1.5.7c.3.1.4.3.4.5 0 .8-.6 1.5-1.4 1.6-.7.1-1.5.2-3.6-.9-2-1-3.3-3.1-3.4-3.3-.1-.2-.8-1.1-.8-2.1 0-1 .5-1.5.7-1.7Z" fill="currentColor" stroke="none" /></>,
    pin: <><path {...p} d="M12 21s6-5.3 6-10a6 6 0 1 0-12 0c0 4.7 6 10 6 10Z" /><circle {...p} cx="12" cy="11" r="2.2" /></>,
  }
  return <svg viewBox="0 0 24 24" className={className} aria-hidden="true">{paths[name]}</svg>
}

/* ------------------------------------------------- Adorno floral (imagen) */
const Floral = ({ src, className }) => (
  <img src={src} className={className} alt="" aria-hidden="true" loading="lazy" />
)

/* --------------------------------------------------------- Componentes */
function Hero() {
  return (
    // <section className="p3-hero">
    //   {/* <img src="/p3-foto1.webp" alt="Karen Elizabeth" className="p3-hero__img" /> */}
    //   <div className="p3-hero__fade" aria-hidden="true" />
    // </section>
    <div>
      <div style={{ height: '32px' }} />
    </div>
  )
}

function Quote() {
  const ref = useFadeIn()
  return (
    <section className="p3-quote">
      <Floral src="/flores1.webp" className="p3-corner p3-corner--tl" />
      <p ref={ref} className="p3-quote__text fade-in">
        “Hay momentos inolvidables que se atesoran en el corazón para siempre,
        por esa razón, quiero que compartas conmigo éste día tan especial.”
      </p>
    </section>
  )
}

function Player() {
  const { playing, progress, toggle, seek, restart } = useAudioPlayer(SONG.src, { autoStart: true, fallback: SONG.fallback })
  const barRef = useRef(null)
  const onSeek = (e) => {
    const el = barRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    seek((e.clientX - r.left) / r.width)
  }
  const pct = `${Math.round(progress * 100)}%`
  return (
    <div className="p3-player">
      <div
        className="p3-player__bar"
        ref={barRef}
        onClick={onSeek}
        role="slider"
        aria-label="Progreso de la canción"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
      >
        <span className="p3-player__fill" style={{ width: pct }} />
        <span className="p3-player__dot" style={{ left: pct }} />
      </div>
      <div className="p3-player__ctrls">
        <button type="button" className="p3-player__btn" aria-label="Aleatorio"><Icon name="shuffle" className="p3-player__ic" /></button>
        <button type="button" className="p3-player__btn" onClick={restart} aria-label="Reiniciar"><Icon name="prev" className="p3-player__ic" /></button>
        <button type="button" className="p3-player__play" onClick={toggle} aria-label={playing ? 'Pausar' : 'Reproducir'}>
          <Icon name={playing ? 'pause' : 'play'} className="p3-player__playic" />
        </button>
        <button type="button" className="p3-player__btn" onClick={restart} aria-label="Siguiente"><Icon name="next" className="p3-player__ic" /></button>
        <button type="button" className="p3-player__btn" aria-label="Repetir"><Icon name="repeat" className="p3-player__ic" /></button>
      </div>
    </div>
  )
}

function Invite() {
  const ref = useFadeIn()
  return (
    <section className="p3-invite">
      <div ref={ref} className="fade-in">
        <Icon name="tiara" className="p3-invite__tiara" />
        <p className="p3-eyebrow">Mis XV Años</p>
        <h1 className="p3-name">Karen Elizabeth</h1>
        <Player />
        <p className="p3-invite__text">
          Con la bendición de Dios y el amor de mis padres, te invito a
          celebrar con alegría este momento tan especial:
        </p>
        <p className="p3-invite__xv">Mis 15 Años</p>
        <div className="p3-date">
          <span className="p3-date__month">Agosto</span>
          <div className="p3-date__row">
            <span className="p3-date__dow">Sábado</span>
            <span className="p3-date__day">29</span>
            <span className="p3-date__year">2026</span>
          </div>
        </div>
      </div>
    </section>
  )
}

function Countdown() {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 })
  useEffect(() => {
    const tick = () => {
      const diff = EVENT_DATE - Date.now()
      if (diff <= 0) return setT({ d: 0, h: 0, m: 0, s: 0 })
      setT({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  const pad = (n) => String(n).padStart(2, '0')
  return (
    <section className="p3-count">
      <p className="p3-eyebrow p3-eyebrow--sm">Faltan</p>
      <div className="p3-count__nums">
        <span>{t.d}</span><i>:</i><span>{pad(t.h)}</span><i>:</i><span>{pad(t.m)}</span><i>:</i><span>{pad(t.s)}</span>
      </div>
      <div className="p3-count__lbls"><span>Días</span><span>Horas</span><span>Min</span><span>Seg</span></div>
    </section>
  )
}

function Photo({ src }) {
  return (
    <section className="p3-photo">
      <img src={src} alt="Karen Elizabeth" loading="lazy" />
    </section>
  )
}

function PlaceCard({ icon, title, place, address, time, map, embed }) {
  return (
    <div className="p3-place">
      <Icon name={icon} className="p3-place__ic" />
      <h3 className="p3-place__title">{title}</h3>
      <p className="p3-place__name">{place}</p>
      <p className="p3-place__addr">{address}</p>
      {time && (
        <p className="p3-place__time">
          <span className="p3-place__time-tag">Importante</span>
          <span>{title} · <strong>{time}</strong></span>
        </p>
      )}
      {embed && (
        <div className="p3-place__map">
          <iframe
            title={`Mapa · ${place}`}
            src={embed}
            width="100%"
            height="200"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      )}
      <a className="p3-btn" href={map} target="_blank" rel="noopener noreferrer">Abrir en Google Maps</a>
    </div>
  )
}

function Places() {
  const ref = useFadeIn()
  return (
    <section className="p3-places">
      <Floral src="/flores2.webp" className="p3-corner p3-corner--tl" />
      <div ref={ref} className="p3-places__grid fade-in">
        <PlaceCard icon="church" title="Misa" {...MISA} />
        <PlaceCard icon="cheers" title="Recepción" {...RECEPCION} />
      </div>
      <Floral src="/flores1.webp" className="p3-corner p3-corner--br" />
    </section>
  )
}

function Itinerary() {
  const ref = useFadeIn()
  return (
    <section className="p3-itin">
      <h2 className="p3-heading">Itinerario de Actividades</h2>
      <Floral src="/flores5.webp" className="p3-band p3-band--sm" />
      <div ref={ref} className="p3-itin__line fade-in">
        {ITINERARY.map((it) => (
          <div key={it.label} className="p3-itin__item">
            <span className="p3-itin__icon"><Icon name={it.icon} className="p3-itin__ic" /></span>
            <div className="p3-itin__txt">
              <span className="p3-itin__time">{it.time}</span>
              <span className="p3-itin__label">{it.label}</span>
            </div>
          </div>
        ))}
      </div>
      <p className="p3-itin__note">
        <Icon name="pin" className="p3-itin__note-ic" />
        <span>Te pedimos de la manera más atenta estar <strong>puntual a las 8:30 PM</strong> en el salón. ¡Tu presencia a tiempo hace la diferencia!</span>
      </p>
    </section>
  )
}

function DressCode() {
  const ref = useFadeIn()
  return (
    <section className="p3-dress">
      <div ref={ref} className="fade-in">
        <Floral src="/flores3.webp" className="p3-band p3-band--xs" />
        <h2 className="p3-heading">Código de Vestimenta</h2>
        <p className="p3-dress__fmt">Formal</p>
        <div className="p3-dress__icons">
          <Icon name="suit" className="p3-dress__ic" />
          <Icon name="dress" className="p3-dress__ic" />
        </div>
        <p className="p3-dress__palette-lbl">Paleta de colores sugerida</p>
        <div className="p3-dress__palette">
          {SWATCHES.map((s) => (
            <div key={s.hex} className="p3-swatch">
              <span className="p3-swatch__dot" style={{ background: s.hex }} />
              <span className="p3-swatch__name">{s.name}</span>
            </div>
          ))}
        </div>
        <p className="p3-dress__note">
          El único color reservado es el <strong>azul</strong>, exclusivo para la quinceañera. ¡El resto de la paleta es bienvenida!
        </p>
      </div>
    </section>
  )
}

function Rsvp() {
  const ref = useFadeIn()
  const { guest, status } = useGuest()

  const mensaje = guest?.familia
    ? `¡Hola! Familia ${guest.familia}. Confirmamos nuestra asistencia a los XV años de Karen Elizabeth.`
    : '¡Hola! Confirmo mi asistencia a los XV años de Karen Elizabeth.'
  const wa = `https://wa.me/${RSVP_WHATSAPP}?text=${encodeURIComponent(mensaje)}`

  return (
    <section className="p3-rsvp">
      <div ref={ref} className="fade-in">
        <Icon name="whatsapp" className="p3-rsvp__ic" />
        <h2 className="p3-heading">Confirmar Asistencia</h2>
        <p className="p3-rsvp__note">Te pedimos confirmar antes del 20 de agosto de 2026</p>

        {status === 'loading' && <p className="p3-rsvp__loading">Cargando tu invitación…</p>}

        {status === 'ready' && guest && (
          <div className="p3-rsvp__card">
            <p className="p3-rsvp__familia">{guest.familia}</p>
            <p className="p3-rsvp__boletos">
              Tienes <strong>{guest.boletos}</strong> {guest.boletos === 1 ? 'lugar reservado' : 'lugares reservados'}
            </p>
          </div>
        )}

        <p className="p3-rsvp__wa-hint">Confírmanos por WhatsApp dando clic en el botón:</p>
        <a className="p3-btn p3-btn--wa" href={wa} target="_blank" rel="noopener noreferrer">
          Confirmar por WhatsApp
        </a>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="p3-footer">
      <Floral src="/flores6.webp" className="p3-band p3-footer__band" />
      <p className="p3-footer__line">Esperamos contar con su presencia</p>
      <p className="p3-footer__thanks">¡Muchas Gracias!</p>
    </footer>
  )
}

export default function Page3() {
  return (
    <div className="page3">
      <Hero />
      <Quote />
      <Invite />
      <Countdown />
      <Photo src="/p3-foto3.webp" />
      <Places />
      <Photo src="/p3-foto4.webp" />
      <Itinerary />
      <Photo src="/p3-foto2.webp" />
      <DressCode />
      <Rsvp />
      <Footer />
    </div>
  )
}
