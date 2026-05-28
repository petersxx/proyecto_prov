import { useState, useEffect } from 'react'
import { categories } from '../data/menu'
import './Menu.css'

function formatPrice(price) {
  if (!price) return null
  return `₲ ${price.toLocaleString('es-PY')}`
}

function MenuCard({ item, onClick, hideHint }) {
  return (
    <div className="menu-card" onClick={() => onClick(item)}>
      <div className="menu-card-info">
        <h3>{item.name}</h3>
        {item.description && <p>{item.description}</p>}
        {!hideHint && <span className="menu-card-hint">Haz clic para ver más</span>}
      </div>
      {item.priceRaya ? (
        <span className="menu-card-price dual">
          <span>Bot. {formatPrice(item.price)}</span>
          <span>Raya {formatPrice(item.priceRaya)}</span>
        </span>
      ) : formatPrice(item.price) ? (
        <span className="menu-card-price">{formatPrice(item.price)}</span>
      ) : (
        <span className="menu-card-price consult">Consultar</span>
      )}
    </div>
  )
}

export default function Menu() {
  const [active, setActive] = useState(categories[0].id)
  const [selected, setSelected] = useState(null)

  const current = categories.find(c => c.id === active)

  useEffect(() => {
    if (!selected) return
    const onKey = e => e.key === 'Escape' && setSelected(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selected])

  return (
    <main className="menu-page">
      <div className="menu-header">
        <p className="menu-eyebrow">La Provista · Est. 2020</p>
        <h1>Nuestra Carta</h1>
        <p className="menu-desc">Todos nuestros platos están preparados con ingredientes frescos del día.</p>
      </div>

      <div className="menu-body">
        {/* Categorías sidebar (desktop) */}
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

        {/* Platos */}
        <section className="menu-items">
          {current.image && (
            <div className="menu-cat-image-wrap" data-cat={current.id}>
              <img src={current.image} alt={current.label} className="menu-cat-image" />
            </div>
          )}
          <h2 className="menu-cat-title">{current.label}</h2>
          {current.note && <p className="menu-cat-note">{current.note}</p>}
          {current.subcategories ? (
            current.subcategories.map(sub => (
              <div key={sub.label} className="menu-subcategory">
                <h3 className="menu-sub-title">{sub.label}</h3>
                <div className="menu-grid">
                  {sub.items.map(item => (
                    <MenuCard key={item.id} item={item} onClick={setSelected} />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="menu-grid">
              {current.items.map(item => (
                <MenuCard key={item.id} item={item} onClick={setSelected} hideHint={current.id === 'empanadas'} />
              ))}
            </div>
          )}
        </section>
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

      {/* Modal */}
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
              <h3>{selected.name}</h3>
              {selected.description && <p>{selected.description}</p>}
              {selected.priceRaya ? (
                <div className="menu-modal-prices">
                  <span>Botella {formatPrice(selected.price)}</span>
                  <span>Raya {formatPrice(selected.priceRaya)}</span>
                </div>
              ) : formatPrice(selected.price) ? (
                <span className="menu-modal-price">{formatPrice(selected.price)}</span>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
