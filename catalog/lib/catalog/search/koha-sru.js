/**
 * Koha SRU search backend — uses the Zebra/Elasticsearch index.
 *
 * CURRENTLY NOT OPERATIONAL: The SRU endpoint at Koha is protected by Anubis
 * bot-protection (JS proof-of-work). Server-side fetch cannot solve the challenge.
 *
 * To activate: configure a proxy or Anubis allowlist for the Next.js server IP,
 * set searchBackend: "koha-sru" and sruBase in the tenant config.
 */
export function createKohaSruSearch({ sruBase }) {
  return async function search(query, page = 1) {
    const startRecord = (page - 1) * 20 + 1
    const params = new URLSearchParams({
      version: '1.1',
      operation: 'searchRetrieve',
      query: `title = "${query}"`,
      maximumRecords: 20,
      startRecord,
    })
    const res = await fetch(`${sruBase}?${params}`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) throw new Error(`SRU search failed: ${res.status}`)
    // Parse MARCXML → bibliographic objects
    const xml = await res.text()
    return parseMarcXmlResults(xml)
  }
}

function parseMarcXmlResults(xml) {
  // MARCXML field mappings:
  //   001          → biblio_id
  //   245$a        → title
  //   100$a/700$a  → author
  //   020$a        → isbn
  const records = []
  const recordMatches = xml.matchAll(/<record>([\s\S]*?)<\/record>/g)
  for (const [, body] of recordMatches) {
    const biblio_id = body.match(/<controlfield tag="001">(.*?)<\/controlfield>/)?.[1] ?? null
    const title  = body.match(/<subfield code="a">([^<]*)<\/subfield>[\s\S]*?tag="245"/)?.[1]
               ?? body.match(/tag="245"[\s\S]*?<subfield code="a">([^<]*)<\/subfield>/)?.[1]
               ?? ''
    const author = body.match(/tag="100"[\s\S]*?<subfield code="a">([^<]*)<\/subfield>/)?.[1]
               ?? body.match(/tag="700"[\s\S]*?<subfield code="a">([^<]*)<\/subfield>/)?.[1]
               ?? ''
    const isbn   = body.match(/tag="020"[\s\S]*?<subfield code="a">([^<]*)<\/subfield>/)?.[1] ?? ''
    if (biblio_id) records.push({ biblio_id: Number(biblio_id), title, author, isbn })
  }
  return records
}
