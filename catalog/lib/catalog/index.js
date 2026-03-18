import { headers } from 'next/headers'
import { createKohaAdapter } from './adapters/koha.js'
import { createKohaRestSearch } from './search/koha-rest.js'
import { createKohaSruSearch } from './search/koha-sru.js'
import demo from '../../tenants/demo.json'
import augsburg from '../../tenants/stadtbuecherei-augsburg.json'
import fuerth from '../../tenants/fuerth.json'

const tenants = { demo, augsburg, fuerth }

function getTenant() {
  const host = headers().get('host') ?? ''
  if (host.startsWith('augsburg.')) return augsburg
  if (host.startsWith('fuerth.')) return fuerth
  return augsburg  // fallback
}

function createSearchBackend(tenant, authHeaders) {
  const backend = tenant.searchBackend ?? 'koha-rest'
  if (backend === 'koha-sru') {
    return createKohaSruSearch({ sruBase: tenant.sruBase })
  }
  // default: koha-rest
  return createKohaRestSearch({ apiBase: tenant.apiBase, authHeaders })
}

export function getCatalogAdapter() {
  const tenant = getTenant()
  if (tenant.adapter !== 'koha') throw new Error(`Unknown adapter: ${tenant.adapter}`)

  const authHeaders = {
    Authorization: `Basic ${Buffer.from(`${process.env.KOHA_API_USER}:${process.env.KOHA_API_PASSWORD}`).toString('base64')}`,
    Accept: 'application/json',
  }
  const searchBackend = createSearchBackend(tenant, authHeaders)

  return createKohaAdapter({ apiBase: tenant.apiBase, authHeaders, searchBackend })
}

export function getTenantConfig() {
  return getTenant()
}
