import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <NavLink to="/" className="navbar-logo">La Provista</NavLink>

      <button
        className={`navbar-burger ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Menú"
      >
        <span />
        <span />
        <span />
      </button>

      <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
        <li><NavLink to="/" onClick={() => setMenuOpen(false)}>Inicio</NavLink></li>
        <li><NavLink to="/menu" onClick={() => setMenuOpen(false)}>Menú</NavLink></li>
        <li><NavLink to="/nosotros" onClick={() => setMenuOpen(false)}>Nosotros</NavLink></li>
        <li><NavLink to="/contacto" onClick={() => setMenuOpen(false)}>Contacto</NavLink></li>
        <li>
          <NavLink to="/reservas" onClick={() => setMenuOpen(false)} className="navbar-reservar">
            Reservar
          </NavLink>
        </li>
      </ul>
    </nav>
  )
}
