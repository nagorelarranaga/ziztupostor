import { useState } from 'react'
import Avatar from '../components/Avatar.jsx'

export default function Reveal({ round, photos = {}, onDone }) {
  const [i, setI] = useState(0)
  const [stage, setStage] = useState('pass') // 'pass' | 'peek'
  const [show, setShow] = useState(false)
  const [seen, setSeen] = useState(false)

  const name = round.players[i]
  const impostor = round.impostors.includes(i)
  const last = i === round.players.length - 1

  function reveal(v) {
    setShow(v)
    if (v) {
      setSeen(true)
      navigator.vibrate?.(15)
    }
  }

  function next() {
    if (last) return onDone()
    setI(i + 1)
    setStage('pass')
    setSeen(false)
    setShow(false)
  }

  if (stage === 'pass') {
    return (
      <div className="screen center">
        <div className="pass-kicker">
          ziztu {i + 1} de {round.players.length} · pasa el móvil a
        </div>
        <div className="pass-name">
          <Avatar name={name} i={i} img={photos[name]} big />
          {name}
        </div>
        <p className="peek-sub">Solo {name} puede mirar su papel.</p>
        <button className="btn btn-primary btn-block cta" onClick={() => setStage('peek')}>
          Soy {name}
        </button>
      </div>
    )
  }

  return (
    <div className="screen center">
      <div
        className={`peek ${show ? 'show' : ''} ${impostor && show ? 'imp' : ''}`}
        style={
          show
            ? {
                borderColor: 'transparent',
                background: round.packImg
                  ? `linear-gradient(160deg, ${round.g1}${impostor ? '44' : '99'}, ${round.g2}${impostor ? '44' : '99'}), linear-gradient(180deg, rgba(0,0,0,${impostor ? '.62' : '.3'}), rgba(0,0,0,${impostor ? '.8' : '.55'})), url('${round.packImg}') center/cover`
                  : impostor
                    ? 'linear-gradient(150deg, #8a6f55, #3a2f26)'
                    : `linear-gradient(140deg, ${round.g1 || '#8a8a8e'}, ${round.g2 || '#3a3a3c'})`,
              }
            : undefined
        }
        onPointerDown={() => reveal(true)}
        onPointerUp={() => reveal(false)}
        onPointerLeave={() => reveal(false)}
        onPointerCancel={() => reveal(false)}
        onContextMenu={(e) => e.preventDefault()}
      >
        {show ? (
          impostor ? (
            <div className="peek-in">
              <img className="bolt bolt-imp" src="rayo.png" alt="" />
              <div className="word-big">ERES ZIZTUPOSTOR</div>
              {round.impostorHint && (
                <div className="hint-pill">
                  {round.hint
                    ? `Pista: ${round.hint}`
                    : `Categoría: ${round.packCat || round.category}`}
                </div>
              )}
              <p className="peek-sub">Disimula. Nadie puede saber que eres tú.</p>
            </div>
          ) : (
            <div className="peek-in">
              <div className="peek-kicker">tu palabra es</div>
              <div className="word-big">{round.word}</div>
              <div className="pack-tag">
                {round.packFlag ? `${round.packFlag} ` : ''}
                {round.packName}
              </div>
              <p className="peek-sub">Da pistas sin decirla. La ziztupostor no la conoce.</p>
            </div>
          )
        ) : (
          <div className="peek-in">
            <div className="hold-label">Mantén pulsado para ver</div>
            <p className="peek-sub">Suelta para ocultar · que nadie mire por encima</p>
          </div>
        )}
      </div>
      <button className="btn btn-primary btn-block cta" disabled={!seen} onClick={next}>
        {last ? 'Empezar el debate' : 'Ya lo vi · siguiente ziztu'}
      </button>
    </div>
  )
}
