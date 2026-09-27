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

export default function handler(req, res) {
  const expected = process.env.ZIZTU_CODE
  const data = process.env.ZIZTU_WORDS
  if (!expected || !data) {
    res.status(404).json({ error: 'no configurado' })
    return
  }
  if (!req.query.code || req.query.code !== expected) {
    res.status(401).json({ error: 'código incorrecto' })
    return
  }
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
  if (process.env.ZIZTU_GROUP_IMG) parsed.groupImg = process.env.ZIZTU_GROUP_IMG
  if (Array.isArray(parsed.players)) {
    parsed.players = parsed.players.map((p) => {
      const name = typeof p === 'object' ? p?.name : p
      const img = name && process.env[`ZIZTU_IMG_${slug(name)}`]
      if (!img) return p
      return typeof p === 'object' ? { ...p, img } : { name: p, img }
    })
  }
  res.setHeader('Cache-Control', 'no-store')
  res.status(200).json(parsed)
}
