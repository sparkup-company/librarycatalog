'use client'
import { useState } from 'react'

const SOURCES = ['ekz', 'openlibrary', 'failed']

// 8 sanfte Farbpaare [gradient-from, gradient-to, text-color]
const PALETTES = [
  ['#fde8d0', '#f7c59f', '#c4622a'],
  ['#dbeafe', '#bfdbfe', '#1d4ed8'],
  ['#dcfce7', '#bbf7d0', '#15803d'],
  ['#fce7f3', '#fbcfe8', '#be185d'],
  ['#ede9fe', '#ddd6fe', '#6d28d9'],
  ['#fef9c3', '#fef08a', '#a16207'],
  ['#ccfbf1', '#99f6e4', '#0f766e'],
  ['#fee2e2', '#fecaca', '#b91c1c'],
]

function getPalette(id) {
  const n = typeof id === 'number' ? id : (String(id).split('').reduce((a, c) => a + c.charCodeAt(0), 0))
  return PALETTES[n % PALETTES.length]
}

function getSrc(isbn, source, size) {
  if (source === 'ekz')         return `https://cover.ekz.de/${isbn}.jpg`
  if (source === 'openlibrary') return `https://covers.openlibrary.org/b/isbn/${isbn}-${size}.jpg?default=false`
  return null
}

export default function BookCover({ isbn, title, size = 'M', biblioId }) {
  const [sourceIdx, setSourceIdx] = useState(0)
  const source = SOURCES[sourceIdx]
  const letter = (title ?? '?')[0].toUpperCase()

  function handleError() {
    setSourceIdx(i => Math.min(i + 1, SOURCES.length - 1))
  }

  if (!isbn || source === 'failed') {
    const [from, to, text] = getPalette(biblioId ?? title?.charCodeAt(0) ?? 0)
    return (
      <div
        className="book-card-cover book-card-cover--fallback"
        style={{ background: `linear-gradient(145deg, ${from}, ${to})`, color: text }}
      >
        <span className="book-card-cover-letter">{letter}</span>
        {title && (
          <span className="book-card-cover-fallback-title">{title}</span>
        )}
      </div>
    )
  }

  return (
    <div className="book-card-cover">
      <img
        src={getSrc(isbn, source, size)}
        alt={title ?? ''}
        onError={handleError}
      />
    </div>
  )
}
