import { motion } from 'framer-motion'
import type { WordEntry } from '../data/words'

interface WordCardProps {
  entry: WordEntry
  questionNumber?: number
  totalQuestions?: number
}

export function WordCard({ entry }: WordCardProps) {
  return (
    <motion.div
      key={entry.en}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="w-full rounded-2xl bg-op-parchment border-4 border-op-ink shadow-manga p-5 text-center"
    >
      <div className="text-5xl mb-2">{entry.icon}</div>
      <div className="font-title text-4xl text-op-ink tracking-wider mb-2">
        {entry.en}
      </div>
      <div className="font-body text-sm text-op-ink/70 italic">
        {entry.hint}
      </div>
    </motion.div>
  )
}
