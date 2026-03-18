'use client'

import { useState } from 'react'

const FALLBACK_COLORS = [
  ['#5c35e0', '#9b72ff'],
  ['#0f766e', '#2dd4bf'],
  ['#c2410c', '#fb923c'],
  ['#be185d', '#f472b6'],
  ['#1d4ed8', '#60a5fa'],
  ['#065f46', '#34d399'],
  ['#7c3aed', '#c084fc'],
  ['#b45309', '#fbbf24'],
]

function getColors(id) {
  const idx = Math.abs(parseInt(String(id).slice(-3), 10) || 0) % FALLBACK_COLORS.length
  return FALLBACK_COLORS[idx]
}

const SOURCES = ['ekz', 'openlibrary', 'failed']

function getSrc(isbn, source) {
  if (source === 'ekz')         return `https://cover.ekz.de/${isbn}.jpg`
  if (source === 'openlibrary') return `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg?default=false`
  return null
}

export default function StripCover({ isbn, title, biblioId }) {
  const [sourceIdx, setSourceIdx] = useState(0)
  const [from, to] = getColors(biblioId)
  const source = SOURCES[sourceIdx]

  function handleError() {
    setSourceIdx(i => Math.min(i + 1, SOURCES.length - 1))
  }

  if (!isbn || source === 'failed') {
    return (
      <div
        className="strip-cover strip-cover--fallback"
        style={{ background: `linear-gradient(145deg, ${from}, ${to})` }}
      >
        <span className="strip-cover-title">{title}</span>
      </div>
    )
  }

  return (
    <div className="strip-cover">
      <img
        src={getSrc(isbn, source)}
        alt={title ?? ''}
        onError={handleError}
      />
    </div>
  )
}
