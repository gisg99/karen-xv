import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import './Modern.css'
import OptionSwitcher from '../components/OptionSwitcher'

const EVENT_DATE = new Date('2026-08-29T17:00:00')

/* ---------- reveal on scroll ---------- */
function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('mod-in'); obs.disconnect() } },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}

/* ---------- section index / side rail ---------- */
const SECTIONS = [
  { id: 'inicio',       n: '00', label: 'Inicio' },
  { id: 'cuenta',       n: '01', label: 'Cuenta' },
  { id: 'evento',       n: '02', label: 'Evento' },
  { id: 'lugar',        n: '03', label: 'Lugar' },
  { id: 'vestimenta',   n: '04', label: 'Vestimenta' },
  { id: 'musica',       n: '05', label: 'Música' },
  { id: 'galeria',      n: '06', label: 'Galería' },
  { id: 'regalos',      n: '07', label: 'Regalos' },
  { id: 'confirmacion', n: '08', label: 'RSVP' },
]

function SideRail() {
  const [active, setActive] = useState('inicio')
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id) }),
      { rootMargin: '-45% 0px -45% 0px' }
    )
    SECTIONS.forEach(s => { const el = document.getElementById(s.id); if (el) obs.observe(el) })
    return () => obs.disconnect()
  }, [])
  return (
    <aside className="mod-rail" aria-label="Índice de secciones">
      {SECTIONS.map(s => (
        <a key={s.id} href={`#${s.id}`} className={`mod-rail__dot${active === s.id ? ' is-on' : ''}`}>
          <span className="mod-rail__n">{s.n}</span>
          <span className="mod-rail__lbl">{s.label}</span>
        </a>
      ))}
    </aside>
  )
}

function TopBar() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])
  return (
    <header className={`mod-top${scrolled ? ' is-solid' : ''}`}>
      <span className="mod-top__mark">K<span>·</span>E</span>
      <span className="mod-top__tag">XV · MMXXVI</span>
      <a href="#confirmacion" className="mod-top__cta">Confirmar</a>
    </header>
  )
}

/* ---------- hero ---------- */
function Hero() {
  const marquee = useMemo(() => Array.from({ length: 6 }, () => 'KAREN ELIZABETH'), [])
  return (
    <section className="mod-hero" id="inicio">
      <div className="mod-hero__bg" aria-hidden="true">
        <span className="mod-hero__blob mod-hero__blob--a" />
        <span className="mod-hero__blob mod-hero__blob--b" />
        <span className="mod-hero__grid" />
      </div>

      <div className="mod-hero__body">
        <div className="mod-hero__left">
          <p className="mod-hero__eyebrow">Mis Quince Años</p>
          <h1 className="mod-hero__title">
            <span className="mod-hero__line">Karen</span>
            <span className="mod-hero__line mod-hero__line--out">Elizabeth</span>
          </h1>
          <div className="mod-hero__meta">
            <span>29·08·2026</span>
            <span className="mod-hero__dot" aria-hidden="true" />
            <span>El Salto, Jalisco</span>
          </div>
        </div>

        <div className="mod-hero__right" aria-hidden="true">
          <div className="mod-hero__xv">
            <span className="mod-hero__xv-num">XV</span>
            <span className="mod-hero__xv-word">años</span>
          </div>
        </div>
      </div>

      <div className="mod-hero__marquee" aria-hidden="true">
        <div className="mod-hero__track">
          {marquee.concat(marquee).map((t, i) => (
            <span key={i} className="mod-hero__mword">{t}<i>✦</i></span>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------- countdown ---------- */
function Countdown() {
  const [t, setT] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  useEffect(() => {
    const tick = () => {
      const diff = EVENT_DATE - Date.now()
      if (diff <= 0) return
      setT({
        days:    Math.floor(diff / 86400000),
        hours:   Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  const pad = (n, l = 2) => String(n).padStart(l, '0')
  const units = [
    { v: pad(t.days, 3), l: 'Días' },
    { v: pad(t.hours),   l: 'Horas' },
    { v: pad(t.minutes), l: 'Minutos' },
    { v: pad(t.seconds), l: 'Segundos' },
  ]
  const ref = useReveal()
  return (
    <section className="mod-count" id="cuenta">
      <div className="mod-count__band" ref={ref}>
        <div className="mod-count__intro">
          <span className="mod-kicker">01 — La espera</span>
          <h2 className="mod-count__h">Falta poco para<br />el gran día</h2>
        </div>
        <div className="mod-count__clock">
          {units.map((u, i) => (
            <div key={u.l} className="mod-count__cell" style={{ '--i': i }}>
              <span className="mod-count__num">{u.v}</span>
              <span className="mod-count__lbl">{u.l}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------- section header helper ---------- */
function SectionHead({ n, kicker, title, sub, light }) {
  return (
    <div className={`mod-head${light ? ' mod-head--light' : ''}`}>
      <span className="mod-kicker">{n} — {kicker}</span>
      <h2 className="mod-head__title">{title}</h2>
      {sub && <p className="mod-head__sub">{sub}</p>}
    </div>
  )
}

/* ---------- events (timeline) ---------- */
const EVENTS = [
  { tag: 'Ceremonia', icon: '⛪', time: '5:00 PM', name: 'Parroquia Madre Admirable', addr: 'Manuel Acuña 32, Centro', city: '45680 El Salto, Jalisco' },
  { tag: 'Recepción', icon: '✦', time: '7:00 PM', name: 'Aura Lounge Salón de eventos', addr: 'Constitución 501, Potrero Nuevo', city: '45680 El Salto, Jalisco' },
]

function Events() {
  const ref = useReveal()
  return (
    <section className="mod-events" id="evento">
      <SectionHead n="02" kicker="El itinerario" title="Cómo será el día" sub="Acompáñame en cada momento de esta celebración" />
      <div className="mod-timeline" ref={ref}>
        <span className="mod-timeline__line" aria-hidden="true" />
        {EVENTS.map((e, i) => (
          <article key={e.tag} className={`mod-tevent mod-tevent--${i % 2 ? 'right' : 'left'}`}>
            <div className="mod-tevent__node" aria-hidden="true">{e.icon}</div>
            <div className="mod-tevent__card">
              <div className="mod-tevent__top">
                <span className="mod-tevent__tag">{e.tag}</span>
                <span className="mod-tevent__time">{e.time}</span>
              </div>
              <h3 className="mod-tevent__name">{e.name}</h3>
              <p className="mod-tevent__addr">{e.addr}</p>
              <p className="mod-tevent__addr">{e.city}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

/* ---------- maps ---------- */
const MAPS = [
  {
    icon: '⛪', title: 'La Iglesia',
    name: 'Parroquia Madre Admirable', line: 'Manuel Acuña 32, Centro, 45680 El Salto, Jal.',
    embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3736.7004633024944!2d-103.1798849240877!3d20.518501881006213!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x842f4a7459787c1f%3A0x3044b914080c0df!2sParroquia%20Madre%20Admirable!5e0!3m2!1ses!2smx!4v1784688669003!5m2!1ses!2smx',
    link: 'https://www.google.com/maps/search/Parroquia+Madre+Admirable+Manuel+Acu%C3%B1a+32+Centro+El+Salto+Jalisco',
  },
  {
    icon: '✦', title: 'El Salón',
    name: 'Aura Lounge Salón de eventos', line: 'Constitución 501, Potrero Nuevo, 45680 El Salto, Jal.',
    embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d467.09829442130024!2d-103.19114144325877!3d20.514982567088513!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x842f4a6ca58fce89%3A0x455566a86e8c526d!2sConstituci%C3%B3n%20501%2C%20Potrero%20Nuevo%2C%2045680%20El%20Salto%2C%20Jal.!5e0!3m2!1ses!2smx!4v1784688502095!5m2!1ses!2smx',
    link: 'https://www.google.com/maps/search/Aura+Lounge+Sal%C3%B3n+de+eventos+Constituci%C3%B3n+501+Potrero+Nuevo+El+Salto+Jalisco',
  },
]

function Maps() {
  const ref = useReveal()
  return (
    <section className="mod-maps" id="lugar">
      <SectionHead n="03" kicker="¿Cómo llegar?" title="Las ubicaciones" />
      <div className="mod-maps__grid" ref={ref}>
        {MAPS.map(m => (
          <article key={m.title} className="mod-map">
            <div className="mod-map__frame">
              <iframe title={`Mapa ${m.title}`} src={m.embed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
            </div>
            <div className="mod-map__info">
              <h3><span aria-hidden="true">{m.icon}</span> {m.title}</h3>
              <p>{m.name}<br />{m.line}</p>
              <a href={m.link} target="_blank" rel="noopener noreferrer" className="mod-btn mod-btn--ghost">Abrir en Maps →</a>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

/* ---------- dress code ---------- */
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
  const ref = useReveal()
  return (
    <section className="mod-dress" id="vestimenta">
      <div className="mod-dress__inner" ref={ref}>
        <div className="mod-dress__head">
          <SectionHead n="04" kicker="A tomar en cuenta" title="Código de vestimenta" light />
          <span className="mod-dress__format">Formal · Elegante</span>
        </div>
        <div className="mod-dress__cards">
          {DRESS_ITEMS.map((d, i) => (
            <div key={d.type} className="mod-dcard" style={{ '--i': i }}>
              <span className="mod-dcard__icon" aria-hidden="true">{d.icon}</span>
              <h3 className="mod-dcard__type">{d.type}</h3>
              <p className="mod-dcard__desc">{d.desc}</p>
            </div>
          ))}
        </div>
        <div className="mod-dress__palette">
          <p className="mod-dress__plbl">Paleta sugerida</p>
          <div className="mod-swatches">
            {SWATCHES.map(s => (
              <div key={s.hex} className="mod-swatch" style={{ background: s.hex }}>
                <span className="mod-swatch__name">{s.name}</span>
              </div>
            ))}
          </div>
          <p className="mod-dress__note">
            Se solicita amablemente no utilizar <strong>rosa palo, blanco ni plateado</strong>,
            reservados para la quinceañera y su corte de honor.
          </p>
        </div>
      </div>
    </section>
  )
}

/* ---------- spotify ---------- */
function Spotify() {
  const ref = useReveal()
  return (
    <section className="mod-music" id="musica">
      <div className="mod-music__grid" ref={ref}>
        <div className="mod-music__aside">
          <SectionHead n="05" kicker="El soundtrack" title="Mi playlist" sub="Las canciones que me acompañarán en este día" />
          <span className="mod-music__eq" aria-hidden="true"><i /><i /><i /><i /><i /></span>
        </div>
        <div className="mod-music__player">
          <iframe
            title="Playlist Karen Elizabeth XV"
            style={{ borderRadius: 16 }}
            src="https://open.spotify.com/embed/playlist/2201cipi8KdUD35HkObKjO?utm_source=generator&theme=0"
            width="100%" height="460" frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  )
}

/* ---------- gallery ---------- */
const GALLERY_PHOTOS = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  src: `https://picsum.photos/seed/k${String(i + 1).padStart(2, '0')}/700/700`,
}))

function Gallery() {
  const ref = useReveal()
  return (
    <section className="mod-gallery" id="galeria">
      <SectionHead n="06" kicker="Nuestros momentos" title="Galería" sub="Los recuerdos más especiales de este día único" />
      <p className="mod-gallery__note">Las fotos de la celebración estarán disponibles muy pronto ✦</p>
      <div className="mod-gallery__grid" ref={ref}>
        {GALLERY_PHOTOS.map((p, i) => (
          <figure key={p.id} className={`mod-gitem mod-gitem--s${(i % 5) + 1}`}>
            <img src={p.src} alt={`Recuerdo ${p.id}`} loading="lazy" />
            <figcaption aria-hidden="true">✦</figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

/* ---------- gifts ---------- */
function Gifts() {
  const ref = useReveal()
  return (
    <section className="mod-gifts" id="regalos">
      <div className="mod-gifts__inner" ref={ref}>
        <div className="mod-gifts__text">
          <SectionHead n="07" kicker="Mesa de regalos" title="Si deseas obsequiarme algo" light />
          <p className="mod-gifts__quote">
            "Tu presencia es el mejor regalo que puedo recibir. Sin embargo, si deseas obsequiarme algo,
            he preparado una selección con artículos que llenan mi corazón de ilusión."
          </p>
          <div className="mod-gifts__btns">
            <a href="#" className="mod-btn mod-btn--filled">Liverpool →</a>
            <a href="#" className="mod-btn mod-btn--ghost mod-btn--ghost-light">Amazon Wishlist →</a>
          </div>
        </div>
        <div className="mod-gifts__bank">
          <span className="mod-gifts__bank-tag">Depósito directo</span>
          <dl>
            <div><dt>Banco</dt><dd>BBVA</dd></div>
            <div><dt>Titular</dt><dd>Karen Elizabeth Gonzalez Osorio</dd></div>
            <div><dt>Cuenta</dt><dd>1234 5678 9012 3456</dd></div>
            <div><dt>CLABE</dt><dd>012 580 01234567890 1</dd></div>
          </dl>
        </div>
      </div>
    </section>
  )
}

/* ---------- rsvp ---------- */
const FORM_INIT = { name: '', phone: '', attend: 'yes', guests: '0', diet: '', message: '' }

function RSVP() {
  const [form, setForm] = useState(FORM_INIT)
  const [done, setDone] = useState(false)
  const ref = useReveal()
  const set = useCallback(k => e => setForm(f => ({ ...f, [k]: e.target.value })), [])
  const submit = e => { e.preventDefault(); setDone(true) }
  return (
    <section className="mod-rsvp" id="confirmacion">
      <div className="mod-rsvp__grid" ref={ref}>
        <div className="mod-rsvp__aside">
          <SectionHead n="08" kicker="Confirmación" title="¿Nos acompañas?" light />
          <p className="mod-rsvp__deadline">Confirma tu asistencia<br />antes del <strong>31 de octubre de 2026</strong></p>
        </div>
        <div className="mod-rsvp__panel">
          {done ? (
            <div className="mod-rsvp__ok">
              <span aria-hidden="true">🌸</span>
              <h3>¡Gracias por confirmar!</h3>
              <p>Tu respuesta ha sido recibida. No puedo esperar a compartir este día tan especial contigo.</p>
              <p className="mod-rsvp__love">Con amor, Karen Elizabeth ♡</p>
            </div>
          ) : (
            <form className="mod-form" onSubmit={submit} noValidate>
              <div className="mod-field mod-field--full">
                <label>Nombre completo</label>
                <input type="text" value={form.name} onChange={set('name')} placeholder="Tu nombre completo" required />
              </div>
              <div className="mod-field">
                <label>Teléfono / WhatsApp</label>
                <input type="tel" value={form.phone} onChange={set('phone')} placeholder="+52 81 0000 0000" />
              </div>
              <div className="mod-field">
                <label>¿Asistirás?</label>
                <div className="mod-toggle">
                  <label className={form.attend === 'yes' ? 'is-on' : ''}>
                    <input type="radio" name="attend" value="yes" checked={form.attend === 'yes'} onChange={set('attend')} /> Sí 🎉
                  </label>
                  <label className={form.attend === 'no' ? 'is-on' : ''}>
                    <input type="radio" name="attend" value="no" checked={form.attend === 'no'} onChange={set('attend')} /> No podré
                  </label>
                </div>
              </div>
              <div className="mod-field">
                <label>Acompañantes</label>
                <select value={form.guests} onChange={set('guests')}>
                  <option value="0">Solo yo</option>
                  <option value="1">1 acompañante</option>
                  <option value="2">2 acompañantes</option>
                  <option value="3">3 acompañantes</option>
                  <option value="4+">4 o más</option>
                </select>
              </div>
              <div className="mod-field">
                <label>¿Restricción alimentaria?</label>
                <select value={form.diet} onChange={set('diet')}>
                  <option value="">Ninguna</option>
                  <option value="vegetariano">Vegetariano</option>
                  <option value="vegano">Vegano</option>
                  <option value="sin-gluten">Sin gluten</option>
                  <option value="otra">Otra</option>
                </select>
              </div>
              <div className="mod-field mod-field--full">
                <label>Mensaje para la festejada (opcional)</label>
                <textarea value={form.message} onChange={set('message')} placeholder="Escríbeme algo especial..." />
              </div>
              <button type="submit" className="mod-btn mod-btn--filled mod-form__submit">Confirmar asistencia</button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="mod-footer">
      <div className="mod-footer__mark">Karen<span>Elizabeth</span></div>
      <p className="mod-footer__date">Sábado, 29 de Agosto de 2026 · El Salto, Jalisco</p>
      <p className="mod-footer__love">Con todo mi amor los espero ♡</p>
      <span className="mod-footer__xv" aria-hidden="true">XV</span>
    </footer>
  )
}

export default function Modern() {
  return (
    <div className="mod">
      <TopBar />
      <SideRail />
      <main>
        <Hero />
        <Countdown />
        <Events />
        <Maps />
        <DressCode />
        <Spotify />
        <Gallery />
        <Gifts />
        <RSVP />
      </main>
      <Footer />
      <OptionSwitcher />
    </div>
  )
}
