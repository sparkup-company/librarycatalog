import { createKohaAdapter } from './adapters/koha.js'
import demo from '../../tenants/demo.json'

// For now: always load the demo tenant.
// Later: resolve tenant by request hostname.
function getTenant() {
  return demo
}

export function getCatalogAdapter() {
  const tenant = getTenant()

  if (tenant.adapter === 'koha') {
    return createKohaAdapter({
      apiBase: tenant.apiBase,
      sessionCookie: process.env.KOHA_SESSION_COOKIE,
    })
  }

  throw new Error(`Unknown adapter: ${tenant.adapter}`)
}

export function getTenantConfig() {
  return getTenant()
}
