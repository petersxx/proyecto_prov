import { useState, useEffect } from 'react'
import './Menu.css'

const TRANSLATIONS = {
  es: {
    eyebrow:   'La Provista · Est. 2020',
    title:     'Nuestra Carta',
    desc:      'Todos nuestros platos están preparados con ingredientes frescos del día.',
    loading:   'Cargando carta...',
    error:     'No se pudo cargar el menú.',
    hint:      'Toca para ver más',
    consult:   'Consultar',
    bottle:    'Botella',
    raya:      'Raya',
  },
  en: {
    eyebrow:   'La Provista · Est. 2020',
    title:     'Our Menu',
    desc:      'All our dishes are prepared with fresh ingredients every day.',
    loading:   'Loading menu...',
    error:     'Could not load the menu.',
    hint:      'Tap for details',
    consult:   'Ask us',
    bottle:    'Bottle',
    raya:      'Glass',
  },
  pt: {
    eyebrow:   'La Provista · Est. 2020',
    title:     'Nosso Cardápio',
    desc:      'Todos os nossos pratos são preparados com ingredientes frescos do dia.',
    loading:   'Carregando cardápio...',
    error:     'Não foi possível carregar o cardápio.',
    hint:      'Toque para ver mais',
    consult:   'Consultar',
    bottle:    'Garrafa',
    raya:      'Dose',
  },
}

const LANG_LABELS = { es: 'ES', en: 'EN', pt: 'PT' }

function formatPrice(price) {
  if (!price) return null
  return `₲ ${price.toLocaleString('es-PY')}`
}

function localName(item, lang) {
  if (lang === 'en') return item.name_en || item.name
  if (lang === 'pt') return item.name_pt || item.name
  return item.name
}

function localDesc(item, lang) {
  if (lang === 'en') return item.desc_en || item.description
  if (lang === 'pt') return item.desc_pt || item.description
  return item.description
}

function MenuCard({ item, onClick, hideHint, t, lang }) {
  const name = localName(item, lang)
  const desc = localDesc(item, lang)
  return (
    <div className="menu-card" onClick={() => onClick(item)}>
      <div className="menu-card-info">
        <h3>{name}</h3>
        {desc && <p>{desc}</p>}
        {!hideHint && <span className="menu-card-hint">{t.hint}</span>}
      </div>
      {item.priceRaya ? (
        <span className="menu-card-price dual">
          <span>Bot. {formatPrice(item.price)}</span>
          <span>Raya {formatPrice(item.priceRaya)}</span>
        </span>
      ) : formatPrice(item.price) ? (
        <span className="menu-card-price">{formatPrice(item.price)}</span>
      ) : (
        <span className="menu-card-price consult">{t.consult}</span>
      )}
    </div>
  )
}

function LangSwitch({ lang, setLang }) {
  return (
    <div className="menu-lang-switch">
      {Object.entries(LANG_LABELS).map(([code, label]) => (
        <button
          key={code}
          className={`menu-lang-btn ${lang === code ? 'active' : ''}`}
          onClick={() => setLang(code)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

export default function Menu({ embedded = false }) {
  const Tag = embedded ? 'div' : 'main'
  const cls = `menu-page${embedded ? ' menu-page--embedded' : ''}`

  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [active, setActive] = useState(null)
  const [selected, setSelected] = useState(null)
  const [lang, setLang] = useState('es')

  const t = TRANSLATIONS[lang]

  useEffect(() => {
    fetch('/api/menu')
      .then(r => r.json())
      .then(data => {
        setCategories(data.categories)
        setActive(data.categories[0]?.id)
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (!selected) return
    const onKey = e => e.key === 'Escape' && setSelected(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selected])

  if (loading) return (
    <Tag className={cls}>
      <div className="menu-header">
        <LangSwitch lang={lang} setLang={setLang} />
        <p className="menu-eyebrow">{t.eyebrow}</p>
        <h1>{t.title}</h1>
      </div>
      <div className="menu-loading">{t.loading}</div>
    </Tag>
  )

  if (error) return (
    <Tag className={cls}>
      <div className="menu-header">
        <LangSwitch lang={lang} setLang={setLang} />
        <p className="menu-eyebrow">{t.eyebrow}</p>
        <h1>{t.title}</h1>
      </div>
      <div className="menu-loading">{t.error}</div>
    </Tag>
  )

  const current = categories.find(c => c.id === active)

  return (
    <Tag className={cls}>
      <div className="menu-header">
        <LangSwitch lang={lang} setLang={setLang} />
        <p className="menu-eyebrow">{t.eyebrow}</p>
        <h1>{t.title}</h1>
        <p className="menu-desc">{t.desc}</p>
      </div>

      <div className="menu-body">
        <aside className="menu-sidebar">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`menu-cat-btn ${active === cat.id ? 'active' : ''}`}
              onClick={() => setActive(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </aside>

        {current && (
          <section className="menu-items">
            <h2 className="menu-cat-title">{current.label}</h2>
            {current.note && <p className="menu-cat-note">{current.note}</p>}
            {current.subcategories ? (
              current.subcategories.map(sub => (
                <div key={sub.label} className="menu-subcategory">
                  <h3 className="menu-sub-title">{sub.label}</h3>
                  <div className="menu-grid">
                    {sub.items.map(item => (
                      <MenuCard key={item.id} item={item} onClick={setSelected} t={t} lang={lang} />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="menu-grid">
                {current.items.map(item => (
                  <MenuCard key={item.id} item={item} onClick={setSelected} t={t} lang={lang} hideHint={current.id === 'Empanadas'} />
                ))}
              </div>
            )}
          </section>
        )}
      </div>

      {/* Tab bar móvil */}
      <div className="menu-tabs-mobile">
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`menu-tab-mobile ${active === cat.id ? 'active' : ''}`}
            onClick={() => setActive(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Modal — rendered at root level para evitar clipping */}
      {selected && (
        <div className="menu-modal-overlay" onClick={() => setSelected(null)}>
          <div className="menu-modal" onClick={e => e.stopPropagation()}>
            <button className="menu-modal-close" onClick={() => setSelected(null)}>✕</button>
            {selected.image && (
              <div className="menu-modal-img">
                <img src={selected.image} alt={selected.name} />
              </div>
            )}
            <div className={`menu-modal-body ${!selected.image ? 'no-img' : ''}`}>
              <h3>{localName(selected, lang)}</h3>
              {localDesc(selected, lang) && <p>{localDesc(selected, lang)}</p>}
              {selected.priceRaya ? (
                <div className="menu-modal-prices">
                  <span>{t.bottle} {formatPrice(selected.price)}</span>
                  <span>{t.raya} {formatPrice(selected.priceRaya)}</span>
                </div>
              ) : formatPrice(selected.price) ? (
                <span className="menu-modal-price">{formatPrice(selected.price)}</span>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </Tag>
  )
}
