import http from 'k6/http'
import { check, sleep } from 'k6'
import { Trend, Rate } from 'k6/metrics'

const BASE_URL = 'https://la-provista.vercel.app'

const menuDuration     = new Trend('menu_duration',     true)
const reservasDuration = new Trend('reservas_duration', true)
const errorRate        = new Rate('error_rate')

// Spike test: calma -> pico brutal (50 VUs) -> calma
export const options = {
  stages: [
    { duration: '10s', target: 5  },
    { duration: '5s',  target: 50 },
    { duration: '20s', target: 50 },
    { duration: '5s',  target: 0  },
  ],
  thresholds: {
    http_req_failed:   ['rate<0.05'],
    menu_duration:     ['p(95)<3000'],
    reservas_duration: ['p(95)<2000'],
    error_rate:        ['rate<0.05'],
  },
}

const TODAY = new Date().toISOString().split('T')[0]

export default function () {
  // GET /api/menu
  {
    const res = http.get(`${BASE_URL}/api/menu`)
    const ok = check(res, {
      'menu status 200':       r => r.status === 200,
      'menu tiene categories': r => {
        try { return JSON.parse(r.body).categories?.length > 0 } catch { return false }
      },
    })
    menuDuration.add(res.timings.duration)
    errorRate.add(!ok)
  }

  sleep(0.3)

  // GET /api/reservas?fecha=hoy
  {
    const res = http.get(`${BASE_URL}/api/reservas?fecha=${TODAY}`)
    const ok = check(res, {
      'reservas status 200': r => r.status === 200,
      'reservas es array':   r => {
        try { return Array.isArray(JSON.parse(r.body).reservas) } catch { return false }
      },
    })
    reservasDuration.add(res.timings.duration)
    errorRate.add(!ok)
  }

  sleep(0.5)
}

export function handleSummary(data) {
  const m = data.metrics
  const fmt = v => (v === undefined || v === null) ? 'N/A' : Math.round(v) + 'ms'
  const pct = v => ((v || 0) * 100).toFixed(1) + '%'

  console.log('\n=== SPIKE TEST — RESUMEN ===')
  console.log('Requests totales : ' + (m.http_reqs?.values?.count ?? 'N/A'))
  console.log('Tasa de errores  : ' + pct(m.http_req_failed?.values?.rate))
  console.log('---')
  console.log('/api/menu    p95 : ' + fmt(m.menu_duration?.values?.['p(95)']))
  console.log('GET reservas p95 : ' + fmt(m.reservas_duration?.values?.['p(95)']))
  console.log('============================\n')

  return {}
}
