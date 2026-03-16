import { Suspense } from 'react'
import Link from 'next/link'
import { getCatalogAdapter } from '../lib/catalog/index.js'
import SearchForm from './SearchForm.js'
import BookCover from './BookCover.js'

export const dynamic = 'force-dynamic'

export default async function HomePage({ searchParams }) {
  const q = searchParams?.q?.trim() ?? ''
  let biblios = []
  let error = null

  if (q) {
    try {
      const catalog = getCatalogAdapter()
      biblios = await catalog.searchBiblios(q)
    } catch (err) {
      error = err.message
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="hero-badge">
          50.000+ Medien in unserer Bibliothek
        </div>
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
            {biblios.map((b) => (
              <div key={b.biblio_id ?? b.biblionumber} className="book-card">
                <BookCover isbn={b.isbn} title={b.title} />
                <div className="book-card-body">
                  <Link
                    href={`/biblios/${b.biblio_id ?? b.biblionumber}`}
                    className="book-card-title"
                  >
                    {b.title ?? '–'}
                  </Link>
                  <p className="book-card-author">{b.author ?? '–'}</p>
                  {(b.copyright_date ?? b.copyrightdate) && (
                    <p className="book-card-year">{b.copyright_date ?? b.copyrightdate}</p>
                  )}
                </div>
              </div>
            ))}
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
