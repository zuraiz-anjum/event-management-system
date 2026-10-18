import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { isRegistered } from '../features/registrations/registrationsSlice.js'
import { formatEventDate, formatEventTime, formatLocation, formatPrice } from '../utils/format.js'

export default function EventCard({ event }) {
  const registered = useSelector((state) => isRegistered(state, event.id))
  const price = formatPrice(event)
  const location = formatLocation(event)

  return (
    <article className="event-card">
      <Link to={`/events/${event.id}`} className="event-card-image">
        {event.image ? (
          <img src={event.image} alt="" loading="lazy" />
        ) : (
          <div className="image-fallback">No image</div>
        )}
        {event.segment && <span className="tag">{event.segment}</span>}
        {registered && <span className="badge badge-upcoming">Registered</span>}
      </Link>
      <div className="event-card-body">
        <p className="event-date">
          {formatEventDate(event.localDate)}
          {event.localTime && !event.timeTBA ? `, ${formatEventTime(event.localTime)}` : ''}
        </p>
        <h3>
          <Link to={`/events/${event.id}`}>{event.name}</Link>
        </h3>
        {event.venueName && <p className="event-meta">{event.venueName}</p>}
        {location && <p className="event-meta muted">{location}</p>}
        {price && <p className="event-price">{price}</p>}
      </div>
    </article>
  )
}
