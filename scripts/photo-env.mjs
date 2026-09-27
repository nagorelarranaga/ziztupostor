// Genera las variables de entorno de Vercel con las fotos de perfil.
// Lee public/words.private.json, redimensiona cada foto de jugadora a
// avatar 256px webp y escribe public/private/vercel-env.txt con todo lo
// que hay que pegar en Settings → Environment Variables de Vercel.
// Uso: npm run photoenv
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import sharp from 'sharp'

const slug = (s) =>
  String(s)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')


const privateJson = join('public', 'words.private.json')
if (!existsSync(privateJson)) {
  console.error('No existe public/words.private.json')
  process.exit(1)
}
const data = JSON.parse(readFileSync(privateJson, 'utf8'))

const lines = [
  '# Pega estas variables en Vercel → Settings → Environment Variables.',
  '# Este archivo está en public/private/ (gitignored) — no se sube.',
  '',
  'ZIZTU_CODE=pon-aqui-vuestro-codigo',
  '',
]
lines.push(`ZIZTU_WORDS=${JSON.stringify(data)}`)
lines.push('')

for (const p of data.players || []) {
  const name = typeof p === 'object' ? p.name : p
  const img = typeof p === 'object' ? p.img : null
  if (!name || !img) continue
  const file = join('public', img)
  if (!existsSync(file)) {
    console.warn(`! ${name}: no existe ${file}, se omite`)
    continue
  }
  const buf = await sharp(file)
    .resize(256, 256, { fit: 'cover' })
    .webp({ quality: 75 })
    .toBuffer()
  const dataUrl = `data:image/webp;base64,${buf.toString('base64')}`
  if (dataUrl.length > 64000) {
    console.warn(`! ${name}: la foto queda en ${dataUrl.length} caracteres, cerca del límite`)
  }
  lines.push(`ZIZTU_IMG_${slug(name)}=${dataUrl}`)
  console.log(`${name}: ${img} → ${Math.round(dataUrl.length / 1024)} KB`)
}

const out = join('public', 'private', 'vercel-env.txt')
writeFileSync(out, lines.join('\n'))
console.log(`\nListo: ${out}`)
console.log('Pega cada línea como variable de entorno en Vercel y redeploy.')
