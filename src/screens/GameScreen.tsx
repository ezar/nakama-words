import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { useProfileStore } from '../store/profileStore'
import { useSettingsStore } from '../store/settingsStore'
import { WordCard } from '../components/WordCard'
import { TimerRing } from '../components/TimerRing'
import { OptionsGrid } from '../components/OptionsGrid'
import { StreakBanner } from '../components/StreakBanner'
import { ParticleEmitter } from '../components/ParticleEmitter'
import { soundEngine } from '../audio/SoundEngine'
import { getTranslations } from '../i18n/translations'
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
  const [feedbackLabel, setFeedbackLabel] = useState('')
  const [particleTrigger, setParticleTrigger] = useState(false)
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const totalQuestions = wordQueue.length
  const isLastQuestion = currentQuestionIndex >= totalQuestions - 1

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
      setFeedbackLabel('')
      setTimerKey(k => k + 1)
      setTimerRunning(true)
    }
  }, [isLastQuestion, advanceQuestion, finishRound, addBerries, addCorrect, updateMaxStreak, isDaily, completeDaily])

  const handleSelect = useCallback((option: string) => {
    if (selected !== null) return
    setTimerRunning(false)
    setSelected(option)

    const correct = answerQuestion(option)
    if (correct) {
      soundEngine.playCorrect()
      setFeedbackLabel(t.correct)
      setParticleTrigger(true)
      setTimeout(() => setParticleTrigger(false), 50)
      const { streak: newStreak } = useGameStore.getState()
      if (newStreak >= 5) soundEngine.playStreak()
    } else {
      soundEngine.playWrong()
      setFeedbackLabel(t.wrong)
    }

    advanceTimer.current = setTimeout(doAdvance, ADVANCE_DELAY)
  }, [selected, answerQuestion, doAdvance, t])

  const handleTimeout = useCallback(() => {
    if (selected !== null) return
    setTimerRunning(false)
    setSelected('__timeout__')
    answerQuestion('')
    setFeedbackLabel(t.timeout)
    soundEngine.playWrong()
    advanceTimer.current = setTimeout(doAdvance, ADVANCE_DELAY)
  }, [selected, answerQuestion, doAdvance, t])

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

  // Reset on new question
  useEffect(() => {
    setSelected(null)
    setFeedbackLabel('')
    setTimerRunning(true)
  }, [currentQuestionIndex])

  useEffect(() => {
    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current)
    }
  }, [])

  if (!currentQuestion) return null

  return (
    <div className="flex flex-col min-h-screen bg-op-ocean-dark px-4 py-6 gap-4">
      <ParticleEmitter trigger={particleTrigger} />

      {/* Top: streak banner */}
      <StreakBanner streak={streak} score={score} />

      {/* Word card */}
      <AnimatePresence mode="wait">
        <WordCard
          key={currentQuestionIndex}
          entry={currentQuestion.prompt}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={totalQuestions}
        />
      </AnimatePresence>

      {/* Timer */}
      <div className="flex justify-center">
        <TimerRing
          key={timerKey}
          duration={QUESTION_DURATION}
          onTimeout={handleTimeout}
          running={timerRunning}
        />
      </div>

      {/* Feedback label */}
      <AnimatePresence>
        {feedbackLabel && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`text-center font-title text-3xl ${
              feedbackLabel === t.correct ? 'text-op-green' : 'text-op-red'
            }`}
            aria-live="assertive"
          >
            {feedbackLabel}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Options */}
      <OptionsGrid
        options={currentQuestion.options}
        correctAnswer={currentQuestion.correctAnswer}
        selected={selected === '__timeout__' ? null : selected}
        onSelect={handleSelect}
        disabled={selected !== null}
      />

      {/* World label */}
      <div className="text-center font-body text-xs text-op-cyan/30">
        {currentWorldId?.toUpperCase()} {isDaily ? '· DAILY ×3' : ''}
      </div>
    </div>
  )
}
