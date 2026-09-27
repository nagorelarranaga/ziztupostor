# ZIZTUPOSTOR

El juego del impostor hecho para ziztubizian. Una sola persona recibe
"ZIZTUPOSTORRA" mientras las demás ven una palabra secreta. Ronda de pistas,
debate, votación secreta y drama.

Se juega pasando un solo móvil. Mobile-first, estilo iOS.

## Jugar en local

```bash
npm install
npm run dev
```

Abre `http://localhost:5173` en el móvil (misma wifi: usa la IP que muestra Vite
con `npm run dev -- --host`).

## Cómo se juega

1. **Ziztuz**: añade los nombres (mínimo 3). Se quedan guardados en el móvil.
2. **Bloque**: elige una categoría o crea la vuestra.
3. **Revelación**: pasa el móvil una a una. Cada ziztuz **mantiene pulsado**
   para ver su papel en secreto y suelta para ocultarlo.
4. **Debate**: ronda de pistas por turnos, con temporizador opcional.
5. **Votación**: cada una vota en secreto quién cree que es la ziztupostorra.
6. **Resultado**: se revela la palabra, la(s) ziztupostorra(s) y el marcador.

## Puntuación

- Ziztubizian caza a la ziztupostorra → +1 a cada inocente.
- La ziztupostorra escapa → +2 a cada ziztupostorra.
- El marcador se guarda en el móvil entre partidas.

## Palabras privadas (IMPORTANTE)

El repo solo trae bloques **genéricos**. Vuestras palabras privadas tienen dos
vías, ninguna llega al repositorio:

1. **Editor en la app** (recomendado): "Crear un nuevo bloque privado" en la
   pantalla inicial. Se guarda en `localStorage` del móvil. Nada sale del
   dispositivo.
2. **Archivo local**: copia `public/words.private.example.json` a
   `public/words.private.json` y edítalo. Está en `.gitignore`, así que **nunca
   se sube a GitHub**. La app lo detecta sola al arrancar.

```json
{
  "players": [
    "Ziztuz 1",
    { "name": "Ziztuz 2", "img": "private/ziztuz2.jpg" },
    "Ziztuz 3"
  ],
  "packs": [
    {
      "id": "bloque1",
      "name": "NUESTRO BLOQUE",
      "img": "private/bloque1.jpg",
      "g1": "#c8a684",
      "g2": "#8a6f55",
      "words": [
        { "w": "Palabra uno", "h": "pista para la ziztupostorra" },
        { "w": "Palabra sin pista", "h": null },
        "También vale texto plano"
      ]
    }
  ]
}
```

- `players` (opcional): ziztuz predeterminadas. Se cargan la primera vez;
  después se pueden quitar/añadir en la app y se guardan en el móvil.
  Cada una puede ser `"Nombre"` o `{ "name": "Nombre", "img": "private/foto.jpg" }`
  para foto de perfil (las fotos van en `public/private/`, ignoradas por git).
- `packs`: lista de bloques. Si existen, **sustituyen** a los genéricos.
- `img` (opcional): estampado de la tarjeta. Usa `public/patterns/` para
  imágenes que sí pueden subir al repo (aparecen en la web desplegada) o
  `public/private/` para las que no.
- `g1`/`g2` (opcional): colores de la tarjeta, en hex.
- `h` es la **pista que ve la ziztupostorra** (opcional). También puedes usar
  `"word"`/`"hint"` como claves, o strings sin pista.

> Si haces `npm run build`, recuerda que `dist/` incluirá una copia de
> `words.private.json` y `public/private/` si existen. Para una versión
> pública, bórralos antes de compilar o usa solo el editor de la app.

## Desplegar en Vercel (con código)

La web pública no incluye las palabras privadas: se sirven desde la función
`api/words.js` solo si el código es correcto. Para desplegar:

1. Sube el repo a GitHub (puede ser público — no hay datos privados).
2. En Vercel: **Import project** → elige el repo → Deploy (detecta Vite solo).
3. Genera las variables ejecutando `npm run photoenv`. Escribe
   `public/private/vercel-env.txt` (ignorado por git) con todo listo.
4. En **Settings → Environment Variables** crea, desde ese archivo:
   - `ZIZTU_CODE` → el código que queráis (ej. `ziztu2024`)
   - `ZIZTU_WORDS` → el JSON completo de vuestras palabras
   - `ZIZTU_IMG_<NOMBRE>` → una por cada foto de perfil (data URL ya
     comprimida a avatar, generada por el script)
5. Redeploy. Listo: al abrir la web, el botón **"Tengo código →"** desbloquea
   los bloques privados **y las fotos de perfil**. Se guarda en cada móvil,
   solo se pide una vez.

Si una jugadora no tiene `ZIZTU_IMG_`, se muestra su inicial. Los estampados
(`public/patterns/`) sí se suben en el repo y se ven siempre.

## Tech

React 19 + Vite. Función serverless en `api/`. Todo el estado en el dispositivo
(`localStorage`). PWA: se puede "Añadir a pantalla de inicio" y mantiene la
pantalla encendida durante la partida.

## Publicar (estático, sin código)

```bash
npm run build   # genera dist/ — súbelo a Netlify/GitHub Pages
```

Sin función serverless no hay desbloqueo por código: solo los bloques
genéricos (más los creados en el editor de la app).
