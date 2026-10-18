import { createSelector, createSlice } from '@reduxjs/toolkit'
import { readJson } from '../../utils/storage.js'
import { hasEnded } from '../../utils/eventTime.js'
import { showToast } from '../toast/toastSlice.js'

export const REGISTRATIONS_KEY = 'ems_registrations'

const registrationsSlice = createSlice({
  name: 'registrations',
  // registrations are grouped by user id: { [userId]: [registration, ...] }
  initialState: { byUser: readJson(REGISTRATIONS_KEY, {}) },
  reducers: {
    registrationAdded(state, action) {
      const { userId, registration } = action.payload
      const list = state.byUser[userId] || []
      // never store the same event twice for one user
      if (list.some((r) => r.eventId === registration.eventId)) return
      state.byUser[userId] = [...list, registration]
    },
    registrationCancelled(state, action) {
      const { userId, eventId } = action.payload
      state.byUser[userId] = (state.byUser[userId] || []).filter((r) => r.eventId !== eventId)
    },
  },
})

export const { registrationAdded, registrationCancelled } = registrationsSlice.actions

// Keep only what My Events needs, so it works without calling the API again.
function toRegistration(event) {
  return {
    eventId: event.id,
    name: event.name,
    image: event.image,
    url: event.url,
    localDate: event.localDate,
    localTime: event.localTime,
    dateTime: event.dateTime,
    timeTBA: event.timeTBA,
    venueName: event.venueName,
    city: event.city,
    state: event.state,
    country: event.country,
    segment: event.segment,
    registeredAt: new Date().toISOString(),
  }
}

export const registerForEvent = (event) => (dispatch, getState) => {
  const user = getState().auth.user
  if (!user) {
    dispatch(showToast('Please log in to register for events.', 'error'))
    return false
  }
  if (isRegistered(getState(), event.id)) {
    dispatch(showToast('You are already registered for this event.', 'info'))
    return false
  }
  if (hasEnded(event) || event.status === 'cancelled') {
    dispatch(showToast('Registration is closed for this event.', 'error'))
    return false
  }
  dispatch(registrationAdded({ userId: user.id, registration: toRegistration(event) }))
  dispatch(showToast(`You are registered for ${event.name}.`, 'success'))
  return true
}

export const cancelRegistration = (eventId, eventName) => (dispatch, getState) => {
  const user = getState().auth.user
  if (!user) return
  dispatch(registrationCancelled({ userId: user.id, eventId }))
  dispatch(showToast(`Registration cancelled for ${eventName}.`, 'info'))
}

const EMPTY = []
const selectByUser = (state) => state.registrations.byUser
const selectUserId = (state) => state.auth.user?.id

export const selectMyRegistrations = createSelector(
  [selectByUser, selectUserId],
  (byUser, userId) => (userId && byUser[userId]) || EMPTY,
)

export function isRegistered(state, eventId) {
  return selectMyRegistrations(state).some((r) => r.eventId === eventId)
}

export default registrationsSlice.reducer
