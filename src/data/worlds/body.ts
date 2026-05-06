import type { World } from '../words'

export const bodyWorld: World = {
  id: 'body',
  label: 'BODY',
  name: 'Body Parts 💪',
  emoji: '💪',
  berriesRequired: 3000,
  words: [
    { en: 'EYE',   es: 'OJO',     hint: 'You see with it',                        icon: '👁️' },
    { en: 'EAR',   es: 'OREJA',   hint: 'You hear with it',                       icon: '👂' },
    { en: 'NOSE',  es: 'NARIZ',   hint: 'You smell with it',                      icon: '👃' },
    { en: 'MOUTH', es: 'BOCA',    hint: 'You eat and talk with it',               icon: '👄' },
    { en: 'HAND',  es: 'MANO',    hint: 'Five fingers each',                      icon: '🖐️' },
    { en: 'FOOT',  es: 'PIE',     hint: 'At the end of your leg',                 icon: '🦶' },
    { en: 'HEAD',  es: 'CABEZA',  hint: 'Sits on top of your body',               icon: '🗣️' },
    { en: 'ARM',   es: 'BRAZO',   hint: 'Connects your hand to your shoulder',    icon: '💪' },
    { en: 'KNEE',  es: 'RODILLA', hint: 'Bends in the middle of your leg',        icon: '🦵' },
    { en: 'BACK',  es: 'ESPALDA', hint: 'The rear part of your body',             icon: '🔙' },
  ],
}
