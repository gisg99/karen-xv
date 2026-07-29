import { useState, useEffect, useCallback } from 'react'
import './Welcome.css'

export default function Welcome() {
  const [leaving, setLeaving] = useState(false)
  const [gone, setGone] = useState(false)

  const open = useCallback(() => {
    if (leaving) return
    setLeaving(true)
    // Avisa a los reproductores para que arranque la música con el gesto del clic
    window.dispatchEvent(new Event('invite:open'))
    window.setTimeout(() => setGone(true), 900)
  }, [leaving])

  // Bloquea el scroll de fondo mientras se muestra la bienvenida
  useEffect(() => {
    if (gone) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [gone])

  if (gone) return null

  return (
    <div
      className={`welcome${leaving ? ' welcome--leaving' : ''}`}
      role="button"
      tabIndex={0}
      aria-label="Abrir invitación"
      onClick={open}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') open() }}
    >
      <div className="welcome__seam" aria-hidden="true" />

      <div className="welcome__content">
        <p className="welcome__mis">Mis XV</p>
        <h1 className="welcome__name">Karen Elizabeth</h1>
      </div>

      {/* Sello de cera con tiara */}
      <div className="welcome__seal" aria-hidden="true">
        <svg viewBox="0 0 120 120" className="welcome__flowers welcome__flowers--seal">
          <g fill="#b9cfe4">
            <circle cx="96" cy="34" r="7" /><circle cx="108" cy="44" r="6" />
            <circle cx="100" cy="56" r="7" /><circle cx="110" cy="66" r="5" />
            <circle cx="98" cy="78" r="6" /><circle cx="90" cy="66" r="5" />
          </g>
          <g fill="#8fb0d0" opacity="0.7">
            <circle cx="96" cy="34" r="2.4" /><circle cx="100" cy="56" r="2.4" />
            <circle cx="98" cy="78" r="2.2" />
          </g>
        </svg>
        <div className="welcome__seal-disc">
          <div className="welcome__seal-inner">
            <svg viewBox="0 0 64 40" className="welcome__tiara">
              <path
                d="M6 34 L10 14 L20 26 L32 8 L44 26 L54 14 L58 34 Z"
                fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinejoin="round" strokeLinecap="round"
              />
              <circle cx="10" cy="12" r="2.4" fill="currentColor" />
              <circle cx="32" cy="6"  r="2.8" fill="currentColor" />
              <circle cx="54" cy="12" r="2.4" fill="currentColor" />
              <line x1="6" y1="34" x2="58" y2="34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="welcome__seal-xv">XV</span>
            <span className="welcome__seal-anios">Años</span>
          </div>
        </div>
      </div>

      {/* Silueta de castillo */}
      <svg className="welcome__castle" viewBox="0 0 340 300" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
        <g fill="currentColor">
          {/* torres laterales */}
          <rect x="8" y="150" width="34" height="150" />
          <polygon points="4,150 25,112 46,150" />
          <rect x="23" y="92" width="4" height="22" />
          <polygon points="27,94 45,100 27,106" />

          <rect x="300" y="150" width="34" height="150" />
          <polygon points="296,150 317,112 338,150" />
          <rect x="315" y="92" width="4" height="22" />
          <polygon points="319,94 337,100 319,106" />

          {/* torres intermedias */}
          <rect x="70" y="120" width="40" height="180" />
          <polygon points="64,120 90,74 116,120" />
          <rect x="88" y="52" width="4" height="24" />
          <polygon points="92,54 112,60 92,66" />

          <rect x="230" y="120" width="40" height="180" />
          <polygon points="224,120 250,74 276,120" />
          <rect x="248" y="52" width="4" height="24" />
          <polygon points="252,54 272,60 252,66" />

          {/* cuerpo central */}
          <rect x="120" y="150" width="100" height="150" />
          {/* almenas */}
          <rect x="120" y="140" width="14" height="14" />
          <rect x="148" y="140" width="14" height="14" />
          <rect x="178" y="140" width="14" height="14" />
          <rect x="206" y="140" width="14" height="14" />
          {/* torre central alta */}
          <rect x="150" y="70" width="40" height="86" />
          <polygon points="142,70 170,20 198,70" />
          <rect x="168" y="0" width="4" height="22" />
          <polygon points="172,2 194,9 172,16" />

          {/* puerta */}
          <path d="M154 300 L154 232 A16 16 0 0 1 186 232 L186 300 Z" fill="#a9c2da" />
        </g>
      </svg>

      <p className="welcome__hint">Toca para abrir la invitación ✦</p>
    </div>
  )
}
