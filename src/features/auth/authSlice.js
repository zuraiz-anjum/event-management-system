import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { readJson, writeJson } from '../../utils/storage.js'

export const USERS_KEY = 'ems_users'
export const SESSION_KEY = 'ems_session'

// This is only a frontend simulation, but we still avoid keeping plain passwords.
async function hashPassword(password, email) {
  const data = new TextEncoder().encode(`${email}:${password}`)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

function toSessionUser(user) {
  return { id: user.id, name: user.name, email: user.email }
}

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ name, email, password }, { rejectWithValue }) => {
    const users = readJson(USERS_KEY, [])
    const cleanEmail = email.trim().toLowerCase()

    if (users.some((u) => u.email === cleanEmail)) {
      return rejectWithValue('An account with this email already exists.')
    }

    const user = {
      id: `u_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
      name: name.trim(),
      email: cleanEmail,
      passwordHash: await hashPassword(password, cleanEmail),
    }
    writeJson(USERS_KEY, [...users, user])
    return toSessionUser(user)
  },
)

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    const users = readJson(USERS_KEY, [])
    const cleanEmail = email.trim().toLowerCase()
    const user = users.find((u) => u.email === cleanEmail)
    const hash = await hashPassword(password, cleanEmail)

    // same message for both cases so we do not reveal which emails exist
    if (!user || user.passwordHash !== hash) {
      return rejectWithValue('Incorrect email or password.')
    }
    return toSessionUser(user)
  },
)

const initialState = {
  user: readJson(SESSION_KEY, null),
  status: 'idle', // idle | loading | failed
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null
      state.status = 'idle'
      state.error = null
    },
    clearAuthError(state) {
      state.error = null
      state.status = 'idle'
    },
  },
  extraReducers: (builder) => {
    const onPending = (state) => {
      state.status = 'loading'
      state.error = null
    }
    const onSuccess = (state, action) => {
      state.status = 'idle'
      state.user = action.payload
    }
    const onFail = (state, action) => {
      state.status = 'failed'
      state.error = action.payload || 'Something went wrong. Please try again.'
    }

    builder
      .addCase(registerUser.pending, onPending)
      .addCase(registerUser.fulfilled, onSuccess)
      .addCase(registerUser.rejected, onFail)
      .addCase(loginUser.pending, onPending)
      .addCase(loginUser.fulfilled, onSuccess)
      .addCase(loginUser.rejected, onFail)
  },
})

export const { logout, clearAuthError } = authSlice.actions

export const selectUser = (state) => state.auth.user
export const selectIsLoggedIn = (state) => Boolean(state.auth.user)

export default authSlice.reducer
