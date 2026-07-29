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
      {/* Sobre cerrado: solapa + costuras que convergen en el sello */}
      <svg className="welcome__envelope" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <polygon className="welcome__flap-fill" points="0,0 100,0 50,55" />
        <path className="welcome__seam" d="M0,0 L50,55 L100,0" />
        <path className="welcome__seam" d="M0,100 L50,55 L100,100" />
        <path className="welcome__seam welcome__seam--v" d="M50,55 L50,100" />
      </svg>

      {/* Arco de flores en la parte superior */}
      <img className="welcome__top" src="/top_flowers.webp" alt="" aria-hidden="true" />

      <div className="welcome__content">
        <p className="welcome__mis">Mis XV</p>
        <h1 className="welcome__name">Karen Elizabeth</h1>
      </div>

      {/* Sello de cera que cierra la carta */}
      <img className="welcome__seal-img" src="/sello.webp" alt="Sello XV Años" />

      <p className="welcome__hint">Toca para abrir la invitación ✦</p>
    </div>
  )
}
