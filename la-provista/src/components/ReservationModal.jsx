import { useState, useEffect, useRef } from 'react'
import { ZONA_LABELS } from '../data/mesas'
import './ReservationModal.css'

const TIME_SLOTS = [
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00',
]

const WHATSAPP_NUMBER = '595991230966'

function buildWhatsAppUrl(mesa, form) {
  const zona = ZONA_LABELS[mesa.zona] || mesa.zona
  const msg =
    `🍽️ *Nueva Reserva - La Provista*\n` +
    `━━━━━━━━━━━━━━━━\n` +
    `📍 *Mesa:* ${mesa.nombre} (${zona})\n` +
    `👤 *Nombre:* ${form.name}\n` +
    `📞 *Teléfono:* ${form.phone}\n` +
    `👥 *Personas:* ${form.guests}\n` +
    `📅 *Fecha:* ${form.date}\n` +
    `🕐 *Hora:* ${form.time}` +
    (form.notes ? `\n📝 *Comentarios:* ${form.notes}` : '') +
    `\n━━━━━━━━━━━━━━━━`

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`
}

const INITIAL = { name: '', phone: '', date: '', time: '', guests: '', notes: '' }

export default function ReservationModal({ mesa, onClose }) {
  const [form, setForm] = useState(INITIAL)
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)
  const dialogRef = useRef(null)

  // Close on Escape
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // Reset form when mesa changes
  useEffect(() => {
    setForm(INITIAL)
    setErrors({})
    setSent(false)
  }, [mesa?.id])

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  function validate() {
    const e = {}
    if (!form.name.trim())  e.name  = 'Ingresá tu nombre'
    if (!form.phone.trim()) e.phone = 'Ingresá tu teléfono'
    if (!form.date)         e.date  = 'Seleccioná una fecha'
    if (!form.time)         e.time  = 'Seleccioná un horario'
    if (!form.guests)       e.guests = 'Indicá la cantidad de personas'

    const n = Number(form.guests)
    if (form.guests && (isNaN(n) || n < mesa.min || n > mesa.max)) {
      e.guests = `Esta mesa es para ${mesa.min}–${mesa.max} personas`
    }

    return e
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    window.open(buildWhatsAppUrl(mesa, form), '_blank', 'noopener,noreferrer')
    setSent(true)
  }

  const today = new Date().toISOString().split('T')[0]
  const guestOptions = Array.from(
    { length: mesa.max - mesa.min + 1 },
    (_, i) => mesa.min + i
  )

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
            <h3>¡Listo!</h3>
            <p>
              Se abrió WhatsApp con tu solicitud de reserva. Solo presioná{' '}
              <strong>Enviar</strong> para confirmarla.
            </p>
            <div className="rm-success__actions">
              <button className="rm-btn rm-btn--outline" onClick={onClose}>
                Volver al mapa
              </button>
              <button
                className="rm-btn rm-btn--ghost"
                onClick={() => {
                  window.open(buildWhatsAppUrl(mesa, form), '_blank', 'noopener,noreferrer')
                }}
              >
                Reabrir WhatsApp
              </button>
            </div>
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

            <button type="submit" className="rm-btn rm-btn--whatsapp">
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Enviar por WhatsApp
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
