'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useSession, signIn } from 'next-auth/react'
import { Book, Headphones, Tablet, Film, Newspaper, Heart, LogOut, Bookmark, Ellipsis, Printer, Share2, Info } from 'lucide-react'
import BookCover from './BookCover.js'

const MEDIA_ICONS = {
  'Hörbuch':     Headphones,
  'E-Book':      Tablet,
  'Film':        Film,
  'Zeitschrift': Newspaper,
}

function getAvailability(items) {
  if (!items.length) return { available: null, dueDate: null }
  const available = items.some(
    i => !i.checked_out_date && !i.withdrawn && !i.lost_status && i.effective_not_for_loan_status === 0
  )
  if (available) return { available: true, dueDate: null }
  const dates = items
    .map(i => i.checkout?.due_date)
    .filter(Boolean)
    .sort()
  return { available: false, dueDate: dates[0] ?? null }
}

function formatDueDate(iso) {
  if (!iso) return null
  const d = new Date(iso)
  return d.toLocaleDateString('de-DE', { day: 'numeric', month: 'long' })
}

export default function BookCard({ biblio, items }) {
  const { data: session } = useSession()
  const [liked, setLiked] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const id = biblio.biblio_id ?? biblio.biblionumber
  const { available, dueDate } = getAvailability(items)
  const mediaType = biblio.medium ?? 'Buch'
  const MediaIcon = MEDIA_ICONS[mediaType] ?? Book
  const theme = biblio.subject_headings?.[0] ?? biblio.interests ?? null

  // Kontextmenü schließen bei Klick außerhalb
  useEffect(() => {
    if (!menuOpen) return
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [menuOpen])

  function handleLike() {
    if (!session) { signIn(); return }
    setLiked(l => !l)
  }

  function handlePrint() {
    setMenuOpen(false)
    window.print()
  }

  function handleShare() {
    setMenuOpen(false)
    const url = `${window.location.origin}/biblios/${id}`
    if (navigator.share) {
      navigator.share({ title: biblio.title, url })
    } else {
      navigator.clipboard?.writeText(url)
    }
  }

  return (
    <div className="book-card-wrapper">
      {/* Pill-Badge außerhalb der Karte */}
      <div className={`book-card-pill${available === false ? ' book-card-pill--unavailable' : ''}`}>
        <span className="book-card-pill-dot" />
        <span>{available === false ? 'Ausgeliehen' : 'Verfügbar'}</span>
      </div>

      {/* Karte */}
      <div className="book-card">
        {/* Zeile: Medientyp | Interessenkreis */}
        <div className="book-card-toprow">
          <span className="book-card-mediatype">
            <MediaIcon size={14} />
            {mediaType}
          </span>
          {theme && <span className="book-card-theme">{theme}</span>}
        </div>

        {/* Titel + Autor */}
        <Link href={`/biblios/${id}`} className="book-card-title">
          {biblio.title ?? '–'}
        </Link>
        <p className="book-card-author">Von {biblio.author ?? '–'}</p>

        {/* Cover */}
        <div className="book-card-cover-area">
          <BookCover isbn={biblio.isbn} title={biblio.title} biblioId={id} />
        </div>

        {/* Aktionen */}
        <div className="book-card-actions">
          <button
            className={`book-card-like${liked ? ' book-card-like--active' : ''}`}
            onClick={handleLike}
            aria-label={session ? 'Merken' : 'Anmelden zum Merken'}
            title={session ? undefined : 'Anmelden zum Merken'}
          >
            <Heart size={14} fill={liked ? 'currentColor' : 'none'} />
          </button>

          {available === false ? (
            <button className="book-card-btn book-card-btn--reserve">
              <Bookmark size={13} />
              Vormerken
            </button>
          ) : (
            <button className="book-card-btn book-card-btn--borrow">
              <LogOut size={13} style={{ transform: 'scaleX(-1)' }} />
              Ausleihen
            </button>
          )}

          {/* Mehr-Button + Kontextmenü */}
          <div className="book-card-menu-wrap" ref={menuRef}>
            <button
              className={`book-card-more${menuOpen ? ' book-card-more--active' : ''}`}
              aria-label="Mehr"
              onClick={() => setMenuOpen(o => !o)}
            >
              <Ellipsis size={14} />
            </button>

            {menuOpen && (
              <div className="book-card-menu">
                <button className="book-card-menu-item" onClick={handlePrint}>
                  <Printer size={13} />
                  Drucken
                </button>
                <button className="book-card-menu-item" onClick={handleShare}>
                  <Share2 size={13} />
                  Teilen
                </button>
                <Link href={`/biblios/${id}`} className="book-card-menu-item" onClick={() => setMenuOpen(false)}>
                  <Info size={13} />
                  Mehr Infos
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Rückgabedatum */}
        {available === false && dueDate && (
          <p className="book-card-due">Fällig am {formatDueDate(dueDate)}</p>
        )}
      </div>
    </div>
  )
}
