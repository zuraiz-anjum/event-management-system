import { createSlice } from '@reduxjs/toolkit'

let nextId = 1

const toastSlice = createSlice({
  name: 'toast',
  initialState: { items: [] },
  reducers: {
    showToast: {
      reducer(state, action) {
        state.items.push(action.payload)
      },
      // type is "success", "error" or "info"
      prepare(message, type = 'info') {
        return { payload: { id: nextId++, message, type } }
      },
    },
    dismissToast(state, action) {
      state.items = state.items.filter((t) => t.id !== action.payload)
    },
  },
})

export const { showToast, dismissToast } = toastSlice.actions
export default toastSlice.reducer
