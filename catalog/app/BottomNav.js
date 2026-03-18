'use client'

import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Home, Search, Bookmark, Heart } from 'lucide-react'

const navItems = [
  { href: '/',           label: 'Start',      icon: Home },
  { href: '/suche',      label: 'Suche',      icon: Search },
  { href: '/sammlungen', label: 'Sammlungen', icon: Bookmark },
]

export default function BottomNav() {
  const pathname = usePathname()
  const { status } = useSession()
  const isLoggedIn = status === 'authenticated'

  function isActive(href) {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <nav className="bottom-nav">
      {navItems.map(({ href, label, icon: Icon }) => (
        <a
          key={href}
          href={href}
          className={`bottom-nav-item${isActive(href) ? ' bottom-nav-item--active' : ''}`}
        >
          <span className="bottom-nav-icon"><Icon size={22} /></span>
          <span className="bottom-nav-label">{label}</span>
        </a>
      ))}

      <a
        href={isLoggedIn ? '/deins' : '/konto'}
        className={`bottom-nav-item${isActive('/deins') ? ' bottom-nav-item--active' : ''}${!isLoggedIn ? ' bottom-nav-item--disabled' : ''}`}
      >
        <span className="bottom-nav-icon"><Heart size={22} /></span>
        <span className="bottom-nav-label">Deins</span>
      </a>

    </nav>
  )
}
