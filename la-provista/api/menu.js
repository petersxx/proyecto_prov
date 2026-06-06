import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300')

  try {
    const supabase = getSupabase()
    const { data: rows, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('activo', true)
      .order('orden', { ascending: true })

    if (error) throw error

    const itemsByCategory = {}
    const categoryOrder = []

    for (const row of rows) {
      const categoria = row.categoria
      if (!itemsByCategory[categoria]) {
        itemsByCategory[categoria] = []
        categoryOrder.push(categoria)
      }
      itemsByCategory[categoria].push({
        id:          row.id,
        name:        row.nombre,
        description: row.descripcion || '',
        name_en:     row.nombre_en    || undefined,
        desc_en:     row.descripcion_en || undefined,
        name_pt:     row.nombre_pt    || undefined,
        desc_pt:     row.descripcion_pt || undefined,
        price:       row.precio,
        priceRaya:   row.precio_raya  || undefined,
        image:       row.foto         || undefined,
        subcategoria: row.subcategoria || undefined,
      })
    }

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
