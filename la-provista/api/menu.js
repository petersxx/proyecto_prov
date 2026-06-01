const NOTION_VERSION = '2022-06-28'

function notionFetch(path, body) {
  return fetch(`https://api.notion.com/v1${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
      'Content-Type': 'application/json',
      'Notion-Version': NOTION_VERSION,
    },
    body: JSON.stringify(body),
  }).then(r => r.json())
}

async function getAllPages(databaseId) {
  const pages = []
  let cursor = undefined

  do {
    const body = { page_size: 100, sorts: [{ property: 'Orden', direction: 'ascending' }] }
    if (cursor) body.start_cursor = cursor

    const res = await notionFetch(`/databases/${databaseId}/query`, body)
    pages.push(...res.results)
    cursor = res.has_more ? res.next_cursor : undefined
  } while (cursor)

  return pages
}

function getProp(page, name) {
  const prop = page.properties[name]
  if (!prop) return null
  switch (prop.type) {
    case 'title':     return prop.title[0]?.plain_text || ''
    case 'rich_text': return prop.rich_text[0]?.plain_text || ''
    case 'number':    return prop.number
    case 'select':    return prop.select?.name || null
    case 'checkbox':  return prop.checkbox
    case 'url':       return prop.url || null
    default:          return null
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300')

  try {
    const dbId = process.env.NOTION_DATABASE_ID
    const pages = await getAllPages(dbId)

    const itemsByCategory = {}
    const categoryOrder = []

    for (const page of pages) {
      if (!getProp(page, 'Activo')) continue

      const nombre      = getProp(page, 'Nombre')
      const categoria   = getProp(page, 'Categoria')
      const subcategoria = getProp(page, 'Subcategoria')
      const descripcion = getProp(page, 'Descripcion')
      const precio      = getProp(page, 'Precio')
      const precioRaya  = getProp(page, 'PrecioRaya')
      const foto        = getProp(page, 'Foto')

      if (!nombre || !categoria) continue

      if (!itemsByCategory[categoria]) {
        itemsByCategory[categoria] = []
        categoryOrder.push(categoria)
      }

      itemsByCategory[categoria].push({
        id: page.id,
        name: nombre,
        description: descripcion || '',
        price: precio,
        priceRaya: precioRaya || undefined,
        image: foto || undefined,
        subcategoria: subcategoria || undefined,
      })
    }

    // Agrupar subcategorías
    const categories = categoryOrder.map(catLabel => {
      const items = itemsByCategory[catLabel]
      const hasSubs = items.some(i => i.subcategoria)

      if (!hasSubs) {
        return { id: catLabel, label: catLabel, items: items.map(({ subcategoria, ...i }) => i) }
      }

      const subMap = {}
      const subOrder = []
      for (const item of items) {
        const sub = item.subcategoria || 'General'
        if (!subMap[sub]) { subMap[sub] = []; subOrder.push(sub) }
        const { subcategoria, ...rest } = item
        subMap[sub].push(rest)
      }

      return {
        id: catLabel,
        label: catLabel,
        subcategories: subOrder.map(s => ({ label: s, items: subMap[s] })),
      }
    })

    res.status(200).json({ categories })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al cargar el menú' })
  }
}
