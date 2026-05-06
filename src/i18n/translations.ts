export type Lang = 'en' | 'es' | 'ca'

const T = {
  en: {
    appName: 'Palabra Hunter',
    play: 'PLAY',
    daily: 'DAILY CHALLENGE',
    achievements: 'ACHIEVEMENTS',
    ranking: 'RANKING',
    back: 'BACK',
    correct: 'CORRECT!',
    wrong: 'WRONG!',
    timeout: 'TIME\'S UP!',
    roundComplete: 'ROUND COMPLETE!',
    berriesEarned: 'Berries Earned',
    wordsLearned: 'Words Learned',
    playAgain: 'PLAY AGAIN',
    worldSelect: 'CHOOSE YOUR WORLD',
    locked: 'LOCKED',
    berriesNeeded: 'Berries needed',
    newProfile: 'NEW PIRATE',
    enterName: 'Enter your pirate name',
    start: 'START!',
    question: 'Question',
    of: 'of',
    selectProfile: 'Choose your pirate',
    rankUp: 'RANK UP!',
    newRank: 'You are now a',
    noProfiles: 'No pirates yet. Create one!',
    soundOn: 'Sound ON',
    soundOff: 'Sound OFF',
  },
  es: {
    appName: 'Cazador de Palabras',
    play: 'JUGAR',
    daily: 'DESAFÍO DIARIO',
    achievements: 'LOGROS',
    ranking: 'RANKING',
    back: 'ATRÁS',
    correct: '¡CORRECTO!',
    wrong: '¡INCORRECTO!',
    timeout: '¡TIEMPO!',
    roundComplete: '¡RONDA COMPLETA!',
    berriesEarned: 'Berries Ganadas',
    wordsLearned: 'Palabras Aprendidas',
    playAgain: 'JUGAR DE NUEVO',
    worldSelect: 'ELIGE TU MUNDO',
    locked: 'BLOQUEADO',
    berriesNeeded: 'Berries necesarias',
    newProfile: 'NUEVO PIRATA',
    enterName: 'Escribe tu nombre pirata',
    start: '¡EMPEZAR!',
    question: 'Pregunta',
    of: 'de',
    selectProfile: 'Elige tu pirata',
    rankUp: '¡SUBIDA DE RANGO!',
    newRank: 'Ahora eres',
    noProfiles: 'Sin piratas aún. ¡Crea uno!',
    soundOn: 'Sonido ON',
    soundOff: 'Sonido OFF',
  },
  ca: {
    appName: 'Caçador de Paraules',
    play: 'JUGAR',
    daily: 'REPTE DIARI',
    achievements: 'ASSOLIMENTS',
    ranking: 'RÀNQUING',
    back: 'ENRERE',
    correct: 'CORRECTE!',
    wrong: 'INCORRECTE!',
    timeout: 'TEMPS ESGOTAT!',
    roundComplete: 'RONDA COMPLETADA!',
    berriesEarned: 'Berries guanyades',
    wordsLearned: 'Paraules apreses',
    playAgain: 'JUGAR DE NOU',
    worldSelect: 'TRIA EL TEU MÓN',
    locked: 'BLOQUEDAT',
    berriesNeeded: 'Berries necessàries',
    newProfile: 'NOU PIRATA',
    enterName: 'Escriu el teu nom pirata',
    start: 'COMENÇA!',
    question: 'Pregunta',
    of: 'de',
    selectProfile: 'Tria el teu pirata',
    rankUp: 'PUJADA DE RANG!',
    newRank: 'Ara ets',
    noProfiles: 'Sense pirates encara. Crea\'n un!',
    soundOn: 'So ON',
    soundOff: 'So OFF',
  },
} as const

export type TranslationKey = keyof typeof T.en

export function detectLanguage(): Lang {
  const lang = navigator.language.split('-')[0]?.toLowerCase()
  if (lang === 'es') return 'es'
  if (lang === 'ca') return 'ca'
  return 'en'
}

type Translations = {
  [K in keyof typeof T.en]: string
}

export function getTranslations(lang: Lang): Translations {
  return T[lang] as Translations
}

export { T }
