import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { WorldId, TargetLang } from '../data/words'
import { WORLDS } from '../data/words'
import { checkNewAchievements } from '../utils/achievementHelpers'
import { getRankForBerries } from '../utils/rankHelpers'

export interface Profile {
  id: string
  name: string
  berries: number
  totalCorrect: number
  maxEverStreak: number
  dailyStreak: number
  lastDailyDate: string | null
  unlockedWorlds: WorldId[]
  achievements: string[]
  createdAt: number
  wordProgress: Partial<Record<TargetLang, Partial<Record<WorldId, string[]>>>>
  wordStats: Partial<Record<TargetLang, Record<string, { c: number; w: number }>>>
  playedDates: string[]
}

interface ProfileState {
  profiles: Profile[]
  activeProfileId: string | null

  createProfile: (name: string) => void
  setActiveProfile: (id: string) => void
  deleteProfile: (id: string) => void
  getActiveProfile: () => Profile | null

  addBerries: (amount: number) => { newAchievements: string[]; rankedUp: boolean; newRankLabel: string; newlyUnlockedWorlds: WorldId[] }
  addCorrect: (count: number) => void
  updateMaxStreak: (streak: number) => void
  unlockWorld: (worldId: WorldId) => void
  completeDaily: (dateStr: string) => void
  grantAchievements: (ids: string[]) => void
  markWordsLearned: (worldId: WorldId, lang: TargetLang, wordKeys: string[]) => void
  recordWordStats: (lang: TargetLang, correct: string[], wrong: string[]) => void
  recordPlayedDate: (date: string) => void
}

function createEmptyProfile(name: string): Profile {
  return {
    id: crypto.randomUUID(),
    name,
    berries: 0,
    totalCorrect: 0,
    maxEverStreak: 0,
    dailyStreak: 0,
    lastDailyDate: null,
    unlockedWorlds: ['animals'],
    achievements: [],
    createdAt: Date.now(),
    wordProgress: {},
    wordStats: {},
    playedDates: [],
  }
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      profiles: [],
      activeProfileId: null,

      createProfile: (name) => {
        const profile = createEmptyProfile(name)
        set(s => ({ profiles: [...s.profiles, profile], activeProfileId: profile.id }))
      },

      setActiveProfile: (id) => set({ activeProfileId: id }),

      deleteProfile: (id) =>
        set(s => ({
          profiles: s.profiles.filter(p => p.id !== id),
          activeProfileId: s.activeProfileId === id ? null : s.activeProfileId,
        })),

      getActiveProfile: () => {
        const { profiles, activeProfileId } = get()
        return profiles.find(p => p.id === activeProfileId) ?? null
      },

      addBerries: (amount) => {
        const { profiles, activeProfileId } = get()
        const profile = profiles.find(p => p.id === activeProfileId)
        if (!profile) return { newAchievements: [], rankedUp: false, newRankLabel: '', newlyUnlockedWorlds: [] }

        const oldRank = getRankForBerries(profile.berries)
        const newBerries = profile.berries + amount
        const newRank = getRankForBerries(newBerries)
        const rankedUp = newRank.rank > oldRank.rank

        const newlyUnlockedWorlds = WORLDS
          .filter(w => w.berriesRequired > 0 && profile.berries < w.berriesRequired && newBerries >= w.berriesRequired)
          .map(w => w.id)

        const newAchievements = checkNewAchievements({
          berries: newBerries,
          totalCorrect: profile.totalCorrect,
          maxStreak: profile.maxEverStreak,
          dailyStreak: profile.dailyStreak,
          unlockedWorlds: profile.unlockedWorlds,
          completedDaily: profile.lastDailyDate !== null,
          earnedAchievements: profile.achievements,
        })

        set(s => ({
          profiles: s.profiles.map(p =>
            p.id === activeProfileId
              ? { ...p, berries: newBerries, achievements: [...p.achievements, ...newAchievements] }
              : p
          ),
        }))

        return { newAchievements, rankedUp, newRankLabel: newRank.label, newlyUnlockedWorlds }
      },

      addCorrect: (count) =>
        set(s => ({
          profiles: s.profiles.map(p =>
            p.id === s.activeProfileId
              ? { ...p, totalCorrect: p.totalCorrect + count }
              : p
          ),
        })),

      updateMaxStreak: (streak) =>
        set(s => ({
          profiles: s.profiles.map(p =>
            p.id === s.activeProfileId
              ? { ...p, maxEverStreak: Math.max(p.maxEverStreak, streak) }
              : p
          ),
        })),

      unlockWorld: (worldId) =>
        set(s => ({
          profiles: s.profiles.map(p =>
            p.id === s.activeProfileId && !p.unlockedWorlds.includes(worldId)
              ? { ...p, unlockedWorlds: [...p.unlockedWorlds, worldId] }
              : p
          ),
        })),

      completeDaily: (dateStr) =>
        set(s => ({
          profiles: s.profiles.map(p => {
            if (p.id !== s.activeProfileId) return p
            const yesterday = new Date()
            yesterday.setDate(yesterday.getDate() - 1)
            const yStr = yesterday.toISOString().slice(0, 10).replace(/-/g, '')
            const streak = p.lastDailyDate === yStr ? p.dailyStreak + 1 : 1
            return { ...p, dailyStreak: streak, lastDailyDate: dateStr }
          }),
        })),

      grantAchievements: (ids) =>
        set(s => ({
          profiles: s.profiles.map(p =>
            p.id === s.activeProfileId
              ? { ...p, achievements: [...new Set([...p.achievements, ...ids])] }
              : p
          ),
        })),

      markWordsLearned: (worldId, lang, wordKeys) =>
        set(s => ({
          profiles: s.profiles.map(p => {
            if (p.id !== s.activeProfileId) return p
            const progress = p.wordProgress ?? {}
            const langProgress = progress[lang] ?? {}
            const existing = langProgress[worldId] ?? []
            const merged = [...new Set([...existing, ...wordKeys])]
            return { ...p, wordProgress: { ...progress, [lang]: { ...langProgress, [worldId]: merged } } }
          }),
        })),

      recordWordStats: (lang, correct, wrong) =>
        set(s => ({
          profiles: s.profiles.map(p => {
            if (p.id !== s.activeProfileId) return p
            const stats = { ...(p.wordStats ?? {}) }
            const langStats = { ...(stats[lang] ?? {}) }
            for (const key of correct) {
              const prev = langStats[key] ?? { c: 0, w: 0 }
              langStats[key] = { c: prev.c + 1, w: prev.w }
            }
            for (const key of wrong) {
              const prev = langStats[key] ?? { c: 0, w: 0 }
              langStats[key] = { c: prev.c, w: prev.w + 1 }
            }
            return { ...p, wordStats: { ...stats, [lang]: langStats } }
          }),
        })),

      recordPlayedDate: (date) =>
        set(s => ({
          profiles: s.profiles.map(p =>
            p.id === s.activeProfileId && !(p.playedDates ?? []).includes(date)
              ? { ...p, playedDates: [...(p.playedDates ?? []), date] }
              : p
          ),
        })),
    }),
    { name: 'ph-profiles' },
  ),
)
