import fachada from '../assets/fachada.png'
import platos from '../assets/platos.png'
import bebidas from '../assets/bebidas.png'
import silla from '../assets/silla.png'
import terrazaNoche from '../assets/terraza-noche.png'
import terrazaDia from '../assets/terraza-dia.png'
import igMesa from '../assets/ig-mesa.png'
import igMenuOffice from '../assets/ig-menu-office.png'
import igEnsalada from '../assets/ig-ensalada.png'
import './InstagramCarousel.css'

const PHOTOS = [
  { src: fachada,       alt: 'La Provista – entrada' },
  { src: igMesa,        alt: 'La Provista – mesa' },
  { src: platos,        alt: 'La Provista – platos' },
  { src: igMenuOffice,  alt: 'La Provista – menú office' },
  { src: bebidas,       alt: 'La Provista – bebidas' },
  { src: igEnsalada,    alt: 'La Provista – ensalada' },
  { src: silla,         alt: 'La Provista – ambiente' },
  { src: terrazaNoche,  alt: 'La Provista – terraza de noche' },
  { src: terrazaDia,    alt: 'La Provista – terraza de día' },
]

export default function InstagramCarousel() {
  const track = [...PHOTOS, ...PHOTOS]

  return (
    <section className="ig-carousel">
      <div className="ig-carousel__header">
        <p className="ig-carousel__eyebrow">Seguinos en Instagram</p>
        <a
          href="https://www.instagram.com/laprovi_asuncion"
          target="_blank"
          rel="noopener noreferrer"
          className="ig-carousel__handle"
        >
          @laprovi_asuncion
        </a>
      </div>

      <div className="ig-carousel__mask">
        <div className="ig-carousel__track">
          {track.map((photo, i) => (
            <a
              key={i}
              href="https://www.instagram.com/laprovi_asuncion"
              target="_blank"
              rel="noopener noreferrer"
              className="ig-carousel__item"
              aria-label={photo.alt}
            >
              <img src={photo.src} alt={photo.alt} />
              <div className="ig-carousel__overlay">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="0.5" fill="white" stroke="none"/>
                </svg>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
