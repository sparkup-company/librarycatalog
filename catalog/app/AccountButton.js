'use client'
import { useSession, signOut } from 'next-auth/react'
import { LogIn, LogOut, User } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

export default function AccountButton() {
  const { data: session, status } = useSession()
  const isLoggedIn = status === 'authenticated'
  const userName = session?.user?.name ?? ''
  const userInitials = userName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  if (!isLoggedIn) {
    return (
      <a href="/konto" className="account-btn">
        <div className="user-avatar user-avatar--guest">
          <LogIn size={16} />
        </div>
      </a>
    )
  }

  return (
    <div ref={ref} className="account-btn-wrap">
      <button className="account-btn" onClick={() => setOpen(v => !v)}>
        <div className="user-avatar">{userInitials}</div>
      </button>
      {open && (
        <div className="account-menu">
          <div className="account-menu-name">
            <User size={14} />
            {userName}
          </div>
          <a href="/deins" className="account-menu-item" onClick={() => setOpen(false)}>
            Mein Konto
          </a>
          <button
            className="account-menu-item account-menu-item--danger"
            onClick={() => signOut({ callbackUrl: '/' })}
          >
            <LogOut size={14} />
            Abmelden
          </button>
        </div>
      )}
    </div>
  )
}
