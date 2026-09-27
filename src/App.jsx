import { useCallback, useEffect, useMemo, useState } from 'react'
import Setup from './screens/Setup.jsx'
import Reveal from './screens/Reveal.jsx'
import Discuss from './screens/Discuss.jsx'
import Vote from './screens/Vote.jsx'
import Results from './screens/Results.jsx'
import PackEditor from './screens/PackEditor.jsx'
import Scores from './screens/Scores.jsx'
import { PACKS, normItem } from './data/packs.js'
import { createRound, mostVoted, tally } from './game.js'
import { useLocalStorage } from './hooks/useLocalStorage.js'
import { useWakeLock } from './hooks/useWakeLock.js'

const DEFAULT_GRADIENT = ['#c8a684', '#8a6f55']

export default function App() {
  const [screen, setScreen] = useState('setup')
  const [players, setPlayers] = useLocalStorage('zz.players', [])
  // El marcador es solo de la sesión: se reinicia al cerrar la web
  const [scores, setScores] = useState({})
  const [customPacks, setCustomPacks] = useLocalStorage('zz.customPacks', [])
  const [defaultPlayers, setDefaultPlayers] = useLocalStorage('zz.defaultPlayers', [])
  const [, setDefaultsApplied] = useLocalStorage('zz.defaultsApplied', false)
  const [privatePacks, setPrivatePacks] = useState(null)
  // Ziztuz de invitado: solo sesión, para no enseñar la lista guardada sin código
  const [guestPlayers, setGuestPlayers] = useState([])
  const [playerPhotos, setPlayerPhotos] = useState({})
  const [groupImg, setGroupImg] = useState(null)
  const [round, setRound] = useState(null)
  useWakeLock()

  // Aplica datos privados (de words.private.json en local o de /api/words
  // en la web desplegada). Acepta {packs, players}, un array, o {name, words}.
  const applyPrivateData = useCallback(
    (d) => {
      if (!d) return
      const raw = Array.isArray(d) ? d : d.packs || [d]
      const titleCase = (s) =>
        typeof s === 'string' && s.length
          ? s[0].toUpperCase() + s.slice(1).toLowerCase()
          : s
      const list = raw
        .map((pk) => ({
          id: pk.id || `priv-${pk.name}`,
          name: titleCase(pk.name) || 'Privado',
          img: pk.img || null,
          g1: pk.g1 || DEFAULT_GRADIENT[0],
          g2: pk.g2 || DEFAULT_GRADIENT[1],
          words: (Array.isArray(pk.words) ? pk.words : [])
            .map(normItem)
            .filter((x) => x.w && x.w.trim()),
        }))
        .filter((pk) => pk.words.length >= 3)
      if (list.length) setPrivatePacks(list)

      // Ziztuz predeterminadas (opcional, privado): solo se aplican una vez
      // y solo si la lista está vacía - luego se pueden quitar/añadir a mano.
      // Cada entrada puede ser "Nombre" o {name, img} (foto de perfil).
      const rawPlayers = Array.isArray(d.players) ? d.players : []
      const names = rawPlayers
        .map((p) => (typeof p === 'string' ? p : p?.name))
        .filter((n) => typeof n === 'string' && n.trim())
        .map((n) => n.trim().slice(0, 14))
      const photos = {}
      rawPlayers.forEach((p) => {
        if (p && typeof p === 'object' && p.name && p.img) {
          photos[p.name.trim()] = p.img
        }
      })
      setPlayerPhotos(photos)
      if (d.groupImg) setGroupImg(d.groupImg)
      if (names.length) setDefaultPlayers(names)
      const stored = (k, fb) => {
        try {
          return JSON.parse(localStorage.getItem(k)) ?? fb
        } catch {
          return fb
        }
      }
      const applied = stored('zz.defaultsApplied', false)
      const current = stored('zz.players', [])
      if (names.length && !applied && current.length === 0) {
        setPlayers(names)
        setDefaultsApplied(true)
      }
    },
    [setPlayers, setDefaultsApplied, setDefaultPlayers],
  )

  // En local: public/words.private.json (gitignored).
  // En la web: el código NO se guarda - hay que meterlo en cada sesión.
  useEffect(() => {
    // Limpieza de versiones que sí guardaban el desbloqueo
    localStorage.removeItem('zz.privateData')
    localStorage.removeItem('zz.code')
    localStorage.removeItem('zz.scores')
    fetch('words.private.json', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d) applyPrivateData(d)
      })
      .catch(() => {})
  }, [applyPrivateData])

  // Desbloqueo con código en la versión desplegada (Vercel /api/words)
  async function unlock(code) {
    try {
      const r = await fetch(`/api/words?code=${encodeURIComponent(code)}`)
      if (!r.ok) return false
      applyPrivateData(await r.json())
      return true
    } catch {
      return false
    }
  }

  const locked = !privatePacks?.length

  const packs = useMemo(() => {
    const base = privatePacks?.length ? privatePacks : PACKS
    // Con bloques privados se añade TODO MEZCLADO: todas las palabras juntas
    const mixed = privatePacks?.length
      ? [
          {
            id: 'todo-mezclado',
            name: 'Todo mezclado',
            img: 'patterns/rayos.jpg',
            g1: '#4a4a4e',
            g2: '#1c1c1e',
            // Cada palabra recuerda su bloque de origen para la categoría
            words: base.flatMap((p) =>
              p.words.map((w) => ({ ...normItem(w), cat: p.name })),
            ),
          },
        ]
      : []
    return [...mixed, ...base, ...customPacks]
  }, [customPacks, privatePacks])

  function startRound(cfg) {
    const pack = packs.find((p) => p.id === cfg.packId) ?? packs[0]
    const item = normItem(pack.words[Math.floor(Math.random() * pack.words.length)])
    const r = createRound(cfg.players, cfg.impostors, item.w, pack.name, cfg.hint)
    setRound({
      ...r,
      hint: item.h,
      packName: pack.name,
      packCat: item.cat || pack.name,
      packImg: pack.img || null,
      g1: pack.g1,
      g2: pack.g2,
      cfg,
    })
    setScreen('reveal')
  }

  function finishVotes(votes) {
    const t = tally(votes)
    const mv = mostVoted(t)
    const caught = !mv.tie && round.impostors.includes(mv.index)
    setRound({ ...round, votes, result: { caught, accused: mv.index, tie: mv.tie, tally: t } })
    setScores((prev) => {
      const next = { ...prev }
      round.players.forEach((p, i) => {
        const isImp = round.impostors.includes(i)
        const won = caught ? !isImp : isImp
        next[p] = (next[p] || 0) + (won ? (isImp ? 2 : 1) : 0)
      })
      return next
    })
    setScreen('results')
  }

  return (
    <div
      className="app"
      style={
        round
          ? {
              background: `linear-gradient(170deg, ${round.g1}38, ${round.g2}2b), #f1ede7`,
            }
          : undefined
      }
    >
      {screen === 'setup' && (
        <Setup
          key="setup"
          players={locked ? guestPlayers : players}
          setPlayers={locked ? setGuestPlayers : setPlayers}
          defaultPlayers={defaultPlayers}
          packs={packs}
          photos={playerPhotos}
          groupImg={groupImg}
          locked={locked}
          onUnlock={unlock}
          onStart={startRound}
          onEditor={() => setScreen('editor')}
          onScores={() => setScreen('scores')}
        />
      )}
      {screen === 'reveal' && round && (
        <Reveal
          key="reveal"
          round={round}
          photos={playerPhotos}
          onDone={() => setScreen('discuss')}
        />
      )}
      {screen === 'discuss' && round && (
        <Discuss key="discuss" round={round} onVote={() => setScreen('vote')} />
      )}
      {screen === 'vote' && round && (
        <Vote key="vote" round={round} photos={playerPhotos} onDone={finishVotes} />
      )}
      {screen === 'results' && round && (
        <Results
          key="results"
          round={round}
          scores={scores}
          onRematch={() => startRound(round.cfg)}
          onSetup={() => {
            setRound(null)
            setScreen('setup')
          }}
        />
      )}
      {screen === 'editor' && (
        <PackEditor
          key="editor"
          packs={customPacks}
          setPacks={setCustomPacks}
          otherPacks={privatePacks?.length ? privatePacks : PACKS}
          onBack={() => setScreen('setup')}
        />
      )}
      {screen === 'scores' && (
        <Scores
          key="scores"
          // Sin código no se muestran los nombres de la cuadrilla
          scores={
            locked
              ? Object.fromEntries(
                  Object.entries(scores).filter(([n]) => !defaultPlayers.includes(n)),
                )
              : scores
          }
          setScores={setScores}
          onBack={() => setScreen('setup')}
        />
      )}
    </div>
  )
}
