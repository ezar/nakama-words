import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { soundEngine } from '../audio/SoundEngine'

interface TimerRingProps {
  duration: number
  onTimeout: () => void
  running: boolean
}

const R = 44
const CIRC = 2 * Math.PI * R

export function TimerRing({ duration, onTimeout, running }: TimerRingProps) {
  const [timeLeft, setTimeLeft] = useState(duration)
  const startRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)
  const calledRef = useRef(false)
  const lastTickSecRef = useRef(-1)

  useEffect(() => {
    setTimeLeft(duration)
    calledRef.current = false
    startRef.current = null
    lastTickSecRef.current = -1
  }, [duration, running])

  useEffect(() => {
    if (!running) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      return
    }

    const tick = (now: number) => {
      if (!startRef.current) startRef.current = now
      const elapsed = (now - startRef.current) / 1000
      const remaining = Math.max(0, duration - elapsed)
      setTimeLeft(remaining)

      const tickSec = Math.ceil(remaining)
      if (remaining <= 3 && remaining > 0 && tickSec !== lastTickSecRef.current) {
        lastTickSecRef.current = tickSec
        soundEngine.playTick()
      }

      if (remaining <= 0 && !calledRef.current) {
        calledRef.current = true
        onTimeout()
        return
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [running, duration, onTimeout])

  const progress = timeLeft / duration
  const strokeDash = CIRC * progress
  const isUrgent = timeLeft <= 3 && timeLeft > 0
  const secCeil = Math.ceil(timeLeft)

  return (
    <motion.div
      className="relative flex items-center justify-center"
      animate={isUrgent ? { scale: [1, 1.06, 1] } : { scale: 1 }}
      transition={isUrgent ? { repeat: Infinity, duration: 0.7, ease: 'easeInOut' } : { duration: 0.3 }}
      style={{ width: 112, height: 112 }}
    >
      <svg width="112" height="112" className="rotate-[-90deg]">
        <circle cx="56" cy="56" r={R} fill="none" stroke="#1A1A2E" strokeWidth="8" />
        <motion.circle
          cx="56" cy="56" r={R}
          fill="none"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={CIRC}
          strokeDashoffset={CIRC - strokeDash}
          animate={{ stroke: isUrgent ? '#D32F2F' : '#00E5FF' }}
          transition={{ duration: 0.5, ease: 'easeInOut', strokeDashoffset: { duration: 0.05 } }}
        />
      </svg>

      <AnimatePresence mode="wait">
        <motion.span
          key={secCeil}
          initial={{ scale: 1.35, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.7, opacity: 0 }}
          transition={{ duration: 0.15, type: 'spring', stiffness: 500 }}
          className={`absolute font-title text-3xl ${isUrgent ? 'text-op-red' : 'text-op-cyan'}`}
          style={{ lineHeight: 1 }}
        >
          {secCeil}
        </motion.span>
      </AnimatePresence>
    </motion.div>
  )
}
