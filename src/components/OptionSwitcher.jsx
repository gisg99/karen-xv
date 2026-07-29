import { useLocation, Link } from 'react-router-dom'

const OPTIONS = [
  { to: '/',        label: 'Opción 3' },
  { to: '/clasico', label: 'Clásico' },
]

export default function OptionSwitcher() {
  // `search` se arrastra al cambiar de diseño para no perder el ?id= del invitado
  const { pathname, search } = useLocation()
  return (
    <div className="opt-switcher" aria-label="Cambiar diseño">
      <span className="opt-switcher__label">Diseño</span>
      {OPTIONS.map(({ to, label }) => (
        <Link
          key={to}
          to={{ pathname: to, search }}
          className={`opt-btn${pathname === to ? ' opt-btn--active' : ''}`}
        >
          {label}
        </Link>
      ))}
    </div>
  )
}
