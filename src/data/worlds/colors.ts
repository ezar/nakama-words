import type { World } from '../words'

export const colorsWorld: World = {
  id: 'colors',
  label: 'COLORS',
  name: 'Colors 🎨',
  emoji: '🎨',
  berriesRequired: 800,
  words: [
    { en: 'RED',    es: 'ROJO',     hint: 'Color of fire trucks',        icon: '🔴' },
    { en: 'BLUE',   es: 'AZUL',     hint: 'Color of the sky',            icon: '🔵' },
    { en: 'GREEN',  es: 'VERDE',    hint: 'Color of grass',              icon: '🟢' },
    { en: 'YELLOW', es: 'AMARILLO', hint: 'Color of the sun',            icon: '🟡' },
    { en: 'ORANGE', es: 'NARANJA',  hint: 'Color of a pumpkin',          icon: '🟠' },
    { en: 'PURPLE', es: 'MORADO',   hint: 'Mix of red and blue',         icon: '🟣' },
    { en: 'PINK',   es: 'ROSA',     hint: 'Light red, color of flamingos', icon: '🩷' },
    { en: 'WHITE',  es: 'BLANCO',   hint: 'Color of snow',               icon: '⬜' },
    { en: 'BLACK',  es: 'NEGRO',    hint: 'Color of night',              icon: '⬛' },
    { en: 'BROWN',  es: 'MARRÓN',   hint: 'Color of chocolate',          icon: '🟫' },
  ],
}
