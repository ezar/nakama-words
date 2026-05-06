import { motion, AnimatePresence } from 'framer-motion'
import { getStreakMessage } from '../utils/rankHelpers'

interface StreakBannerProps {
  streak: number
  score: number
}

export function StreakBanner({ streak, score }: StreakBannerProps) {
  const message = getStreakMessage(streak)

  return (
    <div className="flex items-center justify-between w-full px-1">
      <AnimatePresence mode="wait">
        <motion.span
          key={message}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          className="font-body text-sm text-op-gold"
          aria-live="polite"
        >
          {message}
        </motion.span>
      </AnimatePresence>

      <motion.div
        key={score}
        initial={{ scale: 1.4, color: '#FFD600' }}
        animate={{ scale: 1, color: '#FFD600' }}
        className="font-title text-2xl text-op-gold"
      >
        🍇 {score}
      </motion.div>
    </div>
  )
}
