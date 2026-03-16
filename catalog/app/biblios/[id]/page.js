import Link from 'next/link'
import { getCatalogAdapter } from '../../../lib/catalog/index.js'
import BookCover from '../../BookCover.js'
import ExpandableInfo from './ExpandableInfo.js'

export const dynamic = 'force-dynamic'

function itemStatus(item) {
  if (item.withdrawn && item.withdrawn !== 0) {
    return { text: 'Ausgesondert', cls: 'exemplar-badge-other', available: false }
  }
  if (item.lost_status && item.lost_status !== 0) {
    return { text: 'Verloren', cls: 'exemplar-badge-other', available: false }
  }
  if (item.damaged_status && item.damaged_status !== 0) {
    return { text: 'Beschädigt', cls: 'exemplar-badge-other', available: false }
  }
  if (item.effective_not_for_loan_status && item.effective_not_for_loan_status !== 0) {
    return { text: 'Nicht ausleihbar', cls: 'exemplar-badge-unavailable', available: false }
  }
  if (item.checked_out_date) {
    const due = item.checkout?.due_date
    const duePart = due ? ` bis ${new Date(due).toLocaleDateString('de-CH')}` : ''
    return { text: `Ausgeliehen${duePart}`, cls: 'exemplar-badge-unavailable', available: false }
  }
  return { text: 'Verfügbar', cls: 'exemplar-badge-available', available: true }
}

export default async function BiblioDetailPage({ params }) {
  const { id } = params
  let biblio = null
  let items = []
  let error = null

  try {
    const catalog = getCatalogAdapter()
    ;[biblio, items] = await Promise.all([
      catalog.getBiblio(id),
      catalog.getItems(id).catch(() => []),
    ])
  } catch (err) {
    error = err.message
  }

  const expandableFields = [
    biblio?.isbn && ['ISBN', biblio.isbn],
    biblio?.publisher && ['Verlag', biblio.publisher],
    (biblio?.copyright_date ?? biblio?.copyrightdate) && ['Erschienen', String(biblio.copyright_date ?? biblio.copyrightdate)],
    biblio?.publication_place && ['Erscheinungsort', biblio.publication_place],
    biblio?.edition_statement && ['Ausgabe', biblio.edition_statement],
  ].filter(Boolean)

  return (
    <div className="detail-gradient-bg">
      {/* Sticky header */}
      <header className="detail-sticky-header">
        <Link className="detail-back-pill" href="/">
          ← Zurück zur Suche
        </Link>
      </header>

      {error && <p className="error-box" style={{ margin: '0 3rem 1rem' }}>Fehler: {error}</p>}

      {biblio && (
        <div className="detail-hero-grid">
          {/* LEFT: title, author, abstract, stats, expandable */}
          <div className="detail-left">
            <div>
              <h1 className="detail-title">{biblio.title ?? `Biblio #${id}`}</h1>
              {biblio.subtitle && (
                <p style={{ color: '#655c76', fontSize: '1.1rem', marginTop: '0.25rem' }}>{biblio.subtitle}</p>
              )}
              {biblio.author && (
                <p className="detail-author">Von <span>{biblio.author}</span></p>
              )}
            </div>

            {biblio.abstract && (
              <div>
                <p className="detail-abstract-label" style={{ marginBottom: '0.5rem' }}>Kurzbeschreibung</p>
                <p className="detail-abstract">{biblio.abstract}</p>
              </div>
            )}

            {(biblio.pages || biblio.medium || biblio.language) && (
              <div className="detail-quick-stats">
                {biblio.pages && (
                  <div>
                    <p className="detail-stat-label">Seiten</p>
                    <p className="detail-stat-value">{biblio.pages}</p>
                  </div>
                )}
                {biblio.medium && (
                  <div>
                    <p className="detail-stat-label">Format</p>
                    <p className="detail-stat-value">{biblio.medium}</p>
                  </div>
                )}
                {biblio.language && (
                  <div>
                    <p className="detail-stat-label">Sprache</p>
                    <p className="detail-stat-value">{biblio.language}</p>
                  </div>
                )}
              </div>
            )}

            {expandableFields.length > 0 && (
              <ExpandableInfo fields={expandableFields} />
            )}
          </div>

          {/* CENTER: hero cover */}
          <div className="detail-center">
            <div className="detail-cover-wrap">
              <BookCover isbn={biblio.isbn} title={biblio.title} size="L" />
            </div>
          </div>

          {/* RIGHT: availability glass card */}
          <div className="detail-right">
            <div className="glass-card">
              <p className="glass-section-title">Einzelne Exemplare</p>
              {items.length === 0 && (
                <p style={{ color: 'var(--gray-mid)', fontSize: '0.875rem' }}>Keine Exemplare erfasst.</p>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {items.map((item) => {
                  const status = itemStatus(item)
                  const location = [item.home_library_id, item.location].filter(Boolean).join(' / ')
                  return (
                    <div key={item.item_id} className={`exemplar-card${status.available ? '' : ' unavailable'}`}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                          {item.external_id && (
                            <span className="exemplar-barcode">#{item.external_id}</span>
                          )}
                          <span className={status.cls}>{status.text}</span>
                        </div>
                        <p className="exemplar-location">
                          {location || '—'}
                          {item.callnumber && <span> · {item.callnumber}</span>}
                        </p>
                      </div>
                      {status.available ? (
                        <button className="btn-ausleihen">Ausleihen</button>
                      ) : (
                        <button className="btn-vormerken">Vormerken</button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
