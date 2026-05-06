import type { World } from '../words'

export const familyWorld: World = {
  id: 'family',
  label: 'FAMILY',
  name: 'Family 👨‍👩‍👧‍👦',
  emoji: '👨‍👩‍👧‍👦',
  berriesRequired: 1500,
  words: [
    { en: 'MOTHER',      es: 'MADRE',    hint: 'She takes care of you',           icon: '👩' },
    { en: 'FATHER',      es: 'PADRE',    hint: "He's your dad",                   icon: '👨' },
    { en: 'SISTER',      es: 'HERMANA',  hint: 'A girl in your family',           icon: '👧' },
    { en: 'BROTHER',     es: 'HERMANO',  hint: 'A boy in your family',            icon: '👦' },
    { en: 'GRANDMOTHER', es: 'ABUELA',   hint: "Your parent's mother",            icon: '👵' },
    { en: 'GRANDFATHER', es: 'ABUELO',   hint: "Your parent's father",            icon: '👴' },
    { en: 'BABY',        es: 'BEBÉ',     hint: 'Very young child in the family',  icon: '👶' },
    { en: 'UNCLE',       es: 'TÍO',      hint: "Your parent's brother",           icon: '🧔' },
    { en: 'AUNT',        es: 'TÍA',      hint: "Your parent's sister",            icon: '👩‍🦱' },
    { en: 'COUSIN',      es: 'PRIMO',    hint: "Your aunt or uncle's child",      icon: '🧒' },
  ],
}
