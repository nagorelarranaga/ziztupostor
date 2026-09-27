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

async function toDataUrl(file, size, quality, square = true) {
  const buf = await sharp(file)
    .resize(size, square ? size : null, {
      fit: 'cover',
      withoutEnlargement: true,
    })
    .webp({ quality })
    .toBuffer()
  return `data:image/webp;base64,${buf.toString('base64')}`
}

for (const p of data.players || []) {
  const name = typeof p === 'object' ? p.name : p
  const img = typeof p === 'object' ? p.img : null
  if (!name || !img) continue
  const file = join('public', img)
  if (!existsSync(file)) {
    console.warn(`! ${name}: no existe ${file}, se omite`)
    continue
  }
  const dataUrl = await toDataUrl(file, 256, 75)
  if (dataUrl.length > 64000) {
    console.warn(`! ${name}: la foto queda en ${dataUrl.length} caracteres, cerca del límite`)
  }
  lines.push(`ZIZTU_IMG_${slug(name)}=${dataUrl}`)
  console.log(`${name}: ${img} → ${Math.round(dataUrl.length / 1024)} KB`)
}

// Foto de grupo de la pantalla inicial (data.groupImg). Baja tamaño y
// calidad hasta caber en el límite de ~64KB por variable de entorno.
if (data.groupImg) {
  const file = join('public', data.groupImg)
  if (existsSync(file)) {
    let dataUrl = null
    for (const [size, q] of [[720, 62], [640, 58], [560, 55], [480, 52], [400, 50]]) {
      dataUrl = await toDataUrl(file, size, q, false)
      if (dataUrl.length <= 60000) break
    }
    if (dataUrl.length > 60000) {
      console.warn(`! Foto de grupo: ${dataUrl.length} caracteres, sigue sin caber — recórtala`)
    } else {
      lines.push(`ZIZTU_GROUP_IMG=${dataUrl}`)
      console.log(`Grupo: ${data.groupImg} → ${Math.round(dataUrl.length / 1024)} KB`)
    }
  }
}

const out = join('public', 'private', 'vercel-env.txt')
writeFileSync(out, lines.join('\n'))
console.log(`\nListo: ${out}`)
console.log('Pega cada línea como variable de entorno en Vercel y redeploy.')
