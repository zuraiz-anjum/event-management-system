import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { dismissToast } from '../features/toast/toastSlice.js'

function Toast({ toast }) {
  const dispatch = useDispatch()

  useEffect(() => {
    const timer = setTimeout(() => dispatch(dismissToast(toast.id)), 4000)
    return () => clearTimeout(timer)
  }, [dispatch, toast.id])

  return (
    <div className={`toast toast-${toast.type}`} role="status">
      <span>{toast.message}</span>
      <button
        type="button"
        className="toast-close"
        aria-label="Dismiss message"
        onClick={() => dispatch(dismissToast(toast.id))}
      >
        x
      </button>
    </div>
  )
}

export default function ToastContainer() {
  const toasts = useSelector((state) => state.toast.items)

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  )
}
