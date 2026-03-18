'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'

export default function SearchHeader({ q }) {
  const router = useRouter()
  const params = useSearchParams()
  const [value, setValue] = useState(q)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = value.trim()
    startTransition(() => {
      if (trimmed) {
        // Preserve existing filter params, update q
        const p = new URLSearchParams(params)
        p.set('q', trimmed)
        p.delete('available')
        p.delete('medium')
        router.push('/?' + p.toString())
      } else {
        router.push('/')
      }
    })
  }

  return (
    <div className="search-header">
      <form className="search-form" onSubmit={handleSubmit}>
        <span className="search-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
        </span>
        <input
          className="search-input"
          type="search"
          placeholder="Titel, Autor, Stichwort …"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoFocus
        />
        <button className="search-btn" type="submit" disabled={isPending}>
          {isPending ? 'Suche …' : 'Suchen'}
        </button>
      </form>
    </div>
  )
}
