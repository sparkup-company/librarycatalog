import { getServerSession } from 'next-auth'
import { authOptions } from '../../lib/auth.js'
import { getCatalogAdapter } from '../../lib/catalog/index.js'
import { Heart } from 'lucide-react'
import Link from 'next/link'
import RenewButton from './RenewButton.js'
import StripCover from '../StripCover.js'

// ── Helpers ────────────────────────────────────────────────────────────────

const GREETINGS = [
  (name) => `Willkommen daheim, ${name}!`,
  (name) => `Schön, dass du da bist, ${name}!`,
  (name) => `Hallo wieder, ${name}!`,
  (name) => `Hey ${name}, was liest du heute?`,
  (name) => `Guten Tag, ${name}! Schön, dich zu sehen.`,
]

function randomGreeting(fullName) {
  const firstName = fullName?.split(' ')[0] ?? fullName ?? 'du'
  const fn = GREETINGS[Math.floor(Math.random() * GREETINGS.length)]
  return fn(firstName)
}

const MS_PER_DAY = 86_400_000

function barProgress(from, to) {
  if (!to) return 4
  const end = new Date(to)
  const now = new Date()

  // Falls kein Ausleihdatum: 28-Tage-Standard rückwärts vom Fälligkeitsdatum schätzen
  const start = from ? new Date(from) : new Date(end.getTime() - 28 * MS_PER_DAY)

  const totalDays = Math.max(1, Math.round((end - start) / MS_PER_DAY))
  const elapsedDays = Math.round((now - start) / MS_PER_DAY)
  return Math.min(100, Math.max(4, (elapsedDays / totalDays) * 100))
}

function fmtDate(iso) {
  if (!iso) return '–'
  return new Date(iso).toLocaleDateString('de-DE', { day: 'numeric', month: 'long' })
}

// ── Account card ───────────────────────────────────────────────────────────

const DEBIT_LABELS = {
  OVERDUE:      'Mahngebühr',
  LOST:         'Verlust-Pauschale',
  MANUAL:       'Sonstige Gebühr',
  ACCOUNT_RENEW:'Kontoerneuerung',
  NEW_CARD:     'Kartenersatz',
}

function fmtEur(amount) {
  return Math.abs(amount).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })
}

function AccountCard({ account }) {
  const isDebt = account.balance > 0
  const lines = isDebt
    ? (account.outstanding_debits?.lines ?? [])
    : (account.outstanding_credits?.lines ?? [])

  return (
    <div className={`deins-account-card${isDebt ? ' deins-account-card--warn' : ' deins-account-card--ok'}`}>
      <div className="deins-account-header">
        <span className="deins-account-icon">{isDebt ? '⚠' : '✓'}</span>
        <span className="deins-account-label">
          {isDebt ? 'Offene Gebühren' : 'Guthaben'}
        </span>
        <span className="deins-account-amount">{fmtEur(account.balance)}</span>
      </div>
      {isDebt && lines.length > 0 && (
        <ul className="deins-account-lines">
          {lines.map((line, i) => (
            <li key={i} className="deins-account-line">
              <span>{DEBIT_LABELS[line.debit_type] ?? line.description ?? 'Gebühr'}</span>
              <span className="deins-account-line-right">
                <span>{fmtEur(line.amount_outstanding ?? line.amount)}</span>
                <span className="deins-account-line-date">{fmtDate(line.date)}</span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// ── Login-Prompt ────────────────────────────────────────────────────────────

function LoginPrompt({ message, action, actionLabel }) {
  return (
    <div className="deins-hero">
      <div className="deins-login-prompt">
        <Heart size={48} className="deins-login-icon" />
        <h1>Deine Seite</h1>
        <p>{message}</p>
        <a href={action} className="login-btn">{actionLabel}</a>
      </div>
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────

export default async function DeinsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return <LoginPrompt
      message="Melde dich an, um deine Ausleihen, Vormerkungen und Empfehlungen zu sehen."
      action="/konto"
      actionLabel="Jetzt anmelden"
    />
  }

  if (!session.user.patronId) {
    return <LoginPrompt
      message="Bitte melde dich neu an."
      action="/api/auth/signout?callbackUrl=/konto"
      actionLabel="Neu anmelden"
    />
  }

  const catalog = getCatalogAdapter()
  const [checkouts, holds, account, recommendations] = await Promise.all([
    catalog.getPatronCheckouts(session.user.patronId),
    catalog.getPatronHolds(session.user.patronId),
    catalog.getPatronAccount(session.user.patronId).catch(() => null),
    catalog.searchBiblios('der').catch(() => []),
  ])

  const greeting = randomGreeting(session.user.name)
  const recBooks = recommendations.slice(0, 10)

  return (
    <div className="deins-page">

      {/* ── Begrüßung ── */}
      <div className="deins-greeting">
        <p className="deins-greeting-text">{greeting}</p>
      </div>

      {/* ── Kontostand ── */}
      {account != null && account.balance !== 0 && (
        <AccountCard account={account} />
      )}

      {/* ── Aktuell wichtig ── */}
      {(checkouts.length > 0 || holds.length > 0) && (
        <section className="deins-section">
          <p className="deins-section-label">Aktuell wichtig</p>

          <div className="deins-cards">

            {/* Ausleihen */}
            {checkouts.map(c => {
              const biblio = c.item?.biblio ?? c.biblio ?? {}
              const progress = barProgress(c.checkout_date, c.due_date)
              const overdue = c.due_date && new Date(c.due_date) < new Date()
              return (
                <div key={c.checkout_id} className="deins-card">
                  <div className="deins-card-cover">
                    <StripCover isbn={biblio.isbn} title={biblio.title} biblioId={c.checkout_id} />
                  </div>
                  <div className="deins-card-body">
                    <div className="deins-card-meta">
                      <span className="deins-card-badge">Ausgeliehen</span>
                      <p className="deins-card-title">{biblio.title ?? '–'}</p>
                      <p className="deins-card-author">{biblio.author ?? ''}</p>
                    </div>
                    <div className="deins-bar-track">
                      <div
                        className={`deins-bar-fill${overdue ? ' deins-bar-fill--overdue' : ''}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="deins-card-footer">
                      <span className={`deins-due-label${overdue ? ' deins-due-label--overdue' : ''}`}>
                        {overdue ? `Überfällig seit ${fmtDate(c.due_date)}` : `Fällig am ${fmtDate(c.due_date)}`}
                      </span>
                      <RenewButton checkoutId={c.checkout_id} />
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Vormerkungen */}
            {holds.map(h => {
              const biblio = h.biblio ?? h.item?.biblio ?? {}
              const holdId = h.hold_id ?? h.reserve_id
              const estimatedDate = h.item?.checkout?.due_date ?? null
              const progress = estimatedDate ? barProgress(h.hold_date, estimatedDate) : 30
              return (
                <div key={holdId} className="deins-card">
                  <div className="deins-card-cover">
                    <StripCover isbn={biblio.isbn} title={biblio.title} biblioId={holdId} />
                  </div>
                  <div className="deins-card-body">
                    <div className="deins-card-meta">
                      <span className="deins-card-badge deins-card-badge--hold">Vorgemerkt</span>
                      <p className="deins-card-title">{biblio.title ?? '–'}</p>
                      <p className="deins-card-author">{biblio.author ?? ''}</p>
                    </div>
                    <div className="deins-bar-track">
                      <div className="deins-bar-fill deins-bar-fill--hold" style={{ width: `${progress}%` }} />
                    </div>
                    <div className="deins-card-footer">
                      <span className="deins-due-label deins-due-label--hold">
                        {estimatedDate
                          ? `Verfügbar ab ca. ${fmtDate(estimatedDate)}`
                          : `Warteposition ${h.priority ?? '–'}`}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}

          </div>
        </section>
      )}

      {/* ── Empfehlungen ── */}
      {recBooks.length > 0 && (
        <section className="deins-section">
          <p className="deins-section-label">Könnte dir gefallen</p>
          <div className="reading-strip">
            {recBooks.map(b => {
              const id = b.biblio_id ?? b.biblionumber
              return (
                <Link key={id} href={`/biblios/${id}`} className="reading-strip-item">
                  <StripCover isbn={b.isbn} title={b.title} biblioId={id} />
                </Link>
              )
            })}
          </div>
        </section>
      )}

    </div>
  )
}
