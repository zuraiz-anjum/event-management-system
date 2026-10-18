import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { ErrorMessage, Spinner } from '../components/StatusMessage.jsx'
import { fetchCategories, selectCategories } from '../features/events/eventsSlice.js'

export default function Categories() {
  const dispatch = useDispatch()
  const { items, status, error } = useSelector(selectCategories)

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  return (
    <>
      <div className="page-head">
        <h1>Categories</h1>
        <p className="muted">Pick a category or a genre to see matching events.</p>
      </div>

      {status === 'failed' && (
        <ErrorMessage message={error} onRetry={() => dispatch(fetchCategories())} />
      )}
      {(status === 'idle' || status === 'loading') && <Spinner label="Loading categories..." />}

      <div className="category-grid">
        {items.map((segment) => (
          <section key={segment.id} className="category-card">
            <h2>
              <Link to={`/events?segment=${segment.id}`}>{segment.name}</Link>
            </h2>
            <div className="tag-row">
              {segment.genres.slice(0, 12).map((genre) => (
                <Link
                  key={genre.id}
                  className="tag tag-plain"
                  to={`/events?segment=${segment.id}&genre=${genre.id}`}
                >
                  {genre.name}
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  )
}
