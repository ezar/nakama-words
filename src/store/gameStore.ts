import { create } from 'zustand'
import type { WorldId, WordEntry } from '../data/words'
import type { Question } from '../engine/QuestionEngine'
import { generateQuestion, buildRound, findWorldForEntry } from '../engine/QuestionEngine'
import { WORLD_MAP } from '../data/words'
import { useSettingsStore } from './settingsStore'
import { useProfileStore } from './profileStore'
import { calcQuestionScore } from '../utils/rankHelpers'
import { getDailyWords, DAILY_BERRY_MULTIPLIER } from '../config/daily'
import { todayString } from '../engine/rng'

export type Phase = 'start' | 'hub' | 'game' | 'result' | 'ranking' | 'achievements' | 'progress'
export type GameMode = 'normal' | 'survival' | 'reverse'

export interface RoundResult {
  score: number
  berriesEarned: number
  maxStreak: number
  correctWords: WordEntry[]
  wrongWords: WordEntry[]
  totalQuestions: number
  perfectBonus: number
  newlyUnlockedWorlds: WorldId[]
  gameOver: boolean
}

interface GameState {
  phase: Phase
  gameMode: GameMode
  currentWorldId: WorldId | null
  wordQueue: WordEntry[]
  currentQuestionIndex: number
  currentQuestion: Question | null
  score: number
  streak: number
  maxStreak: number
  lives: number
  isDaily: boolean
  correctWords: WordEntry[]
  wrongWords: WordEntry[]
  lastResult: RoundResult | null
  newAchievements: string[]
  rankedUp: boolean
  newRankLabel: string

  setPhase: (phase: Phase) => void
  setGameMode: (mode: GameMode) => void
  startRound: (worldId: WorldId, isDaily?: boolean) => void
  answerQuestion: (answer: string) => boolean
  loseLife: () => boolean
  advanceQuestion: () => void
  finishRound: (opts: { newAchievements: string[]; rankedUp: boolean; newRankLabel: string; newlyUnlockedWorlds: WorldId[]; perfectBonus: number; gameOver?: boolean }) => void
  resetRound: () => void
  setNewAchievements: (ids: string[]) => void
}

export const useGameStore = create<GameState>()((set, get) => ({
  phase: 'start',
  gameMode: 'normal',
  currentWorldId: null,
  wordQueue: [],
  currentQuestionIndex: 0,
  currentQuestion: null,
  score: 0,
  streak: 0,
  maxStreak: 0,
  lives: 3,
  isDaily: false,
  correctWords: [],
  wrongWords: [],
  lastResult: null,
  newAchievements: [],
  rankedUp: false,
  newRankLabel: '',

  setPhase: (phase) => set({ phase }),
  setGameMode: (gameMode) => set({ gameMode }),

  startRound: (worldId, isDaily = false) => {
    const { gameMode } = get()
    const world = WORLD_MAP[worldId]
    const learnLang = useSettingsStore.getState().learnLang
    const reversed = gameMode === 'reverse'

    let words: WordEntry[]
    if (isDaily) {
      words = getDailyWords(todayString())
    } else {
      const profile = useProfileStore.getState().getActiveProfile()
      const wordStats = profile?.wordStats?.[learnLang]
      words = buildRound(world, Math.random, wordStats ?? undefined)
    }

    const firstEntry = words[0]!
    const firstWorld = isDaily ? findWorldForEntry(firstEntry) : world
    const firstQuestion = generateQuestion(firstWorld, firstEntry, Math.random, learnLang, reversed)

    set({
      phase: 'game',
      currentWorldId: worldId,
      wordQueue: words,
      currentQuestionIndex: 0,
      currentQuestion: firstQuestion,
      score: 0,
      streak: 0,
      maxStreak: 0,
      lives: 3,
      isDaily,
      correctWords: [],
      wrongWords: [],
    })
  },

  answerQuestion: (answer) => {
    const { currentQuestion, streak, maxStreak } = get()
    if (!currentQuestion) return false

    const correct = answer === currentQuestion.correctAnswer
    const newStreak = correct ? streak + 1 : 0
    const points = correct ? calcQuestionScore(streak) : 0

    set(s => ({
      score: s.score + points,
      streak: newStreak,
      maxStreak: Math.max(maxStreak, newStreak),
      correctWords: correct ? [...s.correctWords, currentQuestion.prompt] : s.correctWords,
      wrongWords: !correct ? [...s.wrongWords, currentQuestion.prompt] : s.wrongWords,
    }))

    return correct
  },

  loseLife: () => {
    const { lives } = get()
    const newLives = lives - 1
    set({ lives: newLives })
    return newLives <= 0
  },

  advanceQuestion: () => {
    const { currentQuestionIndex, wordQueue, currentWorldId, isDaily, gameMode } = get()
    const nextIndex = currentQuestionIndex + 1
    if (nextIndex >= wordQueue.length || !currentWorldId) return

    const nextEntry = wordQueue[nextIndex]!
    const world = isDaily ? findWorldForEntry(nextEntry) : WORLD_MAP[currentWorldId]
    const learnLang = useSettingsStore.getState().learnLang
    const reversed = gameMode === 'reverse'
    const nextQuestion = generateQuestion(world, nextEntry, Math.random, learnLang, reversed)

    set({ currentQuestionIndex: nextIndex, currentQuestion: nextQuestion })
  },

  finishRound: ({ newAchievements, rankedUp, newRankLabel, newlyUnlockedWorlds, perfectBonus, gameOver = false }) => {
    const { score, maxStreak, correctWords, wrongWords, wordQueue, isDaily } = get()
    const multiplier = isDaily ? DAILY_BERRY_MULTIPLIER : 1
    const berriesEarned = (score + perfectBonus) * multiplier

    set({
      phase: 'result',
      lastResult: {
        score,
        berriesEarned,
        maxStreak,
        correctWords,
        wrongWords,
        totalQuestions: wordQueue.length,
        perfectBonus,
        newlyUnlockedWorlds,
        gameOver,
      },
      newAchievements,
      rankedUp,
      newRankLabel,
    })
  },

  resetRound: () =>
    set({
      currentWorldId: null,
      wordQueue: [],
      currentQuestionIndex: 0,
      currentQuestion: null,
      score: 0,
      streak: 0,
      maxStreak: 0,
      lives: 3,
      correctWords: [],
      wrongWords: [],
      lastResult: null,
      newAchievements: [],
      rankedUp: false,
    }),

  setNewAchievements: (ids) => set({ newAchievements: ids }),
}))
