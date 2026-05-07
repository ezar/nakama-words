import { mulberry32, dateToSeed } from '../engine/rng'
import type { WordEntry } from '../data/words'
import { WORLDS } from '../data/words'

export const DAILY_QUESTION_COUNT = 8
export const DAILY_BERRY_MULTIPLIER = 3

export function getDailyWords(yyyymmdd: string): WordEntry[] {
  const seed = dateToSeed(yyyymmdd)
  const rng = mulberry32(seed)

  const allWords = WORLDS.flatMap(w => w.words)

  // Fisher-Yates with seeded rng
  const arr = [...allWords]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    const tmp = arr[i]!
    arr[i] = arr[j]!
    arr[j] = tmp
  }

  return arr.slice(0, DAILY_QUESTION_COUNT)
}
