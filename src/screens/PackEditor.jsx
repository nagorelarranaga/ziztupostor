import { useRef, useState } from 'react'

// Degradado neutro por defecto (bloques sin estampado / tinte sobre imagen)
const DEFAULT_GRADIENT = ['#9a9a9c', '#5c5c5e']

// Cada estampado lleva su color (g1/g2): el bloque lo hereda como tinte
const PATTERNS = [
  { label: 'Leopardo', src: 'patterns/ziztubizian.jpg', g1: '#d9b896', g2: '#b08968' },
  { label: 'Disco', src: 'patterns/farri.png', g1: '#d9bdf0', g2: '#b489d4' },
  { label: 'Margaritas', src: 'patterns/pertsonak.jpg', g1: '#f5f1ea', g2: '#d9cfbf' },
  { label: 'Mandalas', src: 'patterns/tanger.jpg', g1: '#6e9bd8', g2: '#3f66ab' },
  { label: 'Cuadros', src: 'patterns/cuadros.jpg', g1: '#9a9a9c', g2: '#5c5c5e' },
  { label: 'Estrellas granate', src: 'patterns/estrellas-granate.jpg', g1: '#7a3b45', g2: '#3d1420' },
  { label: 'Cebra', src: 'patterns/cebra.jpg', g1: '#e8e4de', g2: '#b3aca0' },
  { label: 'Hojas', src: 'patterns/hojas.jpg', g1: '#5b83b8', g2: '#33517e' },
  { label: 'Estrellas beige', src: 'patterns/estrellas.png', g1: '#e8d5bd', g2: '#a9805c' },
  { label: 'Abanicos', src: 'patterns/abanicos.jpg', g1: '#2e5f8a', g2: '#1d3f63' },
  { label: 'Ondas burdeos', src: 'patterns/ondas.jpg', g1: '#8a4a5c', g2: '#542738' },
  { label: 'Leopardo gris', src: 'patterns/leopardo-gris.jpg', g1: '#c9c9c9', g2: '#6e6e70' },
  { label: 'Agua', src: 'patterns/agua.jpg', g1: '#d8dcd9', g2: '#9aa8a6' },
  { label: 'Topos', src: 'patterns/topos.jpg', g1: '#efe8d8', g2: '#3a3a3c' },
  { label: 'Flores burdeos', src: 'patterns/flores.jpg', g1: '#a85d70', g2: '#6e3346' },
  { label: 'Rayas ciruela', src: 'patterns/rayas.jpg', g1: '#7a5568', g2: '#4a3345' },
  { label: 'Damero verde', src: 'patterns/damero.jpg', g1: '#4e6e52', g2: '#2c4630' },
  { label: 'Guindillas', src: 'patterns/guindillas.png', g1: '#e86a92', g2: '#c93737' },
]

export default function PackEditor({ packs, setPacks, otherPacks = [], onBack }) {
  const [editing, setEditing] = useState(null)
  const [name, setName] = useState('')
  const [entries, setEntries] = useState([])
  const [img, setImg] = useState(null)
  const [grad, setGrad] = useState(DEFAULT_GRADIENT)
  const [w, setW] = useState('')
  const [h, setH] = useState('')
  const wRef = useRef(null)

  const words = entries.map((e) => e.w.trim()).filter(Boolean)
  const valid = name.trim().length > 0 && words.length >= 3

  // Estampados ya usados por otros bloques (privados, genéricos o de la app)
  // — no se ofrecen al crear/editar. El del bloque en edición sí queda visible.
  const usedImgs = new Set()
  ;[...packs, ...otherPacks].forEach((p) => {
    if (editing && p.id === editing) return
    if (p.img) usedImgs.add(p.img)
  })
  const patternsAvail = PATTERNS.filter((pt) => !usedImgs.has(pt.src))
  const customImg = img && img.startsWith('data:') ? img : null

  function load(p) {
    setEditing(p.id)
    setName(p.name)
    setEntries(
      p.words.map((x) =>
        typeof x === 'string' ? { w: x, h: '' } : { w: x.w, h: x.h || '' },
      ),
    )
    setImg(p.img || null)
    setGrad([p.g1 || DEFAULT_GRADIENT[0], p.g2 || DEFAULT_GRADIENT[1]])
    setW('')
    setH('')
  }

  function reset() {
    setEditing(null)
    setName('')
    setEntries([])
    setImg(null)
    setGrad(DEFAULT_GRADIENT)
    setW('')
    setH('')
  }

  function addEntry() {
    const word = w.trim()
    if (!word) return
    setEntries([...entries, { w: word, h: h.trim() }])
    setW('')
    setH('')
    wRef.current?.focus()
  }

  function pickFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const image = new Image()
      image.onload = () => {
        const s = Math.min(1, 900 / Math.max(image.width, image.height))
        const c = document.createElement('canvas')
        c.width = Math.round(image.width * s)
        c.height = Math.round(image.height * s)
        c.getContext('2d').drawImage(image, 0, 0, c.width, c.height)
        setImg(c.toDataURL('image/jpeg', 0.82))
      }
      image.src = reader.result
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  function save() {
    if (!valid) return
    const data = {
      name: name.trim(),
      img,
      g1: grad[0],
      g2: grad[1],
      words: entries
        .filter((e) => e.w.trim())
        .map((e) => ({ w: e.w.trim(), h: e.h.trim() || null })),
    }
    if (editing) {
      setPacks(packs.map((p) => (p.id === editing ? { ...p, ...data } : p)))
    } else {
      setPacks([...packs, { id: `custom-${Date.now()}`, ...data }])
    }
    reset()
  }

  function remove(id) {
    setPacks(packs.filter((p) => p.id !== id))
    if (editing === id) reset()
  }

  const tileBg = img
    ? `linear-gradient(160deg, ${grad[0]}55, ${grad[1]}55), linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,.62)), url('${img}') center/cover`
    : `linear-gradient(140deg, ${grad[0]}, ${grad[1]})`

  return (
    <div className="screen">
      <div className="topbar">
        <button className="iconbtn" onClick={onBack} aria-label="Volver">
          ‹
        </button>
        <span className="topbar-title">Bloques privados</span>
        <span className="iconbtn ghost" />
      </div>

      <p className="note">
        Estas palabras se guardan <b>solo en este móvil</b>. No forman parte del código ni se
        suben a ningún sitio.
      </p>

      {packs.map((p) => (
        <div className="card row-between" key={p.id}>
          <div>
            <div className="row-title">{p.name}</div>
            <div className="row-sub">{p.words.length} palabras</div>
          </div>
          <div className="mini-btns">
            <button className="mini-btn" onClick={() => load(p)}>
              Editar
            </button>
            <button className="mini-btn danger" onClick={() => remove(p.id)}>
              Borrar
            </button>
          </div>
        </div>
      ))}

      <div className="card">
        <div className="row-title">{editing ? 'Editar bloque' : 'Nuevo bloque'}</div>
        <input
          className="field"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre del bloque (ej. Nuestras movidas)"
          maxLength={24}
        />

        <div className="row-sub label-in">Palabras y pistas</div>
        <div className="entry-add">
          <input
            ref={wRef}
            className="field"
            value={w}
            onChange={(e) => setW(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addEntry()}
            placeholder="Palabra"
            enterKeyHint="next"
          />
          <input
            className="field"
            value={h}
            onChange={(e) => setH(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addEntry()}
            placeholder="Pista · opcional"
            enterKeyHint="done"
          />
          <button
            className="addbtn"
            onClick={addEntry}
            disabled={!w.trim()}
            aria-label="Añadir palabra"
          >
            +
          </button>
        </div>
        {entries.map((e, idx) => (
          <div className="entry" key={idx}>
            <span className="entry-w">{e.w}</span>
            <span className="entry-h">{e.h || 'sin pista'}</span>
            <button
              className="mini-x"
              onClick={() => setEntries(entries.filter((_, k) => k !== idx))}
              aria-label={`Quitar ${e.w}`}
            >
              ×
            </button>
          </div>
        ))}
        <div className="row-sub">{words.length} palabras · mínimo 3</div>

        <div className="row-sub label-in">Estampado</div>
        <div className="swatches">
          {patternsAvail.map((pt) => (
            <button
              key={pt.src}
              className={`swatch ${img === pt.src ? 'on' : ''}`}
              style={{ backgroundImage: `url('${pt.src}')` }}
              onClick={() => {
                setImg(pt.src)
                setGrad([pt.g1, pt.g2])
              }}
              aria-label={pt.label}
              title={pt.label}
            />
          ))}
          {customImg && (
            <button
              className="swatch on"
              style={{ backgroundImage: `url('${customImg}')` }}
              onClick={() => setImg(customImg)}
              aria-label="Tu foto"
            />
          )}
          <label className="swatch upload" title="Subir foto">
            +
            <input type="file" accept="image/*" hidden onChange={pickFile} />
          </label>
        </div>

        <div className="preview-tile" style={{ background: tileBg }}>
          <span className="pack-name">{name.trim() || 'Nombre del bloque'}</span>
          <span className="pack-count">
            {words.length} {words.length === 1 ? 'palabra' : 'palabras'}
          </span>
        </div>

        <div className="editor-btns">
          {editing && (
            <button className="btn btn-ghost" onClick={reset}>
              Cancelar
            </button>
          )}
          <button className="btn btn-primary" disabled={!valid} onClick={save}>
            {editing ? 'Guardar cambios' : 'Crear bloque'}
          </button>
        </div>
      </div>
    </div>
  )
}
