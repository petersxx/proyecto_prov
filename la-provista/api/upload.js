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

const BUCKET = 'menu-fotos'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Key')

  if (req.method === 'OPTIONS') { res.status(200).end(); return }

  if (req.headers['x-admin-key'] !== 'provista2024') {
    return res.status(401).json({ error: 'No autorizado' })
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' })
  }

  try {
    const body = await readBody(req)
    const { filename, data: base64, contentType } = body

    if (!filename || !base64 || !contentType) {
      return res.status(400).json({ error: 'Faltan datos: filename, data, contentType' })
    }

    const buffer = Buffer.from(base64, 'base64')
    const supabase = getSupabase()

    // Crear bucket si no existe
    const { data: buckets } = await supabase.storage.listBuckets()
    const exists = buckets?.some(b => b.name === BUCKET)
    if (!exists) {
      await supabase.storage.createBucket(BUCKET, { public: true })
    }

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(filename, buffer, { contentType, upsert: true })

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(filename)

    return res.status(200).json({ url: publicUrl })
  } catch (err) {
    console.error('[upload api]', err)
    res.status(500).json({ error: 'Error al subir la imagen' })
  }
}
