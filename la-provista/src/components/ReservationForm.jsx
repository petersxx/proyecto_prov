import { useState } from 'react'
import './ReservationForm.css'

const TIME_SLOTS = [
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00',
]

const INITIAL = { name: '', phone: '', date: '', time: '', guests: '2', notes: '' }

export default function ReservationForm() {
  const [form, setForm] = useState(INITIAL)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState(false)
  const [errors, setErrors] = useState({})

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Ingresá tu nombre'
    if (!form.phone.trim()) e.phone = 'Ingresá tu teléfono'
    if (!form.date) e.date = 'Seleccioná una fecha'
    if (!form.time) e.time = 'Seleccioná un horario'
    return e
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length > 0) { setErrors(e2); return }
    setLoading(true)
    setApiError(false)
    try {
      const res = await fetch('/api/reservas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre:   form.name,
          telefono: form.phone,
          fecha:    form.date,
          hora:     form.time,
          personas: Number(form.guests) || 1,
          notas:    form.notes,
        }),
      })
      if (!res.ok) throw new Error()
      setSubmitted(true)
    } catch {
      setApiError(true)
    } finally {
      setLoading(false)
    }
  }

  function handleReset() {
    setForm(INITIAL)
    setErrors({})
    setSubmitted(false)
  }

  const today = new Date().toISOString().split('T')[0]

  if (submitted) {
    return (
      <div className="reservation-success">
        <span className="reservation-success__icon">✦</span>
        <h3>¡Reserva recibida!</h3>
        <p>
          Gracias, <strong>{form.name}</strong>. Te contactaremos al{' '}
          <strong>{form.phone}</strong> para confirmar tu mesa para{' '}
          <strong>{form.guests} persona{form.guests !== '1' ? 's' : ''}</strong> el{' '}
          <strong>{form.date}</strong> a las <strong>{form.time}</strong>.
        </p>
        <button className="reservation-success__btn" onClick={handleReset}>
          Hacer otra reserva
        </button>
      </div>
    )
  }

  return (
    <form className="reservation-form" onSubmit={handleSubmit} noValidate>
      <div className="rf-row">
        <div className="rf-field">
          <label htmlFor="res-name">Nombre y apellido</label>
          <input
            id="res-name"
            name="name"
            type="text"
            placeholder="Ej: María García"
            value={form.name}
            onChange={handleChange}
            className={errors.name ? 'rf-input--error' : ''}
          />
          {errors.name && <span className="rf-error">{errors.name}</span>}
        </div>
        <div className="rf-field">
          <label htmlFor="res-phone">Teléfono</label>
          <input
            id="res-phone"
            name="phone"
            type="tel"
            placeholder="Ej: 0981 123 456"
            value={form.phone}
            onChange={handleChange}
            className={errors.phone ? 'rf-input--error' : ''}
          />
          {errors.phone && <span className="rf-error">{errors.phone}</span>}
        </div>
      </div>

      <div className="rf-row">
        <div className="rf-field">
          <label htmlFor="res-date">Fecha</label>
          <input
            id="res-date"
            name="date"
            type="date"
            min={today}
            value={form.date}
            onChange={handleChange}
            className={errors.date ? 'rf-input--error' : ''}
          />
          {errors.date && <span className="rf-error">{errors.date}</span>}
        </div>
        <div className="rf-field">
          <label htmlFor="res-time">Horario</label>
          <select
            id="res-time"
            name="time"
            value={form.time}
            onChange={handleChange}
            className={errors.time ? 'rf-input--error' : ''}
          >
            <option value="">Seleccioná un horario</option>
            <optgroup label="Almuerzo">
              {TIME_SLOTS.slice(0, 6).map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </optgroup>
            <optgroup label="Cena">
              {TIME_SLOTS.slice(6).map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </optgroup>
          </select>
          {errors.time && <span className="rf-error">{errors.time}</span>}
        </div>
        <div className="rf-field rf-field--short">
          <label htmlFor="res-guests">Personas</label>
          <select id="res-guests" name="guests" value={form.guests} onChange={handleChange}>
            {['1','2','3','4','5','6','7','8'].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
            <option value="9+">9+</option>
          </select>
        </div>
      </div>

      <div className="rf-field">
        <label htmlFor="res-notes">Comentarios <span className="rf-optional">(opcional)</span></label>
        <textarea
          id="res-notes"
          name="notes"
          rows={3}
          placeholder="Alergias, ocasión especial, preferencia de mesa..."
          value={form.notes}
          onChange={handleChange}
        />
      </div>

      {apiError && (
        <p className="rf-error rf-error--api">
          Hubo un error al enviar la reserva. Intentá de nuevo o llamanos directamente.
        </p>
      )}
      <button type="submit" className="rf-submit" disabled={loading}>
        {loading ? 'Enviando…' : 'Solicitar reserva'}
      </button>
    </form>
  )
}
