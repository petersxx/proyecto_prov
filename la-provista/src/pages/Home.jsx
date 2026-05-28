import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import fachada from '../assets/fachada.png'
import hero1 from '../assets/hero-1.jpg'
import hero2 from '../assets/hero-2.jpg'
import hero3 from '../assets/hero-3.jpg'
import hero4 from '../assets/hero-4.jpg'
import hero5 from '../assets/hero-5.jpg'
import InstagramCarousel from '../components/InstagramCarousel'
import './Home.css'

const heroImages = [hero1, hero2, hero3, hero4, hero5]

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <main className="home">
      {/* Hero */}
      <section className="hero">
        {heroImages.map((img, i) => (
          <div
            key={i}
            className={`hero-slide ${i === currentIndex ? 'hero-slide--active' : ''}`}
            style={{ backgroundImage: `url(${img})` }}
          />
        ))}
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="hero-tagline">Asunción, Paraguay</p>
          <h1>La Provista</h1>
          <p className="hero-sub">Sabores que te hacen volver</p>
          <p className="hero-sub">QUIERO PITO</p>
          <div className="hero-actions">
            <Link to="/menu" className="btn-primary">Ver menú</Link>
            <Link to="/reservas" className="btn-outline-white">Reservas</Link>
          </div>
        </div>
      </section>

      {/* Destacados */}
      <section className="highlights">
        <div className="highlight-item">
          <span className="highlight-icon">✦</span>
          <h3>Ingredientes frescos</h3>
          <p>Seleccionamos los mejores productos cada día para ofrecerte lo mejor en cada plato.</p>
        </div>
        <div className="highlight-divider" />
        <div className="highlight-item">
          <span className="highlight-icon">✦</span>
          <h3>Cocina de autor</h3>
          <p>Una propuesta gastronómica única que fusiona sabores locales con técnicas modernas.</p>
        </div>
        <div className="highlight-divider" />
        <div className="highlight-item">
          <span className="highlight-icon">✦</span>
          <h3>Ambiente único</h3>
          <p>Un espacio pensado para que cada visita sea una experiencia memorable.</p>
        </div>
      </section>

      {/* CTA Menú */}
      <section className="cta-menu">
        <div className="cta-menu-text">
          <h2>Descubrí nuestra carta</h2>
          <p>Explorá nuestros platos, desde entradas hasta postres, con precios claros y detalle de cada preparación.</p>
          <Link to="/menu" className="btn-outline">Ver menú completo</Link>
        </div>
      </section>

<InstagramCarousel />
    </main>
  )
}
