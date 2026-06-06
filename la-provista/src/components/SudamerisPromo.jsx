import { useState, useEffect } from 'react'
import sudamerisLogo from '../assets/sudameris.jpg'
import './SudamerisPromo.css'

const SLIDES = [
  {
    pct: '20%',
    card: 'Tarjetas Sudameris',
    cardSub: 'Crédito normal',
    days: ['Viernes', 'Sábados', 'Domingos'],
    dark: false,
  },
  {
    pct: '25%',
    card: 'Tarjeta Sudameris Black',
    cardSub: 'Máximo beneficio',
    days: ['Viernes', 'Sábados', 'Domingos'],
    dark: true,
  },
]

export default function SudamerisPromo() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setActive(a => (a + 1) % SLIDES.length), 4000)
    return () => clearInterval(t)
  }, [])

  const slide = SLIDES[active]

  return (
    <div className={`suda ${slide.dark ? 'suda--dark' : ''}`}>
      <div className="suda__inner">

        {/* Logo */}
        <div className="suda__logo-wrap">
          <span className="suda__convenio">En convenio con</span>
          <img src={sudamerisLogo} alt="Banco Sudameris" className="suda__logo" />
        </div>

        <div className="suda__divider" />

        {/* Slide content */}
        <div className="suda__content" key={active}>
          <div className="suda__days">
            {slide.days.map(d => <span key={d} className="suda__day">{d}</span>)}
          </div>

          <div className="suda__offer">
            <span className="suda__pct">{slide.pct}</span>
            <div className="suda__card-info">
              <span className="suda__card-name">{slide.card}</span>
              <span className="suda__card-sub">{slide.cardSub}</span>
            </div>
          </div>

          <p className="suda__fine">Descuento directo en cuenta · Solo fines de semana</p>
        </div>

        {/* Dots */}
        <div className="suda__dots">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              className={`suda__dot ${i === active ? 'active' : ''}`}
              onClick={() => setActive(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

      </div>
    </div>
  )
}
