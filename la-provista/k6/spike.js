import http from 'k6/http'
import { check, sleep } from 'k6'
import { Trend, Rate } from 'k6/metrics'

const BASE_URL = 'https://la-provista.vercel.app'

const menuDuration     = new Trend('menu_duration',     true)
const reservasDuration = new Trend('reservas_duration', true)
const postDuration     = new Trend('post_duration',     true)
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
    post_duration:     ['p(95)<2000'],
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

  // GET /api/reservas?fecha=hoy (requiere Supabase activo)
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

  sleep(0.3)

  // POST /api/reservas — reserva de prueba ya cancelada (requiere Supabase activo)
  {
    const payload = JSON.stringify({
      nombre:   'K6_TEST_' + __VU + '_' + __ITER,
      mesa:     String(((__VU + __ITER) % 20) + 1),
      zona:     'Salon',
      telefono: '0981000000',
      fecha:    TODAY,
      hora:     '20:00',
      personas: 2,
      estado:   'Cancelada',
      notas:    'k6 spike test - borrar',
    })
    const res = http.post(`${BASE_URL}/api/reservas`, payload, {
      headers: { 'Content-Type': 'application/json' },
    })
    const ok = check(res, {
      'post reserva 201': r => r.status === 201,
    })
    postDuration.add(res.timings.duration)
    errorRate.add(!ok)
  }

  sleep(0.5)
}

export function handleSummary(data) {
  const m = data.metrics
  const fmt = v => (v === undefined || v === null) ? 'N/A' : Math.round(v) + 'ms'
  const pct = v => ((v || 0) * 100).toFixed(1) + '%'

  const menuP95     = fmt(m.menu_duration?.values?.['p(95)'])
  const reservasP95 = fmt(m.reservas_duration?.values?.['p(95)'])
  const postP95     = fmt(m.post_duration?.values?.['p(95)'])
  const errRate     = pct(m.http_req_failed?.values?.rate)
  const total       = m.http_reqs?.values?.count ?? 'N/A'

  console.log('\n=== SPIKE TEST — RESUMEN ===')
  console.log('Requests totales : ' + total)
  console.log('Tasa de errores  : ' + errRate)
  console.log('---')
  console.log('/api/menu    p95 : ' + menuP95)
  console.log('GET reservas p95 : ' + reservasP95)
  console.log('POST reservas p95: ' + postP95)
  console.log('============================\n')

  return {}
}
