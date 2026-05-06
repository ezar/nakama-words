import { create } from 'zustand'
import type { WorldId, WordEntry } from '../data/words'
import type { Question } from '../engine/QuestionEngine'
import { generateQuestion, buildRound } from '../engine/QuestionEngine'
import { WORLD_MAP } from '../data/words'
import { calcQuestionScore } from '../utils/rankHelpers'
import { getDailyWords, DAILY_BERRY_MULTIPLIER } from '../config/daily'
import { todayString } from '../engine/rng'

export type Phase = 'start' | 'hub' | 'game' | 'result' | 'ranking' | 'achievements'

export interface RoundResult {
  score: number
  berriesEarned: number
  maxStreak: number
  correctWords: WordEntry[]
  wrongWords: WordEntry[]
  totalQuestions: number
}

interface GameState {
  phase: Phase
  currentWorldId: WorldId | null
  wordQueue: WordEntry[]
  currentQuestionIndex: number
  currentQuestion: Question | null
  score: number
  streak: number
  maxStreak: number
  isDaily: boolean
  correctWords: WordEntry[]
  wrongWords: WordEntry[]
  lastResult: RoundResult | null
  newAchievements: string[]
  rankedUp: boolean
  newRankLabel: string

  setPhase: (phase: Phase) => void
  startRound: (worldId: WorldId, isDaily?: boolean) => void
  loadQuestion: () => void
  answerQuestion: (answer: string) => boolean
  advanceQuestion: () => void
  finishRound: (berriesResult: { newAchievements: string[]; rankedUp: boolean; newRankLabel: string }) => void
  resetRound: () => void
  setNewAchievements: (ids: string[]) => void
}

export const useGameStore = create<GameState>()((set, get) => ({
  phase: 'start',
  currentWorldId: null,
  wordQueue: [],
  currentQuestionIndex: 0,
  currentQuestion: null,
  score: 0,
  streak: 0,
  maxStreak: 0,
  isDaily: false,
  correctWords: [],
  wrongWords: [],
  lastResult: null,
  newAchievements: [],
  rankedUp: false,
  newRankLabel: '',

  setPhase: (phase) => set({ phase }),

  startRound: (worldId, isDaily = false) => {
    const world = WORLD_MAP[worldId]
    let words: WordEntry[]

    if (isDaily) {
      words = getDailyWords(todayString())
    } else {
      words = buildRound(world)
    }

    const firstQuestion = generateQuestion(world, words[0]!)

    set({
      phase: 'game',
      currentWorldId: worldId,
      wordQueue: words,
      currentQuestionIndex: 0,
      currentQuestion: firstQuestion,
      score: 0,
      streak: 0,
      maxStreak: 0,
      isDaily,
      correctWords: [],
      wrongWords: [],
    })
  },

  loadQuestion: () => {
    const { wordQueue, currentQuestionIndex, currentWorldId } = get()
    if (!currentWorldId) return
    const world = WORLD_MAP[currentWorldId]
    const entry = wordQueue[currentQuestionIndex]
    if (!entry) return
    const question = generateQuestion(world, entry)
    set({ currentQuestion: question })
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
      correctWords: correct
        ? [...s.correctWords, currentQuestion.prompt]
        : s.correctWords,
      wrongWords: !correct
        ? [...s.wrongWords, currentQuestion.prompt]
        : s.wrongWords,
    }))

    return correct
  },

  advanceQuestion: () => {
    const { currentQuestionIndex, wordQueue, currentWorldId } = get()
    const nextIndex = currentQuestionIndex + 1

    if (nextIndex >= wordQueue.length || !currentWorldId) {
      return
    }

    const world = WORLD_MAP[currentWorldId]
    const nextEntry = wordQueue[nextIndex]!
    const nextQuestion = generateQuestion(world, nextEntry)

    set({
      currentQuestionIndex: nextIndex,
      currentQuestion: nextQuestion,
    })
  },

  finishRound: (berriesResult) => {
    const { score, maxStreak, correctWords, wrongWords, wordQueue, isDaily } = get()
    const multiplier = isDaily ? DAILY_BERRY_MULTIPLIER : 1
    const berriesEarned = score * multiplier

    set({
      phase: 'result',
      lastResult: {
        score,
        berriesEarned,
        maxStreak,
        correctWords,
        wrongWords,
        totalQuestions: wordQueue.length,
      },
      newAchievements: berriesResult.newAchievements,
      rankedUp: berriesResult.rankedUp,
      newRankLabel: berriesResult.newRankLabel,
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
      correctWords: [],
      wrongWords: [],
      lastResult: null,
      newAchievements: [],
      rankedUp: false,
    }),

  setNewAchievements: (ids) => set({ newAchievements: ids }),
}))
