import { motion } from 'framer-motion'
import type { WordEntry, TargetLang } from '../data/words'

interface WordCardProps {
  entry: WordEntry
  reversed?: boolean
  learnLang?: TargetLang
  questionNumber?: number
  totalQuestions?: number
}

export function WordCard({ entry, reversed = false, learnLang = 'es' }: WordCardProps) {
  const displayWord = reversed ? (entry[learnLang] ?? entry.es) : entry.en

  return (
    <motion.div
      key={entry.en}
      initial={{ x: 60, opacity: 0, scale: 0.95 }}
      animate={{ x: 0, opacity: 1, scale: 1 }}
      exit={{ x: -60, opacity: 0, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 360, damping: 28 }}
      className="w-full rounded-2xl bg-op-parchment border-4 border-op-ink shadow-manga p-5 text-center"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.08, type: 'spring', stiffness: 500, damping: 20 }}
        className="text-5xl mb-2"
      >
        {entry.icon}
      </motion.div>
      <motion.div
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.12, duration: 0.2 }}
        className="font-title text-4xl text-op-ink tracking-wider mb-2"
      >
        {displayWord}
      </motion.div>
      {reversed && (
        <div className="font-body text-xs text-op-ink/50 italic mb-1 tracking-widest">→ English?</div>
      )}
      <div className="font-body text-sm text-op-ink/70 italic">
        {entry.hint}
      </div>
    </motion.div>
  )
}
