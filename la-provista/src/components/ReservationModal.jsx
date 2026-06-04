import { useState, useEffect, useRef } from 'react'
import { ZONA_LABELS } from '../data/mesas'
import './ReservationModal.css'

const SLOTS_ALMUERZO  = ['12:00', '12:30', '13:00', '13:30', '14:00', '14:30']
const SLOTS_MERIENDA  = ['15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00']
const SLOTS_CENA      = ['19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00']
const ALL_SLOTS       = [...SLOTS_ALMUERZO, ...SLOTS_MERIENDA, ...SLOTS_CENA]

function toMins(t) {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

function fromMins(mins) {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

const INITIAL = { name: '', phone: '', date: '', time: '', guests: '', notes: '' }

export default function ReservationModal({ mesa, onClose }) {
  const [form, setForm]             = useState(INITIAL)
  const [errors, setErrors]         = useState({})
  const [sent, setSent]             = useState(false)
  const [loading, setLoading]       = useState(false)
  const [submitError, setSubmitError] = useState(false)
  const [reservasMesa, setReservasMesa] = useState([])
  const dialogRef = useRef(null)

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    setForm(INITIAL)
    setErrors({})
    setSent(false)
    setSubmitError(false)
    setReservasMesa([])
  }, [mesa?.id])

  // Fetch reservations for this mesa+date when date changes
  useEffect(() => {
    if (!form.date || !mesa?.id) { setReservasMesa([]); return }
    fetch(`/api/reservas?fecha=${form.date}`)
      .then(r => r.json())
      .then(data => {
        const deMesa = (data.reservas || []).filter(
          r => r.mesa === mesa.id && r.estado !== 'Cancelada'
        )
        setReservasMesa(deMesa)
      })
      .catch(() => setReservasMesa([]))
  }, [form.date, mesa?.id])

  // Earliest dinner reservation for this mesa on the selected date
  const earliestCenaMins = reservasMesa
    .filter(r => SLOTS_CENA.includes(r.hora))
    .reduce((min, r) => Math.min(min, toMins(r.hora)), Infinity)

  // Merienda slots are cut off 30 min before dinner
  const departureLimitMins = earliestCenaMins < Infinity ? earliestCenaMins - 30 : null

  // Available slots: filter merienda slots that start at or after the limit
  const availableSlots = ALL_SLOTS.filter(t => {
    if (SLOTS_MERIENDA.includes(t) && departureLimitMins !== null) {
      return toMins(t) < departureLimitMins
    }
    return true
  })

  // Departure notice shown when selected slot is merienda and there's a limit
  const departureNotice =
    form.time &&
    SLOTS_MERIENDA.includes(form.time) &&
    departureLimitMins !== null
      ? fromMins(departureLimitMins)
      : null

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  function validate() {
    const e = {}
    if (!form.name.trim())  e.name   = 'Ingresá tu nombre'
    if (!form.phone.trim()) e.phone  = 'Ingresá tu teléfono'
    if (!form.date)         e.date   = 'Seleccioná una fecha'
    if (!form.time)         e.time   = 'Seleccioná un horario'
    if (!form.guests)       e.guests = 'Indicá la cantidad de personas'

    const n = Number(form.guests)
    if (form.guests && (isNaN(n) || n < mesa.min || n > mesa.max)) {
      e.guests = `Esta mesa es para ${mesa.min}–${mesa.max} personas`
    }

    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setLoading(true)
    setSubmitError(false)
    try {
      const notasConLimite = departureNotice
        ? `${form.notes ? form.notes + ' — ' : ''}Límite de salida: ${departureNotice}`
        : form.notes

      const res = await fetch('/api/reservas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre:   form.name,
          telefono: form.phone,
          mesa:     mesa.id,
          zona:     ZONA_LABELS[mesa.zona] || mesa.zona,
          fecha:    form.date,
          hora:     form.time,
          personas: Number(form.guests),
          notas:    notasConLimite,
          estado:   'Pendiente',
        }),
      })
      if (!res.ok) throw new Error()
      setSent(true)
    } catch {
      setSubmitError(true)
    } finally {
      setLoading(false)
    }
  }

  const today = new Date().toISOString().split('T')[0]
  const guestOptions = Array.from(
    { length: mesa.max - mesa.min + 1 },
    (_, i) => mesa.min + i
  )

  const almuerzoDisp = availableSlots.filter(t => SLOTS_ALMUERZO.includes(t))
  const meriendaDisp = availableSlots.filter(t => SLOTS_MERIENDA.includes(t))
  const cenaDisp     = availableSlots.filter(t => SLOTS_CENA.includes(t))

  return (
    <div
      className="rm-overlay"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="rm-title"
    >
      <div className="rm-dialog" ref={dialogRef}>
        <button className="rm-close" onClick={onClose} aria-label="Cerrar">✕</button>

        <div className="rm-header">
          <p className="rm-eyebrow">{ZONA_LABELS[mesa.zona]}</p>
          <h2 id="rm-title">{mesa.nombre}</h2>
          <p className="rm-capacity">
            {mesa.min === mesa.max
              ? `${mesa.min} personas`
              : `${mesa.min}–${mesa.max} personas`}
          </p>
        </div>

        {sent ? (
          <div className="rm-success">
            <span className="rm-success__icon">✦</span>
            <h3>¡Solicitud enviada!</h3>
            <p>
              Tu pedido de reserva fue recibido. El equipo de{' '}
              <strong>La Provista</strong> lo revisará y te contactará para confirmar.
            </p>
            <button className="rm-btn rm-btn--outline" onClick={onClose}>
              Volver al mapa
            </button>
          </div>
        ) : (
          <form className="rm-form" onSubmit={handleSubmit} noValidate>
            <div className="rm-row">
              <div className="rm-field">
                <label htmlFor="rm-name">Nombre y apellido</label>
                <input
                  id="rm-name"
                  name="name"
                  type="text"
                  placeholder="Ej: María García"
                  value={form.name}
                  onChange={handleChange}
                  className={errors.name ? 'rm-input--err' : ''}
                />
                {errors.name && <span className="rm-error">{errors.name}</span>}
              </div>
              <div className="rm-field">
                <label htmlFor="rm-phone">Teléfono</label>
                <input
                  id="rm-phone"
                  name="phone"
                  type="tel"
                  placeholder="Ej: 0981 123 456"
                  value={form.phone}
                  onChange={handleChange}
                  className={errors.phone ? 'rm-input--err' : ''}
                />
                {errors.phone && <span className="rm-error">{errors.phone}</span>}
              </div>
            </div>

            <div className="rm-row">
              <div className="rm-field">
                <label htmlFor="rm-date">Fecha</label>
                <input
                  id="rm-date"
                  name="date"
                  type="date"
                  min={today}
                  value={form.date}
                  onChange={handleChange}
                  className={errors.date ? 'rm-input--err' : ''}
                />
                {errors.date && <span className="rm-error">{errors.date}</span>}
              </div>
              <div className="rm-field">
                <label htmlFor="rm-time">Horario</label>
                <select
                  id="rm-time"
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  className={errors.time ? 'rm-input--err' : ''}
                >
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
                {errors.time && <span className="rm-error">{errors.time}</span>}
              </div>
              <div className="rm-field rm-field--short">
                <label htmlFor="rm-guests">Personas</label>
                <select
                  id="rm-guests"
                  name="guests"
                  value={form.guests}
                  onChange={handleChange}
                  className={errors.guests ? 'rm-input--err' : ''}
                >
                  <option value="">—</option>
                  {guestOptions.map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
                {errors.guests && <span className="rm-error">{errors.guests}</span>}
              </div>
            </div>

            {departureNotice && (
              <div className="rm-notice">
                <span className="rm-notice__icon">⏱</span>
                Esta mesa debe quedar libre a las <strong>{departureNotice}</strong> por una reserva de cena posterior.
              </div>
            )}

            <div className="rm-field">
              <label htmlFor="rm-notes">
                Comentarios <span className="rm-optional">(opcional)</span>
              </label>
              <textarea
                id="rm-notes"
                name="notes"
                rows={2}
                placeholder="Alergias, ocasión especial..."
                value={form.notes}
                onChange={handleChange}
              />
            </div>

            {submitError && (
              <p className="rm-submit-error">
                Hubo un error al enviar. Intentá de nuevo.
              </p>
            )}

            <button type="submit" className="rm-btn rm-btn--primary" disabled={loading}>
              {loading ? 'Enviando…' : 'Solicitar reserva'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
