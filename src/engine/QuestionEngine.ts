import type { World, WordEntry } from '../data/words'
import type { RNG } from './rng'

export interface Question {
  prompt: WordEntry
  options: string[]
  correctAnswer: string
}

function shuffleArray<T>(arr: T[], rng: RNG): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    const tmp = a[i]
    a[i] = a[j]!
    a[j] = tmp!
  }
  return a
}

export function generateQuestion(
  world: World,
  correctEntry: WordEntry,
  rng: RNG = Math.random,
): Question {
  const pool = world.words.filter(w => w.es !== correctEntry.es)
  const shuffledPool = shuffleArray(pool, rng)
  const distractors = shuffledPool.slice(0, 3).map(w => w.es)

  const options = shuffleArray([correctEntry.es, ...distractors], rng)

  return {
    prompt: correctEntry,
    options,
    correctAnswer: correctEntry.es,
  }
}

export function buildRound(world: World, rng: RNG = Math.random): WordEntry[] {
  const shuffled = shuffleArray(world.words, rng)
  return shuffled.slice(0, 8)
}
