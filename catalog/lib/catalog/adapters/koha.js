/**
 * Koha REST API adapter.
 * Docs: https://koha.adminkuhn.ch:8443/api/v1/.html
 */

// Module-level session cache for CGI staff interface (shared across adapter instances)
let _staffSession = null

async function kohaStaffLogin(staffBase) {
  // Step 1: GET login page to obtain initial session + CSRF token
  const initRes = await fetch(`${staffBase}/mainpage.pl`, {
    headers: { 'User-Agent': 'Mozilla/5.0' },
    cache: 'no-store',
  })
  const html = await initRes.text()
  // CSRF token lives in a hidden form input (full hash,hash,timestamp format)
  const csrf = html.match(/name="csrf_token"\s+value="([^"]+)"/)?.[1] ?? ''
  const initCookie = initRes.headers.get('set-cookie')?.match(/CGISESSID=([^;]+)/)?.[1] ?? ''

  // Step 2: POST login with correct field names
  const loginRes = await fetch(`${staffBase}/mainpage.pl`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': `CGISESSID=${initCookie}`,
      'User-Agent': 'Mozilla/5.0',
    },
    body: new URLSearchParams({
      login_userid: process.env.KOHA_API_USER ?? 'demo',
      login_password: process.env.KOHA_API_PASSWORD ?? 'demo',
      csrf_token: csrf,
      op: 'cud-login',
      koha_login_context: 'intranet',
    }).toString(),
    redirect: 'follow',
    cache: 'no-store',
  })

  const newSession = loginRes.headers.get('set-cookie')?.match(/CGISESSID=([^;]+)/)?.[1]
  return newSession || initCookie
}

async function getStaffSession(staffBase) {
  if (_staffSession) {
    const test = await fetch(`${staffBase}/mainpage.pl`, {
      headers: { Cookie: `CGISESSID=${_staffSession}`, 'User-Agent': 'Mozilla/5.0' },
      cache: 'no-store',
    }).catch(() => null)
    const html = await test?.text() ?? ''
    if (html.includes('logOut')) return _staffSession
    _staffSession = null
  }
  _staffSession = await kohaStaffLogin(staffBase)
  return _staffSession
}

export function createKohaAdapter({ apiBase, authHeaders, searchBackend }) {
  const staffBase = apiBase.replace('/api/v1', '/cgi-bin/koha')

  // searchBiblios delegiert an das konfigurierte Such-Backend
  async function searchBiblios(query, page = 1) {
    return searchBackend(query, page)
  }

  async function getBiblio(id) {
    const res = await fetch(`${apiBase}/biblios/${id}`, {
      headers: authHeaders,
      next: { revalidate: 60 },
    })
    if (!res.ok) throw new Error(`Koha getBiblio failed: ${res.status} ${res.statusText}`)
    return res.json()
  }

  async function getItems(biblioId) {
    const res = await fetch(`${apiBase}/biblios/${biblioId}/items`, {
      headers: { ...authHeaders, 'x-koha-embed': 'checkout' },
      next: { revalidate: 30 },
    })
    if (!res.ok) throw new Error(`Koha getItems failed: ${res.status}`)
    const data = await res.json()
    return Array.isArray(data) ? data : (data.results ?? [])
  }

  async function getActivePatronCount() {
    const res = await fetch(`${apiBase}/checkouts?_per_page=500`, {
      headers: authHeaders,
      next: { revalidate: 120 },
    })
    if (!res.ok) throw new Error(`Koha getActivePatronCount failed: ${res.status}`)
    const data = await res.json()
    const checkouts = Array.isArray(data) ? data : (data.results ?? [])
    return new Set(checkouts.map(c => c.patron_id)).size
  }

  async function getItemsForBiblios(biblioIds) {
    if (!biblioIds.length) return {}
    try {
      // Batch-Fetch: 1 Request statt N
      const params = new URLSearchParams({
        q: JSON.stringify({ biblio_id: { '-in': biblioIds } }),
        _per_page: 200,
      })
      const res = await fetch(`${apiBase}/items?${params}`, {
        headers: { ...authHeaders, 'x-koha-embed': 'checkout' },
        next: { revalidate: 30 },
      })
      if (!res.ok) throw new Error(`batch items failed: ${res.status}`)
      const data = await res.json()
      const items = Array.isArray(data) ? data : (data.results ?? [])
      const map = Object.fromEntries(biblioIds.map(id => [id, []]))
      for (const item of items) {
        const bid = item.biblio_id ?? item.biblionumber
        if (bid != null && map[bid]) map[bid].push(item)
      }
      return map
    } catch {
      // Fallback: individuelle Calls
      const results = await Promise.all(
        biblioIds.map(id =>
          getItems(id).then(items => ({ id, items })).catch(() => ({ id, items: [] }))
        )
      )
      return Object.fromEntries(results.map(({ id, items }) => [id, items]))
    }
  }

  async function getCurrentCheckouts(limit = 30) {
    const res = await fetch(`${apiBase}/checkouts?_per_page=${limit}`, {
      headers: { ...authHeaders, 'x-koha-embed': 'item.biblio' },
      next: { revalidate: 120 },
    })
    if (!res.ok) return []
    const data = await res.json()
    return Array.isArray(data) ? data : (data.results ?? [])
  }

  async function getPatronCheckouts(patronId) {
    if (!patronId) return []
    const res = await fetch(`${apiBase}/patrons/${patronId}/checkouts?_per_page=100`, {
      headers: { ...authHeaders, 'x-koha-embed': 'item.biblio' },
      next: { revalidate: 60 },
    })
    if (!res.ok) {
      console.error(`Koha getPatronCheckouts failed: ${res.status}`)
      return []
    }
    const data = await res.json()
    return Array.isArray(data) ? data : (data.results ?? [])
  }

  async function getPatronAccount(patronId) {
    if (!patronId) return null
    const res = await fetch(`${apiBase}/patrons/${patronId}/account`, {
      headers: authHeaders,
      next: { revalidate: 60 },
    })
    if (!res.ok) return null
    return res.json()
  }

  async function getPatronHolds(patronId) {
    if (!patronId) return []
    const params = new URLSearchParams({ patron_id: patronId, _per_page: 50 })
    const res = await fetch(`${apiBase}/holds?${params}`, {
      headers: { ...authHeaders, 'x-koha-embed': 'biblio,item' },
      next: { revalidate: 60 },
    })
    if (!res.ok) return []
    const data = await res.json()
    return Array.isArray(data) ? data : (data.results ?? [])
  }

  async function getPublicLists() {
    const res = await fetch(`${apiBase}/public/lists?only_public`, {
      next: { revalidate: 300 },
    })
    if (!res.ok) throw new Error(`getPublicLists failed: ${res.status}`)
    const data = await res.json()
    return Array.isArray(data) ? data : (data.results ?? [])
  }

  async function getListBiblios(listId, limit = 5) {
    try {
      const session = await getStaffSession(staffBase)

      // Fetch the virtual shelf HTML page
      const shelfRes = await fetch(
        `${staffBase}/virtualshelves/shelves.pl?shelfnumber=${listId}&op=view`,
        { headers: { Cookie: `CGISESSID=${session}`, 'User-Agent': 'Mozilla/5.0' }, cache: 'no-store' }
      )
      if (!shelfRes.ok) return []

      const html = await shelfRes.text()

      // Parse unique biblionumbers (each book appears multiple times in the HTML)
      const biblioIds = [...new Set(
        [...html.matchAll(/biblionumber=(\d+)/g)].map(m => Number(m[1]))
      )].slice(0, limit)

      if (!biblioIds.length) return []

      // Batch fetch biblio metadata via REST API
      const params = new URLSearchParams({
        q: JSON.stringify({ biblio_id: { '-in': biblioIds } }),
        _per_page: biblioIds.length,
      })
      const res = await fetch(`${apiBase}/biblios?${params}`, {
        headers: { ...authHeaders, Accept: 'application/json' },
      })
      if (!res.ok) return []
      const data = await res.json()
      const biblios = Array.isArray(data) ? data : (data.results ?? [])

      // Preserve order from shelf
      const byId = Object.fromEntries(biblios.map(b => [b.biblio_id ?? b.biblionumber, b]))
      return biblioIds.map(id => byId[id]).filter(Boolean)
    } catch {
      return []
    }
  }

  return { searchBiblios, getBiblio, getItems, getItemsForBiblios, getActivePatronCount, getCurrentCheckouts, getPatronCheckouts, getPatronAccount, getPatronHolds, getPublicLists, getListBiblios }
}
