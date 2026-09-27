export function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function createRound(players, impostorCount, word, category, impostorHint) {
  const impostors = shuffle(players.map((_, i) => i)).slice(0, impostorCount)
  const start = Math.floor(Math.random() * players.length)
  return { players, impostors, word, category, impostorHint, start, votes: {} }
}

export function tally(votes) {
  const t = {}
  for (const s of Object.values(votes)) t[s] = (t[s] || 0) + 1
  return t
}

export function mostVoted(t) {
  let best = null
  let max = 0
  let tie = false
  for (const [k, v] of Object.entries(t)) {
    const i = Number(k)
    if (v > max) {
      max = v
      best = i
      tie = false
    } else if (v === max) {
      tie = true
    }
  }
  return { index: tie ? null : best, votes: max, tie }
}
