import { getCatalogAdapter } from '../../../lib/catalog/index.js'

export async function GET() {
  const catalog = getCatalogAdapter()
  const lists = await catalog.getPublicLists().catch(() => [])
  return Response.json(lists)
}
