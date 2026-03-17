import { Suspense } from 'react'
import { getCatalogAdapter } from '../lib/catalog/index.js'
import SearchForm from './SearchForm.js'
import BookCard from './BookCard.js'

export const dynamic = 'force-dynamic'

export default async function HomePage({ searchParams }) {
  const q = searchParams?.q?.trim() ?? ''
  let biblios = []
  let error = null
  let activePatrons = 0
  try {
    const catalog = getCatalogAdapter()
    activePatrons = await catalog.getActivePatronCount()
  } catch { /* non-critical */ }

  let availabilityMap = {}
  if (q) {
    try {
      const catalog = getCatalogAdapter()
      biblios = await catalog.searchBiblios(q)
      try {
        const ids = biblios.map(b => b.biblio_id ?? b.biblionumber).filter(Boolean)
        availabilityMap = await catalog.getItemsForBiblios(ids)
      } catch { /* non-critical */ }
    } catch (err) {
      error = err.message
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="hero">
        {activePatrons === 1 && (
          <div className="hero-badge">1 andere Person nutzt gerade die Bibliothek mit dir!</div>
        )}
        {activePatrons > 1 && (
          <div className="hero-badge">{activePatrons} andere Personen nutzen gerade die Bibliothek mit dir!</div>
        )}
        <h1>
          Deine nächste <br />
          <span className="highlight">Geschichte</span> wartet schon.
        </h1>
        <Suspense>
          <SearchForm />
        </Suspense>
      </section>

      {/* Error */}
      {error && <p className="error-box">Fehler: {error}</p>}

      {/* No results */}
      {!error && q && biblios.length === 0 && (
        <div className="results-section">
          <p className="empty-hero">Keine Treffer für „{q}".</p>
        </div>
      )}

      {/* Results grid */}
      {!error && biblios.length > 0 && (
        <div className="results-section">
          <div className="section-header">
            <h2 className="section-title">Suchergebnisse</h2>
            <span className="results-count">{biblios.length} Treffer für „{q}"</span>
          </div>
          <div className="results-grid">
            {biblios.map((b) => {
              const id = b.biblio_id ?? b.biblionumber
              const items = availabilityMap[id] ?? []
              return <BookCard key={id} biblio={b} items={items} />
            })}
          </div>
        </div>
      )}

      {/* Default state: show CTA when no search */}
      {!q && (
        <div className="cta-section">
          <h2>50.000+ handverlesene Medien für dich</h2>
          <p>
            Entdecke unsere kuratierte Sammlung von Büchern, Hörbüchern und mehr –
            direkt in deiner Bibliothek vor Ort.
          </p>
          <a href="#" className="cta-btn">Katalog entdecken</a>
        </div>
      )}

      <footer className="site-footer">
        <p>© 2024 Demo Bibliothek Katalog</p>
      </footer>
    </>
  )
}
