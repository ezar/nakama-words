export type WorldId = 'animals' | 'food' | 'colors' | 'family' | 'body'

export interface WordEntry {
  en: string
  es: string
  hint: string
  icon: string
}

export interface World {
  id: WorldId
  label: string
  name: string
  emoji: string
  berriesRequired: number
  words: WordEntry[]
}

export { animalsWorld } from './worlds/animals'
export { foodWorld } from './worlds/food'
export { colorsWorld } from './worlds/colors'
export { familyWorld } from './worlds/family'
export { bodyWorld } from './worlds/body'

import { animalsWorld } from './worlds/animals'
import { foodWorld } from './worlds/food'
import { colorsWorld } from './worlds/colors'
import { familyWorld } from './worlds/family'
import { bodyWorld } from './worlds/body'

export const WORLDS: World[] = [
  animalsWorld,
  foodWorld,
  colorsWorld,
  familyWorld,
  bodyWorld,
]

export const WORLD_MAP: Record<WorldId, World> = {
  animals: animalsWorld,
  food: foodWorld,
  colors: colorsWorld,
  family: familyWorld,
  body: bodyWorld,
}
