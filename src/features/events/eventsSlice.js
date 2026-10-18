import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchEventById, fetchEventsPage, fetchSegments } from '../../api/ticketmaster.js'

export const listKey = (params) => JSON.stringify(params)

// The condition callbacks skip a request when the same one is already
// running or finished, which keeps us under the 2 requests per second limit.
export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async (params, { rejectWithValue }) => {
    try {
      return await fetchEventsPage(params)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  },
  {
    condition: (params, { getState }) => {
      const { list } = getState().events
      const busyOrDone = list.status === 'loading' || list.status === 'succeeded'
      return !(list.key === listKey(params) && busyOrDone)
    },
  },
)

export const fetchEventDetails = createAsyncThunk(
  'events/fetchEventDetails',
  async (id, { rejectWithValue }) => {
    try {
      return await fetchEventById(id)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  },
  {
    condition: (id, { getState }) => {
      const { details } = getState().events
      return !details.byId[id] && details.statusById[id] !== 'loading'
    },
  },
)

export const fetchCategories = createAsyncThunk(
  'events/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchSegments()
    } catch (err) {
      return rejectWithValue(err.message)
    }
  },
  {
    condition: (_, { getState }) => {
      const { status } = getState().events.categories
      return status !== 'loading' && status !== 'succeeded'
    },
  },
)

const initialState = {
  list: {
    items: [],
    page: { number: 0, size: 0, totalElements: 0, totalPages: 0 },
    status: 'idle', // idle | loading | succeeded | failed
    error: null,
    key: null,
  },
  details: {
    byId: {},
    statusById: {},
    errorById: {},
  },
  categories: {
    items: [],
    status: 'idle',
    error: null,
  },
}

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state, action) => {
        state.list.status = 'loading'
        state.list.error = null
        state.list.key = listKey(action.meta.arg)
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        // ignore a slow response if the user has already searched for something else
        if (state.list.key !== listKey(action.meta.arg)) return
        state.list.status = 'succeeded'
        state.list.items = action.payload.items
        state.list.page = action.payload.page
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        if (state.list.key !== listKey(action.meta.arg)) return
        state.list.status = 'failed'
        state.list.error = action.payload || 'Could not load events.'
      })

      .addCase(fetchEventDetails.pending, (state, action) => {
        const id = action.meta.arg
        state.details.statusById[id] = 'loading'
        delete state.details.errorById[id]
      })
      .addCase(fetchEventDetails.fulfilled, (state, action) => {
        const id = action.meta.arg
        state.details.statusById[id] = 'succeeded'
        state.details.byId[id] = action.payload
      })
      .addCase(fetchEventDetails.rejected, (state, action) => {
        const id = action.meta.arg
        state.details.statusById[id] = 'failed'
        state.details.errorById[id] = action.payload || 'Could not load this event.'
      })

      .addCase(fetchCategories.pending, (state) => {
        state.categories.status = 'loading'
        state.categories.error = null
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories.status = 'succeeded'
        state.categories.items = action.payload
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categories.status = 'failed'
        state.categories.error = action.payload || 'Could not load categories.'
      })
  },
})

export const selectEventsList = (state) => state.events.list
export const selectCategories = (state) => state.events.categories
export const selectEventById = (id) => (state) => state.events.details.byId[id]

export default eventsSlice.reducer
