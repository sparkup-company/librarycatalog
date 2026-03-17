'use client'
import { useState } from 'react'
import Link from 'next/link'
import BookCover from './BookCover.js'

function getAvailability(items) {
  if (!items.length) return { available: null, dueDate: null }
  const available = items.some(
    i => !i.checked_out_date && !i.withdrawn && !i.lost_status && i.effective_not_for_loan_status === 0
  )
  if (available) return { available: true, dueDate: null }
  const dates = items
    .map(i => i.checkout?.due_date)
    .filter(Boolean)
    .sort()
  return { available: false, dueDate: dates[0] ?? null }
}

function formatDueDate(iso) {
  if (!iso) return null
  const d = new Date(iso)
  return d.toLocaleDateString('de-DE', { day: 'numeric', month: 'long' })
}

export default function BookCard({ biblio, items }) {
  const [liked, setLiked] = useState(false)
  const id = biblio.biblio_id ?? biblio.biblionumber
  const { available, dueDate } = getAvailability(items)
  const mediaType = biblio.medium ?? 'Buch'

  return (
    <div className="book-card">
      {/* Cover */}
      <div className="book-card-cover-wrap">
        <BookCover isbn={biblio.isbn} title={biblio.title} />
        <span className="book-card-media-badge">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>
          {mediaType}
        </span>
      </div>

      {/* Body */}
      <div className="book-card-body">
        <div className="book-card-meta">
          <Link href={`/biblios/${id}`} className="book-card-title">
            {biblio.title ?? '–'}
          </Link>
          <p className="book-card-author">{biblio.author ?? '–'}</p>
        </div>

        {/* Footer row */}
        <div className="book-card-footer">
          {/* Left: status */}
          {available === false ? (
            <div className="book-card-status-col">
              <span className="book-card-status-label book-card-status-label--unavailable">Ausgeliehen</span>
              {dueDate && <span className="book-card-due">bis {formatDueDate(dueDate)}</span>}
            </div>
          ) : (
            <div className="book-card-status-row">
              <span className="book-card-dot" />
              <span className="book-card-status-label">Verfügbar</span>
            </div>
          )}

          {/* Right: actions */}
          <div className="book-card-actions">
            {available === false ? (
              <button className="book-card-btn book-card-btn--reserve">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
                </svg>
                Vormerken
              </button>
            ) : (
              <>
                <button className="book-card-btn book-card-btn--borrow">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{transform:'scaleX(-1)'}}>
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Ausleihen
                </button>
                <button
                  className={`book-card-like${liked ? ' book-card-like--active' : ''}`}
                  onClick={() => setLiked(l => !l)}
                  aria-label="Merken"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
