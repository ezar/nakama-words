import type { World, WordEntry, TargetLang } from '../data/words'
import { WORLDS } from '../data/words'
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

export function findWorldForEntry(entry: WordEntry): World {
  return WORLDS.find(w => w.words.some(e => e.en === entry.en)) ?? WORLDS[0]!
}

export function generateQuestion(
  world: World,
  correctEntry: WordEntry,
  rng: RNG = Math.random,
  learnLang: TargetLang = 'es',
): Question {
  const correctTrans = correctEntry[learnLang] ?? correctEntry.es
  const pool = world.words.filter(w => (w[learnLang] ?? w.es) !== correctTrans)
  const shuffledPool = shuffleArray(pool, rng)
  const distractors = shuffledPool.slice(0, 3).map(w => w[learnLang] ?? w.es)

  const options = shuffleArray([correctTrans, ...distractors], rng)

  return {
    prompt: correctEntry,
    options,
    correctAnswer: correctTrans,
  }
}

export function buildRound(world: World, rng: RNG = Math.random): WordEntry[] {
  const shuffled = shuffleArray(world.words, rng)
  return shuffled.slice(0, 8)
}
