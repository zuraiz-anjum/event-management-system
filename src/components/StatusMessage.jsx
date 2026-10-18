export function Spinner({ label = 'Loading...' }) {
  return (
    <div className="status-box" role="status">
      <div className="spinner" aria-hidden="true" />
      <p className="muted">{label}</p>
    </div>
  )
}

export function ErrorMessage({ message, onRetry }) {
  return (
    <div className="status-box status-error" role="alert">
      <h3>Something went wrong</h3>
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="btn" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  )
}

export function EmptyState({ title, children }) {
  return (
    <div className="status-box">
      <h3>{title}</h3>
      {children && <div className="muted">{children}</div>}
    </div>
  )
}
