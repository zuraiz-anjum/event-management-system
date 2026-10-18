// Shows a few page numbers around the current one instead of every page.
function pageNumbers(current, total) {
  const pages = new Set([1, total, current - 1, current, current + 1])
  return [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b)
}

export default function Pagination({ current, total, onChange }) {
  if (total <= 1) return null
  const numbers = pageNumbers(current, total)

  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        type="button"
        className="btn btn-small"
        disabled={current <= 1}
        onClick={() => onChange(current - 1)}
      >
        Previous
      </button>
      {numbers.map((page, index) => (
        <span key={page} className="pagination-item">
          {index > 0 && page - numbers[index - 1] > 1 && <span className="muted">...</span>}
          <button
            type="button"
            className={`btn btn-small ${page === current ? 'btn-primary' : ''}`}
            aria-current={page === current ? 'page' : undefined}
            onClick={() => onChange(page)}
          >
            {page}
          </button>
        </span>
      ))}
      <button
        type="button"
        className="btn btn-small"
        disabled={current >= total}
        onClick={() => onChange(current + 1)}
      >
        Next
      </button>
    </nav>
  )
}
