'use client'

import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Home, Search, Bookmark, Heart } from 'lucide-react'

const navItems = [
  { href: '/',           label: 'Start',       icon: Home },
  { href: '/suche',      label: 'Suche',       icon: Search },
  { href: '/sammlungen', label: 'Sammlungen',  icon: Bookmark },
]

export default function NavSidebar({ tenant }) {
  const pathname = usePathname()
  const { status } = useSession()
  const isLoggedIn = status === 'authenticated'

  function isActive(href) {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-inner">
        <a href="/" className="sidebar-logo">
          {tenant.logoFavicon ? (
            <>
              <div className="logo-icon logo-icon--img">
                <img src={tenant.logoFavicon} alt={tenant.name} />
              </div>
              <img src={tenant.logoFull} alt={tenant.name} className="logo-full" />
            </>
          ) : (
            <>
              <div className="logo-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/>
                </svg>
              </div>
              <span className="sidebar-logo-text">{tenant.name}</span>
            </>
          )}
        </a>

        <nav className="sidebar-nav">
          <div className="nav-section">
            {navItems.map(({ href, label, icon: Icon }) => (
              <a
                key={href}
                href={href}
                className={`nav-item${isActive(href) ? ' nav-item-active' : ''}`}
              >
                <span className="nav-icon"><Icon size={20} /></span>
                <span className="nav-item-text">{label}</span>
              </a>
            ))}
            {isLoggedIn ? (
              <a
                href="/deins"
                className={`nav-item${isActive('/deins') ? ' nav-item-active' : ''}`}
              >
                <span className="nav-icon"><Heart size={20} /></span>
                <span className="nav-item-text">Deins</span>
              </a>
            ) : (
              <span className="nav-item nav-item--disabled" title="Anmelden erforderlich">
                <span className="nav-icon"><Heart size={20} /></span>
                <span className="nav-item-text">Deins</span>
              </span>
            )}
          </div>
        </nav>
      </div>
    </aside>
  )
}
