import { NavLink } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <span className="footer-logo">La Provista</span>
          <p>Asunción, Paraguay</p>
        </div>

        <nav className="footer-nav">
          <NavLink to="/">Inicio</NavLink>
          <NavLink to="/menu">Menú</NavLink>
          <NavLink to="/nosotros">Nosotros</NavLink>
          <NavLink to="/contacto">Contacto</NavLink>
        </nav>

        <div className="footer-social">
          <a
            href="https://www.instagram.com/laprovi_asuncion"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} La Provista. Todos los derechos reservados.</p>
      </div>
    </footer>
  )
}
