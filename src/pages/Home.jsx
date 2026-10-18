import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { fetchCategories, selectCategories } from '../features/events/eventsSlice.js'

export default function Home() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const categories = useSelector(selectCategories)
  const [keyword, setKeyword] = useState('')

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  const handleSearch = (event) => {
    event.preventDefault()
    const q = keyword.trim()
    navigate(q ? `/events?q=${encodeURIComponent(q)}` : '/events')
  }

  return (
    <>
      <section className="hero">
        <h1>Find your next event</h1>
        <p>Browse concerts, sports and shows, register and keep track of them in one place.</p>
        <form className="hero-search" onSubmit={handleSearch}>
          <input
            type="search"
            className="input"
            placeholder="Search for an artist, team or show"
            aria-label="Search events"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>
      </section>

      {categories.items.length > 0 && (
        <section className="home-section">
          <h2>Browse by category</h2>
          <div className="tag-row">
            {categories.items.map((c) => (
              <Link key={c.id} to={`/events?segment=${c.id}`} className="tag tag-plain tag-large">
                {c.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="home-section home-links">
        <Link to="/upcoming" className="link-card">
          <h3>Upcoming events</h3>
          <p className="muted">See what is happening in the next few weeks.</p>
        </Link>
        <Link to="/my-events" className="link-card">
          <h3>My events</h3>
          <p className="muted">The events you have registered for.</p>
        </Link>
      </section>
    </>
  )
}
