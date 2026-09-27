import { useState } from 'react'
import Avatar from '../components/Avatar.jsx'

export default function Vote({ round, photos = {}, onDone }) {
  const [i, setI] = useState(0)
  const [stage, setStage] = useState('pass')
  const [votes, setVotes] = useState({})

  const name = round.players[i]
  const last = i === round.players.length - 1

  function choose(suspect) {
    const v = { ...votes, [i]: suspect }
    setVotes(v)
    navigator.vibrate?.(10)
    if (last) return onDone(v)
    setI(i + 1)
    setStage('pass')
  }

  if (stage === 'pass') {
    return (
      <div className="screen center">
        <div className="vote-banner">
          <img className="bolt" src="rayo.png" alt="" />
          VOTACIÓN
        </div>
        <div className="pass-kicker">
          {i + 1} de {round.players.length} · pasa el móvil a
        </div>
        <div className="pass-name">
          <Avatar name={name} i={i} img={photos[name]} big />
          {name}
        </div>
        <p className="peek-sub">Vota en secreto. Sin soplar.</p>
        <button className="btn btn-accent btn-block cta" onClick={() => setStage('choose')}>
          Soy {name}
        </button>
      </div>
    )
  }

  return (
    <div className="screen">
      <div className="label-top">voto de {name}</div>
      <img className="bolt bolt-q" src="rayo.png" alt="" />
      <h2 className="vote-q">¿Quién es ziztupostor?</h2>
      <div className="suspects">
        {round.players.map((p, j) =>
          j === i ? null : (
            <button key={p} className="suspect" onClick={() => choose(j)}>
              <Avatar name={p} i={j} img={photos[p]} />
              {p}
            </button>
          ),
        )}
      </div>
      <p className="peek-sub center-t">Tu voto es secreto hasta el final.</p>
    </div>
  )
}
