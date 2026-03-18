import { getCatalogAdapter } from '../../../../lib/catalog/index.js'

export async function GET(request, { params }) {
  const catalog = getCatalogAdapter()
  const biblios = await catalog.getListBiblios(params.id, 200).catch(() => [])
  return Response.json(biblios)
}
