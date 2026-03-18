import { getServerSession } from 'next-auth'
import { authOptions } from '../../../lib/auth.js'
import { getTenantConfig } from '../../../lib/catalog/index.js'

export async function POST(request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.patronId) {
    return Response.json({ error: 'Nicht angemeldet' }, { status: 401 })
  }

  const { checkoutId } = await request.json()
  if (!checkoutId) {
    return Response.json({ error: 'Fehlende checkoutId' }, { status: 400 })
  }

  const tenant = getTenantConfig()
  const basicAuth = `Basic ${Buffer.from(`${process.env.KOHA_API_USER}:${process.env.KOHA_API_PASSWORD}`).toString('base64')}`

  const res = await fetch(`${tenant.apiBase}/checkouts/${checkoutId}/renewal`, {
    method: 'POST',
    headers: { Authorization: basicAuth, Accept: 'application/json' },
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    return Response.json({ error: `Verlängerung fehlgeschlagen (${res.status})`, detail: body }, { status: res.status })
  }

  const data = await res.json()
  return Response.json({ due_date: data.due_date })
}
