import { useSelector } from 'react-redux'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { selectIsLoggedIn } from '../features/auth/authSlice.js'

// Pages that need a logged in user. We remember where the user wanted to go.
export function RequireAuth() {
  const loggedIn = useSelector(selectIsLoggedIn)
  const location = useLocation()

  if (!loggedIn) {
    return <Navigate to="/login" replace state={{ from: location, needsLogin: true }} />
  }
  return <Outlet />
}

// Login and register make no sense for someone who is already logged in.
export function GuestOnly() {
  const loggedIn = useSelector(selectIsLoggedIn)
  const location = useLocation()
  const from = location.state?.from

  // send people back to the page that asked them to log in
  if (loggedIn) return <Navigate to={from ? from.pathname + from.search : '/events'} replace />
  return <Outlet />
}
