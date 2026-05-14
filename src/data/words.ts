export type WorldId =
  | 'animals' | 'food' | 'colors' | 'family' | 'body'
  | 'numbers' | 'clothes' | 'house' | 'school' | 'nature'
  | 'fruits' | 'vegetables' | 'sports' | 'emotions' | 'actions'
  | 'transport' | 'weather' | 'professions'

export interface WordEntry {
  en: string
  es: string
  ca?: string
  hint: string
  icon: string
}

export type TargetLang = 'es' | 'ca'

export interface World {
  id: WorldId
  label: string
  name: string
  emoji: string
  berriesRequired: number
  words: WordEntry[]
}

export { animalsWorld }    from './worlds/animals'
export { foodWorld }       from './worlds/food'
export { colorsWorld }     from './worlds/colors'
export { familyWorld }     from './worlds/family'
export { bodyWorld }       from './worlds/body'
export { numbersWorld }    from './worlds/numbers'
export { clothesWorld }    from './worlds/clothes'
export { houseWorld }      from './worlds/house'
export { schoolWorld }     from './worlds/school'
export { natureWorld }     from './worlds/nature'
export { fruitsWorld }     from './worlds/fruits'
export { vegetablesWorld } from './worlds/vegetables'
export { sportsWorld }     from './worlds/sports'
export { emotionsWorld }   from './worlds/emotions'
export { actionsWorld }    from './worlds/actions'
export { transportWorld }  from './worlds/transport'
export { weatherWorld }    from './worlds/weather'
export { professionsWorld } from './worlds/professions'

import { animalsWorld }    from './worlds/animals'
import { foodWorld }       from './worlds/food'
import { colorsWorld }     from './worlds/colors'
import { familyWorld }     from './worlds/family'
import { bodyWorld }       from './worlds/body'
import { numbersWorld }    from './worlds/numbers'
import { clothesWorld }    from './worlds/clothes'
import { houseWorld }      from './worlds/house'
import { schoolWorld }     from './worlds/school'
import { natureWorld }     from './worlds/nature'
import { fruitsWorld }     from './worlds/fruits'
import { vegetablesWorld } from './worlds/vegetables'
import { sportsWorld }     from './worlds/sports'
import { emotionsWorld }   from './worlds/emotions'
import { actionsWorld }    from './worlds/actions'
import { transportWorld }  from './worlds/transport'
import { weatherWorld }    from './worlds/weather'
import { professionsWorld } from './worlds/professions'

export const WORLDS: World[] = [
  animalsWorld,
  foodWorld,
  colorsWorld,
  familyWorld,
  bodyWorld,
  numbersWorld,
  clothesWorld,
  houseWorld,
  schoolWorld,
  natureWorld,
  fruitsWorld,
  vegetablesWorld,
  sportsWorld,
  emotionsWorld,
  actionsWorld,
  transportWorld,
  weatherWorld,
  professionsWorld,
]

export const WORLD_MAP: Record<WorldId, World> = {
  animals:    animalsWorld,
  food:       foodWorld,
  colors:     colorsWorld,
  family:     familyWorld,
  body:       bodyWorld,
  numbers:    numbersWorld,
  clothes:    clothesWorld,
  house:      houseWorld,
  school:     schoolWorld,
  nature:     natureWorld,
  fruits:     fruitsWorld,
  vegetables: vegetablesWorld,
  sports:     sportsWorld,
  emotions:   emotionsWorld,
  actions:    actionsWorld,
  transport:  transportWorld,
  weather:    weatherWorld,
  professions: professionsWorld,
}
