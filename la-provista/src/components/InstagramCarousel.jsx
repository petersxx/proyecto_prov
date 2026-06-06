import { useState } from 'react'
import fachada from '../assets/fachada.png'
import platos from '../assets/platos.png'
import bebidas from '../assets/bebidas.png'
import terrazaNoche from '../assets/terraza-noche.png'
import igMesa from '../assets/ig-mesa.png'
import igMenuOffice from '../assets/ig-menu-office.png'
import igEnsalada from '../assets/ig-ensalada.png'
import './InstagramCarousel.css'

const HANDLE = 'laprovi_asuncion'
const IG_URL  = 'https://www.instagram.com/laprovi_asuncion'

const POSTS = [
  {
    src: igMesa,
    caption: 'Una tarde perfecta en nuestra terraza. Mesa lista, ambiente único. 🍷',
    likes: 342, comments: 18, time: '2 d',
    hashtags: '#LaProvista #Asuncion #TerrazaParaguay',
  },
  {
    src: igEnsalada,
    caption: 'Frescura en cada bocado. Ensalada de la huerta, recién preparada. 🥗',
    likes: 218, comments: 12, time: '4 d',
    hashtags: '#CocinaFresca #Ensaladas #LaProvista',
  },
  {
    src: platos,
    caption: 'Ingredientes del día, sabores de siempre. Cada plato es una historia. ✨',
    likes: 489, comments: 31, time: '1 sem',
    hashtags: '#GastronomiaParaguaya #LaProvista',
  },
  {
    src: igMenuOffice,
    caption: 'El menú ejecutivo ya está listo. Almuerzo completo para recargar energías. 💼🍽️',
    likes: 156, comments: 8, time: '1 sem',
    hashtags: '#MenuOffice #AlmuerzoPY #LaProvista',
  },
  {
    src: bebidas,
    caption: 'La carta de bebidas que te esperaba. Gin, vinos y más para tu noche. 🍸',
    likes: 274, comments: 22, time: '2 sem',
    hashtags: '#Tragos #BebidaPY #LaProvista',
  },
  {
    src: terrazaNoche,
    caption: 'Noches de La Provista. Ven a vivir la experiencia. 🌙',
    likes: 531, comments: 47, time: '2 sem',
    hashtags: '#TerrazaNoche #Asuncion #LaProvista',
  },
]

function IconHeart({ filled }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={filled ? '#ed4956' : 'none'} stroke={filled ? '#ed4956' : 'currentColor'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  )
}

function IconComment() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  )
}

function IconShare() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"/>
      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  )
}

function IconBookmark() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
    </svg>
  )
}

function IconInstagram() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  )
}

function Post({ post }) {
  const [liked, setLiked]       = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [animating, setAnimating] = useState(false)

  function handleLike() {
    setLiked(l => !l)
    setAnimating(true)
    setTimeout(() => setAnimating(false), 300)
  }

  const likeCount = post.likes + (liked ? 1 : 0)

  return (
    <article className="ig-post">
      {/* Header */}
      <div className="ig-post__header">
        <a href={IG_URL} target="_blank" rel="noopener noreferrer" className="ig-post__user">
          <div className="ig-post__avatar-ring">
            <img src={fachada} alt="La Provista" className="ig-post__avatar" />
          </div>
          <div className="ig-post__meta">
            <span className="ig-post__username">{HANDLE}</span>
            <span className="ig-post__time">{post.time}</span>
          </div>
        </a>
        <button className="ig-post__more" aria-label="Opciones">
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Photo */}
      <a href={IG_URL} target="_blank" rel="noopener noreferrer" className="ig-post__photo-wrap">
        <img src={post.src} alt={post.caption} className="ig-post__photo" />
        {/* Double-tap heart animation */}
        <div className={`ig-post__photo-overlay ${animating && liked ? 'show' : ''}`}>
          <svg width="80" height="80" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="1">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </div>
      </a>

      {/* Actions */}
      <div className="ig-post__body">
        <div className="ig-post__actions">
          <div className="ig-post__actions-left">
            <button
              className={`ig-post__btn ${animating ? 'ig-post__btn--pop' : ''}`}
              onClick={handleLike}
              aria-label={liked ? 'Quitar like' : 'Me gusta'}
            >
              <IconHeart filled={liked} />
            </button>
            <a href={IG_URL} target="_blank" rel="noopener noreferrer" className="ig-post__btn" aria-label="Comentar">
              <IconComment />
            </a>
            <a href={IG_URL} target="_blank" rel="noopener noreferrer" className="ig-post__btn" aria-label="Compartir">
              <IconShare />
            </a>
          </div>
          <button
            className={`ig-post__btn ${bookmarked ? 'ig-post__btn--saved' : ''}`}
            onClick={() => setBookmarked(b => !b)}
            aria-label={bookmarked ? 'Guardado' : 'Guardar'}
          >
            <IconBookmark />
          </button>
        </div>

        <p className="ig-post__likes">
          {likeCount.toLocaleString('es-PY')} Me gusta
        </p>

        <p className="ig-post__caption">
          <a href={IG_URL} target="_blank" rel="noopener noreferrer">
            <strong>{HANDLE}</strong>
          </a>
          {' '}{post.caption}{' '}
          <span className="ig-post__hashtags">{post.hashtags}</span>
        </p>

        {post.comments > 0 && (
          <a href={IG_URL} target="_blank" rel="noopener noreferrer" className="ig-post__comments">
            Ver los {post.comments} comentarios
          </a>
        )}
      </div>
    </article>
  )
}

export default function InstagramCarousel() {
  return (
    <section className="ig-section">
      <div className="ig-section__header">
        <div className="ig-section__brand">
          <div className="ig-section__logo">
            <IconInstagram />
          </div>
          <div>
            <p className="ig-section__eyebrow">Seguinos en Instagram</p>
            <a href={IG_URL} target="_blank" rel="noopener noreferrer" className="ig-section__handle">
              @{HANDLE}
            </a>
          </div>
        </div>
        <a href={IG_URL} target="_blank" rel="noopener noreferrer" className="ig-section__follow">
          Seguir
        </a>
      </div>

      <div className="ig-mask">
        <div className="ig-track">
          {[...POSTS, ...POSTS].map((post, i) => <Post key={i} post={post} />)}
        </div>
      </div>
    </section>
  )
}
