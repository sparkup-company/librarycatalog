import { getCatalogAdapter } from '../lib/catalog/index.js'

export default async function PatronBadge() {
  let count = 0
  try { count = await getCatalogAdapter().getActivePatronCount() } catch {}
  if (count <= 0) return null
  return (
    <div className="hero-badge">
      {count === 1 ? '1 andere Person' : `${count} andere Personen`} nutzen gerade die Bibliothek mit dir!
    </div>
  )
}
