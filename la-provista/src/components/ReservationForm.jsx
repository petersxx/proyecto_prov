import { useState } from 'react'
import './ReservationForm.css'

const WA_NUMBER = '595991230966'

const TIME_SLOTS = [
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00',
]

const INITIAL = { name: '', phone: '', date: '', time: '', guests: '2', notes: '' }

function formatDate(dateStr) {
  if (!dateStr) return ''
  const [y, m, d] = dateStr.split('-')
  return `${d}/${m}/${y}`
}

function buildWhatsAppUrl(form) {
  const lines = [
    '🍽️ *Solicitud de reserva — La Provista*',
    '',
    `👤 *Nombre:* ${form.name}`,
    `📞 *Teléfono:* ${form.phone}`,
    `📅 *Fecha:* ${formatDate(form.date)}`,
    `🕐 *Horario:* ${form.time}`,
    `👥 *Personas:* ${form.guests}`,
  ]
  if (form.notes.trim()) lines.push(`📝 *Comentarios:* ${form.notes.trim()}`)
  const text = encodeURIComponent(lines.join('\n'))
  return `https://wa.me/${WA_NUMBER}?text=${text}`
}

export default function ReservationForm() {
  const [form, setForm] = useState(INITIAL)
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

  function handleSubmit(e) {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length > 0) { setErrors(e2); return }
    window.open(buildWhatsAppUrl(form), '_blank')
  }

  const today = new Date().toISOString().split('T')[0]

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

      <button type="submit" className="rf-submit">
        Reservar por WhatsApp
      </button>
    </form>
  )
}
