import Link from 'next/link'
import { getCatalogAdapter } from '../lib/catalog/index.js'
import StripCover from './StripCover.js'

export default async function CurrentlyReadingStrip({ city }) {
  let checkouts = []
  try {
    const catalog = getCatalogAdapter()
    checkouts = await catalog.getCurrentCheckouts(40)
  } catch {
    return null
  }

  // Deduplizieren nach biblio_id, max. 20 Titel
  const seen = new Set()
  const biblios = []
  for (const c of checkouts) {
    const biblio = c.item?.biblio
    if (!biblio) continue
    const id = biblio.biblio_id ?? biblio.biblionumber
    if (!id || seen.has(id)) continue
    seen.add(id)
    biblios.push({ ...biblio, _id: id })
    if (biblios.length >= 20) break
  }

  if (!biblios.length) return null

  return (
    <section className="reading-strip-section">
      <h2 className="reading-strip-heading">
        Was <span className="reading-strip-city">{city}</span> gerade liest
      </h2>
      <div className="reading-strip">
        {biblios.map(b => (
          <Link key={b._id} href={`/biblios/${b._id}`} className="reading-strip-item">
            <StripCover isbn={b.isbn} title={b.title} biblioId={b._id} />
          </Link>
        ))}
      </div>
    </section>
  )
}
