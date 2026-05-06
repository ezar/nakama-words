import type { World } from '../words'

export const animalsWorld: World = {
  id: 'animals',
  label: 'ANIMALS',
  name: 'Animals 🐾',
  emoji: '🦁',
  berriesRequired: 0,
  words: [
    { en: 'CAT',      es: 'GATO',     hint: 'It says meow...',             icon: '🐱' },
    { en: 'DOG',      es: 'PERRO',    hint: "Man's best friend",            icon: '🐶' },
    { en: 'BIRD',     es: 'PÁJARO',   hint: 'It has wings and sings',       icon: '🐦' },
    { en: 'FISH',     es: 'PEZ',      hint: 'Swims in water',               icon: '🐟' },
    { en: 'HORSE',    es: 'CABALLO',  hint: 'You can ride it',              icon: '🐴' },
    { en: 'RABBIT',   es: 'CONEJO',   hint: 'Has long ears, loves carrots', icon: '🐰' },
    { en: 'LION',     es: 'LEÓN',     hint: 'King of the jungle',           icon: '🦁' },
    { en: 'ELEPHANT', es: 'ELEFANTE', hint: 'Biggest land animal',          icon: '🐘' },
    { en: 'MONKEY',   es: 'MONO',     hint: 'Loves bananas, climbs trees',  icon: '🐒' },
    { en: 'TURTLE',   es: 'TORTUGA',  hint: 'Slow but steady',              icon: '🐢' },
  ],
}
