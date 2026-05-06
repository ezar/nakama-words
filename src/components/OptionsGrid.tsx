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
  idle:    'bg-[#0d2d4a] border-op-cyan text-op-cyan hover:bg-op-cyan/15 active:scale-[0.97]',
  correct: 'bg-op-green/20 border-op-green text-op-green',
  wrong:   'bg-op-red/20 border-op-red text-white',
  reveal:  'bg-[#0d2d4a]/60 border-white/10 text-white/30',
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
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.04, type: 'spring', stiffness: 380, damping: 22 }}
            className={`
              relative font-title text-2xl tracking-wide
              rounded-2xl border-4 py-5 px-3
              transition-colors duration-100 cursor-pointer
              ${stateStyles[state]}
            `}
            aria-label={`Option ${i + 1}: ${option}`}
          >
            <span className="absolute top-1.5 left-2.5 text-[10px] font-body opacity-40 leading-none">
              {KEY_LABELS[i]}
            </span>
            {option}
          </motion.button>
        )
      })}
    </div>
  )
}
