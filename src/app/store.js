import { configureStore } from '@reduxjs/toolkit'
import toastReducer from '../features/toast/toastSlice.js'

// Auth, events and registrations reducers are added in the next stages.
export const store = configureStore({
  reducer: {
    toast: toastReducer,
  },
})
