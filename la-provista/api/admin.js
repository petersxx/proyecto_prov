import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
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
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Key')

  if (req.method === 'OPTIONS') { res.status(200).end(); return }

  if (req.headers['x-admin-key'] !== 'provista2024') {
    return res.status(401).json({ error: 'No autorizado' })
  }

  const url = new URL(req.url, 'http://localhost')
  const itemId = url.pathname.replace(/^\/api\/admin\/?/, '').split('/')[0] || null

  const supabase = getSupabase()

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('orden', { ascending: true })
      if (error) throw error
      return res.status(200).json({ items: data })
    }

    if (req.method === 'POST') {
      const body = await readBody(req)
      const { data, error } = await supabase
        .from('menu_items')
        .insert(body)
        .select()
        .single()
      if (error) throw error
      return res.status(201).json({ item: data })
    }

    if (req.method === 'PATCH' && itemId) {
      const body = await readBody(req)
      const { data, error } = await supabase
        .from('menu_items')
        .update(body)
        .eq('id', itemId)
        .select()
        .single()
      if (error) throw error
      return res.status(200).json({ item: data })
    }

    if (req.method === 'DELETE' && itemId) {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', itemId)
      if (error) throw error
      return res.status(200).json({ ok: true })
    }

    res.status(405).json({ error: 'Método no permitido' })
  } catch (err) {
    console.error('[admin api]', err)
    res.status(500).json({ error: 'Error interno' })
  }
}
