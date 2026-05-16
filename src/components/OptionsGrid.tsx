import { motion, AnimatePresence } from 'framer-motion'

type OptionState = 'idle' | 'correct-hit' | 'correct-show' | 'wrong' | 'reveal'

interface OptionsGridProps {
  options: string[]
  correctAnswer: string
  selected: string | null
  onSelect: (option: string) => void
  disabled: boolean
}

function getOptionState(
  option: string,
  selected: string | null,
  correctAnswer: string,
): OptionState {
  if (selected === null) return 'idle'
  if (option === selected && option === correctAnswer) return 'correct-hit'
  if (option === correctAnswer) return 'correct-show'
  if (option === selected) return 'wrong'
  return 'reveal'
}

const stateStyles: Record<OptionState, string> = {
  'idle':          'bg-[#0d2d4a] border-op-cyan text-op-cyan cursor-pointer',
  'correct-hit':   'bg-op-green/20 border-op-green text-op-green',
  'correct-show':  'bg-op-green/10 border-op-green/50 text-op-green/75',
  'wrong':         'bg-op-red/20 border-op-red text-white',
  'reveal':        'bg-[#0d2d4a]/40 border-white/10 text-white/25',
}

function getAnimate(state: OptionState) {
  // Only the user's correct pick gets the celebratory bounce.
  // correct-show (answer revealed after a miss) just fades to green — no bounce hint.
  if (state === 'wrong')        return { x: [0, -12, 12, -9, 9, -5, 5, 0], scale: 1, opacity: 1 }
  if (state === 'correct-hit')  return { scale: [1, 1.07, 0.97, 1.02, 1], opacity: 1, x: 0 }
  if (state === 'correct-show') return { scale: 1, opacity: 1, x: 0 }
  if (state === 'reveal')       return { scale: 0.96, opacity: 0.3, x: 0 }
  return { scale: 1, opacity: 1, x: 0 }
}

function getTransition(state: OptionState, i: number) {
  if (state === 'wrong')        return { duration: 0.45, ease: 'easeInOut' }
  if (state === 'correct-hit')  return { duration: 0.4, type: 'spring' as const, stiffness: 500, damping: 18 }
  if (state === 'correct-show') return { duration: 0.25 }
  if (state === 'reveal')       return { duration: 0.2 }
  return { delay: i * 0.05, type: 'spring' as const, stiffness: 360, damping: 22 }
}

const KEY_LABELS = ['1', '2', '3', '4']

export function OptionsGrid({ options, correctAnswer, selected, onSelect, disabled }: OptionsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 w-full">
      {options.map((option, i) => {
        const state = getOptionState(option, selected, correctAnswer)
        return (
          <motion.button
            key={option}
            onClick={() => !disabled && onSelect(option)}
            disabled={disabled}
            initial={{ scale: 0.88, opacity: 0 }}
            animate={getAnimate(state)}
            transition={getTransition(state, i)}
            whileHover={state === 'idle' ? { scale: 1.03, transition: { duration: 0.12 } } : {}}
            whileTap={state === 'idle' ? { scale: 0.93 } : {}}
            className={`
              relative font-title text-2xl tracking-wide
              rounded-2xl border-4 py-5 px-3
              transition-colors duration-200
              ${stateStyles[state]}
            `}
            aria-label={`Option ${i + 1}: ${option}`}
          >
            <span className="absolute top-1.5 left-2.5 text-[10px] font-body opacity-40 leading-none">
              {KEY_LABELS[i]}
            </span>

            <AnimatePresence>
              {state === 'correct-hit' && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute top-1.5 right-2.5 text-op-green text-sm"
                >
                  ✓
                </motion.span>
              )}
              {state === 'correct-show' && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className="absolute top-1.5 right-2.5 text-op-green/60 text-sm"
                >
                  ✓
                </motion.span>
              )}
              {state === 'wrong' && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute top-1.5 right-2.5 text-op-red text-sm"
                >
                  ✗
                </motion.span>
              )}
            </AnimatePresence>

            {option}
          </motion.button>
        )
      })}
    </div>
  )
}
