import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

const links = [
  { to: '/events', label: 'Events' },
  { to: '/upcoming', label: 'Upcoming' },
  { to: '/categories', label: 'Categories' },
  { to: '/my-events', label: 'My Events' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="brand" onClick={close}>
          Event<span>Hub</span>
        </Link>
        <button
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-label="Toggle navigation"
          onClick={() => setOpen((o) => !o)}
        >
          Menu
        </button>
        <nav className={`nav ${open ? 'nav-open' : ''}`}>
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} onClick={close}>
              {link.label}
            </NavLink>
          ))}
          <NavLink to="/login" onClick={close}>
            Log in
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
