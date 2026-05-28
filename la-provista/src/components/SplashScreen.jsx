import { useState, useEffect } from 'react'
import './SplashScreen.css'

export default function SplashScreen() {
  const [hiding, setHiding] = useState(false)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setHiding(true), 2600)
    const t2 = setTimeout(() => setGone(true), 3300)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  if (gone) return null

  return (
    <div className={`splash ${hiding ? 'splash--out' : ''}`}>
      <div className="splash__content">

        <svg
          className="splash__svg"
          viewBox="0 -8 120 118"
          width="140"
          height="140"
          fill="none"
          stroke="white"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Steam lines */}
          <path className="steam steam--1" d="M 44 24 Q 40 18 44 12 Q 48 6 44 0" strokeWidth="1.5" />
          <path className="steam steam--2" d="M 60 22 Q 56 16 60 10 Q 64 4 60 -2"  strokeWidth="1.5" />
          <path className="steam steam--3" d="M 76 24 Q 80 18 76 12 Q 72 6 76 0"  strokeWidth="1.5" />

          {/* Dome handle */}
          <path
            className="plate-draw plate-draw--handle"
            d="M 56 38 L 56 32 Q 56 26 60 26 Q 64 26 64 32 L 64 38"
            strokeWidth="1.5"
          />

          {/* Dome arc */}
          <path
            className="plate-draw plate-draw--dome"
            d="M 14 90 A 46 54 0 0 1 106 90"
            strokeWidth="1.5"
          />

          {/* Plate base */}
          <ellipse
            className="plate-draw plate-draw--base"
            cx="60" cy="90" rx="46" ry="8"
            strokeWidth="1.5"
          />

          {/* Inner plate rim */}
          <ellipse
            className="plate-draw plate-draw--rim"
            cx="60" cy="90" rx="36" ry="5.5"
            strokeWidth="0.75"
            strokeOpacity="0.4"
          />
        </svg>

        <p className="splash__name">La Provista</p>
        <p className="splash__tagline">Asunción, Paraguay</p>
      </div>
    </div>
  )
}
