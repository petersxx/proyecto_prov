const NOTION_VERSION = '2022-06-28'

function notionReq(method, path, body) {
  return fetch(`https://api.notion.com/v1${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
      'Content-Type': 'application/json',
      'Notion-Version': NOTION_VERSION,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  }).then(r => r.json())
}

function dbId() {
  return process.env.NOTION_RESERVAS_DB_ID
}

function pageToReserva(page) {
  const p = page.properties
  const get = (name, type) => {
    const prop = p[name]
    if (!prop) return null
    switch (type) {
      case 'title':     return prop.title?.[0]?.plain_text || ''
      case 'text':      return prop.rich_text?.[0]?.plain_text || ''
      case 'phone':     return prop.phone_number || ''
      case 'number':    return prop.number ?? null
      case 'select':    return prop.select?.name || null
      case 'date':      return prop.date?.start || null
      default:          return null
    }
  }

  return {
    id: page.id,
    nombre:    get('Nombre',   'title'),
    mesa:      get('Mesa',     'text'),
    zona:      get('Zona',     'select'),
    telefono:  get('Teléfono', 'phone'),
    fecha:     get('Fecha',    'date'),
    hora:      get('Hora',     'text'),
    personas:  get('Personas', 'number'),
    estado:    get('Estado',   'select') || 'Pendiente',
    notas:     get('Notas',    'text'),
  }
}

function buildProperties({ nombre, mesa, zona, telefono, fecha, hora, personas, estado, notas }) {
  return {
    Nombre:     { title:       [{ text: { content: nombre || '' } }] },
    Mesa:       { rich_text:   [{ text: { content: mesa || '' } }] },
    Zona:       { select:      { name: zona || 'Salón' } },
    'Teléfono': { phone_number: telefono || '' },
    Fecha:      { date:        { start: fecha } },
    Hora:       { rich_text:   [{ text: { content: hora || '' } }] },
    Personas:   { number:      Number(personas) || 1 },
    Estado:     { select:      { name: estado || 'Pendiente' } },
    Notas:      { rich_text:   [{ text: { content: notas || '' } }] },
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') { res.status(200).end(); return }

  const url = new URL(req.url, `http://localhost`)
  const segments = url.pathname.replace(/^\/api\/reservas\/?/, '').split('/')
  const pageId = segments[0] || null

  try {
    // ── GET /api/reservas?fecha=YYYY-MM-DD ──────────────────────────────────
    if (req.method === 'GET') {
      const fecha = url.searchParams.get('fecha')
      const body = {
        page_size: 100,
        sorts: [
          { property: 'Fecha', direction: 'ascending' },
          { property: 'Hora',  direction: 'ascending' },
        ],
      }
      if (fecha) {
        body.filter = {
          property: 'Fecha',
          date: { equals: fecha },
        }
      }
      const data = await notionReq('POST', `/databases/${dbId()}/query`, body)
      const reservas = (data.results || []).map(pageToReserva)
      return res.status(200).json({ reservas })
    }

    // ── POST /api/reservas ──────────────────────────────────────────────────
    if (req.method === 'POST') {
      const body = await readBody(req)
      const page = await notionReq('POST', '/pages', {
        parent: { database_id: dbId() },
        properties: buildProperties(body),
      })
      return res.status(201).json({ reserva: pageToReserva(page) })
    }

    // ── PATCH /api/reservas/:id ─────────────────────────────────────────────
    if (req.method === 'PATCH' && pageId) {
      const body = await readBody(req)
      const updates = {}
      if (body.estado)   updates.Estado    = { select: { name: body.estado } }
      if (body.notas)    updates.Notas     = { rich_text: [{ text: { content: body.notas } }] }
      const page = await notionReq('PATCH', `/pages/${pageId}`, { properties: updates })
      return res.status(200).json({ reserva: pageToReserva(page) })
    }

    // ── DELETE /api/reservas/:id ────────────────────────────────────────────
    if (req.method === 'DELETE' && pageId) {
      await notionReq('PATCH', `/pages/${pageId}`, { archived: true })
      return res.status(200).json({ ok: true })
    }

    res.status(405).json({ error: 'Método no permitido' })
  } catch (err) {
    console.error('[reservas api]', err)
    res.status(500).json({ error: 'Error interno' })
  }
}

function readBody(req) {
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
