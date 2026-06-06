import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
}

function rowToReserva(row) {
  return {
    id:       row.id,
    nombre:   row.nombre,
    mesa:     row.mesa,
    zona:     row.zona,
    telefono: row.telefono,
    fecha:    row.fecha,
    hora:     row.hora,
    personas: row.personas,
    estado:   row.estado || 'Pendiente',
    notas:    row.notas,
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') { res.status(200).end(); return }

  const url = new URL(req.url, 'http://localhost')
  const segments = url.pathname.replace(/^\/api\/reservas\/?/, '').split('/')
  const reservaId = segments[0] || null

  const supabase = getSupabase()

  try {
    // ── GET /api/reservas?fecha=YYYY-MM-DD ──────────────────────────────────
    if (req.method === 'GET') {
      const fecha = url.searchParams.get('fecha')
      let query = supabase
        .from('reservas')
        .select('*')
        .order('fecha', { ascending: true })
        .order('hora',  { ascending: true })

      if (fecha) query = query.eq('fecha', fecha)

      const { data, error } = await query
      if (error) throw error
      return res.status(200).json({ reservas: data.map(rowToReserva) })
    }

    // ── POST /api/reservas ──────────────────────────────────────────────────
    if (req.method === 'POST') {
      const body = await readBody(req)
      const { data, error } = await supabase
        .from('reservas')
        .insert({
          nombre:   body.nombre,
          mesa:     body.mesa,
          zona:     body.zona     || 'Salón',
          telefono: body.telefono,
          fecha:    body.fecha,
          hora:     body.hora,
          personas: Number(body.personas) || 1,
          estado:   body.estado   || 'Pendiente',
          notas:    body.notas,
        })
        .select()
        .single()

      if (error) throw error
      return res.status(201).json({ reserva: rowToReserva(data) })
    }

    // ── PATCH /api/reservas/:id ─────────────────────────────────────────────
    if (req.method === 'PATCH' && reservaId) {
      const body = await readBody(req)
      const updates = {}
      if (body.estado !== undefined) updates.estado = body.estado
      if (body.notas  !== undefined) updates.notas  = body.notas

      const { data, error } = await supabase
        .from('reservas')
        .update(updates)
        .eq('id', reservaId)
        .select()
        .single()

      if (error) throw error
      return res.status(200).json({ reserva: rowToReserva(data) })
    }

    // ── DELETE /api/reservas/:id ────────────────────────────────────────────
    if (req.method === 'DELETE' && reservaId) {
      const { error } = await supabase
        .from('reservas')
        .delete()
        .eq('id', reservaId)

      if (error) throw error
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
