import { getCatalogAdapter } from '../lib/catalog/index.js'
import BookCard from './BookCard.js'
import SearchFilters from './SearchFilters.js'

function getAvailability(items) {
  if (!items.length) return { available: null, dueDate: null }
  const available = items.some(
    i => !i.checked_out_date && !i.withdrawn && !i.lost_status && i.effective_not_for_loan_status === 0
  )
  if (available) return { available: true, dueDate: null }
  const dates = items.map(i => i.checkout?.due_date).filter(Boolean).sort()
  return { available: false, dueDate: dates[0] ?? null }
}

async function fetchLibraries() {
  try {
    const basicAuth = `Basic ${Buffer.from(`${process.env.KOHA_API_USER}:${process.env.KOHA_API_PASSWORD}`).toString('base64')}`
    const res = await fetch('https://koha.adminkuhn.ch:8443/api/v1/libraries', {
      headers: { Authorization: basicAuth, Accept: 'application/json' },
      next: { revalidate: 3600 },
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.map(l => l.name).filter(Boolean)
  } catch {
    return []
  }
}

export default async function SearchResults({ q, available }) {
  const catalog = getCatalogAdapter()
  let biblios = [], error = null, availabilityMap = {}
  try {
    biblios = await catalog.searchBiblios(q)
    try {
      const ids = biblios.map(b => b.biblio_id ?? b.biblionumber).filter(Boolean)
      availabilityMap = await catalog.getItemsForBiblios(ids)
    } catch { /* non-critical */ }
  } catch (err) { error = err.message }

  if (error) return <p className="error-box">Fehler: {error}</p>
  if (!biblios.length) return <div className="results-section"><p className="empty-hero">Keine Treffer für „{q}".</p></div>

  // Verfügbarkeits-Filter anwenden
  const isAvailable = available === '1'
  let filtered = biblios
  if (isAvailable) {
    filtered = filtered.filter(b => {
      const items = availabilityMap[b.biblio_id ?? b.biblionumber] ?? []
      return getAvailability(items).available === true
    })
  }

  const libraries = await fetchLibraries()

  return (
    <div className="results-section">
      <SearchFilters available={isAvailable} libraries={libraries} />
      <div className="section-header">
        <h2 className="section-title">Suchergebnisse</h2>
        <span className="results-count">{filtered.length} Treffer für „{q}"</span>
      </div>
      {filtered.length === 0 ? (
        <p className="empty-hero">Keine Treffer mit diesen Filtern.</p>
      ) : (
        <div className="results-grid">
          {filtered.map((b) => {
            const id = b.biblio_id ?? b.biblionumber
            return <BookCard key={id} biblio={b} items={availabilityMap[id] ?? []} />
          })}
        </div>
      )}
    </div>
  )
}
