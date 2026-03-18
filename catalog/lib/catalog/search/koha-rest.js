/**
 * Koha REST API search backend.
 * Searches title, author, and ISBN via SQL LIKE — no search index involved.
 */
export function createKohaRestSearch({ apiBase, authHeaders }) {
  return async function search(query, page = 1) {
    const params = new URLSearchParams({
      q: JSON.stringify({
        '-or': [
          { title:  { '-like': `%${query}%` } },
          { author: { '-like': `%${query}%` } },
          { isbn:   { '-like': `%${query}%` } },
        ],
      }),
      _per_page: 20,
      _page: page,
    })
    const res = await fetch(`${apiBase}/biblios?${params}`, {
      headers: authHeaders,
      next: { revalidate: 60 },
    })
    if (!res.ok) throw new Error(`Koha REST search failed: ${res.status} ${res.statusText}`)
    const data = await res.json()
    return Array.isArray(data) ? data : (data.results ?? [])
  }
}
