export default function Results({ round, scores, onRematch, onSetup }) {
  const { result } = round
  const impostorNames = round.impostors.map((i) => round.players[i])
  const maxVotes = Math.max(1, ...Object.values(result.tally))
  const accusedName = result.accused != null ? round.players[result.accused] : null
  const standings = Object.entries(scores).sort((a, b) => b[1] - a[1])

  return (
    <div className="screen">
      <div className={`outcome ${result.caught ? 'win' : 'lose'}`}>
        <div className="outcome-kicker">
          {result.caught ? 'cazada' : result.tie ? 'empate en la votación' : 'se escapó'}
        </div>
        {!result.caught && <img className="bolt bolt-outcome" src="rayo.png" alt="" />}
        <h2 className="outcome-title">
          {result.caught ? 'Ziztubizian gana' : 'Gana la ziztupostorra'}
        </h2>
        {accusedName && (
          <p className="outcome-sub">
            La más votada: <b>{accusedName}</b>
          </p>
        )}
      </div>

      <div className="card reveal-word">
        <div className="row-sub">la palabra era</div>
        <div className="word-big">{round.word}</div>
      </div>

      <div className="card">
        <div className="row-sub">
          {round.impostors.length === 1 ? 'la ziztupostorra era' : 'las ziztupostorras eran'}
        </div>
        <div className="imps">
          {impostorNames.map((n) => (
            <span key={n} className="imp-chip">
              {n}
            </span>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="row-title">Votos</div>
        {round.players.map((p, i) => {
          const v = result.tally[i] || 0
          return (
            <div key={p} className="tally-row">
              <span className="tally-name">{p}</span>
              <div className="tally-track">
                <div
                  className={`tally-bar ${round.impostors.includes(i) ? 'imp' : ''}`}
                  style={{ width: `${(v / maxVotes) * 100}%` }}
                />
              </div>
              <span className="tally-n">{v}</span>
            </div>
          )
        })}
      </div>

      {standings.length > 0 && (
        <div className="card">
          <div className="row-title">Marcador</div>
          {standings.map(([n, s], k) => (
            <div key={n} className="score-row">
              <span className="score-pos">{k + 1}</span>
              <span className="score-name">{n}</span>
              <span className="score-pts">{s}</span>
            </div>
          ))}
        </div>
      )}

      <div className="cta">
        <button className="btn btn-accent btn-block" onClick={onRematch}>
          Otra ronda
        </button>
        <button className="btn btn-ghost btn-block" onClick={onSetup}>
          Volver al inicio
        </button>
      </div>
    </div>
  )
}
