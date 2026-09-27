// Genera las variables de entorno de Vercel con las fotos de perfil.
// Lee public/words.private.json, redimensiona cada foto de jugadora a
// avatar 256px webp y escribe public/private/vercel-env.txt con todo lo
// que hay que pegar en Settings → Environment Variables de Vercel.
// Uso: npm run photoenv
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
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
  '# Este archivo está en public/private/ (gitignored) - no se sube.',
  '',
  'ZIZTU_CODE=pon-aqui-vuestro-codigo',
  '',
]
// En base64: sin llaves ni comillas, imposible de corromper al pegar.
// El API lo decodifica igualmente.
lines.push(`ZIZTU_WORDS=${Buffer.from(JSON.stringify(data), 'utf8').toString('base64')}`)
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
  // Vercel limita a ~64KB el TOTAL de variables: los avatares se ven
  // pequeños (~90px), con 128px y calidad moderada sobra (~4-6KB cada uno).
  const dataUrl = await toDataUrl(file, 128, 62)
  if (dataUrl.length > 12000) {
    console.warn(`! ${name}: la foto queda en ${dataUrl.length} caracteres, demasiado grande`)
  }
  lines.push(`ZIZTU_IMG_${slug(name)}=${dataUrl}`)
  console.log(`${name}: ${img} → ${Math.round(dataUrl.length / 1024)} KB`)
}

// Foto de grupo de la pantalla inicial (data.groupImg). Baja tamaño y
// calidad hasta caber en el límite de ~64KB por variable de entorno.
if (data.groupImg) {
  const file = join('public', data.groupImg)
  if (existsSync(file)) {
    // Vercel limita a ~64KB el TOTAL de variables: reservamos ~24KB para
    // la foto de grupo (los ~40KB restantes van a palabras + 7 avatares)
    let dataUrl = null
    for (const [size, q] of [[400, 55], [360, 52], [320, 50], [280, 48]]) {
      dataUrl = await toDataUrl(file, size, q, false)
      if (dataUrl.length <= 24000) break
    }
    if (dataUrl.length > 24000) {
      console.warn(`! Foto de grupo: ${dataUrl.length} caracteres, sigue sin caber - recórtala`)
    } else {
      lines.push(`ZIZTU_GROUP_IMG=${dataUrl}`)
      console.log(`Grupo: ${data.groupImg} → ${Math.round(dataUrl.length / 1024)} KB`)
    }
  }
}

const out = join('public', 'private', 'vercel-env.txt')
writeFileSync(out, lines.join('\n'))

// Copia a prueba de errores: un .txt por variable con solo el valor
const envDir = join('public', 'private', 'env')
mkdirSync(envDir, { recursive: true })
for (const line of lines) {
  const eq = line.indexOf('=')
  if (eq > 0 && !line.startsWith('#')) {
    writeFileSync(join(envDir, `${line.slice(0, eq)}.txt`), line.slice(eq + 1))
  }
}

console.log(`\nListo: ${out} y valores sueltos en ${envDir}/`)
console.log('Pega cada línea como variable de entorno en Vercel y redeploy.')
