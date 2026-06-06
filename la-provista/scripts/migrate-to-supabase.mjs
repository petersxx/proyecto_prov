/**
 * Migra datos de Notion → Supabase.
 * Uso: node scripts/migrate-to-supabase.mjs
 * Requiere en .env.local:
 *   NOTION_API_KEY, NOTION_DATABASE_ID, NOTION_RESERVAS_DB_ID
 *   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */

import { config } from 'dotenv'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'

const __dirname = dirname(fileURLToPath(import.meta.url))
config({ path: resolve(__dirname, '../.env.local') })

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

async function getAllPages(databaseId, sorts = []) {
  const pages = []
  let cursor = undefined
  do {
    const body = { page_size: 100, sorts }
    if (cursor) body.start_cursor = cursor
    const res = await notionFetch(`/databases/${databaseId}/query`, body)
    if (res.object === 'error') throw new Error(res.message)
    pages.push(...res.results)
    cursor = res.has_more ? res.next_cursor : undefined
  } while (cursor)
  return pages
}

function getProp(page, name) {
  const prop = page.properties[name]
  if (!prop) return null
  switch (prop.type) {
    case 'title':        return prop.title[0]?.plain_text || ''
    case 'rich_text':    return prop.rich_text[0]?.plain_text || ''
    case 'number':       return prop.number
    case 'select':       return prop.select?.name || null
    case 'checkbox':     return prop.checkbox
    case 'url':          return prop.url || null
    case 'phone_number': return prop.phone_number || ''
    case 'date':         return prop.date?.start || null
    default:             return null
  }
}

function getSupabase() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local')
  return createClient(url, key)
}

// ── Migrar menú ───────────────────────────────────────────────────────────────

async function migrateMenu(supabase) {
  console.log('\n📋 Migrando menú...')
  const dbId = process.env.NOTION_DATABASE_ID
  if (!dbId) throw new Error('Falta NOTION_DATABASE_ID en .env.local')

  const pages = await getAllPages(dbId, [{ property: 'Orden', direction: 'ascending' }])
  console.log(`   ${pages.length} items encontrados en Notion`)

  const rows = pages.map(page => ({
    nombre:         getProp(page, 'Nombre'),
    categoria:      getProp(page, 'Categoria'),
    subcategoria:   getProp(page, 'Subcategoria'),
    descripcion:    getProp(page, 'Descripcion') || '',
    precio:         getProp(page, 'Precio'),
    precio_raya:    getProp(page, 'PrecioRaya'),
    orden:          getProp(page, 'Orden') ?? 0,
    activo:         getProp(page, 'Activo') ?? true,
    foto:           getProp(page, 'Foto'),
    nombre_en:      getProp(page, 'Nombre_EN'),
    descripcion_en: getProp(page, 'Descripcion_EN'),
    nombre_pt:      getProp(page, 'Nombre_PT'),
    descripcion_pt: getProp(page, 'Descripcion_PT'),
  })).filter(r => r.nombre && r.categoria)

  // Insertar en lotes de 50
  let inserted = 0
  for (let i = 0; i < rows.length; i += 50) {
    const batch = rows.slice(i, i + 50)
    const { error } = await supabase.from('menu_items').insert(batch)
    if (error) throw new Error(`Error insertando menu_items: ${error.message}`)
    inserted += batch.length
    process.stdout.write(`\r   Insertados: ${inserted}/${rows.length}`)
  }
  console.log(`\n✅ Menú migrado: ${inserted} items`)
}

// ── Migrar reservas ───────────────────────────────────────────────────────────

async function migrateReservas(supabase) {
  console.log('\n📅 Migrando reservas...')
  const dbId = process.env.NOTION_RESERVAS_DB_ID
  if (!dbId) throw new Error('Falta NOTION_RESERVAS_DB_ID en .env.local')

  const pages = await getAllPages(dbId, [
    { property: 'Fecha', direction: 'ascending' },
    { property: 'Hora',  direction: 'ascending' },
  ])
  console.log(`   ${pages.length} reservas encontradas en Notion`)

  if (pages.length === 0) {
    console.log('   (sin datos que migrar)')
    return
  }

  const rows = pages.map(page => ({
    nombre:   getProp(page, 'Nombre'),
    mesa:     getProp(page, 'Mesa'),
    zona:     getProp(page, 'Zona') || 'Salón',
    telefono: getProp(page, 'Teléfono'),
    fecha:    getProp(page, 'Fecha'),
    hora:     getProp(page, 'Hora'),
    personas: getProp(page, 'Personas') ?? 1,
    estado:   getProp(page, 'Estado') || 'Pendiente',
    notas:    getProp(page, 'Notas'),
  })).filter(r => r.nombre && r.fecha)

  let inserted = 0
  for (let i = 0; i < rows.length; i += 50) {
    const batch = rows.slice(i, i + 50)
    const { error } = await supabase.from('reservas').insert(batch)
    if (error) throw new Error(`Error insertando reservas: ${error.message}`)
    inserted += batch.length
    process.stdout.write(`\r   Insertadas: ${inserted}/${rows.length}`)
  }
  console.log(`\n✅ Reservas migradas: ${inserted}`)
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  try {
    const supabase = getSupabase()

    // Verificar conexión
    const { error: pingError } = await supabase.from('menu_items').select('id').limit(1)
    if (pingError) throw new Error(`No se puede conectar a Supabase: ${pingError.message}\n¿Ejecutaste el schema SQL? (scripts/supabase-schema.sql)`)

    await migrateMenu(supabase)
    await migrateReservas(supabase)

    console.log('\n🎉 Migración completa!')
  } catch (err) {
    console.error('\n❌ Error:', err.message)
    process.exit(1)
  }
}

main()
