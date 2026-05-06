import { RANKS, type Rank } from '../config/ranks'

export function getRankForBerries(berries: number): Rank {
  let current = RANKS[0]!
  for (const rank of RANKS) {
    if (berries >= rank.berries) {
      current = rank
    }
  }
  return current
}

export function getNextRank(berries: number): Rank | null {
  const current = getRankForBerries(berries)
  const idx = RANKS.findIndex(r => r.rank === current.rank)
  return RANKS[idx + 1] ?? null
}

export function getRankProgress(berries: number): number {
  const current = getRankForBerries(berries)
  const next = getNextRank(berries)
  if (!next) return 1
  const range = next.berries - current.berries
  const progress = berries - current.berries
  return Math.min(1, progress / range)
}

export function calcQuestionScore(streak: number): number {
  const base = 10
  if (streak < 3) return base
  if (streak < 5) return Math.round(base * 1.5) // 15
  if (streak < 10) return base * 2               // 20
  return base * 3                                 // 30
}

export function getStreakMessage(streak: number): string {
  if (streak === 0) return '🎯 Ready to hunt words!'
  if (streak <= 2) return '🔥 Nice!'
  if (streak <= 4) return '🔥🔥 On fire!'
  if (streak <= 9) return '⚡ Gear Second!'
  return '👑 GEAR THIRD — LEGENDARY!'
}
