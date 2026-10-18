import { SORT_OPTIONS, UPCOMING_RANGES } from '../utils/eventQuery.js'

// The filters are controlled by the URL, the parent passes the values and a change handler.
export default function EventFilters({ filters, categories, mode, onChange, onClear }) {
  const selectedSegment = categories.find((c) => c.id === filters.segment)
  const genres = selectedSegment ? selectedSegment.genres : []

  const handleInput = (event) => onChange({ [event.target.name]: event.target.value })

  const handleSegment = (event) => onChange({ segment: event.target.value, genre: '' })

  return (
    <form className="filters" onSubmit={(e) => e.preventDefault()} aria-label="Search and filter events">
      <div className="filters-row">
        <div className="field field-grow">
          <label htmlFor="q">Search</label>
          <input
            id="q"
            name="q"
            type="search"
            className="input"
            placeholder="Artist, team or event name"
            value={filters.q}
            onChange={handleInput}
          />
        </div>
        <div className="field">
          <label htmlFor="city">City</label>
          <input
            id="city"
            name="city"
            type="text"
            className="input"
            placeholder="e.g. Chicago"
            value={filters.city}
            onChange={handleInput}
          />
        </div>
      </div>

      <div className="filters-row">
        <div className="field">
          <label htmlFor="segment">Category</label>
          <select id="segment" className="input" value={filters.segment} onChange={handleSegment}>
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="genre">Genre</label>
          <select
            id="genre"
            name="genre"
            className="input"
            value={filters.genre}
            onChange={handleInput}
            disabled={!genres.length}
          >
            <option value="">All genres</option>
            {genres.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>
        {mode === 'all' ? (
          <>
            <div className="field">
              <label htmlFor="from">From</label>
              <input
                id="from"
                name="from"
                type="date"
                className="input"
                value={filters.from}
                max={filters.to || undefined}
                onChange={handleInput}
              />
            </div>
            <div className="field">
              <label htmlFor="to">To</label>
              <input
                id="to"
                name="to"
                type="date"
                className="input"
                value={filters.to}
                min={filters.from || undefined}
                onChange={handleInput}
              />
            </div>
          </>
        ) : (
          <div className="field">
            <label htmlFor="days">Time window</label>
            <select id="days" name="days" className="input" value={filters.days} onChange={handleInput}>
              {UPCOMING_RANGES.map((d) => (
                <option key={d} value={d}>
                  Next {d} days
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="field">
          <label htmlFor="sort">Sort by</label>
          <select id="sort" name="sort" className="input" value={filters.sort || ''} onChange={handleInput}>
            <option value="">Default</option>
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button type="button" className="btn btn-small" onClick={onClear}>
        Clear filters
      </button>
    </form>
  )
}
