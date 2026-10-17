import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { logout, selectUser } from '../features/auth/authSlice.js'
import { showToast } from '../features/toast/toastSlice.js'

const links = [
  { to: '/events', label: 'Events' },
  { to: '/upcoming', label: 'Upcoming' },
  { to: '/categories', label: 'Categories' },
]

export default function Header() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(selectUser)
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  const handleLogout = () => {
    dispatch(logout())
    dispatch(showToast('You have been logged out.', 'info'))
    close()
    navigate('/')
  }

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
          <NavLink to="/my-events" onClick={close}>
            My Events
          </NavLink>
          {user ? (
            <>
              <span className="nav-user">{user.name}</span>
              <button type="button" className="nav-button" onClick={handleLogout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" onClick={close}>
                Log in
              </NavLink>
              <NavLink to="/register" onClick={close}>
                Sign up
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
