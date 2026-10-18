// Works for both full events and the smaller copies saved with a registration.
export function eventStartTime(event) {
  if (event.dateTime) return new Date(event.dateTime).getTime()
  if (event.localDate) {
    // no exact time, so the event counts as running until the end of that day
    return new Date(`${event.localDate}T${event.localTime || '23:59:59'}`).getTime()
  }
  return null
}

export function hasEnded(event, now = Date.now()) {
  const start = eventStartTime(event)
  return start !== null && start < now
}
