// Cada palabra lleva una pista: es lo que ve la ziztupostorra para disimular.
// Las pistas deben orientar sin revelar la palabra exacta.
const p = (w, h) => ({ w, h })

const comida = [
  p('Tortilla de patatas', 'huevos'),
  p('Pizza', 'Italia'),
  p('Paella', 'arroz'),
  p('Croquetas', 'rebozadas'),
  p('Churros', 'para mojar'),
  p('Sushi', 'Japón'),
  p('Hamburguesa', 'fast food'),
  p('Ensalada', 'healthy'),
  p('Tarta de queso', 'postre'),
  p('Gazpacho', 'se bebe frío'),
  p('Pulpo a la gallega', 'Galicia'),
  p('Macarrones', 'pasta'),
  p('Chocolate', 'dulce'),
  p('Helado', 'verano'),
  p('Pintxos', 'de bar en bar'),
]

const ciudad = [
  p('Playa', 'arena'),
  p('Museo', 'cuadros'),
  p('Cine', 'palomitas'),
  p('Aeropuerto', 'maletas'),
  p('Biblioteca', 'silencio'),
  p('Estadio', 'partido'),
  p('Hospital', 'urgencias'),
  p('Supermercado', 'carrito'),
  p('Parque de atracciones', 'montaña rusa'),
  p('Estación de tren', 'andén'),
  p('Camping', 'naturaleza'),
  p('Puerto', 'barcos'),
  p('Peluquería', 'tijeras'),
  p('Gimnasio', 'sudar'),
  p('Casa rural', 'escapada'),
]

const animales = [
  p('Pingüino', 'polo sur'),
  p('Elefante', 'trompa'),
  p('Jirafa', 'cuello largo'),
  p('Pulpo', 'ocho brazos'),
  p('Flamenco', 'rosa'),
  p('Koala', 'Australia'),
  p('Tiburón', 'película de miedo'),
  p('Gato', 'maúlla'),
  p('Perro', 'paseos'),
  p('Loro', 'repite todo'),
  p('Medusa', 'pica'),
  p('Caballo', 'se monta'),
  p('Erizo', 'púas'),
  p('Perezoso', 'muy lento'),
  p('Nutria', 'río'),
]

const casa = [
  p('Sofá', 'salón'),
  p('Nevera', 'en la cocina'),
  p('Escoba', 'barrer'),
  p('Espejo', 'reflejo'),
  p('Almohada', 'dormir'),
  p('Lavadora', 'ropa'),
  p('Microondas', 'en 2 minutos'),
  p('Manta', 'abrigarse'),
  p('Cortinas', 'ventana'),
  p('Vela', 'huele bien'),
  p('Planta', 'regar'),
  p('Cajón', 'guardar cosas'),
  p('Ventilador', 'calor'),
  p('Tetera', 'infusión'),
  p('Alfombra', 'en el suelo'),
]

const fiesta = [
  p('Cumpleaños', 'soplar velas'),
  p('Boda', 'vestido blanco'),
  p('Karaoke', 'micrófono'),
  p('Fiesta de disfraces', 'máscara'),
  p('Concierto', 'en directo'),
  p('Picnic', 'cesta y manta'),
  p('Nochevieja', 'uvas'),
  p('Despedida de soltera', 'antes de la boda'),
  p('Feria', 'casetas'),
  p('Verbena', 'en el pueblo'),
  p('Cena de empresa', 'compañeros de trabajo'),
  p('Amigo invisible', 'regalo secreto'),
  p('Cumple sorpresa', 'que no se entere'),
  p('Botellón', 'en el parque'),
  p('After', 'de madrugada'),
]

const profesiones = [
  p('Médica', 'bata blanca'),
  p('Profesora', 'en clase'),
  p('Bombera', 'fuego'),
  p('Chef', 'cocina'),
  p('Piloto', 'vuela'),
  p('Veterinaria', 'animales'),
  p('Policía', 'uniforme'),
  p('Cantante', 'escenario'),
  p('Fontanera', 'tuberías'),
  p('Astronauta', 'espacio'),
  p('Influencer', 'redes sociales'),
  p('Árbitra', 'silbato'),
  p('Traductora', 'idiomas'),
  p('Detective', 'investiga'),
  p('Peluquera', 'tijeras'),
]

const viajes = [
  p('Maleta', 'hacerla'),
  p('Pasaporte', 'frontera'),
  p('Avión', 'despegue'),
  p('Hotel con buffet', 'comida libre'),
  p('Mapa', 'orientarse'),
  p('Cámara de fotos', 'recuerdos'),
  p('Tren', 'vías'),
  p('Barco', 'mar'),
  p('Mochila', 'a la espalda'),
  p('Souvenir', 'recuerdo'),
  p('Crucero', 'de puerto en puerto'),
  p('Interrail', 'Europa'),
  p('Furgoneta camper', 'dormir dentro'),
  p('All inclusive', 'pulserita'),
  p('Escala de 8 horas', 'esperar'),
]

const cosasDeGroupi = [
  p('Group chat', '99+ mensajes'),
  p('Meme', 'humor'),
  p('Story', 'dura 24 horas'),
  p('Video llamada', 'por pantalla'),
  p('Audio de 5 minutos', 'chapa'),
  p('Quedada que nunca pasa', 'a ver si'),
  p('Plan de última hora', 'improvisado'),
  p('Spoiler', 'que no te lo cuenten'),
  p('Foto grupal', 'una más y ya'),
  p('Broma interna', 'solo nosotras'),
  p('Screenshot', 'la prueba'),
  p('Emoji de risa', 'reacción'),
  p('Directo', 'live'),
  p('Trend', 'viral'),
  p('Fiesta en casa', 'los vecinos'),
]

export const PACKS = [
  {
    id: 'mix',
    name: 'Todo mezclado',
    tag: 'clásico',
    g1: '#ff5f8f',
    g2: '#b06bff',
    words: [
      ...comida, ...ciudad, ...animales, ...casa,
      ...fiesta, ...profesiones, ...viajes, ...cosasDeGroupi,
    ],
  },
  { id: 'comida', name: 'Comida', g1: '#ff9f43', g2: '#ff5f6d', words: comida },
  { id: 'ciudad', name: 'Sitios', g1: '#0a84ff', g2: '#64d2ff', words: ciudad },
  { id: 'animales', name: 'Animales', g1: '#30d158', g2: '#66d4cf', words: animales },
  { id: 'casa', name: 'Cosas de casa', g1: '#bf5af2', g2: '#ff6482', words: casa },
  { id: 'fiesta', name: 'De fiesta', g1: '#ffd60a', g2: '#ff9f43', words: fiesta },
  { id: 'profesiones', name: 'Profesiones', g1: '#64d2ff', g2: '#0a84ff', words: profesiones },
  { id: 'viajes', name: 'Viajes', g1: '#ff6482', g2: '#ff9f43', words: viajes },
  { id: 'cuadrilla', name: 'Vida de ziztubizian', g1: '#b06bff', g2: '#64d2ff', words: cosasDeGroupi },
]

// Acepta strings o { w, h } / { word, hint } y devuelve { w, h|null }
export function normItem(item) {
  if (typeof item === 'string') return { w: item, h: null }
  const it = { w: item.w ?? item.word, h: item.h ?? item.hint ?? null }
  if (item.cat) it.cat = item.cat
  return it
}
