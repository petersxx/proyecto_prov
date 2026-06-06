import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import './Admin.css'

const PASSWORD = 'provista2024'
const HEADERS = { 'Content-Type': 'application/json', 'X-Admin-Key': PASSWORD }

async function resizeImage(file, maxPx = 1200) {
  return new Promise(resolve => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      const canvas = document.createElement('canvas')
      let { width: w, height: h } = img
      if (w > maxPx || h > maxPx) {
        if (w > h) { h = Math.round(h * maxPx / w); w = maxPx }
        else { w = Math.round(w * maxPx / h); h = maxPx }
      }
      canvas.width = w; canvas.height = h
      canvas.getContext('2d').drawImage(img, 0, 0, w, h)
      canvas.toBlob(blob => resolve(blob), 'image/jpeg', 0.85)
    }
    img.src = url
  })
}

async function blobToBase64(blob) {
  return new Promise(resolve => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result.split(',')[1])
    reader.readAsDataURL(blob)
  })
}

const EMPTY_FORM = {
  nombre: '', descripcion: '', precio: '', precio_raya: '',
  categoria: '', subcategoria: '', activo: true, foto: '', orden: 0,
  nombre_en: '', descripcion_en: '', nombre_pt: '', descripcion_pt: '',
}

export default function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('admin_auth') === '1')
  const [pwInput, setPwInput] = useState('')
  const [pwError, setPwError] = useState(false)

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeCategory, setActiveCategory] = useState(null)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [formTab, setFormTab] = useState('principal')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const fileRef = useRef()

  const fetchItems = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin', { headers: { 'X-Admin-Key': PASSWORD } })
      const data = await res.json()
      setItems(data.items || [])
    } catch { setItems([]) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { if (authed) fetchItems() }, [authed, fetchItems])

  // Categorías en orden (por el menor `orden` de sus ítems)
  const categories = useMemo(() => {
    const sorted = [...items].sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0))
    const seen = new Set()
    const cats = []
    for (const item of sorted) {
      if (!seen.has(item.categoria)) { seen.add(item.categoria); cats.push(item.categoria) }
    }
    return cats
  }, [items])

  useEffect(() => {
    if (!activeCategory && categories.length > 0) setActiveCategory(categories[0])
  }, [categories, activeCategory])

  const currentItems = useMemo(() =>
    items.filter(i => i.categoria === activeCategory).sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0)),
    [items, activeCategory]
  )

  function handleLogin(e) {
    e.preventDefault()
    if (pwInput === PASSWORD) {
      sessionStorage.setItem('admin_auth', '1')
      setAuthed(true)
    } else {
      setPwError(true)
      setPwInput('')
    }
  }

  function openNew() {
    const maxOrden = items
      .filter(i => i.categoria === activeCategory)
      .reduce((max, i) => Math.max(max, i.orden ?? 0), -1)
    setForm({ ...EMPTY_FORM, categoria: activeCategory || '', orden: maxOrden + 1 })
    setFormTab('principal')
    setModal({ mode: 'new' })
  }

  function openEdit(item) {
    setForm({
      nombre:        item.nombre || '',
      descripcion:   item.descripcion || '',
      precio:        item.precio ?? '',
      precio_raya:   item.precio_raya ?? '',
      categoria:     item.categoria || '',
      subcategoria:  item.subcategoria || '',
      activo:        item.activo ?? true,
      foto:          item.foto || '',
      orden:         item.orden ?? 0,
      nombre_en:     item.nombre_en || '',
      descripcion_en: item.descripcion_en || '',
      nombre_pt:     item.nombre_pt || '',
      descripcion_pt: item.descripcion_pt || '',
    })
    setFormTab('principal')
    setModal({ mode: 'edit', item })
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        nombre:        form.nombre,
        descripcion:   form.descripcion || null,
        precio:        form.precio !== '' ? Number(form.precio) : null,
        precio_raya:   form.precio_raya !== '' ? Number(form.precio_raya) : null,
        categoria:     form.categoria,
        subcategoria:  form.subcategoria || null,
        activo:        form.activo,
        foto:          form.foto || null,
        orden:         Number(form.orden) || 0,
        nombre_en:     form.nombre_en || null,
        descripcion_en: form.descripcion_en || null,
        nombre_pt:     form.nombre_pt || null,
        descripcion_pt: form.descripcion_pt || null,
      }
      if (modal.mode === 'new') {
        await fetch('/api/admin', { method: 'POST', headers: HEADERS, body: JSON.stringify(payload) })
      } else {
        await fetch(`/api/admin/${modal.item.id}`, { method: 'PATCH', headers: HEADERS, body: JSON.stringify(payload) })
      }
      setModal(null)
      fetchItems()
    } finally { setSaving(false) }
  }

  async function handleDelete(id) {
    if (!confirm('¿Eliminar este plato? Esta acción no se puede deshacer.')) return
    await fetch(`/api/admin/${id}`, { method: 'DELETE', headers: { 'X-Admin-Key': PASSWORD } })
    fetchItems()
  }

  async function handleToggleActivo(item) {
    await fetch(`/api/admin/${item.id}`, {
      method: 'PATCH',
      headers: HEADERS,
      body: JSON.stringify({ activo: !item.activo }),
    })
    fetchItems()
  }

  async function moveItem(item, dir) {
    const sorted = currentItems
    const idx = sorted.findIndex(i => i.id === item.id)
    const swapIdx = idx + dir
    if (swapIdx < 0 || swapIdx >= sorted.length) return
    const other = sorted[swapIdx]
    // Si tienen el mismo orden, forzamos diferencia
    const ordA = item.orden ?? idx
    const ordB = other.orden ?? swapIdx
    const newA = ordA === ordB ? ordB - dir : ordB
    await Promise.all([
      fetch(`/api/admin/${item.id}`,  { method: 'PATCH', headers: HEADERS, body: JSON.stringify({ orden: newA }) }),
      fetch(`/api/admin/${other.id}`, { method: 'PATCH', headers: HEADERS, body: JSON.stringify({ orden: ordA }) }),
    ])
    fetchItems()
  }

  async function moveCat(idx, dir) {
    const newCats = [...categories]
    const swapIdx = idx + dir
    if (swapIdx < 0 || swapIdx >= newCats.length) return
    ;[newCats[idx], newCats[swapIdx]] = [newCats[swapIdx], newCats[idx]]

    // Reasignar ordenes: cat0 → 0,1,2… | cat1 → 100,101…
    const updates = []
    newCats.forEach((cat, catIdx) => {
      const catItems = items
        .filter(i => i.categoria === cat)
        .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0))
      catItems.forEach((item, itemIdx) => {
        const newOrden = catIdx * 100 + itemIdx
        if (item.orden !== newOrden) updates.push({ id: item.id, orden: newOrden })
      })
    })
    await Promise.all(updates.map(u =>
      fetch(`/api/admin/${u.id}`, { method: 'PATCH', headers: HEADERS, body: JSON.stringify({ orden: u.orden }) })
    ))
    fetchItems()
  }

  async function handlePhotoUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) { alert('La imagen no puede superar 10 MB'); return }
    setUploading(true)
    try {
      const blob = await resizeImage(file)
      const base64 = await blobToBase64(blob)
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify({ filename, data: base64, contentType: 'image/jpeg' }),
      })
      const data = await res.json()
      if (data.url) setForm(f => ({ ...f, foto: data.url }))
      else alert('Error al subir la imagen')
    } catch { alert('Error al subir la imagen') }
    finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  // ── Login ───────────────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="adm-login">
        <form className="adm-login__box" onSubmit={handleLogin}>
          <h1>Admin · Menú</h1>
          <p>Ingresá la contraseña para acceder</p>
          <input
            type="password"
            placeholder="Contraseña"
            value={pwInput}
            onChange={e => { setPwInput(e.target.value); setPwError(false) }}
            className={pwError ? 'err' : ''}
            autoFocus
          />
          {pwError && <span className="adm-login__err">Contraseña incorrecta</span>}
          <button type="submit">Ingresar</button>
        </form>
      </div>
    )
  }

  // ── Panel ───────────────────────────────────────────────────────────────────
  return (
    <div className="adm-page">
      <header className="adm-header">
        <h1>Editor de Menú</h1>
        <div className="adm-header__actions">
          <button className="adm-btn adm-btn--ghost" onClick={fetchItems} disabled={loading}>
            {loading ? 'Cargando…' : '↻ Actualizar'}
          </button>
          <button className="adm-btn adm-btn--primary" onClick={openNew} disabled={!activeCategory}>
            + Nuevo plato
          </button>
          <button className="adm-btn adm-btn--ghost" onClick={() => {
            sessionStorage.removeItem('admin_auth'); setAuthed(false)
          }}>
            Salir
          </button>
        </div>
      </header>

      <div className="adm-body">
        {/* ── Sidebar categorías ── */}
        <aside className="adm-sidebar">
          <p className="adm-sidebar__label">Categorías</p>
          <ul className="adm-cats">
            {categories.map((cat, idx) => (
              <li key={cat} className={`adm-cat ${activeCategory === cat ? 'active' : ''}`}>
                <button className="adm-cat__name" onClick={() => setActiveCategory(cat)}>
                  <span>{cat}</span>
                  <span className="adm-badge-count">{items.filter(i => i.categoria === cat).length}</span>
                </button>
                <div className="adm-cat__arrows">
                  <button onClick={() => moveCat(idx, -1)} disabled={idx === 0} title="Subir categoría">↑</button>
                  <button onClick={() => moveCat(idx, 1)} disabled={idx === categories.length - 1} title="Bajar categoría">↓</button>
                </div>
              </li>
            ))}
          </ul>
        </aside>

        {/* ── Items ── */}
        <main className="adm-main">
          {!activeCategory ? (
            <p className="adm-empty">Seleccioná una categoría</p>
          ) : (
            <>
              <div className="adm-main__header">
                <h2>
                  {activeCategory}
                  <span className="adm-badge-count">{currentItems.length}</span>
                </h2>
              </div>

              {loading ? (
                <p className="adm-empty">Cargando…</p>
              ) : currentItems.length === 0 ? (
                <p className="adm-empty">Sin platos. ¡Agregá el primero!</p>
              ) : (
                <ul className="adm-items">
                  {currentItems.map((item, idx) => (
                    <li key={item.id} className={`adm-item ${!item.activo ? 'adm-item--hidden' : ''}`}>
                      {item.foto ? (
                        <img className="adm-item__foto" src={item.foto} alt={item.nombre} />
                      ) : (
                        <div className="adm-item__foto adm-item__foto--empty">📷</div>
                      )}
                      <div className="adm-item__info">
                        <strong className="adm-item__name">{item.nombre}</strong>
                        {item.subcategoria && <span className="adm-item__sub">{item.subcategoria}</span>}
                        {item.descripcion && <span className="adm-item__desc">{item.descripcion}</span>}
                        <span className="adm-item__price">
                          {item.precio
                            ? `₲ ${item.precio.toLocaleString('es-PY')}`
                            : <em>Sin precio</em>}
                          {item.precio_raya
                            ? ` · Raya ₲ ${item.precio_raya.toLocaleString('es-PY')}`
                            : null}
                        </span>
                      </div>
                      <div className="adm-item__actions">
                        <button
                          className={`adm-visibility ${item.activo ? 'visible' : 'hidden'}`}
                          onClick={() => handleToggleActivo(item)}
                          title={item.activo ? 'Ocultar del menú' : 'Mostrar en el menú'}
                        >
                          {item.activo ? '👁 Visible' : '🚫 Oculto'}
                        </button>
                        <div className="adm-reorder">
                          <button onClick={() => moveItem(item, -1)} disabled={idx === 0} title="Subir">↑</button>
                          <button onClick={() => moveItem(item, 1)} disabled={idx === currentItems.length - 1} title="Bajar">↓</button>
                        </div>
                        <button className="adm-btn adm-btn--edit" onClick={() => openEdit(item)}>Editar</button>
                        <button className="adm-btn adm-btn--del" onClick={() => handleDelete(item.id)}>Eliminar</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </main>
      </div>

      {/* ── Modal ── */}
      {modal && (
        <div className="adm-overlay" onClick={() => setModal(null)}>
          <div className="adm-modal" onClick={e => e.stopPropagation()}>
            <div className="adm-modal__header">
              <h2>{modal.mode === 'new' ? 'Nuevo plato' : 'Editar plato'}</h2>
              <button className="adm-modal__close" onClick={() => setModal(null)}>✕</button>
            </div>

            <div className="adm-tabs">
              <button className={formTab === 'principal' ? 'active' : ''} onClick={() => setFormTab('principal')}>
                Principal
              </button>
              <button className={formTab === 'traducciones' ? 'active' : ''} onClick={() => setFormTab('traducciones')}>
                Traducciones EN / PT
              </button>
            </div>

            <form className="adm-form" onSubmit={handleSave}>
              {formTab === 'principal' && (
                <>
                  {/* Foto */}
                  <div className="adm-foto-section">
                    {form.foto ? (
                      <img src={form.foto} alt="Preview" className="adm-foto-preview" />
                    ) : (
                      <div className="adm-foto-empty">Sin foto</div>
                    )}
                    <div className="adm-foto-btns">
                      <button
                        type="button"
                        className="adm-btn adm-btn--upload"
                        onClick={() => fileRef.current?.click()}
                        disabled={uploading}
                      >
                        {uploading ? 'Subiendo…' : '📷 Subir foto'}
                      </button>
                      {form.foto && (
                        <button
                          type="button"
                          className="adm-btn adm-btn--ghost"
                          onClick={() => setForm(f => ({ ...f, foto: '' }))}
                        >
                          Quitar
                        </button>
                      )}
                    </div>
                    {form.foto && (
                      <input
                        type="url"
                        className="adm-input adm-input--sm"
                        placeholder="URL de la foto"
                        value={form.foto}
                        onChange={e => setForm(f => ({ ...f, foto: e.target.value }))}
                      />
                    )}
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      className="adm-file-hidden"
                      onChange={handlePhotoUpload}
                    />
                  </div>

                  <label className="adm-label">
                    Nombre *
                    <input
                      className="adm-input"
                      required
                      value={form.nombre}
                      onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
                    />
                  </label>

                  <label className="adm-label">
                    Descripción
                    <textarea
                      className="adm-input adm-textarea"
                      rows={3}
                      value={form.descripcion}
                      onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
                    />
                  </label>

                  <div className="adm-row">
                    <label className="adm-label">
                      Precio (₲)
                      <input
                        className="adm-input"
                        type="number"
                        min="0"
                        step="500"
                        placeholder="Ej: 85000"
                        value={form.precio}
                        onChange={e => setForm(f => ({ ...f, precio: e.target.value }))}
                      />
                    </label>
                    <label className="adm-label">
                      Precio Raya (₲)
                      <input
                        className="adm-input"
                        type="number"
                        min="0"
                        step="500"
                        placeholder="Solo para vinos/tragos"
                        value={form.precio_raya}
                        onChange={e => setForm(f => ({ ...f, precio_raya: e.target.value }))}
                      />
                    </label>
                  </div>

                  <div className="adm-row">
                    <label className="adm-label">
                      Categoría *
                      <input
                        className="adm-input"
                        required
                        list="adm-cats-list"
                        value={form.categoria}
                        onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))}
                      />
                      <datalist id="adm-cats-list">
                        {categories.map(c => <option key={c} value={c} />)}
                      </datalist>
                    </label>
                    <label className="adm-label">
                      Subcategoría
                      <input
                        className="adm-input"
                        placeholder="Ej: Tintos, Blancos…"
                        value={form.subcategoria}
                        onChange={e => setForm(f => ({ ...f, subcategoria: e.target.value }))}
                      />
                    </label>
                  </div>

                  <div className="adm-row adm-row--short">
                    <label className="adm-label">
                      Orden
                      <input
                        className="adm-input"
                        type="number"
                        value={form.orden}
                        onChange={e => setForm(f => ({ ...f, orden: e.target.value }))}
                      />
                    </label>
                    <label className="adm-label adm-label--toggle">
                      <span>Visible en el menú</span>
                      <input
                        type="checkbox"
                        checked={form.activo}
                        onChange={e => setForm(f => ({ ...f, activo: e.target.checked }))}
                      />
                    </label>
                  </div>
                </>
              )}

              {formTab === 'traducciones' && (
                <>
                  <p className="adm-hint">
                    Si dejás estos campos vacíos se muestra el nombre en español.
                  </p>
                  <div className="adm-row">
                    <label className="adm-label">
                      Nombre (EN)
                      <input className="adm-input" value={form.nombre_en} onChange={e => setForm(f => ({ ...f, nombre_en: e.target.value }))} />
                    </label>
                    <label className="adm-label">
                      Nombre (PT)
                      <input className="adm-input" value={form.nombre_pt} onChange={e => setForm(f => ({ ...f, nombre_pt: e.target.value }))} />
                    </label>
                  </div>
                  <label className="adm-label">
                    Descripción (EN)
                    <textarea className="adm-input adm-textarea" rows={2} value={form.descripcion_en} onChange={e => setForm(f => ({ ...f, descripcion_en: e.target.value }))} />
                  </label>
                  <label className="adm-label">
                    Descripción (PT)
                    <textarea className="adm-input adm-textarea" rows={2} value={form.descripcion_pt} onChange={e => setForm(f => ({ ...f, descripcion_pt: e.target.value }))} />
                  </label>
                </>
              )}

              <div className="adm-form__footer">
                <button type="button" className="adm-btn adm-btn--ghost" onClick={() => setModal(null)}>
                  Cancelar
                </button>
                <button type="submit" className="adm-btn adm-btn--primary" disabled={saving}>
                  {saving ? 'Guardando…' : 'Guardar cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
