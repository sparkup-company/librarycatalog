import { headers } from 'next/headers'
import { createKohaAdapter } from './adapters/koha.js'
import demo from '../../tenants/demo.json'
import augsburg from '../../tenants/stadtbuecherei-augsburg.json'
import fuerth from '../../tenants/fuerth.json'

const tenants = { demo, augsburg, fuerth }

function getTenant() {
  const host = headers().get('host') ?? ''
  if (host.startsWith('augsburg.')) return augsburg
  if (host.startsWith('fuerth.')) return fuerth
  return demo  // fallback
}

export function getCatalogAdapter() {
  const tenant = getTenant()

  if (tenant.adapter === 'koha') {
    return createKohaAdapter({
      apiBase: tenant.apiBase,
      sessionCookie: process.env[`KOHA_SESSION_COOKIE_${tenant.id.toUpperCase()}`],
    })
  }

  throw new Error(`Unknown adapter: ${tenant.adapter}`)
}

export function getTenantConfig() {
  return getTenant()
}
