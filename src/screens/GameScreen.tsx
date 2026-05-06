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
import { getTranslations } from '../i18n/translations'
import { getStreakMessage } from '../utils/rankHelpers'
import { todayString } from '../engine/rng'

const ADVANCE_DELAY = 1400
const QUESTION_DURATION = 10

export function GameScreen() {
  const {
    currentQuestion, currentQuestionIndex, wordQueue,
    score, streak, isDaily, currentWorldId,
    answerQuestion, advanceQuestion, finishRound,
  } = useGameStore()

  const { addBerries, addCorrect, updateMaxStreak, completeDaily } = useProfileStore()
  const { language } = useSettingsStore()
  const t = getTranslations(language)

  const [selected, setSelected] = useState<string | null>(null)
  const [timerRunning, setTimerRunning] = useState(true)
  const [timerKey, setTimerKey] = useState(0)
  const [feedbackCorrect, setFeedbackCorrect] = useState<boolean | null>(null)
  const [particleTrigger, setParticleTrigger] = useState(false)
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const totalQuestions = wordQueue.length
  const isLastQuestion = currentQuestionIndex >= totalQuestions - 1
  const streakMsg = getStreakMessage(streak)

  const doAdvance = useCallback(() => {
    if (isLastQuestion) {
      const { maxStreak, correctWords } = useGameStore.getState()
      updateMaxStreak(maxStreak)
      addCorrect(correctWords.length)
      if (isDaily) completeDaily(todayString())
      const berriesResult = addBerries(useGameStore.getState().score)
      finishRound(berriesResult)
    } else {
      advanceQuestion()
      setSelected(null)
      setFeedbackCorrect(null)
      setTimerKey(k => k + 1)
      setTimerRunning(true)
    }
  }, [isLastQuestion, advanceQuestion, finishRound, addBerries, addCorrect, updateMaxStreak, isDaily, completeDaily])

  const handleSelect = useCallback((option: string) => {
    if (selected !== null) return
    setTimerRunning(false)
    setSelected(option)

    const correct = answerQuestion(option)
    setFeedbackCorrect(correct)

    if (correct) {
      soundEngine.playCorrect()
      setParticleTrigger(true)
      setTimeout(() => setParticleTrigger(false), 50)
      const { streak: newStreak } = useGameStore.getState()
      if (newStreak >= 5) soundEngine.playStreak()
    } else {
      soundEngine.playWrong()
    }

    advanceTimer.current = setTimeout(doAdvance, ADVANCE_DELAY)
  }, [selected, answerQuestion, doAdvance])

  const handleTimeout = useCallback(() => {
    if (selected !== null) return
    setTimerRunning(false)
    setSelected('__timeout__')
    setFeedbackCorrect(false)
    answerQuestion('')
    soundEngine.playWrong()
    advanceTimer.current = setTimeout(doAdvance, ADVANCE_DELAY)
  }, [selected, answerQuestion, doAdvance])

  // Keyboard: 1–4
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!currentQuestion) return
      const idx = ['1', '2', '3', '4'].indexOf(e.key)
      if (idx !== -1 && currentQuestion.options[idx]) {
        handleSelect(currentQuestion.options[idx]!)
      }
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

  return (
    <div className="flex flex-col min-h-screen bg-op-ocean-dark px-4 pt-5 pb-6">
      <ParticleEmitter trigger={particleTrigger} />

      {/* ── Top bar: streak message + score ── */}
      <div className="flex items-center justify-between">
        <AnimatePresence mode="wait">
          <motion.span
            key={streakMsg}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            className="font-body text-sm text-op-gold"
            aria-live="polite"
          >
            {streakMsg}
          </motion.span>
        </AnimatePresence>

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

      {/* ── Word card — flex-1 so it takes all middle space ── */}
      <div className="flex-1 flex flex-col justify-center py-4">
        <AnimatePresence mode="wait">
          <WordCard
            key={currentQuestionIndex}
            entry={currentQuestion.prompt}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={totalQuestions}
          />
        </AnimatePresence>
      </div>

      {/* ── Timer + feedback — fixed height, nothing shifts ── */}
      <div className="flex items-center justify-center gap-4 h-28 mb-4">
        <TimerRing
          key={timerKey}
          duration={QUESTION_DURATION}
          onTimeout={handleTimeout}
          running={timerRunning}
        />

        <div className="w-40 flex items-center justify-center">
          <AnimatePresence>
            {feedbackCorrect !== null && (
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                className={`
                  px-4 py-2 rounded-2xl border-4 font-title text-2xl text-center w-full
                  ${feedbackCorrect
                    ? 'border-op-green text-op-green bg-op-green/10'
                    : 'border-op-red text-op-red bg-op-red/10'}
                `}
                aria-live="assertive"
              >
                {feedbackCorrect ? '✓ ' + t.correct : '✗ ' + t.wrong}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Answer options ── */}
      <OptionsGrid
        options={currentQuestion.options}
        correctAnswer={currentQuestion.correctAnswer}
        selected={selected === '__timeout__' ? null : selected}
        onSelect={handleSelect}
        disabled={selected !== null}
      />

      {/* ── World / daily label ── */}
      <div className="text-center font-body text-xs text-white/20 mt-4 tracking-widest">
        {currentWorldId?.toUpperCase()}{isDaily ? ' · DAILY ×3' : ''}
      </div>
    </div>
  )
}
