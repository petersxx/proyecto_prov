import { config } from 'dotenv'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
config({ path: resolve(__dirname, '../.env.local') })

const TOKEN = process.env.NOTION_API_KEY
const DB_ID = process.env.NOTION_DATABASE_ID
const NOTION_VERSION = '2022-06-28'

function notionFetch(path, method, body) {
  return fetch(`https://api.notion.com/v1${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
      'Notion-Version': NOTION_VERSION,
    },
    body: body ? JSON.stringify(body) : undefined,
  }).then(async r => {
    const json = await r.json()
    if (!r.ok) throw new Error(json.message)
    return json
  })
}

// Platos que tienen foto → nombre en Notion : archivo en public/fotos/
const FOTOS = {
  'Hummus, Tabuleh y Falafel': 'hummus-item.jpg',
  'Capresse':                   'ensalada-capresse.jpg',  // la de ensaladas
  'De Contrastes':              'ensalada-contrastes.jpg',
  'Pulmón':                     'ensalada-pulmon.jpg',
  'Caesar':                     'ensalada-caesar.jpg',
  'De Campo':                   'toston-campo.jpg',
  'De Atún':                    'toston-atun.jpg',
  'Asado a la Olla':            'asado.jpg',
  'Mila Napolitana':            'mila-napolitana.jpg',
  'Marinera a Caballo':         'marinera.jpg',
  'Cheesecake de Frutos Rojos': 'cheesecake.jpg',
}

// Capresse tostón tiene el mismo nombre que Capresse ensalada, lo buscamos por categoría
const FOTOS_CON_CATEGORIA = {
  'Capresse|Tostones': 'toston-capresse.jpg',
}

async function getAllPages() {
  const pages = []
  let cursor = undefined
  do {
    const body = { page_size: 100 }
    if (cursor) body.start_cursor = cursor
    const res = await notionFetch(`/databases/${DB_ID}/query`, 'POST', body)
    pages.push(...res.results)
    cursor = res.has_more ? res.next_cursor : undefined
  } while (cursor)
  return pages
}

async function main() {
  // 1. Agregar columna Foto a la DB
  console.log('Agregando columna Foto a la base de datos...')
  await notionFetch(`/databases/${DB_ID}`, 'PATCH', {
    properties: { 'Foto': { url: {} } }
  })
  console.log('✅ Columna Foto agregada')

  // 2. Traer todos los platos
  console.log('Buscando platos...')
  const pages = await getAllPages()

  // 3. Actualizar los que tienen foto
  let updated = 0
  for (const page of pages) {
    const nombre = page.properties['Nombre']?.title[0]?.plain_text
    const categoria = page.properties['Categoria']?.select?.name

    const key = `${nombre}|${categoria}`
    const foto = FOTOS_CON_CATEGORIA[key] || FOTOS[nombre]

    if (foto) {
      await notionFetch(`/pages/${page.id}`, 'PATCH', {
        properties: {
          'Foto': { url: `/fotos/${foto}` }
        }
      })
      console.log(`  ✓ ${nombre} → /fotos/${foto}`)
      updated++
    }
  }

  console.log(`\n✅ ${updated} platos actualizados con fotos.`)
}

main().catch(err => { console.error(err.message); process.exit(1) })
