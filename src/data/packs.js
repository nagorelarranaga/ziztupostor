// Cada palabra lleva una pista: es lo que ve la ziztupostorra para disimular.
// Las pistas deben orientar sin revelar la palabra exacta.
const p = (w, h) => ({ w, h })

const comida = [
  p('Tortilla de patatas', 'huevos'),
  p('Pizza', 'Italia'),
  p('Paella', 'arroz'),
  p('Croquetas', 'rebozado'),
  p('Churros', 'mojar'),
  p('Sushi', 'Japón'),
  p('Hamburguesa', 'fast food'),
  p('Ensalada', 'healthy'),
  p('Tarta de queso', 'postre'),
  p('Gazpacho', 'frío'),
  p('Pulpo', 'Galicia'),
  p('Macarrones', 'tipos diferentes'),
  p('Chocolate', '3 colores'),
  p('Helado', 'congelado'),
  p('Pintxos', 'de bar en bar'),
]

const ciudad = [
  p('Playa', 'piedra'),
  p('Museo', 'historia'),
  p('Cine', 'silla'),
  p('Aeropuerto', 'maleta'),
  p('Biblioteca', 'shh'),
  p('Estadio', 'gente'),
  p('Hospital', 'urgencias'),
  p('Supermercado', 'carro'),
  p('Parque de atracciones', 'muchas cosas'),
  p('Estación de tren', 'sentarse'),
  p('Camping', 'naturaleza'),
  p('Puerto', 'varadero'),
  p('Peluquería', 'tijeras'),
  p('Gimnasio', 'sudoroso'),
  p('Casa rural', 'escapada'),
]

const animales = [
  p('Pingüino', 'pico'),
  p('Elefante', 'trompa'),
  p('Jirafa', 'largo'),
  p('Pulpo', 'muchos brazos'),
  p('Flamenco', 'rosa'),
  p('Koala', 'Australia'),
  p('Tiburón', 'dientes'),
  p('Gato', 'casa'),
  p('Perro', 'paseos'),
  p('Loro', 'repeticiones'),
  p('Medusa', 'pica'),
  p('Caballo', 'montarse'),
  p('Erizo', 'púas'),
  p('Perezoso', 'lentillo'),
  p('Nutria', 'río'),
]

const casa = [
  p('Sofá', 'descanso'),
  p('Nevera', 'cocina'),
  p('Escoba', 'pelos'),
  p('Espejo', 'verse'),
  p('Almohada', 'apollo'),
  p('Lavadora', 'jabón'),
  p('Microondas', 'minutos'),
  p('Manta', 'abrigarse'),
  p('Cortinas', 'ventana'),
  p('Vela', 'olor'),
  p('Planta', 'agua'),
  p('Cajón', 'guardar'),
  p('Ventilador', 'calor'),
  p('Tetera', 'infusión'),
  p('Alfombra', 'suelo'),
]

const fiesta = [
  p('Cumpleaños', 'soplar'),
  p('Boda', 'blanco'),
  p('Karaoke', 'micrófono'),
  p('Fiesta de disfraces', 'máscara'),
  p('Concierto', 'directo'),
  p('Picnic', 'cesta y manta'),
  p('Nochevieja', 'uvas'),
  p('Despedida de soltera', 'antes de la boda'),
  p('Feria', 'casetas'),
  p('Verbena', 'pueblo'),
  p('Cena de empresa', 'compañeros'),
  p('Amigo invisible', 'secreto'),
  p('Cumple sorpresa', 'enterarse'),
  p('Botellón', 'bolsas'),
  p('After', 'madrugada'),
]

const profesiones = [
  p('Médica', 'blanco'),
  p('Profesora', 'pro'),
  p('Bombero', 'fuego'),
  p('Chef', 'cocina'),
  p('Piloto', 'volar'),
  p('Veterinaria', 'animal'),
  p('Policía', 'orden'),
  p('Cantante', 'escenario'),
  p('Fontanero', 'tuberías'),
  p('Astronauta', 'nave'),
  p('Influencer', 'redes sociales'),
  p('Árbitro', 'silbato'),
  p('Traductor', 'idiomas'),
  p('Detective', 'buscar'),
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
  p('Mochila', 'espalda'),
  p('Souvenir', 'recuerdo'),
  p('Crucero', 'puerto'),
  p('Interrail', 'Europa'),
  p('Furgoneta camper', 'dormir'),
  p('Escala', 'esperar'),
]

export const PACKS = [
  {
    id: 'mix',
    name: 'Todo mezclado',
    tag: 'clásico',
    g1: '#4a4a4e',
    g2: '#1c1c1e',
    img: 'patterns/rayos.jpg',
    words: [
      ...comida, ...ciudad, ...animales, ...casa,
      ...fiesta, ...profesiones, ...viajes,
    ],
  },
  { id: 'comida', name: 'Comida', g1: '#e8dcc8', g2: '#2f5d66', img: 'patterns/comida.jpg', words: comida },
  { id: 'ciudad', name: 'Sitios', g1: '#f2c0cc', g2: '#5d93b8', img: 'patterns/sitios.jpg', words: ciudad },
  { id: 'animales', name: 'Animales', g1: '#d6cba8', g2: '#4e6e48', img: 'patterns/animales.jpg', words: animales },
  { id: 'casa', name: 'Cosas de casa', g1: '#f0b4c2', g2: '#6e8fa3', img: 'patterns/casa.jpg', words: casa },
  { id: 'fiesta', name: 'De fiesta', g1: '#e2e2e7', g2: '#43434c', img: 'patterns/fiesta.jpg', words: fiesta },
  { id: 'profesiones', name: 'Profesiones', g1: '#d9cdf0', g2: '#7a5fa8', img: 'patterns/profesiones.jpg', words: profesiones },
  { id: 'viajes', name: 'Viajes', g1: '#f7cfe0', g2: '#4a7fae', img: 'patterns/viajes.png', words: viajes },
]

// Acepta strings o { w, h } / { word, hint } y devuelve { w, h|null }
export function normItem(item) {
  if (typeof item === 'string') return { w: item, h: null }
  const it = { w: item.w ?? item.word, h: item.h ?? item.hint ?? null }
  if (item.cat) it.cat = item.cat
  return it
}
