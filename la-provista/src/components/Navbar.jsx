import { useState, useEffect } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function handleMenuClick(e) {
    e.preventDefault()
    setMenuOpen(false)
    if (location.pathname === '/') {
      document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/')
      setTimeout(() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' }), 150)
    }
  }

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
        <li><a href="/#menu" onClick={handleMenuClick}>Menú</a></li>
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
