import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { useProfileStore } from '../store/profileStore'
import { useSettingsStore } from '../store/settingsStore'
import { WordCard } from '../components/WordCard'
import { TimerRing } from '../components/TimerRing'
import { OptionsGrid } from '../components/OptionsGrid'
import { ParticleEmitter } from '../components/ParticleEmitter'
import { soundEngine } from '../audio/SoundEngine'
import { vibrate, HapticPattern } from '../utils/haptics'
import { getTranslations } from '../i18n/translations'
import { todayString } from '../engine/rng'

const ADVANCE_DELAY = 1600
const QUESTION_DURATION = 10
const PERFECT_BONUS = 50

const STREAK_MILESTONES: Record<number, { label: string; color: string }> = {
  3:  { label: '🔥 ON FIRE!',               color: 'text-orange-400' },
  5:  { label: '⚡ GEAR SECOND!',            color: 'text-op-cyan' },
  10: { label: '👑 GEAR THIRD — LEGENDARY!', color: 'text-op-gold' },
}

export function GameScreen() {
  const {
    currentQuestion, currentQuestionIndex, wordQueue,
    score, streak, isDaily, currentWorldId, gameMode, lives,
    answerQuestion, loseLife, advanceQuestion, finishRound,
  } = useGameStore()

  const { addBerries, addCorrect, updateMaxStreak, completeDaily, markWordsLearned, recordWordStats, recordPlayedDate } = useProfileStore()
  const { language, learnLang } = useSettingsStore()
  const t = getTranslations(language)

  const [selected, setSelected] = useState<string | null>(null)
  const [timerRunning, setTimerRunning] = useState(true)
  const [timerKey, setTimerKey] = useState(0)
  const [feedbackCorrect, setFeedbackCorrect] = useState<boolean | null>(null)
  const [particleTrigger, setParticleTrigger] = useState(false)
  const [milestoneBanner, setMilestoneBanner] = useState<string | null>(null)
  const [milestoneColor, setMilestoneColor] = useState('text-op-gold')
  const [survivorDead, setSurvivorDead] = useState(false)

  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const shownMilestones = useRef(new Set<number>())

  const totalQuestions = wordQueue.length
  const doAdvance = useCallback((forcedGameOver = false) => {
    const { currentQuestionIndex: idx, wordQueue: q, maxStreak, correctWords, score: finalScore, gameMode } = useGameStore.getState()
    const isGameOver = forcedGameOver || survivorDead
    const isOver = isGameOver || (idx >= q.length - 1 && gameMode !== 'survival')

    if (isOver) {
      const perfectBonus = !isGameOver && correctWords.length === q.length ? PERFECT_BONUS : 0
      updateMaxStreak(maxStreak)
      addCorrect(correctWords.length)
      if (isDaily) completeDaily(todayString())
      if (!isDaily && currentWorldId) {
        const { learnLang: ll } = useSettingsStore.getState()
        markWordsLearned(currentWorldId, ll, correctWords.map(w => w.en))
      }
      const { learnLang: ll } = useSettingsStore.getState()
      const { wrongWords } = useGameStore.getState()
      recordWordStats(ll, correctWords.map(w => w.en), wrongWords.map(w => w.en))
      recordPlayedDate(todayString())
      const berriesResult = addBerries(finalScore + perfectBonus)
      finishRound({ ...berriesResult, perfectBonus, gameOver: isGameOver })
    } else {
      advanceQuestion()
      setSelected(null)
      setFeedbackCorrect(null)
      setTimerKey(k => k + 1)
      setTimerRunning(true)
    }
  }, [survivorDead, advanceQuestion, finishRound, addBerries, addCorrect, updateMaxStreak, isDaily, completeDaily, currentWorldId, markWordsLearned, recordWordStats, recordPlayedDate])

  const handleSelect = useCallback((option: string) => {
    if (selected !== null) return
    setTimerRunning(false)
    setSelected(option)

    const correct = answerQuestion(option)
    setFeedbackCorrect(correct)

    if (correct) {
      soundEngine.playCorrect()
      vibrate(HapticPattern.correct)
      setParticleTrigger(true)
      setTimeout(() => setParticleTrigger(false), 50)

      const { streak: newStreak } = useGameStore.getState()
      if (newStreak >= 5) soundEngine.playStreak()

      const milestone = STREAK_MILESTONES[newStreak]
      if (milestone && !shownMilestones.current.has(newStreak)) {
        shownMilestones.current.add(newStreak)
        vibrate(HapticPattern.streak)
        setMilestoneBanner(milestone.label)
        setMilestoneColor(milestone.color)
        setTimeout(() => setMilestoneBanner(null), 1800)
      }
    } else {
      soundEngine.playWrong()
      vibrate(HapticPattern.wrong)
      if (gameMode === 'survival') {
        const dead = loseLife()
        if (dead) {
          setSurvivorDead(true)
          advanceTimer.current = setTimeout(() => doAdvance(true), ADVANCE_DELAY)
          return
        }
      }
    }

    advanceTimer.current = setTimeout(() => doAdvance(), ADVANCE_DELAY)
  }, [selected, answerQuestion, loseLife, gameMode, doAdvance])

  const handleTimeout = useCallback(() => {
    if (selected !== null) return
    setTimerRunning(false)
    setSelected('__timeout__')
    setFeedbackCorrect(false)
    answerQuestion('')
    soundEngine.playWrong()
    vibrate(HapticPattern.wrong)
    if (gameMode === 'survival') {
      const dead = loseLife()
      if (dead) {
        setSurvivorDead(true)
        advanceTimer.current = setTimeout(() => doAdvance(true), ADVANCE_DELAY)
        return
      }
    }
    advanceTimer.current = setTimeout(() => doAdvance(), ADVANCE_DELAY)
  }, [selected, answerQuestion, loseLife, gameMode, doAdvance])

  // Keyboard 1–4
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!currentQuestion) return
      const idx = ['1', '2', '3', '4'].indexOf(e.key)
      if (idx !== -1 && currentQuestion.options[idx]) handleSelect(currentQuestion.options[idx]!)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [currentQuestion, handleSelect])

  useEffect(() => {
    setSelected(null)
    setFeedbackCorrect(null)
    setTimerRunning(true)
  }, [currentQuestionIndex])

  useEffect(() => {
    return () => { if (advanceTimer.current) clearTimeout(advanceTimer.current) }
  }, [])

  if (!currentQuestion) return null

  const answeredCount = currentQuestionIndex + (selected !== null ? 1 : 0)
  const isSurvival = gameMode === 'survival'
  const isReverse = gameMode === 'reverse'

  return (
    <div className="flex flex-col h-full bg-op-ocean-dark px-4 pt-5 pb-6">
      <ParticleEmitter trigger={particleTrigger} />

      {/* Streak milestone banner */}
      <AnimatePresence>
        {milestoneBanner && (
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="fixed top-0 inset-x-0 z-50 flex justify-center pt-safe pt-3 pointer-events-none"
          >
            <div className={`bg-op-ocean-dark border-4 border-op-gold rounded-2xl px-6 py-3 shadow-manga font-title text-2xl ${milestoneColor}`}>
              {milestoneBanner}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── TOP BAR: streak · lives · score ── */}
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <AnimatePresence mode="wait">
          <motion.span
            key={streak}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            className="font-body text-sm text-op-gold"
            aria-live="polite"
          >
            {streak > 0 ? `🔥 ×${streak}` : '🎯 Ready!'}
          </motion.span>
        </AnimatePresence>

        {isSurvival && (
          <div className="flex gap-1">
            {[0, 1, 2].map(i => (
              <motion.span
                key={i}
                animate={i === lives ? { scale: [1, 1.3, 0.8] } : {}}
                className={`text-xl ${i < lives ? 'opacity-100' : 'opacity-20 grayscale'}`}
              >
                ❤️
              </motion.span>
            ))}
          </div>
        )}

        <motion.div
          key={score}
          initial={{ scale: 1.35 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400 }}
          className="font-title text-2xl text-op-gold"
        >
          🍇 {score}
        </motion.div>
      </div>

      {/* ── PROGRESS DOTS / SURVIVAL COUNTER ── */}
      {isSurvival ? (
        <div className="flex justify-center mb-3 flex-shrink-0">
          <span className="font-title text-op-gold/60 text-sm tracking-widest">
            Q{answeredCount}
          </span>
        </div>
      ) : (
        <div className="flex gap-1.5 justify-center mb-3 flex-shrink-0">
          {Array.from({ length: totalQuestions }).map((_, i) => {
            const done    = i < answeredCount
            const current = i === currentQuestionIndex && selected === null
            return (
              <motion.div
                key={i}
                animate={current ? { scale: [1, 1.4, 1] } : {}}
                transition={{ repeat: Infinity, duration: 1.2 }}
                className={`rounded-full transition-all duration-300 ${
                  done    ? 'w-2.5 h-2.5 bg-op-green' :
                  current ? 'w-2.5 h-2.5 bg-op-gold' :
                            'w-2 h-2 bg-white/20'
                }`}
              />
            )
          })}
        </div>
      )}

      {/* ── MIDDLE: card + timer/feedback ── */}
      <div className="flex-1 flex flex-col justify-center gap-4 min-h-0">

        <AnimatePresence mode="wait">
          <WordCard
            key={currentQuestionIndex}
            entry={currentQuestion.prompt}
            reversed={isReverse}
            learnLang={learnLang}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={totalQuestions}
          />
        </AnimatePresence>

        <div className="flex flex-col items-center gap-2">
          <TimerRing
            key={timerKey}
            duration={QUESTION_DURATION}
            onTimeout={handleTimeout}
            running={timerRunning}
          />

          <div className="h-14 flex flex-col items-center justify-center gap-1">
            <AnimatePresence>
              {feedbackCorrect !== null && (
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                  className={`px-8 py-1.5 rounded-2xl border-4 font-title text-2xl text-center ${
                    feedbackCorrect
                      ? 'border-op-green text-op-green bg-op-green/10'
                      : 'border-op-red text-op-red bg-op-red/10'
                  }`}
                  aria-live="assertive"
                >
                  {feedbackCorrect ? '✓ ' + t.correct : '✗ ' + t.wrong}
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {feedbackCorrect === false && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="font-title text-lg text-op-green"
                >
                  ✓ {currentQuestion.correctAnswer}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── BOTTOM: options + label ── */}
      <div className="flex-shrink-0 flex flex-col gap-3 mt-3">
        <OptionsGrid
          options={currentQuestion.options}
          correctAnswer={currentQuestion.correctAnswer}
          selected={selected === '__timeout__' ? null : selected}
          onSelect={handleSelect}
          disabled={selected !== null}
        />
        <div className="text-center font-body text-xs text-white/20 tracking-widest">
          {currentWorldId?.toUpperCase()}
          {isDaily ? ' · DAILY ×3' : ''}
          {isSurvival ? ' · ❤️ SURVIVAL' : ''}
          {isReverse ? ' · 🔄 REVERSE' : ''}
        </div>
      </div>
    </div>
  )
}
