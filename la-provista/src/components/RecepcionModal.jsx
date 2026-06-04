import { useState, useEffect } from 'react'
import { MESAS, ZONA_LABELS } from '../data/mesas'
import './RecepcionModal.css'

const SLOTS_ALMUERZO = ['12:00', '12:30', '13:00', '13:30', '14:00', '14:30']
const SLOTS_MERIENDA = ['15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00']
const SLOTS_CENA     = ['19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00']
const ALL_SLOTS      = [...SLOTS_ALMUERZO, ...SLOTS_MERIENDA, ...SLOTS_CENA]

function toMins(t) {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

function fromMins(mins) {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

const MESAS_RESERVABLES = MESAS.filter(m => m.reservable !== false)

const INITIAL = { nombre: '', telefono: '', fecha: '', hora: '', personas: '', notas: '', estado: 'Confirmada' }

export default function RecepcionModal({ mesa, fecha, onClose, onCrear }) {
  const [form, setForm] = useState({ ...INITIAL, fecha: fecha || '' })
  const [errors, setErrors] = useState({})
  const [mesaId, setMesaId] = useState(mesa?.id || '')
  const [loading, setLoading] = useState(false)
  const [reservasMesa, setReservasMesa] = useState([])

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // Fetch reservations for this mesa+date to compute slot limits
  useEffect(() => {
    if (!form.fecha || !mesaId) { setReservasMesa([]); return }
    fetch(`/api/reservas?fecha=${form.fecha}`)
      .then(r => r.json())
      .then(data => {
        const deMesa = (data.reservas || []).filter(
          r => r.mesa === mesaId && r.estado !== 'Cancelada'
        )
        setReservasMesa(deMesa)
      })
      .catch(() => setReservasMesa([]))
  }, [form.fecha, mesaId])

  const selectedMesa = MESAS_RESERVABLES.find(m => m.id === mesaId)

  const earliestCenaMins = reservasMesa
    .filter(r => SLOTS_CENA.includes(r.hora))
    .reduce((min, r) => Math.min(min, toMins(r.hora)), Infinity)

  const departureLimitMins = earliestCenaMins < Infinity ? earliestCenaMins - 30 : null

  const availableSlots = ALL_SLOTS.filter(t => {
    if (SLOTS_MERIENDA.includes(t) && departureLimitMins !== null) {
      return toMins(t) < departureLimitMins
    }
    return true
  })

  const departureNotice =
    form.hora && SLOTS_MERIENDA.includes(form.hora) && departureLimitMins !== null
      ? fromMins(departureLimitMins)
      : null

  const almuerzoDisp = availableSlots.filter(t => SLOTS_ALMUERZO.includes(t))
  const meriendaDisp = availableSlots.filter(t => SLOTS_MERIENDA.includes(t))
  const cenaDisp     = availableSlots.filter(t => SLOTS_CENA.includes(t))

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  function validate() {
    const e = {}
    if (!mesaId)                e.mesa    = 'Seleccioná una mesa'
    if (!form.nombre.trim())    e.nombre  = 'Ingresá el nombre'
    if (!form.fecha)            e.fecha   = 'Seleccioná la fecha'
    if (!form.hora)             e.hora    = 'Seleccioná el horario'
    if (!form.personas)         e.personas = 'Indicá la cantidad'

    if (selectedMesa && form.personas) {
      const n = Number(form.personas)
      if (isNaN(n) || n < selectedMesa.min || n > selectedMesa.max) {
        e.personas = `Esta mesa es para ${selectedMesa.min}–${selectedMesa.max} personas`
      }
    }
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setLoading(true)
    try {
      await onCrear({
        nombre:   form.nombre,
        mesa:     mesaId,
        zona:     ZONA_LABELS[selectedMesa?.zona] || selectedMesa?.zona || '',
        telefono: form.telefono,
        fecha:    form.fecha,
        hora:     form.hora,
        personas: Number(form.personas),
        notas:    form.notas,
        estado:   form.estado,
      })
    } finally {
      setLoading(false)
    }
  }

  const today = new Date().toISOString().split('T')[0]
  const guestOptions = selectedMesa
    ? Array.from({ length: selectedMesa.max - selectedMesa.min + 1 }, (_, i) => selectedMesa.min + i)
    : []

  // Group mesas by zone for select
  const mesasByZona = MESAS_RESERVABLES.reduce((acc, m) => {
    const z = ZONA_LABELS[m.zona] || m.zona
    if (!acc[z]) acc[z] = []
    acc[z].push(m)
    return acc
  }, {})

  return (
    <div className="rcm-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="rcm-dialog">
        <button className="rcm-close" onClick={onClose} aria-label="Cerrar">✕</button>

        <div className="rcm-header">
          <h2>Nueva Reserva</h2>
          {mesa && <p className="rcm-sub">{mesa.nombre} · {ZONA_LABELS[mesa.zona]}</p>}
        </div>

        <form className="rcm-form" onSubmit={handleSubmit} noValidate>
          {/* Mesa selector */}
          <div className="rcm-field">
            <label>Mesa</label>
            <select value={mesaId} onChange={e => { setMesaId(e.target.value); setErrors(prev => ({ ...prev, mesa: '', personas: '' })) }}
              className={errors.mesa ? 'rcm-err' : ''}>
              <option value="">Seleccioná una mesa</option>
              {Object.entries(mesasByZona).map(([zona, ms]) => (
                <optgroup key={zona} label={zona}>
                  {ms.map(m => (
                    <option key={m.id} value={m.id}>
                      Mesa {m.id} ({m.min}–{m.max} p)
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            {errors.mesa && <span className="rcm-error">{errors.mesa}</span>}
          </div>

          <div className="rcm-row">
            <div className="rcm-field">
              <label>Nombre y apellido</label>
              <input name="nombre" type="text" placeholder="Ej: María García"
                value={form.nombre} onChange={handleChange}
                className={errors.nombre ? 'rcm-err' : ''} />
              {errors.nombre && <span className="rcm-error">{errors.nombre}</span>}
            </div>
            <div className="rcm-field">
              <label>Teléfono <span className="rcm-optional">(opcional)</span></label>
              <input name="telefono" type="tel" placeholder="Ej: 0981 123 456"
                value={form.telefono} onChange={handleChange} />
            </div>
          </div>

          <div className="rcm-row">
            <div className="rcm-field">
              <label>Fecha</label>
              <input name="fecha" type="date" min={today}
                value={form.fecha} onChange={handleChange}
                className={errors.fecha ? 'rcm-err' : ''} />
              {errors.fecha && <span className="rcm-error">{errors.fecha}</span>}
            </div>
            <div className="rcm-field">
              <label>Horario</label>
              <select name="hora" value={form.hora} onChange={handleChange}
                className={errors.hora ? 'rcm-err' : ''}>
                <option value="">Seleccioná</option>
                {almuerzoDisp.length > 0 && (
                  <optgroup label="Almuerzo">
                    {almuerzoDisp.map(t => <option key={t} value={t}>{t}</option>)}
                  </optgroup>
                )}
                {meriendaDisp.length > 0 && (
                  <optgroup label="Merienda">
                    {meriendaDisp.map(t => <option key={t} value={t}>{t}</option>)}
                  </optgroup>
                )}
                {cenaDisp.length > 0 && (
                  <optgroup label="Cena">
                    {cenaDisp.map(t => <option key={t} value={t}>{t}</option>)}
                  </optgroup>
                )}
              </select>
              {errors.hora && <span className="rcm-error">{errors.hora}</span>}
              {departureNotice && (
                <span className="rcm-notice">
                  ⏱ Límite de salida: <strong>{departureNotice}</strong> (cena reservada)
                </span>
              )}
            </div>
            <div className="rcm-field rcm-field--short">
              <label>Personas</label>
              <select name="personas" value={form.personas} onChange={handleChange}
                className={errors.personas ? 'rcm-err' : ''}>
                <option value="">—</option>
                {guestOptions.length > 0
                  ? guestOptions.map(n => <option key={n} value={n}>{n}</option>)
                  : Array.from({ length: 12 }, (_, i) => i + 1).map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))
                }
              </select>
              {errors.personas && <span className="rcm-error">{errors.personas}</span>}
            </div>
          </div>

          <div className="rcm-row">
            <div className="rcm-field">
              <label>Estado inicial</label>
              <select name="estado" value={form.estado} onChange={handleChange}>
                <option value="Pendiente">Pendiente</option>
                <option value="Confirmada">Confirmada</option>
                <option value="Ocupada">Ocupada</option>
              </select>
            </div>
          </div>

          <div className="rcm-field">
            <label>Notas <span className="rcm-optional">(opcional)</span></label>
            <textarea name="notas" rows={2} placeholder="Alergias, ocasión especial..."
              value={form.notas} onChange={handleChange} />
          </div>

          <div className="rcm-actions">
            <button type="button" className="rcm-btn rcm-btn--cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="rcm-btn rcm-btn--save" disabled={loading}>
              {loading ? 'Guardando…' : 'Guardar reserva'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
