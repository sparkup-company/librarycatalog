'use client'

import { useState } from 'react'

export default function RenewButton({ checkoutId }) {
  const [state, setState] = useState('idle') // idle | loading | done | error
  const [newDueDate, setNewDueDate] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')

  async function handleRenew() {
    setState('loading')
    try {
      const res = await fetch('/api/renew', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checkoutId }),
      })
      const data = await res.json()
      if (!res.ok) {
        setErrorMsg(data.error ?? 'Fehler')
        setState('error')
        return
      }
      setNewDueDate(new Date(data.due_date).toLocaleDateString('de-DE', { day: 'numeric', month: 'long' }))
      setState('done')
    } catch {
      setErrorMsg('Netzwerkfehler')
      setState('error')
    }
  }

  if (state === 'done') {
    return <span className="deins-renew-confirm">Verlängert bis {newDueDate}</span>
  }
  if (state === 'error') {
    return <span className="deins-renew-error">{errorMsg}</span>
  }

  return (
    <button
      className="deins-renew-btn"
      onClick={handleRenew}
      disabled={state === 'loading'}
    >
      {state === 'loading' ? '…' : 'Verlängern'}
    </button>
  )
}
