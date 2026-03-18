import Link from 'next/link'
import { MapPin, Phone, Mail, Globe, Clock, ExternalLink } from 'lucide-react'

const LEGAL_LINKS = [
  { label: 'Datenschutz',              href: '/datenschutz' },
  { label: 'Impressum',                href: '/impressum' },
  { label: 'Barrierefreiheit',         href: '/barrierefreiheit' },
  { label: 'Nutzungsbedingungen',      href: '/nutzungsbedingungen' },
]

export default function SiteFooter({ tenant }) {
  const contact = tenant.contact ?? null
  const links   = tenant.footerLinks ?? []
  const year    = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">

        {/* Grid: 4 sections */}
        <div className="site-footer-grid">

          {/* Sektion 1: Kontakt */}
          {contact && (
            <div className="site-footer-section">
              <h3 className="site-footer-heading">Kontakt</h3>
              <ul className="site-footer-contact-list">
                {contact.address && (
                  <li>
                    <MapPin size={13} />
                    <span>{contact.address}</span>
                  </li>
                )}
                {contact.phone && (
                  <li>
                    <Phone size={13} />
                    <a href={`tel:${contact.phone.replace(/\s/g, '')}`}>{contact.phone}</a>
                  </li>
                )}
                {contact.email && (
                  <li>
                    <Mail size={13} />
                    <a href={`mailto:${contact.email}`}>{contact.email}</a>
                  </li>
                )}
                {contact.website && (
                  <li>
                    <Globe size={13} />
                    <a href={contact.website} target="_blank" rel="noopener noreferrer">
                      {contact.website.replace(/^https?:\/\//, '')}
                    </a>
                  </li>
                )}
              </ul>
              {contact.hours?.length > 0 && (
                <div className="site-footer-hours">
                  <div className="site-footer-hours-label">
                    <Clock size={13} />
                    <span>Öffnungszeiten</span>
                  </div>
                  {contact.hours.map((h, i) => (
                    <div key={i} className="site-footer-hours-row">
                      <span>{h.days}</span>
                      <span>{h.time}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Sektion 2: Custom Links */}
          {links.length > 0 && (
            <div className="site-footer-section">
              <h3 className="site-footer-heading">Entdecken</h3>
              <ul className="site-footer-links">
                {links.map((l, i) => (
                  <li key={i}>
                    {l.external ? (
                      <a href={l.href} target="_blank" rel="noopener noreferrer">
                        {l.label}
                        <ExternalLink size={11} />
                      </a>
                    ) : (
                      <Link href={l.href}>{l.label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Sektion 3: Rechtliches */}
          <div className="site-footer-section">
            <h3 className="site-footer-heading">Rechtliches</h3>
            <ul className="site-footer-links">
              {LEGAL_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sektion 4: Logo + Tagline */}
          <div className="site-footer-section site-footer-brand">
            {tenant.logoFull ? (
              <img
                src={tenant.logoFull}
                alt={tenant.name}
                className="site-footer-logo"
              />
            ) : (
              <span className="site-footer-logo-text">{tenant.name}</span>
            )}
            <p className="site-footer-tagline">
              Made by your library,<br />
              powered by <strong>libspark.</strong>
            </p>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="site-footer-bottom">
          <span>© {year} {tenant.name}</span>
          <span className="site-footer-bottom-sep">·</span>
          <span>Alle Rechte vorbehalten</span>
        </div>

      </div>
    </footer>
  )
}
