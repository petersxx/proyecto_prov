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

function pageToReserva(page) {
  const p = page.properties
  return {
    id:       page.id,
    nombre:   p.Nombre?.title?.map(t => t.plain_text).join('') || '',
    mesa:     getText(p.Mesa),
    zona:     p.Zona?.select?.name || 'Salón',
    telefono: p['Teléfono']?.phone_number || '',
    fecha:    p.Fecha?.date?.start || '',
    hora:     getText(p.Hora),
    personas: p.Personas?.number ?? 1,
    estado:   p.Estado?.select?.name || 'Pendiente',
    notas:    getText(p.Notas),
  }
}

function buildProperties(body) {
  const props = {}
  if (body.nombre   !== undefined) props.Nombre      = { title: [{ text: { content: body.nombre } }] }
  if (body.mesa     !== undefined) props.Mesa        = { rich_text: [{ text: { content: String(body.mesa) } }] }
  if (body.zona     !== undefined) props.Zona        = { select: { name: body.zona } }
  if (body.telefono !== undefined) props['Teléfono'] = { phone_number: body.telefono }
  if (body.fecha    !== undefined) props.Fecha       = { date: { start: body.fecha } }
  if (body.hora     !== undefined) props.Hora        = { rich_text: [{ text: { content: body.hora } }] }
  if (body.personas !== undefined) props.Personas    = { number: Number(body.personas) || 1 }
  if (body.estado   !== undefined) props.Estado      = { select: { name: body.estado } }
  if (body.notas    !== undefined) props.Notas       = { rich_text: body.notas ? [{ text: { content: body.notas } }] : [] }
  return props
}

async function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = ''
    req.on('data', chunk => { data += chunk })
    req.on('end', () => {
      try { resolve(JSON.parse(data || '{}')) }
      catch { resolve({}) }
    })
    req.on('error', reject)
  })
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'GET') {
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60')
  }

  if (req.method === 'OPTIONS') { res.status(200).end(); return }

  const url = new URL(req.url, 'http://localhost')
  const segments = url.pathname.replace(/^\/api\/reservas\/?/, '').split('/')
  const reservaId = segments[0] || null
  const DB_ID = process.env.NOTION_RESERVAS_DB_ID

  try {
    // GET /api/reservas?fecha=YYYY-MM-DD
    if (req.method === 'GET') {
      const fecha = url.searchParams.get('fecha')
      const body = {
        sorts: [
          { property: 'Fecha', direction: 'ascending' },
          { property: 'Hora',  direction: 'ascending' },
        ],
        page_size: 100,
      }
      if (fecha) body.filter = { property: 'Fecha', date: { equals: fecha } }

      const resp = await fetch(
        `https://api.notion.com/v1/databases/${DB_ID}/query`,
        { method: 'POST', headers: notionHeaders(), body: JSON.stringify(body) }
      )
      if (!resp.ok) throw new Error(`Notion ${resp.status}`)
      const data = await resp.json()
      return res.status(200).json({ reservas: data.results.map(pageToReserva) })
    }

    // POST /api/reservas
    if (req.method === 'POST') {
      const body = await readBody(req)
      const properties = buildProperties({
        nombre:   body.nombre   || '',
        mesa:     body.mesa     || '',
        zona:     body.zona     || 'Salón',
        telefono: body.telefono || '',
        fecha:    body.fecha    || '',
        hora:     body.hora     || '',
        personas: body.personas || 1,
        estado:   body.estado   || 'Pendiente',
        notas:    body.notas    || '',
      })
      const resp = await fetch('https://api.notion.com/v1/pages', {
        method: 'POST',
        headers: notionHeaders(),
        body: JSON.stringify({ parent: { database_id: DB_ID }, properties }),
      })
      if (!resp.ok) throw new Error(`Notion ${resp.status}`)
      const page = await resp.json()
      return res.status(201).json({ reserva: pageToReserva(page) })
    }

    // PATCH /api/reservas/:id
    if (req.method === 'PATCH' && reservaId) {
      const body = await readBody(req)
      const updates = {}
      if (body.estado !== undefined) updates.estado = body.estado
      if (body.notas  !== undefined) updates.notas  = body.notas

      const resp = await fetch(`https://api.notion.com/v1/pages/${reservaId}`, {
        method: 'PATCH',
        headers: notionHeaders(),
        body: JSON.stringify({ properties: buildProperties(updates) }),
      })
      if (!resp.ok) throw new Error(`Notion ${resp.status}`)
      const page = await resp.json()
      return res.status(200).json({ reserva: pageToReserva(page) })
    }

    // DELETE /api/reservas/:id — archiva la página en Notion
    if (req.method === 'DELETE' && reservaId) {
      const resp = await fetch(`https://api.notion.com/v1/pages/${reservaId}`, {
        method: 'PATCH',
        headers: notionHeaders(),
        body: JSON.stringify({ archived: true }),
      })
      if (!resp.ok) throw new Error(`Notion ${resp.status}`)
      return res.status(200).json({ ok: true })
    }

    res.status(405).json({ error: 'Método no permitido' })
  } catch (err) {
    console.error('[reservas api]', err)
    res.status(500).json({ error: 'Error interno' })
  }
}
