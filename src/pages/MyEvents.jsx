import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { EmptyState } from '../components/StatusMessage.jsx'
import { cancelRegistration, selectMyRegistrations } from '../features/registrations/registrationsSlice.js'
import { eventStartTime, hasEnded } from '../utils/eventTime.js'
import { formatEventDate, formatEventTime, formatLocation } from '../utils/format.js'

function RegistrationCard({ registration, completed, onCancel }) {
  const location = formatLocation(registration)

  return (
    <li className={`registration ${completed ? 'registration-done' : ''}`}>
      <div className="registration-image">
        {registration.image ? (
          <img src={registration.image} alt="" loading="lazy" />
        ) : (
          <div className="image-fallback">No image</div>
        )}
      </div>
      <div className="registration-body">
        <p className="event-date">
          {formatEventDate(registration.localDate)}, {formatEventTime(registration.localTime, registration.timeTBA)}
        </p>
        <h3>
          <Link to={`/events/${registration.eventId}`}>{registration.name}</Link>
        </h3>
        {registration.venueName && <p className="event-meta">{registration.venueName}</p>}
        {location && <p className="event-meta muted">{location}</p>}
      </div>
      <div className="registration-actions">
        <span className={`badge ${completed ? 'badge-done' : 'badge-upcoming'}`}>
          {completed ? 'Completed' : 'Upcoming'}
        </span>
        <Link to={`/events/${registration.eventId}`} className="btn btn-small">
          View
        </Link>
        {!completed && (
          <button type="button" className="btn btn-small btn-danger" onClick={() => onCancel(registration)}>
            Cancel
          </button>
        )}
      </div>
    </li>
  )
}

function Section({ title, items, completed, onCancel, emptyText }) {
  return (
    <section className="my-events-section">
      <h2>
        {title} <span className="count">{items.length}</span>
      </h2>
      {items.length === 0 ? (
        <p className="muted">{emptyText}</p>
      ) : (
        <ul className="registration-list">
          {items.map((r) => (
            <RegistrationCard key={r.eventId} registration={r} completed={completed} onCancel={onCancel} />
          ))}
        </ul>
      )}
    </section>
  )
}

export default function MyEvents() {
  const dispatch = useDispatch()
  const registrations = useSelector(selectMyRegistrations)
  // fixed when the page opens, so the split does not shift while it is open
  const [now] = useState(() => Date.now())

  const { upcoming, completed } = useMemo(() => {
    const byStart = (a, b) => (eventStartTime(a) ?? 0) - (eventStartTime(b) ?? 0)
    return {
      upcoming: registrations.filter((r) => !hasEnded(r, now)).sort(byStart),
      completed: registrations.filter((r) => hasEnded(r, now)).sort((a, b) => byStart(b, a)),
    }
  }, [registrations, now])

  const handleCancel = (registration) => {
    if (window.confirm(`Cancel your registration for ${registration.name}?`)) {
      dispatch(cancelRegistration(registration.eventId, registration.name))
    }
  }

  return (
    <>
      <div className="page-head">
        <h1>My Events</h1>
        <p className="muted">The events you have registered for.</p>
      </div>

      {registrations.length === 0 ? (
        <EmptyState title="You have not registered for any events yet">
          <Link to="/events">Find an event</Link> and register to see it here.
        </EmptyState>
      ) : (
        <>
          <Section
            title="Upcoming"
            items={upcoming}
            completed={false}
            onCancel={handleCancel}
            emptyText="No upcoming events."
          />
          <Section
            title="Completed"
            items={completed}
            completed
            onCancel={handleCancel}
            emptyText="No completed events yet."
          />
        </>
      )}
    </>
  )
}
