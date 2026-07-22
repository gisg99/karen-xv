import { useLocation, Link } from 'react-router-dom'

const OPTIONS = [
  { to: '/',       label: 'Clásico' },
  { to: '/modern', label: 'Moderno' },
]

export default function OptionSwitcher() {
  const { pathname } = useLocation()
  return (
    <div className="opt-switcher" aria-label="Cambiar diseño">
      <span className="opt-switcher__label">Diseño</span>
      {OPTIONS.map(({ to, label }) => (
        <Link
          key={to}
          to={to}
          className={`opt-btn${pathname === to ? ' opt-btn--active' : ''}`}
        >
          {label}
        </Link>
      ))}
    </div>
  )
}
