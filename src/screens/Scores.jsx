import { useState } from 'react'

export default function Scores({ scores, setScores, onBack }) {
  const [confirm, setConfirm] = useState(false)
  const standings = Object.entries(scores).sort((a, b) => b[1] - a[1])

  return (
    <div className="screen">
      <div className="topbar">
        <button className="iconbtn" onClick={onBack} aria-label="Volver">
          ‹
        </button>
        <span className="topbar-title">Marcador</span>
        <span className="iconbtn ghost" />
      </div>

      {standings.length === 0 ? (
        <div className="empty-block">
          <p className="peek-sub">Todavía no hay puntos. Jugad una ronda.</p>
        </div>
      ) : (
        <div className="card">
          {standings.map(([n, s], k) => (
            <div key={n} className="score-row">
              <span className="score-pos">{k + 1}</span>
              <span className="score-name">{n}</span>
              <span className="score-pts">{s}</span>
            </div>
          ))}
        </div>
      )}

      {standings.length > 0 && (
        <div className="cta">
          {confirm ? (
            <button
              className="btn btn-ghost btn-block danger-t"
              onClick={() => {
                setScores({})
                setConfirm(false)
              }}
            >
              ¿Seguro? Toca otra vez para borrar
            </button>
          ) : (
            <button className="btn btn-ghost btn-block" onClick={() => setConfirm(true)}>
              Reiniciar marcador
            </button>
          )}
        </div>
      )}
    </div>
  )
}
