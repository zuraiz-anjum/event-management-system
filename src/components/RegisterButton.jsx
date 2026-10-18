import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import { selectIsLoggedIn } from '../features/auth/authSlice.js'
import {
  cancelRegistration,
  isRegistered,
  registerForEvent,
} from '../features/registrations/registrationsSlice.js'
import { hasEnded } from '../utils/eventTime.js'

export default function RegisterButton({ event }) {
  const dispatch = useDispatch()
  const location = useLocation()
  const loggedIn = useSelector(selectIsLoggedIn)
  const registered = useSelector((state) => isRegistered(state, event.id))

  if (!loggedIn) {
    return (
      <Link
        to="/login"
        state={{ from: location, needsLogin: true }}
        className="btn btn-block"
      >
        Log in to register
      </Link>
    )
  }

  if (registered) {
    return (
      <div className="registered-box">
        <p className="registered-note">You are registered for this event.</p>
        {!hasEnded(event) && (
          <button
            type="button"
            className="btn btn-danger btn-block"
            onClick={() => dispatch(cancelRegistration(event.id, event.name))}
          >
            Cancel registration
          </button>
        )}
      </div>
    )
  }

  if (hasEnded(event) || event.status === 'cancelled') {
    return (
      <button type="button" className="btn btn-block" disabled>
        Registration closed
      </button>
    )
  }

  return (
    <button
      type="button"
      className="btn btn-primary btn-block"
      onClick={() => dispatch(registerForEvent(event))}
    >
      Register for this event
    </button>
  )
}
