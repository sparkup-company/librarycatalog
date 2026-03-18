export default function SearchResultsSkeleton({ q }) {
  return (
    <div className="results-section">
      <div className="section-header">
        <h2 className="section-title skeleton-line" style={{ width: '12rem' }} />
        <span className="skeleton-line" style={{ width: '8rem', height: '1rem' }} />
      </div>
      <div className="results-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="book-card skeleton-card">
            <div className="book-card-cover-wrap skeleton-shimmer" />
            <div className="book-card-body">
              <div className="skeleton-line" style={{ width: '80%' }} />
              <div className="skeleton-line" style={{ width: '50%', marginTop: '0.5rem' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
