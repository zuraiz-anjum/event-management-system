import { configureStore } from '@reduxjs/toolkit'
import authReducer, { SESSION_KEY } from '../features/auth/authSlice.js'
import eventsReducer from '../features/events/eventsSlice.js'
import registrationsReducer, { REGISTRATIONS_KEY } from '../features/registrations/registrationsSlice.js'
import toastReducer from '../features/toast/toastSlice.js'
import { removeKey, writeJson } from '../utils/storage.js'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventsReducer,
    registrations: registrationsReducer,
    toast: toastReducer,
  },
})

// Save the session and the registrations whenever they change, so a refresh keeps them.
let lastUser = store.getState().auth.user
let lastRegistrations = store.getState().registrations.byUser

store.subscribe(() => {
  const { auth, registrations } = store.getState()

  if (auth.user !== lastUser) {
    lastUser = auth.user
    if (auth.user) writeJson(SESSION_KEY, auth.user)
    else removeKey(SESSION_KEY)
  }

  if (registrations.byUser !== lastRegistrations) {
    lastRegistrations = registrations.byUser
    writeJson(REGISTRATIONS_KEY, registrations.byUser)
  }
})
