import { createServer } from 'http'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import handler from './api/menu.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Cargar .env.local
const envFile = resolve(__dirname, '.env.local')
try {
  const lines = readFileSync(envFile, 'utf8').split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const [key, ...rest] = trimmed.split('=')
    process.env[key] = rest.join('=').replace(/^"|"$/g, '')
  }
} catch {}

function wrapRes(res) {
  res.status = (code) => { res.statusCode = code; return res }
  res.json = (data) => {
    if (!res.getHeader('Content-Type')) res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(data))
    return res
  }
  return res
}

const PORT = 3001

createServer(async (req, res) => {
  wrapRes(res)
  if (req.url === '/api/menu') {
    await handler(req, res)
  } else {
    res.statusCode = 404
    res.end('Not found')
  }
}).listen(PORT, () => {
  console.log(`API server corriendo en http://localhost:${PORT}`)
})
