'use client'
import { signOut } from 'next-auth/react'

export default function LogoutButton() {
  return (
    <button
      className="login-btn"
      onClick={() => signOut({ callbackUrl: window.location.origin + '/konto' })}
    >
      Abmelden
    </button>
  )
}
