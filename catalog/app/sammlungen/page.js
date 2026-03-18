import { getCatalogAdapter } from '../../lib/catalog/index.js'
import Link from 'next/link'
import StripCover from '../StripCover.js'

export default async function SammlungenPage() {
  const catalog = getCatalogAdapter()

  let lists = []
  try {
    lists = await catalog.getPublicLists()
  } catch {
    return (
      <div className="sammlungen-page">
        <h1 className="sammlungen-title">Sammlungen</h1>
        <p className="sammlungen-empty">Inhalte konnten nicht geladen werden.</p>
      </div>
    )
  }

  // Für jede Liste die ersten 8 Cover laden (parallel)
  const previews = await Promise.all(
    lists.map(list => catalog.getListBiblios(list.list_id, 8).catch(() => []))
  )

  return (
    <div className="sammlungen-page">
      <h1 className="sammlungen-title">Sammlungen</h1>

      {lists.length === 0 ? (
        <p className="sammlungen-empty">Keine öffentlichen Sammlungen vorhanden.</p>
      ) : (
        <div className="sammlungen-list">
          {lists.map((list, i) => (
            <Link
              key={list.list_id}
              href={`/sammlungen/${list.list_id}`}
              className="sammlung-row"
            >
              <div className="sammlung-row-header">
                <span className="sammlung-row-name">{list.name}</span>
                <span className="sammlung-row-arrow">→</span>
              </div>
              <div className="sammlung-strip">
                {previews[i].length === 0 ? (
                  <span className="sammlung-strip-empty">Noch keine Bücher</span>
                ) : (
                  previews[i].map((b, j) => (
                    <div key={b.biblionumber ?? j} className="sammlung-strip-item">
                      <StripCover
                        isbn={b.isbn}
                        title={b.title}
                        biblioId={b.biblio_id ?? b.biblionumber ?? list.list_id * 100 + j}
                      />
                    </div>
                  ))
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
