import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
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

  useEffect(() => {
    setTimeLeft(duration)
    calledRef.current = false
    startRef.current = null
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

      // Tick sound in last 3 seconds
      if (remaining <= 3 && remaining > 0 && Math.floor(remaining) !== Math.floor(remaining + 0.016)) {
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
  const isUrgent = timeLeft <= 3

  return (
    <div className="relative flex items-center justify-center" style={{ width: 112, height: 112 }}>
      <svg width="112" height="112" className="rotate-[-90deg]">
        <circle cx="56" cy="56" r={R} fill="none" stroke="#1A1A2E" strokeWidth="8" />
        <motion.circle
          cx="56"
          cy="56"
          r={R}
          fill="none"
          stroke={isUrgent ? '#D32F2F' : '#00E5FF'}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={CIRC}
          strokeDashoffset={CIRC - strokeDash}
          transition={{ duration: 0.05 }}
        />
      </svg>
      <span
        className={`absolute font-title text-3xl ${isUrgent ? 'text-op-red' : 'text-op-cyan'}`}
        style={{ lineHeight: 1 }}
      >
        {Math.ceil(timeLeft)}
      </span>
    </div>
  )
}
