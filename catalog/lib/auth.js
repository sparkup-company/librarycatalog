import CredentialsProvider from 'next-auth/providers/credentials'
import { getTenantConfig } from './catalog/index.js'

export const authOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        cardnumber: {},
        pin: { type: 'password' },
      },
      async authorize(credentials) {
        const tenant = getTenantConfig()
        const basicAuth = `Basic ${Buffer.from(`${process.env.KOHA_API_USER}:${process.env.KOHA_API_PASSWORD}`).toString('base64')}`
        const authHeaders = {
          'Content-Type': 'application/json',
          'Authorization': basicAuth,
        }

        // Step 1: validate patron credentials
        let res
        try {
          res = await fetch(`${tenant.apiBase}/auth/password/validation`, {
            method: 'POST',
            headers: authHeaders,
            body: JSON.stringify({ identifier: credentials.cardnumber, password: credentials.pin }),
          })
        } catch (err) {
          console.error('[auth] fetch failed:', err.message)
          return null
        }
        if (!res.ok) {
          const body = await res.text().catch(() => '')
          console.error(`[auth] password/validation ${res.status}:`, body)
          return null
        }
        const { patron_id, cardnumber } = await res.json()

        // Step 2: fetch patron details
        const patronRes = await fetch(`${tenant.apiBase}/patrons/${patron_id}`, {
          headers: { 'Authorization': basicAuth, 'Accept': 'application/json' },
        })
        if (!patronRes.ok) return null
        const patron = await patronRes.json()

        return {
          id: String(patron_id),
          name: `${patron.firstname} ${patron.surname}`.trim(),
          cardnumber,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.cardnumber = user.cardnumber
        token.patronId = user.id
      }
      return token
    },
    async session({ session, token }) {
      session.user.cardnumber = token.cardnumber
      session.user.patronId = token.patronId
      return session
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return url
      try {
        const { pathname } = new URL(url)
        if (pathname === '/konto' || pathname === '/') return url
      } catch {}
      return baseUrl
    },
  },
  pages: { signIn: '/konto' },
}
