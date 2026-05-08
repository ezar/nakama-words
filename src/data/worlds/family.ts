import type { World } from '../words'

export const familyWorld: World = {
  id: 'family',
  label: 'FAMILY',
  name: 'Family 👨‍👩‍👧‍👦',
  emoji: '👨‍👩‍👧‍👦',
  berriesRequired: 1500,
  words: [
    { en: 'MOTHER',      es: 'MADRE',      ca: 'MARE',         hint: 'She takes care of you',           icon: '👩' },
    { en: 'FATHER',      es: 'PADRE',      ca: 'PARE',         hint: "He's your dad",                   icon: '👨' },
    { en: 'SISTER',      es: 'HERMANA',    ca: 'GERMANA',      hint: 'A girl in your family',           icon: '👧' },
    { en: 'BROTHER',     es: 'HERMANO',    ca: 'GERMÀ',        hint: 'A boy in your family',            icon: '👦' },
    { en: 'GRANDMOTHER', es: 'ABUELA',     ca: 'ÀVIA',         hint: "Your parent's mother",            icon: '👵' },
    { en: 'GRANDFATHER', es: 'ABUELO',     ca: 'AVI',          hint: "Your parent's father",            icon: '👴' },
    { en: 'BABY',        es: 'BEBÉ',       ca: 'BEBÈ',         hint: 'Very young child in the family',  icon: '👶' },
    { en: 'UNCLE',       es: 'TÍO',        ca: 'ONCLE',        hint: "Your parent's brother",           icon: '🧔' },
    { en: 'AUNT',        es: 'TÍA',        ca: 'TIA',          hint: "Your parent's sister",            icon: '👩‍🦱' },
    { en: 'COUSIN',      es: 'PRIMO',      ca: 'COSÍ',         hint: "Your aunt or uncle's child",      icon: '🧒' },
    { en: 'SON',         es: 'HIJO',       ca: 'FILL',         hint: 'A boy child',                     icon: '👦' },
    { en: 'DAUGHTER',    es: 'HIJA',       ca: 'FILLA',        hint: 'A girl child',                    icon: '👧' },
    { en: 'HUSBAND',     es: 'ESPOSO',     ca: 'MARIT',        hint: 'A married man',                   icon: '👨' },
    { en: 'WIFE',        es: 'ESPOSA',     ca: 'MULLER',       hint: 'A married woman',                 icon: '👩' },
    { en: 'FRIEND',      es: 'AMIGO',      ca: 'AMIC',         hint: 'Someone you like and trust',      icon: '🤝' },
  ],
}
