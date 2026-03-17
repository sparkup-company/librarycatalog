/**
 * Koha REST API adapter.
 * Docs: https://koha.adminkuhn.ch:8443/api/v1/.html
 */

export function createKohaAdapter({ apiBase, sessionCookie }) {
  const headers = {
    Cookie: `CGISESSID=${sessionCookie}`,
    Accept: 'application/json',
  }

  async function searchBiblios(query, page = 1) {
    const perPage = 20
    const offset = (page - 1) * perPage

    const params = new URLSearchParams({
      q: JSON.stringify({ title: { '-like': `%${query}%` } }),
      _per_page: perPage,
      _page: page,
    })

    const url = `${apiBase}/biblios?${params}`
    const res = await fetch(url, { headers, cache: 'no-store' })

    if (!res.ok) {
      throw new Error(`Koha search failed: ${res.status} ${res.statusText}`)
    }

    const data = await res.json()
    return Array.isArray(data) ? data : (data.results ?? [])
  }

  async function getBiblio(id) {
    const res = await fetch(`${apiBase}/biblios/${id}`, { headers, cache: 'no-store' })

    if (!res.ok) {
      throw new Error(`Koha getBiblio failed: ${res.status} ${res.statusText}`)
    }

    return res.json()
  }

  async function getItems(biblioId) {
    const res = await fetch(`${apiBase}/biblios/${biblioId}/items`, {
      headers: { ...headers, 'x-koha-embed': 'checkout' },
      cache: 'no-store',
    })
    if (!res.ok) throw new Error(`Koha getItems failed: ${res.status}`)
    const data = await res.json()
    return Array.isArray(data) ? data : (data.results ?? [])
  }

  async function getActivePatronCount() {
    const res = await fetch(`${apiBase}/checkouts?_per_page=500`, { headers, cache: 'no-store' })
    if (!res.ok) throw new Error(`Koha getActivePatronCount failed: ${res.status}`)
    const data = await res.json()
    const checkouts = Array.isArray(data) ? data : (data.results ?? [])
    return new Set(checkouts.map(c => c.patron_id)).size
  }

  async function getItemsForBiblios(biblioIds) {
    const results = await Promise.all(
      biblioIds.map(id =>
        getItems(id).then(items => ({ id, items })).catch(() => ({ id, items: [] }))
      )
    )
    return Object.fromEntries(results.map(({ id, items }) => [id, items]))
  }

  return { searchBiblios, getBiblio, getItems, getItemsForBiblios, getActivePatronCount }
}
