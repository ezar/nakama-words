import type { World, WordEntry, TargetLang } from '../data/words'
import { WORLDS } from '../data/words'
import type { RNG } from './rng'

export interface Question {
  prompt: WordEntry
  options: string[]
  correctAnswer: string
  reversed: boolean
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
  reversed = false,
): Question {
  if (reversed) {
    const pool = world.words.filter(w => w.en !== correctEntry.en)
    const shuffledPool = shuffleArray(pool, rng)
    const distractors = shuffledPool.slice(0, 3).map(w => w.en)
    const options = shuffleArray([correctEntry.en, ...distractors], rng)
    return { prompt: correctEntry, options, correctAnswer: correctEntry.en, reversed: true }
  }

  const correctTrans = correctEntry[learnLang] ?? correctEntry.es
  const pool = world.words.filter(w => (w[learnLang] ?? w.es) !== correctTrans)
  const shuffledPool = shuffleArray(pool, rng)
  const distractors = shuffledPool.slice(0, 3).map(w => w[learnLang] ?? w.es)
  const options = shuffleArray([correctTrans, ...distractors], rng)

  return { prompt: correctEntry, options, correctAnswer: correctTrans, reversed: false }
}

export function buildRound(
  world: World,
  rng: RNG = Math.random,
  wordStats?: Record<string, { c: number; w: number }>,
): WordEntry[] {
  if (!wordStats || Object.keys(wordStats).length < 5) {
    return shuffleArray(world.words, rng).slice(0, 8)
  }

  // Weighted selection: lower accuracy → higher weight → appears more often
  const weighted = world.words.map(w => {
    const stat = wordStats[w.en]
    if (!stat) return { word: w, weight: 3 }
    const total = stat.c + stat.w
    const acc = total === 0 ? 1 : stat.c / total
    return { word: w, weight: Math.max(1, 4 - acc * 3) }
  })

  const selected: WordEntry[] = []
  const pool = [...weighted]

  while (selected.length < Math.min(8, pool.length)) {
    const totalWeight = pool.reduce((sum, item) => sum + item.weight, 0)
    let rand = rng() * totalWeight
    let chosen = 0
    for (let i = 0; i < pool.length; i++) {
      rand -= pool[i]!.weight
      if (rand <= 0) { chosen = i; break }
    }
    selected.push(pool[chosen]!.word)
    pool.splice(chosen, 1)
  }

  return shuffleArray(selected, rng)
}
