'use client'
import { signIn } from 'next-auth/react'
import { useState } from 'react'

export default function LoginForm() {
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const fd = new FormData(e.target)
    const result = await signIn('credentials', {
      cardnumber: fd.get('cardnumber'),
      pin: fd.get('pin'),
      redirect: false,
    })
    setLoading(false)
    if (result?.error) setError('Ausweisnummer oder PIN falsch.')
    else window.location.href = '/deins'
  }

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <label>Bibliotheksausweis-Nr.</label>
      <input name="cardnumber" type="text" placeholder="z. B. 12345" required />
      <label>PIN</label>
      <input name="pin" type="password" placeholder="••••••" required />
      {error && <p className="login-error">{error}</p>}
      <button type="submit" className="login-btn" disabled={loading}>
        {loading ? 'Wird geprüft…' : 'Anmelden'}
      </button>
    </form>
  )
}
