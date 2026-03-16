'use client'
import { useState } from 'react'

export default function BookCover({ isbn, title, size = 'M' }) {
  const [failed, setFailed] = useState(false)
  const letter = (title ?? '?')[0].toUpperCase()

  if (!isbn || failed) {
    return <div className="book-card-cover">{letter}</div>
  }

  return (
    <div className="book-card-cover">
      <img
        src={`https://covers.openlibrary.org/b/isbn/${isbn}-${size}.jpg?default=false`}
        alt={title ?? ''}
        onError={() => setFailed(true)}
      />
    </div>
  )
}
