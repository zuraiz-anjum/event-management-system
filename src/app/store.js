import { configureStore } from '@reduxjs/toolkit'
import authReducer, { SESSION_KEY } from '../features/auth/authSlice.js'
import eventsReducer from '../features/events/eventsSlice.js'
import toastReducer from '../features/toast/toastSlice.js'
import { removeKey, writeJson } from '../utils/storage.js'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventsReducer,
    toast: toastReducer,
  },
})

// Keep the session in localStorage so a refresh does not log the user out.
let lastUser = store.getState().auth.user
store.subscribe(() => {
  const user = store.getState().auth.user
  if (user === lastUser) return
  lastUser = user
  if (user) writeJson(SESSION_KEY, user)
  else removeKey(SESSION_KEY)
})
