import './Contact.css'

export default function Contact() {
  return (
    <main className="contact-page">
      <div className="contact-header">
        <p className="contact-eyebrow">Encontranos</p>
        <h1>Contacto</h1>
      </div>

      <div className="contact-body">
        <div className="contact-info">
          <div className="contact-block">
            <h4>Dirección</h4>
            <p>Asunción, Paraguay</p>
            <a
              href="https://maps.app.goo.gl/9tS2JBicgXUtNvqJA"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-link"
            >
              Ver en Google Maps →
            </a>
          </div>

          <div className="contact-block">
            <h4>Horarios</h4>
            <p>Lunes a viernes · 12:00 – 15:00 / 20:00 – 23:00</p>
            <p>Sábados · 12:00 – 23:00</p>
            <p>Domingos · 12:00 – 16:00</p>
          </div>

          <div className="contact-block">
            <h4>Instagram</h4>
            <a
              href="https://www.instagram.com/laprovi_asuncion"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-link"
            >
              @laprovi_asuncion
            </a>
          </div>
        </div>

        <div className="contact-map">
          <iframe
            title="Ubicación La Provista"
            src="https://maps.google.com/maps?q=-25.3003424,-57.5820396&z=17&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: '420px' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </main>
  )
}
