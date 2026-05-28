import terrazaNoche from '../assets/terraza-noche.png'
import terrazaDia from '../assets/terraza-dia.png'
import './About.css'

export default function About() {
  return (
    <main className="about-page">
      <div className="about-header">
        <p className="about-eyebrow">Nuestra historia</p>
        <h1>La Provista</h1>
      </div>

      <div className="about-content">
        <div className="about-text">
          <h2>¿Quiénes somos?</h2>
          <p>
            La Provista nació del amor por la buena comida y el deseo de crear un espacio donde cada visita se convierta en un recuerdo.
            Desde nuestra apertura en Asunción, nos dedicamos a ofrecer una propuesta gastronómica honesta, sabrosa y cercana.
          </p>
          <p>
            Trabajamos con productores locales para garantizar ingredientes frescos en cada plato.
            Nuestro equipo está comprometido con brindarte una experiencia auténtica, donde el sabor y la calidez están en cada detalle.
          </p>
        </div>

        <div className="about-values">
          <div className="value-item">
            <h4>Frescura</h4>
            <p>Productos seleccionados a diario de proveedores locales de confianza.</p>
          </div>
          <div className="value-item">
            <h4>Pasión</h4>
            <p>Cada plato refleja el cuidado y dedicación de nuestro equipo de cocina.</p>
          </div>
          <div className="value-item">
            <h4>Comunidad</h4>
            <p>Somos parte del tejido gastronómico de Asunción, y eso nos enorgullece.</p>
          </div>
        </div>
      </div>

      {/* Fotos del espacio */}
      <div className="about-photos">
        <div className="about-photo-item">
          <img src={terrazaNoche} alt="La Provista de noche" />
        </div>
        <div className="about-photo-item">
          <img src={terrazaDia} alt="La Provista de día" />
        </div>
      </div>
    </main>
  )
}
