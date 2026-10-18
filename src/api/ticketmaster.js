const BASE_URL = 'https://app.ticketmaster.com/discovery/v2'

// The free key allows 2 requests per second, so keep calls at least this far apart.
const MIN_GAP_MS = 550
let nextSlot = 0

function waitForSlot() {
  const now = Date.now()
  const start = Math.max(now, nextSlot)
  nextSlot = start + MIN_GAP_MS
  return new Promise((resolve) => setTimeout(resolve, start - now))
}

function getApiKey() {
  const key = import.meta.env?.VITE_TICKETMASTER_API_KEY
  if (!key || key === 'your_key_here') {
    throw new Error(
      'Missing Ticketmaster API key. Add VITE_TICKETMASTER_API_KEY to your .env file and restart the dev server.',
    )
  }
  return key
}

export function buildUrl(path, params = {}) {
  const url = new URL(`${BASE_URL}/${path}`)
  Object.entries(params).forEach(([name, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(name, value)
    }
  })
  url.searchParams.set('apikey', getApiKey())
  return url
}

async function request(path, params, retried = false) {
  const url = buildUrl(path, params)
  await waitForSlot()

  let response
  try {
    response = await fetch(url)
  } catch {
    throw new Error('Could not reach Ticketmaster. Check your internet connection and try again.')
  }

  if (response.status === 429 && !retried) {
    // we went over the rate limit, wait a moment and try once more
    await new Promise((resolve) => setTimeout(resolve, 1100))
    return request(path, params, true)
  }
  if (response.status === 429) {
    throw new Error('Too many requests to Ticketmaster. Please wait a few seconds and try again.')
  }
  if (response.status === 401) {
    throw new Error('Ticketmaster rejected the API key. Check the value in your .env file.')
  }
  if (response.status === 404) {
    throw new Error('We could not find what you were looking for.')
  }
  if (!response.ok) {
    throw new Error(`Ticketmaster returned an error (${response.status}). Please try again.`)
  }
  return response.json()
}

function pickImage(images = []) {
  const wide = images.filter((img) => img.ratio === '16_9')
  const pool = wide.length ? wide : images
  if (!pool.length) return null
  // smallest image that is still at least 640px wide, otherwise the biggest one
  const sorted = [...pool].sort((a, b) => a.width - b.width)
  return (sorted.find((img) => img.width >= 640) || sorted[sorted.length - 1]).url
}

function clean(name) {
  return name && name.toLowerCase() !== 'undefined' ? name : null
}

// Turn the large API response into the small plain object the app needs.
export function normalizeEvent(raw) {
  const venue = raw._embedded?.venues?.[0]
  const classification = raw.classifications?.find((c) => c.primary) || raw.classifications?.[0]
  const start = raw.dates?.start || {}
  const price = raw.priceRanges?.[0]

  return {
    id: raw.id,
    name: raw.name,
    url: raw.url || null,
    image: pickImage(raw.images),
    localDate: start.localDate || null,
    localTime: start.localTime || null,
    dateTime: start.dateTime || null,
    timeTBA: Boolean(start.timeTBA || start.noSpecificTime),
    status: raw.dates?.status?.code || null,
    venueName: venue?.name || null,
    address: venue?.address?.line1 || null,
    city: venue?.city?.name || null,
    state: venue?.state?.stateCode || venue?.state?.name || null,
    country: venue?.country?.name || null,
    segment: clean(classification?.segment?.name),
    genre: clean(classification?.genre?.name),
    subGenre: clean(classification?.subGenre?.name),
    priceMin: price?.min ?? null,
    priceMax: price?.max ?? null,
    currency: price?.currency || null,
    info: raw.info || null,
    pleaseNote: raw.pleaseNote || null,
    seatmap: raw.seatmap?.staticUrl || null,
    promoter: raw.promoter?.name || null,
    attractions: (raw._embedded?.attractions || []).map((a) => a.name),
    onSaleStart: raw.sales?.public?.startDateTime || null,
  }
}

export async function fetchEventsPage(params) {
  const data = await request('events.json', params)
  return {
    items: (data._embedded?.events || []).map(normalizeEvent),
    page: {
      number: data.page?.number ?? 0,
      size: data.page?.size ?? 0,
      totalElements: data.page?.totalElements ?? 0,
      totalPages: data.page?.totalPages ?? 0,
    },
  }
}

export async function fetchEventById(id) {
  const data = await request(`events/${encodeURIComponent(id)}.json`)
  return normalizeEvent(data)
}

export async function fetchSegments() {
  const data = await request('classifications.json', { size: 50 })
  const classifications = data._embedded?.classifications || []

  // each classification has one segment with its genres inside
  const byId = new Map()
  classifications.forEach((c) => {
    const segment = c.segment
    if (!segment || !clean(segment.name)) return
    if (!byId.has(segment.id)) {
      const genres = (segment._embedded?.genres || [])
        .filter((g) => clean(g.name))
        .map((g) => ({ id: g.id, name: g.name }))
      byId.set(segment.id, { id: segment.id, name: segment.name, genres })
    }
  })
  return [...byId.values()]
}
