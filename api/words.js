// Función serverless (Vercel). Devuelve los bloques privados solo si el
// código coincide con la variable de entorno ZIZTU_CODE.
// Las palabras viven en ZIZTU_WORDS (JSON) - nunca en el bundle público.
// Las fotos de perfil viven en ZIZTU_IMG_<NOMBRE> (data URL) - se inyectan
// en cada jugadora si la variable existe; si no, se usa su img local o la
// inicial.
const slug = (s) =>
  String(s)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')

// Límite de intentos por IP: 8 fallos → bloqueada 10 min. El contador vive
// en la instancia de la función (se reinicia si se reutiliza otra).
const attempts = globalThis.__zzAttempts || (globalThis.__zzAttempts = new Map())
const WINDOW_MS = 10 * 60 * 1000
const MAX_FAILS = 8

export default function handler(req, res) {
  const expected = process.env.ZIZTU_CODE
  const data = process.env.ZIZTU_WORDS
  if (!expected || !data) {
    res.status(404).json({ error: 'no configurado' })
    return
  }
  const ip = String(req.headers['x-forwarded-for'] || 'anon').split(',')[0].trim()
  const now = Date.now()
  const rec = attempts.get(ip) || { n: 0, t: now }
  if (now - rec.t > WINDOW_MS) {
    rec.n = 0
    rec.t = now
  }
  if (rec.n >= MAX_FAILS) {
    res.status(429).json({ error: 'demasiados intentos, espera un rato' })
    return
  }
  const code = String(req.query.code || '').trim()
  if (code !== expected) {
    rec.n++
    attempts.set(ip, rec)
    res.status(401).json({ error: 'código incorrecto' })
    return
  }
  attempts.delete(ip)
  let parsed
  try {
    // Acepta JSON plano o base64 (este último no se corrompe al pegarlo)
    // Acepta JSON plano o base64; si se pegó la línea entera con el
    // prefijo "ZIZTU_WORDS=" también lo limpia.
    const clean = data.trim().replace(/^ZIZTU_WORDS=/, '').trim()
    const raw = clean.startsWith('{')
      ? clean
      : Buffer.from(clean, 'base64').toString('utf8')
    parsed = JSON.parse(raw)
  } catch {
    res.status(500).json({ error: 'ZIZTU_WORDS no es un JSON válido' })
    return
  }
  // Limpia el prefijo "ZIZTU_X=" por si se pegó la línea entera
  const val = (v) => v && v.trim().replace(/^ZIZTU_[A-Z0-9_]+=/, '')
  if (process.env.ZIZTU_GROUP_IMG) parsed.groupImg = val(process.env.ZIZTU_GROUP_IMG)
  if (Array.isArray(parsed.players)) {
    parsed.players = parsed.players.map((p) => {
      const name = typeof p === 'object' ? p?.name : p
      const img = name && val(process.env[`ZIZTU_IMG_${slug(name)}`])
      if (!img) return p
      return typeof p === 'object' ? { ...p, img } : { name: p, img }
    })
  }
  res.setHeader('Cache-Control', 'no-store')
  res.status(200).json(parsed)
}
