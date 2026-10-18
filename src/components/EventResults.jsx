import EventCard from './EventCard.jsx'
import Pagination from './Pagination.jsx'
import { EmptyState, ErrorMessage, Spinner } from './StatusMessage.jsx'
import { MAX_PAGES } from '../utils/eventQuery.js'

export default function EventResults({ list, currentPage, onPageChange, onRetry }) {
  if (list.status === 'idle' || (list.status === 'loading' && !list.items.length)) {
    return <Spinner label="Finding events..." />
  }
  if (list.status === 'failed') {
    return <ErrorMessage message={list.error} onRetry={onRetry} />
  }
  if (!list.items.length) {
    return (
      <EmptyState title="No events found">
        Try a different keyword or loosen the filters.
      </EmptyState>
    )
  }

  const { totalElements, totalPages } = list.page
  const pages = Math.min(totalPages, MAX_PAGES)

  return (
    <section aria-busy={list.status === 'loading'}>
      <p className="result-count muted">
        {totalElements.toLocaleString()} {totalElements === 1 ? 'event' : 'events'} found
        {pages > 1 ? `, page ${currentPage} of ${pages}` : ''}
      </p>
      <div className={`event-grid ${list.status === 'loading' ? 'is-loading' : ''}`}>
        {list.items.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
      <Pagination current={currentPage} total={pages} onChange={onPageChange} />
    </section>
  )
}
