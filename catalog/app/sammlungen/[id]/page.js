'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import BookCover from '../../BookCover.js'
import { Search } from 'lucide-react'

export default function SammlungDetail({ params }) {
  const { id } = params
  const [list, setList] = useState(null)
  const [biblios, setBiblios] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [listsRes, bibliosRes] = await Promise.all([
        fetch('/api/lists'),
        fetch(`/api/lists/${id}/biblios`),
      ])
      const lists = listsRes.ok ? await listsRes.json() : []
      const bibs  = bibliosRes.ok ? await bibliosRes.json() : []
      setList(lists.find(l => String(l.list_id) === String(id)) ?? null)
      setBiblios(bibs)
      setLoading(false)
    }
    load()
  }, [id])

  const filtered = useMemo(() => {
    if (!query.trim()) return biblios
    const q = query.toLowerCase()
    return biblios.filter(b =>
      b.title?.toLowerCase().includes(q) ||
      b.author?.toLowerCase().includes(q)
    )
  }, [biblios, query])

  if (loading) return <div className="sammlungen-page"><p className="sammlungen-empty">Wird geladen…</p></div>

  return (
    <div className="sammlungen-page">
      <Link href="/sammlungen" className="sammlung-back">← Alle Sammlungen</Link>

      <div className="sammlung-detail-header">
        <h1 className="sammlung-detail-title">{list?.name ?? 'Sammlung'}</h1>
        <span className="sammlung-detail-count">{biblios.length} Bücher</span>
      </div>

      {/* Suchleiste */}
      <div className="sammlung-search-wrap">
        <Search size={16} className="sammlung-search-icon" />
        <input
          className="sammlung-search-input"
          type="text"
          placeholder="In dieser Sammlung suchen…"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <p className="sammlungen-empty">Keine Treffer.</p>
      ) : (
        <div className="sammlung-detail-grid">
          {filtered.map(b => {
            const id = b.biblionumber ?? b.biblio_id
            return (
              <Link key={id} href={`/biblios/${id}`} className="sammlung-detail-item">
                <div className="sammlung-detail-cover">
                  <BookCover isbn={b.isbn} title={b.title} biblioId={id} size="M" />
                </div>
                <p className="sammlung-detail-item-title">{b.title}</p>
                {b.author && <p className="sammlung-detail-item-author">{b.author}</p>}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
