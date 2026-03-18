import { Suspense } from 'react'
import SearchForm from './SearchForm.js'
import SearchHeader from './SearchHeader.js'
import SearchResults from './SearchResults.js'
import SearchResultsSkeleton from './SearchResultsSkeleton.js'
import PatronBadge from './PatronBadge.js'
import CurrentlyReadingStrip from './CurrentlyReadingStrip.js'
import LibrarianRecommendations from './LibrarianRecommendations.js'
import { getTenantConfig } from '../lib/catalog/index.js'

export default function HomePage({ searchParams }) {
  const q = searchParams?.q?.trim() ?? ''
  const available = searchParams?.available ?? ''
  const tenant = getTenantConfig()
  const city = tenant.city ?? tenant.name

  return (
    <>
      {q ? (
        <Suspense fallback={null}>
          <SearchHeader q={q} />
        </Suspense>
      ) : (
        <section className="hero">
          <Suspense fallback={null}>
            <PatronBadge />
          </Suspense>
          <h1>
            Deine nächste <br />
            <span className="highlight">Geschichte</span> wartet schon.
          </h1>
          <Suspense>
            <SearchForm />
          </Suspense>
        </section>
      )}

      {q ? (
        <Suspense key={q + available} fallback={<SearchResultsSkeleton q={q} />}>
          <SearchResults q={q} available={available} />
        </Suspense>
      ) : (
        <>
          <Suspense fallback={null}>
            <CurrentlyReadingStrip city={city} />
          </Suspense>
          <LibrarianRecommendations />
          <div className="cta-section">
            <h2>180.000+ handverlesene Medien für dich</h2>
            <p>
              Entdecke unsere kuratierte Sammlung von Büchern, Hörbüchern und mehr –
              direkt in deiner Bibliothek vor Ort.
            </p>
            <a href="#" className="cta-btn">Katalog entdecken</a>
          </div>
        </>
      )}

    </>
  )
}
