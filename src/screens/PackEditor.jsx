import { useState } from 'react'

const GRADIENTS = [
  ['#c8a684', '#8a6f55'],
  ['#9a9a9c', '#5c5c5e'],
  ['#d9bdf0', '#9a7ab8'],
  ['#b8c4b0', '#7a8a72'],
  ['#a9815e', '#4a3628'],
]

export default function PackEditor({ packs, setPacks, onBack }) {
  const [editing, setEditing] = useState(null)
  const [name, setName] = useState('')
  const [text, setText] = useState('')

  const words = text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const [w, h] = l.split('|').map((s) => s.trim())
      return { w, h: h || null }
    })
  const valid = name.trim().length > 0 && words.length >= 3

  function load(p) {
    setEditing(p.id)
    setName(p.name)
    setText(
      p.words
        .map((x) => (typeof x === 'string' ? x : x.h ? `${x.w} | ${x.h}` : x.w))
        .join('\n'),
    )
  }

  function reset() {
    setEditing(null)
    setName('')
    setText('')
  }

  function save() {
    if (!valid) return
    const g = GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)]
    if (editing) {
      setPacks(
        packs.map((p) => (p.id === editing ? { ...p, name: name.trim(), words } : p)),
      )
    } else {
      setPacks([
        ...packs,
        { id: `custom-${Date.now()}`, name: name.trim(), words, g1: g[0], g2: g[1] },
      ])
    }
    reset()
  }

  function remove(id) {
    setPacks(packs.filter((p) => p.id !== id))
    if (editing === id) reset()
  }

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
        <textarea
          className="field area"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={
            'Una por línea. Pon "palabra | pista" para que la ziztupostorra reciba pista.\nEj.:\nLa fiesta de 2019 | donde nevó\nEl piso de arriba | vecinos\nLa boda de verano | calor'
          }
          rows={7}
        />
        <div className="row-sub">
          {words.length} palabras · mínimo 3 · la pista tras “|” es opcional
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
