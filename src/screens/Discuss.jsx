import { useEffect, useRef, useState } from 'react'

const R = 52
const C = 2 * Math.PI * R

export default function Discuss({ round, onVote }) {
  const order = round.players.map((_, k) => (round.start + k) % round.players.length)
  const total = round.cfg.timer
  const [left, setLeft] = useState(total)
  const [run, setRun] = useState(total > 0)
  const done = total > 0 && left <= 0
  const buzzed = useRef(false)

  useEffect(() => {
    if (!run || done) return
    const id = setTimeout(() => setLeft((l) => l - 1), 1000)
    return () => clearTimeout(id)
  }, [run, left, total, done])

  useEffect(() => {
    if (done && !buzzed.current) {
      buzzed.current = true
      navigator.vibrate?.([60, 80, 60])
    }
    if (!done) buzzed.current = false
  }, [done])

  const pct = total ? Math.max(0, left) / total : 0
  const mm = Math.floor(Math.max(0, left) / 60)
  const ss = String(Math.max(0, left) % 60).padStart(2, '0')

  return (
    <div className="screen center">
      <div className="label-top">ronda de pistas</div>
      <p className="rules">
        Por turnos, cada una dice <b>una palabra o pista</b> relacionada con la palabra secreta.
        La ziztupostor finge que la conoce.
      </p>

      <div className="turn-card card">
        <div className="turn-kicker">empieza</div>
        <div className="turn-name">{round.players[round.start]}</div>
        <div className="chips">
          {order.map((idx, k) => (
            <span key={idx} className={`chip ${k === 0 ? 'first' : ''}`}>
              {round.players[idx]}
            </span>
          ))}
        </div>
      </div>

      {total > 0 && (
        <div className={`timer ${done ? 'done' : ''}`}>
          <svg viewBox="0 0 120 120">
            <circle cx="60" cy="60" r={R} className="ring-bg" />
            <circle
              cx="60"
              cy="60"
              r={R}
              className="ring-fg"
              style={!done && round.g2 ? { stroke: round.g2 } : undefined}
              strokeDasharray={C}
              strokeDashoffset={C * (1 - pct)}
            />
          </svg>
          <div className="timer-text">{done ? '¡YA!' : `${mm}:${ss}`}</div>
        </div>
      )}

      {total > 0 && (
        <div className="timer-btns">
          {done ? (
            <button
              className="btn btn-ghost"
              onClick={() => {
                setLeft(total)
                setRun(true)
              }}
            >
              Reiniciar
            </button>
          ) : (
            <button className="btn btn-ghost" onClick={() => setRun(!run)}>
              {run ? 'Pausar' : 'Seguir'}
            </button>
          )}
        </div>
      )}

      <button className="btn btn-accent btn-block cta" onClick={onVote}>
        {done ? '¡Tiempo! A votar' : 'Votar a ziztupostor'}
      </button>
    </div>
  )
}
