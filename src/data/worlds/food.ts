import type { World } from '../words'

export const foodWorld: World = {
  id: 'food',
  label: 'FOOD',
  name: 'Food 🍕',
  emoji: '🍕',
  berriesRequired: 300,
  words: [
    { en: 'APPLE',   es: 'MANZANA', hint: 'Red or green, crunchy fruit',     icon: '🍎' },
    { en: 'BREAD',   es: 'PAN',     hint: 'Made from flour and water',        icon: '🍞' },
    { en: 'MILK',    es: 'LECHE',   hint: 'Comes from a cow, white',          icon: '🥛' },
    { en: 'CHEESE',  es: 'QUESO',   hint: 'Made from milk, goes on pizza',    icon: '🧀' },
    { en: 'CHICKEN', es: 'POLLO',   hint: 'A common meat, not the animal',    icon: '🍗' },
    { en: 'RICE',    es: 'ARROZ',   hint: 'Tiny white grains',                icon: '🍚' },
    { en: 'EGG',     es: 'HUEVO',   hint: 'Comes from a hen',                 icon: '🥚' },
    { en: 'BANANA',  es: 'BANANA',  hint: 'Yellow and curved',                icon: '🍌' },
    { en: 'ORANGE',  es: 'NARANJA', hint: 'Citrus fruit, orange color',       icon: '🍊' },
    { en: 'PIZZA',   es: 'PIZZA',   hint: 'Italian with cheese on top',       icon: '🍕' },
  ],
}
