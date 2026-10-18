export const PAGE_SIZE = 12

// The API does not return results past item 1000 (size * page must stay below that).
export const MAX_PAGES = Math.floor(1000 / PAGE_SIZE)

export const SORT_OPTIONS = [
  { value: 'date,asc', label: 'Soonest first' },
  { value: 'date,desc', label: 'Latest first' },
  { value: 'name,asc', label: 'Name A to Z' },
  { value: 'relevance,desc', label: 'Most relevant' },
]

export const UPCOMING_RANGES = [7, 30, 90]

export function toDateInput(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function addDays(days) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return toDateInput(date)
}

// Read the filters from the URL so a search can be shared or bookmarked.
export function readFilters(searchParams) {
  const page = parseInt(searchParams.get('page'), 10)
  const days = parseInt(searchParams.get('days'), 10)
  return {
    q: searchParams.get('q') || '',
    segment: searchParams.get('segment') || '',
    genre: searchParams.get('genre') || '',
    city: searchParams.get('city') || '',
    from: searchParams.get('from') || '',
    to: searchParams.get('to') || '',
    sort: searchParams.get('sort') || '',
    days: UPCOMING_RANGES.includes(days) ? days : 30,
    page: page > 0 ? Math.min(page, MAX_PAGES) : 1,
  }
}

// Build the query for the events endpoint from the page filters.
export function toApiParams(filters, mode = 'all') {
  // never list events that already happened, the API would otherwise start with old ones
  const from = filters.from || toDateInput(new Date())
  let to = filters.to
  if (mode === 'upcoming') {
    to = to || addDays(filters.days)
  }

  return {
    keyword: filters.q.trim(),
    segmentId: filters.segment,
    genreId: filters.genre,
    city: filters.city.trim(),
    startDateTime: from ? `${from}T00:00:00Z` : '',
    endDateTime: to ? `${to}T23:59:59Z` : '',
    sort: filters.sort || (filters.q.trim() ? 'relevance,desc' : 'date,asc'),
    page: filters.page - 1,
    size: PAGE_SIZE,
  }
}
