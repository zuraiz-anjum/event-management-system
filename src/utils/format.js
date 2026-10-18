// Event times are the local time at the venue, so we show them as they are.
export function parseEventDate(localDate, localTime) {
  if (!localDate) return null
  return new Date(`${localDate}T${localTime || '00:00:00'}`)
}

export function formatEventDate(localDate) {
  const date = parseEventDate(localDate)
  if (!date) return 'Date to be announced'
  return date.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function formatEventTime(localTime, timeTBA) {
  if (!localTime || timeTBA) return 'Time to be announced'
  const date = parseEventDate('2000-01-01', localTime)
  return date.toLocaleTimeString('en-GB', { hour: 'numeric', minute: '2-digit', hour12: true })
}

export function formatLocation(event) {
  return [event.city, event.state, event.country].filter(Boolean).join(', ')
}

export function formatPrice(event) {
  if (event.priceMin == null) return null
  const money = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: event.currency || 'USD',
    maximumFractionDigits: 2,
  })
  if (event.priceMax == null || event.priceMax === event.priceMin) return money.format(event.priceMin)
  return `${money.format(event.priceMin)} to ${money.format(event.priceMax)}`
}

export function formatDateTime(isoString) {
  if (!isoString) return null
  return new Date(isoString).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })
}
