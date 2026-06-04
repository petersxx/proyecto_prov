import { useState, useEffect, useCallback } from 'react'
import TableMapAdmin from '../components/TableMapAdmin'
import RecepcionModal from '../components/RecepcionModal'
import './Recepcion.css'

const PASSWORD = 'provista2024'
const TODAY = new Date().toISOString().split('T')[0]

const SLOTS_MERIENDA = ['15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00']
const SLOTS_CENA     = ['19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00']

function toMins(t) {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

function fromMins(mins) {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

const ESTADO_COLORS = {
  Pendiente:   '#f59e0b',
  Confirmada:  '#3b82f6',
  Ocupada:     '#ef4444',
  Cancelada:   '#9ca3af',
}

const ESTADO_LABELS = {
  Pendiente:  'Pendiente',
  Confirmada: 'Confirmada',
  Ocupada:    'Ocupada',
  Cancelada:  'Cancelada',
}

export default function Recepcion() {
  const [authed, setAuthed]         = useState(() => sessionStorage.getItem('recepcion_auth') === '1')
  const [pwInput, setPwInput]       = useState('')
  const [pwError, setPwError]       = useState(false)

  const [reservas, setReservas]     = useState([])
  const [loading, setLoading]       = useState(false)
  const [fecha, setFecha]           = useState(TODAY)

  const [modal, setModal]           = useState(null) // { type: 'nueva'|'detalle', mesa?, reserva? }

  const fetchReservas = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/reservas?fecha=${fecha}`)
      const data = await res.json()
      setReservas(data.reservas || [])
    } catch {
      setReservas([])
    } finally {
      setLoading(false)
    }
  }, [fecha])

  useEffect(() => {
    if (authed) fetchReservas()
  }, [authed, fetchReservas])

  function handleLogin(e) {
    e.preventDefault()
    if (pwInput === PASSWORD) {
      sessionStorage.setItem('recepcion_auth', '1')
      setAuthed(true)
    } else {
      setPwError(true)
      setPwInput('')
    }
  }

  // Map mesa id → estado activo (Ocupada > Confirmada > Pendiente)
  const mesaEstados = {}
  for (const r of reservas) {
    if (!r.mesa || r.estado === 'Cancelada') continue
    const prev = mesaEstados[r.mesa]
    const priority = { Ocupada: 3, Confirmada: 2, Pendiente: 1 }
    if (!prev || priority[r.estado] > priority[prev]) {
      mesaEstados[r.mesa] = r.estado
    }
  }

  async function handleEstado(id, estado) {
    await fetch(`/api/reservas/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado }),
    })
    fetchReservas()
  }

  async function handleEliminar(id) {
    if (!confirm('¿Eliminar esta reserva?')) return
    await fetch(`/api/reservas/${id}`, { method: 'DELETE' })
    fetchReservas()
  }

  async function handleCrear(datos) {
    await fetch('/api/reservas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    })
    setModal(null)
    fetchReservas()
  }

  if (!authed) {
    return (
      <div className="rec-login">
        <form className="rec-login__box" onSubmit={handleLogin}>
          <h1>Recepción</h1>
          <p>Ingresá la contraseña para acceder</p>
          <input
            type="password"
            placeholder="Contraseña"
            value={pwInput}
            onChange={e => { setPwInput(e.target.value); setPwError(false) }}
            className={pwError ? 'err' : ''}
            autoFocus
          />
          {pwError && <span className="rec-login__err">Contraseña incorrecta</span>}
          <button type="submit">Ingresar</button>
        </form>
      </div>
    )
  }

  const reservasActivas = reservas

  return (
    <div className="rec-page">
      <header className="rec-header">
        <div className="rec-header__left">
          <h1>Panel de Recepción</h1>
          <input
            type="date"
            value={fecha}
            onChange={e => setFecha(e.target.value)}
            className="rec-date"
          />
        </div>
        <div className="rec-header__right">
          <button className="rec-btn rec-btn--refresh" onClick={fetchReservas} disabled={loading}>
            {loading ? 'Actualizando…' : '↻ Actualizar'}
          </button>
          <button
            className="rec-btn rec-btn--new"
            onClick={() => setModal({ type: 'nueva' })}
          >
            + Nueva reserva
          </button>
        </div>
      </header>

      <div className="rec-body">
        {/* Mapa */}
        <section className="rec-map-section">
          <div className="rec-map-legend">
            <span className="rec-legend-item rec-legend--libre">Libre</span>
            <span className="rec-legend-item rec-legend--pendiente">Pendiente</span>
            <span className="rec-legend-item rec-legend--confirmada">Confirmada</span>
            <span className="rec-legend-item rec-legend--ocupada">Ocupada</span>
          </div>
          <TableMapAdmin
            mesaEstados={mesaEstados}
            onTableClick={(mesa) => setModal({ type: 'nueva', mesa })}
          />
        </section>

        {/* Lista de reservas */}
        <section className="rec-list-section">
          <h2>
            Reservas del día
            {reservasActivas.length > 0 && (
              <span className="rec-count">{reservasActivas.length}</span>
            )}
          </h2>

          {loading ? (
            <p className="rec-empty">Cargando…</p>
          ) : reservasActivas.length === 0 ? (
            <p className="rec-empty">No hay reservas para este día.</p>
          ) : (
            <ul className="rec-list">
              {reservasActivas.map(r => (
                <li key={r.id} className={`rec-item rec-item--${r.estado.toLowerCase()}`}>
                  <div className="rec-item__top">
                    <span className="rec-item__mesa">Mesa {r.mesa}</span>
                    <span
                      className="rec-item__estado"
                      style={{ background: ESTADO_COLORS[r.estado] }}
                    >
                      {ESTADO_LABELS[r.estado]}
                    </span>
                  </div>
                  <div className="rec-item__info">
                    <strong>{r.nombre}</strong>
                    <span>{r.hora} · {r.personas} pers.</span>
                    <span>{r.telefono}</span>
                  </div>
                  {r.notas && <p className="rec-item__notas">{r.notas}</p>}
                  {SLOTS_MERIENDA.includes(r.hora) && (() => {
                    const cenas = reservas.filter(x =>
                      x.mesa === r.mesa &&
                      x.estado !== 'Cancelada' &&
                      SLOTS_CENA.includes(x.hora)
                    )
                    const minCena = cenas.reduce((min, x) => Math.min(min, toMins(x.hora)), Infinity)
                    if (minCena === Infinity) return null
                    return (
                      <p className="rec-item__limite">
                        ⏱ Límite de salida: <strong>{fromMins(minCena - 30)}</strong>
                      </p>
                    )
                  })()}
                  <div className="rec-item__actions">
                    {r.estado === 'Pendiente' && (
                      <>
                        <button onClick={() => handleEstado(r.id, 'Confirmada')} className="rec-action rec-action--confirm">
                          Aceptar
                        </button>
                        <button onClick={() => handleEstado(r.id, 'Cancelada')} className="rec-action rec-action--rechazar">
                          Rechazar
                        </button>
                      </>
                    )}
                    {(r.estado === 'Pendiente' || r.estado === 'Confirmada') && (
                      <button onClick={() => handleEstado(r.id, 'Ocupada')} className="rec-action rec-action--ocupar">
                        Marcar ocupada
                      </button>
                    )}
                    {r.estado === 'Ocupada' && (
                      <button onClick={() => handleEstado(r.id, 'Confirmada')} className="rec-action rec-action--liberar">
                        Liberar mesa
                      </button>
                    )}
                    <button onClick={() => handleEliminar(r.id)} className="rec-action rec-action--del">
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {modal && (
        <RecepcionModal
          type={modal.type}
          mesa={modal.mesa}
          fecha={fecha}
          onClose={() => setModal(null)}
          onCrear={handleCrear}
        />
      )}
    </div>
  )
}
