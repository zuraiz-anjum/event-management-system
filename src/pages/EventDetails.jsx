import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import RegisterButton from '../components/RegisterButton.jsx'
import { ErrorMessage, Spinner } from '../components/StatusMessage.jsx'
import { fetchEventDetails } from '../features/events/eventsSlice.js'
import {
  formatDateTime,
  formatEventDate,
  formatEventTime,
  formatLocation,
  formatPrice,
} from '../utils/format.js'

function InfoRow({ label, children }) {
  if (!children) return null
  return (
    <div className="info-row">
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  )
}

export default function EventDetails() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const event = useSelector((state) => state.events.details.byId[id])
  const status = useSelector((state) => state.events.details.statusById[id])
  const error = useSelector((state) => state.events.details.errorById[id])

  useEffect(() => {
    dispatch(fetchEventDetails(id))
  }, [dispatch, id])

  if (!event && status === 'failed') {
    return (
      <>
        <Link to="/events" className="back-link">Back to events</Link>
        <ErrorMessage message={error} onRetry={() => dispatch(fetchEventDetails(id))} />
      </>
    )
  }
  if (!event) return <Spinner label="Loading event..." />

  const location = formatLocation(event)
  const categories = [event.segment, event.genre, event.subGenre].filter(Boolean)
  const cancelled = event.status === 'cancelled' || event.status === 'postponed'

  return (
    <article className="details">
      <Link to="/events" className="back-link">Back to events</Link>

      <div className="details-hero">
        {event.image ? (
          <img src={event.image} alt={event.name} />
        ) : (
          <div className="image-fallback">No image available</div>
        )}
      </div>

      <div className="details-layout">
        <div className="details-main">
          {categories.length > 0 && (
            <div className="tag-row">
              {categories.map((c) => (
                <span key={c} className="tag tag-plain">{c}</span>
              ))}
            </div>
          )}
          <h1>{event.name}</h1>
          {cancelled && (
            <p className="form-error">This event is {event.status}. Check the organiser for updates.</p>
          )}

          {event.attractions.length > 0 && (
            <p className="muted">Featuring {event.attractions.join(', ')}</p>
          )}
          {event.info && (
            <section>
              <h2>About this event</h2>
              <p>{event.info}</p>
            </section>
          )}
          {event.pleaseNote && (
            <section>
              <h2>Please note</h2>
              <p>{event.pleaseNote}</p>
            </section>
          )}
          {event.seatmap && (
            <section>
              <h2>Seat map</h2>
              <img className="seatmap" src={event.seatmap} alt={`Seat map for ${event.venueName || 'the venue'}`} />
            </section>
          )}
        </div>

        <aside className="details-side">
          <dl>
            <InfoRow label="Date">{formatEventDate(event.localDate)}</InfoRow>
            <InfoRow label="Time">{formatEventTime(event.localTime, event.timeTBA)}</InfoRow>
            <InfoRow label="Venue">{event.venueName}</InfoRow>
            <InfoRow label="Address">{event.address}</InfoRow>
            <InfoRow label="Location">{location}</InfoRow>
            <InfoRow label="Price">{formatPrice(event)}</InfoRow>
            <InfoRow label="Promoter">{event.promoter}</InfoRow>
            <InfoRow label="Tickets on sale">{formatDateTime(event.onSaleStart)}</InfoRow>
          </dl>
          <div className="details-actions">
            <RegisterButton event={event} />
            {event.url && (
              <a className="btn btn-primary btn-block" href={event.url} target="_blank" rel="noreferrer">
                Buy tickets on Ticketmaster
              </a>
            )}
          </div>
        </aside>
      </div>
    </article>
  )
}
