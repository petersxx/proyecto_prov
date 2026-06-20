const NOTION_VERSION = '2022-06-28'

function notionHeaders() {
  return {
    Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
    'Notion-Version': NOTION_VERSION,
    'Content-Type': 'application/json',
  }
}

function getText(prop) {
  return prop?.rich_text?.map(t => t.plain_text).join('') || ''
}

async function queryAll(database_id, filter, sorts) {
  const results = []
  let cursor = undefined
  do {
    const body = { filter, sorts, page_size: 100 }
    if (cursor) body.start_cursor = cursor

    const resp = await fetch(
      `https://api.notion.com/v1/databases/${database_id}/query`,
      { method: 'POST', headers: notionHeaders(), body: JSON.stringify(body) }
    )
    if (!resp.ok) throw new Error(`Notion API error: ${resp.status}`)
    const data = await resp.json()
    results.push(...data.results)
    cursor = data.has_more ? data.next_cursor : undefined
  } while (cursor)
  return results
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300')

  try {
    const pages = await queryAll(
      process.env.NOTION_DATABASE_ID,
      { property: 'Activo', checkbox: { equals: true } },
      [{ property: 'Orden', direction: 'ascending' }]
    )

    const rows = pages.map(page => {
      const p = page.properties
      const nameEN = getText(p.Nombre_EN)
      const descEN = getText(p.Descripcion_EN)
      const namePT = getText(p.Nombre_PT)
      const descPT = getText(p.Descripcion_PT)
      return {
        id:           page.id,
        name:         p.Nombre?.title?.map(t => t.plain_text).join('') || '',
        description:  getText(p.Descripcion),
        name_en:      nameEN  || undefined,
        desc_en:      descEN  || undefined,
        name_pt:      namePT  || undefined,
        desc_pt:      descPT  || undefined,
        price:        p.Precio?.number    ?? null,
        priceRaya:    p.PrecioRaya?.number ?? undefined,
        image:        p.Foto?.url          ?? undefined,
        categoria:    p.Categoria?.select?.name  || '',
        subcategoria: p.Subcategoria?.select?.name || undefined,
        orden:        p.Orden?.number ?? 0,
      }
    })

    const itemsByCategory = {}
    const categoryOrder = []

    for (const row of rows) {
      if (!row.categoria) continue
      if (!itemsByCategory[row.categoria]) {
        itemsByCategory[row.categoria] = []
        categoryOrder.push(row.categoria)
      }
      itemsByCategory[row.categoria].push(row)
    }

    const categories = categoryOrder.map(catLabel => {
      const items = itemsByCategory[catLabel]
      const hasSubs = items.some(i => i.subcategoria)

      if (!hasSubs) {
        return {
          id: catLabel,
          label: catLabel,
          items: items.map(({ categoria, subcategoria, orden, ...i }) => i),
        }
      }

      const subMap = {}
      const subOrder = []
      for (const item of items) {
        const sub = item.subcategoria || 'General'
        if (!subMap[sub]) { subMap[sub] = []; subOrder.push(sub) }
        const { categoria, subcategoria, orden, ...rest } = item
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
