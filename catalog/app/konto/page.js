import { getServerSession } from 'next-auth'
import { authOptions } from '../../lib/auth.js'
import LoginForm from './LoginForm.js'
import LogoutButton from './LogoutButton.js'

export default async function KontoPage() {
  const session = await getServerSession(authOptions)

  if (session) {
    return (
      <div className="konto-hero">
        <div className="konto-card glass-card">
          <h1>Hallo, {session.user.name}</h1>
          <p>Ausweis: {session.user.cardnumber}</p>
          {/* Ausleihen / Vormerkungen folgen hier */}
          <LogoutButton />
        </div>
      </div>
    )
  }

  return (
    <div className="konto-hero">
      <div className="konto-card glass-card">
        <h1>Willkommen zurück</h1>
        <p>Melde dich an, um deine Ausleihen, Vormerkungen und Favoriten zu sehen.</p>
        <LoginForm />
        <p className="login-hint">Noch kein Konto? Melde dich in deiner Bibliothek vor Ort an.</p>
      </div>
    </div>
  )
}
