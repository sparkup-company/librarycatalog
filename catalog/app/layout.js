import { getTenantConfig } from '../lib/catalog/index.js'
import Script from 'next/script'
import './globals.css'

export const metadata = {
  title: 'Library Catalog',
}

export default function RootLayout({ children }) {
  const tenant = getTenantConfig()

  return (
    <html lang="de">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@400;500;700;800&family=Kalam:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="app-layout">
          {/* Collapsible sidebar */}
          <aside className="sidebar">
            <div className="sidebar-inner">
              <a href="/" className="sidebar-logo">
                <div className="logo-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/>
                  </svg>
                </div>
                <span className="sidebar-logo-text">{tenant.name}</span>
              </a>

              <nav className="sidebar-nav">
                <div className="nav-section">
                  <p className="nav-section-label">Navigation</p>
                  <a href="/" className="nav-item nav-item-active">
                    <span className="nav-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
                      </svg>
                    </span>
                    <span className="nav-item-text">Entdecken</span>
                  </a>
                  <a href="#" className="nav-item">
                    <span className="nav-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>
                      </svg>
                    </span>
                    <span className="nav-item-text">Kategorien</span>
                  </a>
                </div>
                <div className="nav-section">
                  <p className="nav-section-label">Persönlich</p>
                  <a href="#" className="nav-item">
                    <span className="nav-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                      </svg>
                    </span>
                    <span className="nav-item-text">Favoriten</span>
                  </a>
                </div>
              </nav>

              <div className="sidebar-footer">
                <a href="#">
                  <div className="user-avatar">JS</div>
                  <div className="user-info">
                    <p className="user-name">Julian Schmidt</p>
                    <p className="user-role">Mitglied</p>
                  </div>
                </a>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="main-area">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}
