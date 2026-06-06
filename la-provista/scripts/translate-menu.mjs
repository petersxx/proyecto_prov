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
    if (!r.ok) throw new Error(json.message + '\n' + JSON.stringify(json, null, 2))
    return json
  })
}

async function translate(text, targetLang) {
  if (!text || text.trim() === '') return ''
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=es|${targetLang}&de=peter123brow@gmail.com`
  const res = await fetch(url)
  const data = await res.json()
  if (data.responseStatus !== 200) throw new Error(`Translation error: ${data.responseDetails}`)
  return data.responseData.translatedText
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms))
}

async function getAllPages() {
  const pages = []
  let cursor = undefined
  do {
    const body = { page_size: 100, sorts: [{ property: 'Orden', direction: 'ascending' }] }
    if (cursor) body.start_cursor = cursor
    const res = await notionFetch(`/databases/${DB_ID}/query`, 'POST', body)
    pages.push(...res.results)
    cursor = res.has_more ? res.next_cursor : undefined
  } while (cursor)
  return pages
}

function getText(page, name) {
  const prop = page.properties[name]
  if (!prop) return ''
  if (prop.type === 'title') return prop.title[0]?.plain_text || ''
  if (prop.type === 'rich_text') return prop.rich_text[0]?.plain_text || ''
  return ''
}

async function addSchemaProperties() {
  console.log('Agregando propiedades de traducción a la base de datos...')
  await notionFetch(`/databases/${DB_ID}`, 'PATCH', {
    properties: {
      'Nombre_EN':     { rich_text: {} },
      'Descripcion_EN': { rich_text: {} },
      'Nombre_PT':     { rich_text: {} },
      'Descripcion_PT': { rich_text: {} },
    },
  })
  console.log('✅ Propiedades creadas.')
}

async function main() {
  await addSchemaProperties()

  const pages = await getAllPages()
  console.log(`\nTraduciendo ${pages.length} items...\n`)

  let done = 0
  let skipped = 0
  for (const page of pages) {
    const nombre = getText(page, 'Nombre')
    const desc   = getText(page, 'Descripcion')

    // Saltear si ya tiene traducción
    const yaTraducido = getText(page, 'Nombre_EN')
    if (yaTraducido) { skipped++; done++; process.stdout.write(`\r  ${done}/${pages.length} — (ya traducido) ${nombre.substring(0, 35)}`); continue }

    let nombreEN = '', descEN = '', nombrePT = '', descPT = ''

    try {
      nombreEN = await translate(nombre, 'en'); await sleep(300)
      descEN   = desc ? await translate(desc, 'en') : ''; await sleep(300)
      nombrePT = await translate(nombre, 'pt'); await sleep(300)
      descPT   = desc ? await translate(desc, 'pt') : ''; await sleep(300)
    } catch (err) {
      console.error(`\n  ⚠ Error traduciendo "${nombre}": ${err.message}`)
      await sleep(2000)
    }

    await notionFetch(`/pages/${page.id}`, 'PATCH', {
      properties: {
        'Nombre_EN':      { rich_text: nombreEN ? [{ text: { content: nombreEN } }] : [] },
        'Descripcion_EN': { rich_text: descEN   ? [{ text: { content: descEN   } }] : [] },
        'Nombre_PT':      { rich_text: nombrePT ? [{ text: { content: nombrePT } }] : [] },
        'Descripcion_PT': { rich_text: descPT   ? [{ text: { content: descPT   } }] : [] },
      },
    })

    done++
    process.stdout.write(`\r  ${done}/${pages.length} — ${nombre.substring(0, 40)}`)
  }

  console.log(`\n\n✅ Traducciones completadas. (${skipped} ya existían, ${done - skipped} nuevas)`)
}

main().catch(err => { console.error('\nError:', err.message); process.exit(1) })
