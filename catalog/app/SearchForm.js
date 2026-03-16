'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function SearchForm() {
  const router = useRouter()
  const params = useSearchParams()
  const [q, setQ] = useState(params.get('q') ?? '')

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = q.trim()
    if (trimmed) {
      router.push(`/?q=${encodeURIComponent(trimmed)}`)
    } else {
      router.push('/')
    }
  }

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <span className="search-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>
      </span>
      <input
        className="search-input"
        type="search"
        placeholder="Titel, Autor, Stichwort …"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        autoFocus
      />
      <button className="search-btn" type="submit">Suchen</button>
    </form>
  )
}
