import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SLIDES = [
  {
    emoji: '🏴‍☠️',
    title: 'PALABRA HUNTER',
    body: 'Answer word questions to earn berries. The more you play, the more worlds you unlock!',
  },
  {
    emoji: '🌊',
    title: 'CHOOSE YOUR WORLD',
    body: 'Each world has its own vocabulary. Unlock new worlds by earning enough berries.',
  },
  {
    emoji: '⚡',
    title: 'DAILY CHALLENGE',
    body: 'A new set of words every day. Complete it for a 3× berry bonus and build your daily streak!',
  },
  {
    emoji: '🎮',
    title: 'GAME MODES',
    body: '🎯 Normal — classic rounds\n❤️ Survival — endless until 3 wrong\n🔄 Reverse — pick the English word',
  },
]

interface Props {
  onDone: () => void
}

export function TutorialOverlay({ onDone }: Props) {
  const [idx, setIdx] = useState(0)
  const slide = SLIDES[idx]!
  const isLast = idx === SLIDES.length - 1

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/70 px-6"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-sm bg-[#0d2d4a] border-4 border-op-gold/50 rounded-3xl px-6 pt-8 pb-6 flex flex-col items-center gap-5 shadow-manga"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.18 }}
            className="flex flex-col items-center gap-3 text-center"
          >
            <div className="text-7xl">{slide.emoji}</div>
            <h2 className="font-title text-2xl text-op-gold tracking-widest">{slide.title}</h2>
            <p className="font-body text-sm text-white/70 leading-relaxed whitespace-pre-line">{slide.body}</p>
          </motion.div>
        </AnimatePresence>

        {/* Dots */}
        <div className="flex gap-2">
          {SLIDES.map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-300 ${i === idx ? 'w-4 h-2 bg-op-gold' : 'w-2 h-2 bg-white/20'}`}
            />
          ))}
        </div>

        <button
          onClick={() => isLast ? onDone() : setIdx(i => i + 1)}
          className="w-full py-3.5 rounded-2xl border-4 border-op-gold bg-op-gold/20 text-op-gold font-title text-xl tracking-widest hover:bg-op-gold/30 transition-colors"
        >
          {isLast ? '⚓ LET\'S GO!' : 'NEXT →'}
        </button>

        {idx > 0 && (
          <button
            onClick={() => setIdx(i => i - 1)}
            className="font-body text-xs text-white/30 hover:text-white/50 -mt-2"
          >
            ← back
          </button>
        )}
      </motion.div>
    </motion.div>
  )
}
