import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import '../App.css'
import OptionSwitcher from '../components/OptionSwitcher'

const EVENT_DATE = new Date('2026-08-29T17:00:00')

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
  { href: '#vestimenta',   label: 'Vestimenta' },
  { href: '#musica',       label: 'Música' },
  { href: '#galeria',      label: 'Galería' },
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

const SWATCHES = [
  { hex: '#C9A96E', name: 'Dorado' },
  { hex: '#B76E79', name: 'Rosa Oro' },
  { hex: '#7D9B76', name: 'Verde Salvia' },
  { hex: '#8B7BA8', name: 'Lavanda' },
  { hex: '#4A7C9E', name: 'Azul Acero' },
  { hex: '#2C1810', name: 'Chocolate' },
]

const DRESS_ITEMS = [
  { icon: '👗', type: 'Damas',      desc: 'Vestido de noche o coctel. Por favor evitar el color rosa palo y blanco, reservados para la festejada.' },
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
          <strong>rosa palo, blanco ni plateado</strong>,<br />
          reservados para la quinceañera y su corte de honor.
        </p>
      </div>
    </section>
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
      <div className="spotify__wrap fade-in" ref={ref}>
        <iframe
          title="Playlist Karen Elizabeth XV"
          style={{ borderRadius: 12 }}
          src="https://open.spotify.com/embed/playlist/2201cipi8KdUD35HkObKjO?utm_source=generator&theme=0"
          width="100%"
          height="480"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        />
      </div>
    </section>
  )
}

const GALLERY_PHOTOS = [
  { id: 1,  src: 'https://picsum.photos/seed/k01/600/400' },
  { id: 2,  src: 'https://picsum.photos/seed/k02/400/580' },
  { id: 3,  src: 'https://picsum.photos/seed/k03/600/400' },
  { id: 4,  src: 'https://picsum.photos/seed/k04/600/500' },
  { id: 5,  src: 'https://picsum.photos/seed/k05/400/600' },
  { id: 6,  src: 'https://picsum.photos/seed/k06/600/400' },
  { id: 7,  src: 'https://picsum.photos/seed/k07/600/400' },
  { id: 8,  src: 'https://picsum.photos/seed/k08/400/520' },
  { id: 9,  src: 'https://picsum.photos/seed/k09/600/400' },
  { id: 10, src: 'https://picsum.photos/seed/k10/600/600' },
  { id: 11, src: 'https://picsum.photos/seed/k11/400/580' },
  { id: 12, src: 'https://picsum.photos/seed/k12/600/400' },
]

function Gallery() {
  const ref = useFadeIn()
  return (
    <section className="gallery" id="galeria">
      <p className="label">Nuestros Momentos</p>
      <h2 className="title">Galería de Fotos</h2>
      <p className="subtitle">Los recuerdos más especiales de este día único</p>
      <div className="ornament" aria-hidden="true"><span>✦</span></div>
      <p className="gallery__note">Las fotos de la celebración estarán disponibles muy pronto ✦</p>
      <div className="gallery__masonry fade-in" ref={ref}>
        {GALLERY_PHOTOS.map(p => (
          <div key={p.id} className="gallery__item">
            <img src={p.src} alt={`Recuerdo ${p.id}`} loading="lazy" />
            <div className="gallery__overlay"><span>✦</span></div>
          </div>
        ))}
      </div>
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

const FORM_INIT = { name: '', phone: '', attend: 'yes', guests: '0', diet: '', message: '' }

function Field({ label, children }) {
  return (
    <div className="field">
      <label className="field__lbl">{label}</label>
      {children}
    </div>
  )
}

function RSVP() {
  const [form, setForm] = useState(FORM_INIT)
  const [done, setDone] = useState(false)
  const ref = useFadeIn()
  const set = useCallback(k => e => setForm(f => ({ ...f, [k]: e.target.value })), [])
  const submit = e => { e.preventDefault(); setDone(true) }
  return (
    <section className="rsvp" id="confirmacion">
      <p className="label">Confirmación de Asistencia</p>
      <h2 className="title">¿Nos acompañas?</h2>
      <p className="subtitle">Confirma tu asistencia antes del 31 de octubre de 2026</p>
      <div className="ornament" aria-hidden="true"><span>✦</span></div>
      <div className="rsvp__box fade-in" ref={ref}>
        {done ? (
          <div className="rsvp__success">
            <span className="rsvp__icon" aria-hidden="true">🌸</span>
            <h3>¡Gracias por confirmar!</h3>
            <p>Tu respuesta ha sido recibida. No puedo esperar a compartir este día tan especial contigo.</p>
            <p className="rsvp__love">Con amor, Karen Elizabeth ♡</p>
          </div>
        ) : (
          <form className="rsvp__form" onSubmit={submit} noValidate>
            <Field label="Nombre completo">
              <input type="text" value={form.name} onChange={set('name')} placeholder="Tu nombre completo" required />
            </Field>
            <Field label="Teléfono / WhatsApp">
              <input type="tel" value={form.phone} onChange={set('phone')} placeholder="+52 81 0000 0000" />
            </Field>
            <Field label="¿Asistirás?">
              <div className="radio-group">
                <label className="radio-label"><input type="radio" name="attend" value="yes" checked={form.attend === 'yes'} onChange={set('attend')} /> Sí, ahí estaré 🎉</label>
                <label className="radio-label"><input type="radio" name="attend" value="no"  checked={form.attend === 'no'}  onChange={set('attend')} /> No podré asistir</label>
              </div>
            </Field>
            <Field label="Número de acompañantes">
              <select value={form.guests} onChange={set('guests')}>
                <option value="0">Solo yo</option>
                <option value="1">1 acompañante</option>
                <option value="2">2 acompañantes</option>
                <option value="3">3 acompañantes</option>
                <option value="4+">4 o más</option>
              </select>
            </Field>
            <Field label="¿Restricción alimentaria?">
              <select value={form.diet} onChange={set('diet')}>
                <option value="">Ninguna</option>
                <option value="vegetariano">Vegetariano</option>
                <option value="vegano">Vegano</option>
                <option value="sin-gluten">Sin gluten</option>
                <option value="otra">Otra</option>
              </select>
            </Field>
            <Field label="Mensaje para la festejada (opcional)">
              <textarea value={form.message} onChange={set('message')} placeholder="Escríbeme algo especial..." />
            </Field>
            <button type="submit" className="rsvp__submit">Confirmar Asistencia</button>
          </form>
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
      <DressCode />
      <Spotify />
      <Gallery />
      <Gifts />
      <RSVP />
      <Footer />
      <OptionSwitcher />
    </>
  )
}
