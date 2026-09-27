// Función serverless (Vercel). Devuelve los bloques privados solo si el
// código coincide con la variable de entorno ZIZTU_CODE.
// Las palabras viven en ZIZTU_WORDS (JSON) — nunca en el bundle público.
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
  res.setHeader('Cache-Control', 'no-store')
  res.status(200).json(JSON.parse(data))
}
