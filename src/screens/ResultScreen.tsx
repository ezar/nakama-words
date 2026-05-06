import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { AnimatePresence } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { useSettingsStore } from '../store/settingsStore'
import { StarRating } from '../components/StarRating'
import { getTranslations } from '../i18n/translations'
import { soundEngine } from '../audio/SoundEngine'
import { ACHIEVEMENT_MAP } from '../config/achievements'

export function ResultScreen() {
  const { lastResult, setPhase, currentWorldId, resetRound, newAchievements, rankedUp, newRankLabel } = useGameStore()
  const { language } = useSettingsStore()
  const t = getTranslations(language)

  useEffect(() => {
    if (rankedUp) {
      soundEngine.playRankUp()
    }
  }, [rankedUp])

  if (!lastResult) {
    setPhase('hub')
    return null
  }

  const { score, berriesEarned, maxStreak, correctWords, wrongWords, totalQuestions } = lastResult

  const handlePlayAgain = () => {
    if (currentWorldId) {
      resetRound()
      setPhase('hub')
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-op-ocean-dark px-4 py-6 overflow-y-auto">
      {/* Rank-up banner */}
      <AnimatePresence>
        {rankedUp && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="fixed inset-0 flex flex-col items-center justify-center bg-op-ocean-dark/95 z-50"
          >
            <motion.div
              animate={{ rotate: [0, -5, 5, -5, 5, 0] }}
              transition={{ duration: 0.5 }}
              className="text-7xl mb-4"
            >
              🏴‍☠️
            </motion.div>
            <div className="font-title text-4xl text-op-gold text-center">{t.rankUp}</div>
            <div className="font-body text-lg text-op-cyan mt-2">{t.newRank}</div>
            <div className="font-title text-5xl text-op-gold mt-1">{newRankLabel}</div>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              onClick={() => useGameStore.setState({ rankedUp: false })}
              className="mt-8 font-title text-2xl text-op-cyan border-2 border-op-cyan px-8 py-3 rounded-xl"
            >
              ▶ CONTINUE
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-6"
      >
        <h1 className="font-title text-4xl text-op-gold">{t.roundComplete}</h1>
        <div className="mt-3">
          <StarRating correct={correctWords.length} total={totalQuestions} />
        </div>
      </motion.div>

      {/* Score + berries */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-op-parchment border-4 border-op-ink rounded-2xl shadow-manga p-5 mb-4 text-center"
      >
        <div className="font-title text-5xl text-op-ink">{score}</div>
        <div className="font-body text-sm text-op-ink/60 mb-3">points</div>
        <div className="flex justify-around">
          <div>
            <div className="font-title text-3xl text-op-gold">🍇 {berriesEarned}</div>
            <div className="font-body text-xs text-op-ink/60">{t.berriesEarned}</div>
          </div>
          <div>
            <div className="font-title text-3xl text-op-cyan">🔥 {maxStreak}</div>
            <div className="font-body text-xs text-op-ink/60">Best streak</div>
          </div>
          <div>
            <div className="font-title text-3xl text-op-green">✓ {correctWords.length}/{totalQuestions}</div>
            <div className="font-body text-xs text-op-ink/60">Correct</div>
          </div>
        </div>
      </motion.div>

      {/* New achievements */}
      {newAchievements.length > 0 && (
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-op-gold/10 border-2 border-op-gold/40 rounded-xl p-4 mb-4"
        >
          <div className="font-title text-xl text-op-gold mb-2">🏆 New Achievements!</div>
          {newAchievements.map(id => {
            const ach = ACHIEVEMENT_MAP[id]
            if (!ach) return null
            return (
              <div key={id} className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{ach.icon}</span>
                <span className="font-body text-sm text-op-gold">{ach.title}</span>
              </div>
            )
          })}
        </motion.div>
      )}

      {/* Words learned */}
      {correctWords.length > 0 && (
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="bg-op-ink/20 border-2 border-op-green/30 rounded-xl p-4 mb-4"
        >
          <div className="font-title text-xl text-op-green mb-2">✓ {t.wordsLearned}</div>
          <div className="grid grid-cols-2 gap-1">
            {correctWords.map(w => (
              <div key={w.en} className="font-body text-sm text-white/80">
                {w.icon} {w.en} → <span className="text-op-green">{w.es}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Wrong words */}
      {wrongWords.length > 0 && (
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-op-ink/20 border-2 border-op-red/30 rounded-xl p-4 mb-4"
        >
          <div className="font-title text-xl text-op-red mb-2">✗ Practice more</div>
          <div className="grid grid-cols-2 gap-1">
            {wrongWords.map(w => (
              <div key={w.en} className="font-body text-sm text-white/60">
                {w.icon} {w.en} → <span className="text-op-red">{w.es}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3 mt-2">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => { resetRound(); setPhase('hub') }}
          className="flex-1 py-4 rounded-xl border-4 border-op-ink/30 text-op-cyan font-title text-xl"
        >
          HUB
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handlePlayAgain}
          className="flex-2 flex-grow-[2] py-4 rounded-xl border-4 border-op-ink bg-op-gold text-op-ink font-title text-2xl shadow-manga"
        >
          {t.playAgain}
        </motion.button>
      </div>
    </div>
  )
}
