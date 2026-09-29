import { useState } from 'react'
import Avatar from '../components/Avatar.jsx'

const TIMER_OPTIONS = [
  { label: 'Sin límite', value: 0 },
  { label: '1 min', value: 60 },
  { label: '2 min', value: 120 },
  { label: '3 min', value: 180 },
  { label: '5 min', value: 300 },
]

export default function Setup({
  players,
  setPlayers,
  defaultPlayers = [],
  packs,
  photos = {},
  groupImg = null,
  locked = false,
  onUnlock,
  onStart,
  onEditor,
  onScores,
}) {
  const [name, setName] = useState('')
  const [impostors, setImpostors] = useState(1)
  const [packId, setPackId] = useState(packs[0]?.id)
  const [hint, setHint] = useState(true)
  const [timer, setTimer] = useState(120)
  const [showLock, setShowLock] = useState(false)
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [codeError, setCodeError] = useState(false)
  const [groupImgErr, setGroupImgErr] = useState(false)
  const [showInfo, setShowInfo] = useState(false)

  async function tryUnlock() {
    if (!code.trim() || busy) return
    setBusy(true)
    setCodeError(false)
    const ok = await onUnlock(code.trim())
    setBusy(false)
    if (!ok) setCodeError(true)
  }

  const maxImpostors = Math.max(1, players.length - 2)
  const imp = Math.min(impostors, maxImpostors)
  const ready = players.length >= 3
  const pack = packs.find((p) => p.id === packId) ?? packs[0]

  function addPlayer() {
    const n = name.trim().slice(0, 14)
    if (!n || players.includes(n)) return
    setPlayers([...players, n])
    setName('')
  }

  return (
    <div className="screen">
      <header className="hero">
        <h1 className="hero-title">
          ZIZTU<span>POSTOR</span>
        </h1>
      </header>

      {groupImg && !groupImgErr && (
        <div className="group-photo-wrap">
          <img
            className="group-photo"
            src={groupImg}
            alt="ziztubizian"
            onError={() => setGroupImgErr(true)}
          />
          <img className="bolt bolt-tr" src="rayo.png" alt="" />
          <img className="bolt bolt-bl" src="rayo.png" alt="" />
        </div>
      )}

      {locked && (
        <div className="card lockcard-hero">
          <div className="lock-top">
            <div>
              <div className="lock-title">Bloques privados 🔒</div>
              <div className="lock-sub">Pídele a @nagorelarranaga el código</div>
            </div>
            <button
              className="info-dot"
              onClick={() => setShowInfo(!showInfo)}
              aria-label="Por qué está protegido"
            >
              i
            </button>
          </div>
          {showInfo && (
            <p className="lock-note">
              Está protegido porque hay cosas funables que no se pueden publicar.
              Cosa de las ziztuz 🤫
            </p>
          )}
          {showLock ? (
            <>
              <input
                className="field"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && tryUnlock()}
                placeholder="Código"
                autoComplete="off"
                autoCapitalize="none"
                enterKeyHint="go"
              />
              {codeError && (
                <div className="lock-note error">Código incorrecto, pregunta a la de siempre</div>
              )}
              <button
                className="btn btn-primary btn-block"
                onClick={tryUnlock}
                disabled={busy || !code.trim()}
              >
                {busy ? 'Comprobando…' : 'Desbloquear'}
              </button>
            </>
          ) : (
            <button
              className="btn btn-accent btn-block lock-btn"
              onClick={() => setShowLock(true)}
            >
              Tengo código →
            </button>
          )}
        </div>
      )}

      <div className="label">Ziztuz · {players.length}</div>
      <div className="card plist">
        {players.map((p, i) => (
          <div className="player-row" key={p}>
            <Avatar name={p} i={i} img={photos[p]} />
            <span className="player-name">{p}</span>
            <button
              className="mini-x"
              aria-label={`Quitar a ${p}`}
              onClick={() => setPlayers(players.filter((x) => x !== p))}
            >
              ×
            </button>
          </div>
        ))}
        <div className="addrow">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
            placeholder="Añadir ziztu"
            maxLength={14}
            enterKeyHint="done"
          />
          <button className="addbtn" onClick={addPlayer} disabled={!name.trim()} aria-label="Añadir">
            +
          </button>
        </div>
        {players.length === 0 && (
          <p className="empty">Mínimo 3 ziztuz. Se juega pasando un solo móvil.</p>
        )}
        {!locked && defaultPlayers.some((n) => !players.includes(n)) && (
          <button
            className="linkish"
            onClick={() =>
              setPlayers([
                ...players,
                ...defaultPlayers.filter((n) => !players.includes(n)),
              ])
            }
          >
            Restaurar ziztuz de la cuadrilla ↺
          </button>
        )}
      </div>

      <div className="label">Bloques</div>
      <div className="packs">
        {packs.map((p) => (
          <button
            key={p.id}
            className={`pack ${packId === p.id ? 'on' : ''}`}
            style={
              p.img
                ? {
                    background: `linear-gradient(160deg, ${p.g1}55, ${p.g2}55), linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,.62)), url('${p.img}') center/cover no-repeat, linear-gradient(140deg, ${p.g1}, ${p.g2})`,
                  }
                : { '--g1': p.g1, '--g2': p.g2 }
            }
            onClick={() => setPackId(p.id)}
          >
            <span className="pack-name">
              {p.flag && <span className="pack-flag">{p.flag}</span>}
              {p.name}
            </span>
            <span className="pack-count">
              {p.words.length} {p.words.length === 1 ? 'palabra' : 'palabras'}
            </span>
          </button>
        ))}
        <button className="pack pack-add" onClick={onEditor} aria-label="Crear bloque privado">
          <span className="pack-plus">+</span>
          <span className="pack-count">Nuevo bloque</span>
        </button>
      </div>

      <div className="label">Partida</div>
      <div className="card row-between">
        <div>
          <div className="row-title">Ziztupostors</div>
          <div className="row-sub">
            {imp} {imp === 1 ? 'ziztupostorra' : 'ziztupostors'} ·{' '}
            {Math.max(0, players.length - imp)} inocentes
          </div>
        </div>
        <div className="stepper">
          <button
            onClick={() => setImpostors(Math.max(1, imp - 1))}
            aria-label="Menos ziztupostors"
          >
            -
          </button>
          <b>{imp}</b>
          <button
            onClick={() => setImpostors(Math.min(maxImpostors, imp + 1))}
            aria-label="Más ziztupostors"
          >
            +
          </button>
        </div>
      </div>

      <div className="card row-between">
        <div>
          <div className="row-title">Pista para ziztupostor</div>
          <div className="row-sub">Recibe una pista de la palabra (o la categoría)</div>
        </div>
        <button
          className={`switch ${hint ? 'on' : ''}`}
          role="switch"
          aria-checked={hint}
          onClick={() => setHint(!hint)}
        >
          <span className="knob" />
        </button>
      </div>

      <div className="card">
        <div className="row-title">Tiempo de debate</div>
        <div className="optrow">
          {TIMER_OPTIONS.map((o) => (
            <button
              key={o.value}
              className={`pill ${timer === o.value ? 'on' : ''}`}
              onClick={() => setTimer(o.value)}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div className="cta">
        <button
          className="btn btn-accent btn-block"
          disabled={!ready}
          onClick={() =>
            onStart({ players, impostors: imp, packId: pack.id, hint, timer })
          }
        >
          {ready ? 'Empezar partida' : 'Añade al menos 3 ziztuz'}
        </button>
        <button className="btn btn-ghost btn-block" onClick={onScores}>
          Marcador de ziztupostor
        </button>
      </div>
    </div>
  )
}
