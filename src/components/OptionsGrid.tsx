import { motion } from 'framer-motion'

type OptionState = 'idle' | 'correct' | 'wrong' | 'reveal'

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
  if (option === correctAnswer) return 'correct'
  if (option === selected) return 'wrong'
  return 'reveal'
}

const stateStyles: Record<OptionState, string> = {
  idle:    'bg-op-ocean-dark border-op-cyan text-op-cyan hover:bg-op-cyan/10 active:scale-95',
  correct: 'bg-op-green border-op-green text-op-ink',
  wrong:   'bg-op-red border-op-red text-white',
  reveal:  'bg-op-ocean-dark border-op-ink/30 text-op-cyan/40',
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
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.05, type: 'spring', stiffness: 400 }}
            className={`
              relative font-title text-2xl tracking-wide
              rounded-xl border-4 py-4 px-2
              shadow-manga-sm transition-colors duration-150
              ${stateStyles[state]}
            `}
            aria-label={`Option ${i + 1}: ${option}`}
          >
            <span className="absolute top-1 left-2 text-xs opacity-40 font-body">
              {KEY_LABELS[i]}
            </span>
            {option}
          </motion.button>
        )
      })}
    </div>
  )
}
