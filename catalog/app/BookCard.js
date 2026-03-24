import Link from 'next/link'
import { Book, Headphones, Tablet, Film, Newspaper } from 'lucide-react'
import BookCover from './BookCover.js'

const MEDIA_ICONS = {
  'Hörbuch':     Headphones,
  'E-Book':      Tablet,
  'Film':        Film,
  'Zeitschrift': Newspaper,
}

function getAvailability(items) {
  if (!items.length) return { count: null, dueDate: null }
  const availableItems = items.filter(
    i => !i.checked_out_date && !i.withdrawn && !i.lost_status && i.effective_not_for_loan_status === 0
  )
  if (availableItems.length > 0) return { count: availableItems.length, dueDate: null }
  const dates = items
    .map(i => i.checkout?.due_date)
    .filter(Boolean)
    .sort()
  return { count: 0, dueDate: dates[0] ?? null }
}

function formatDueDate(iso) {
  if (!iso) return null
  const d = new Date(iso)
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })
}

export default function BookCard({ biblio, items }) {
  const id = biblio.biblio_id ?? biblio.biblionumber
  const { count, dueDate } = getAvailability(items)
  const mediaType = biblio.medium ?? 'Buch'
  const MediaIcon = MEDIA_ICONS[mediaType] ?? Book
  const category = biblio.subject_headings?.[0] ?? biblio.interests ?? null

  return (
    <div className="c-book-card">

      {/* Availability — above cover, right-aligned */}
      <div className="c-book-card__availability">
        {count > 0 ? (
          <>
            <span className="c-book-card__dot c-book-card__dot--available" />
            <span className="c-book-card__status--available">{count} verfügbar</span>
          </>
        ) : dueDate ? (
          <>
            <span className="c-book-card__dot c-book-card__dot--borrowed" />
            <span className="c-book-card__status--borrowed">zurück am {formatDueDate(dueDate)}</span>
          </>
        ) : null}
      </div>

      {/* Cover */}
      <Link
        href={`/biblios/${id}`}
        className="c-book-card__cover"
        style={biblio.isbn ? {'--cover-url': `url('https://cover.ekz.de/${biblio.isbn}.jpg')`} : undefined}
      >
        <div className="c-book-card__cover-frame">
          <BookCover isbn={biblio.isbn} title={biblio.title} biblioId={id} />
        </div>
      </Link>

      {/* Title & Author */}
      <Link href={`/biblios/${id}`} className="c-book-card__title">
        {biblio.title ?? '–'}
      </Link>
      <div className="c-book-card__author">{biblio.author ?? '–'}</div>

      {/* Meta — mediatype | category */}
      <div className="c-book-card__meta">
        <div className="c-book-card__type">
          <MediaIcon size={11} strokeWidth={1.8} />
          {mediaType}
        </div>
        {category && (
          <>
            <div className="c-book-card__divider" />
            {category}
          </>
        )}
      </div>

    </div>
  )
}
