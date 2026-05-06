import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Particle {
  id: number
  x: number
  y: number
  color: string
  size: number
}

const COLORS = ['#FFD600', '#00E5FF', '#00E676', '#FF6B6B', '#FF9800']

let particleId = 0

interface ParticleEmitterProps {
  trigger: boolean
  origin?: { x: number; y: number }
}

export function ParticleEmitter({ trigger, origin = { x: 50, y: 50 } }: ParticleEmitterProps) {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    if (!trigger) return
    const newParticles = Array.from({ length: 12 }, () => ({
      id: particleId++,
      x: origin.x + (Math.random() - 0.5) * 80,
      y: origin.y + (Math.random() - 0.5) * 80,
      color: COLORS[Math.floor(Math.random() * COLORS.length)]!,
      size: 6 + Math.random() * 8,
    }))
    setParticles(newParticles)
    const timer = setTimeout(() => setParticles([]), 700)
    return () => clearTimeout(timer)
  }, [trigger, origin])

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      <AnimatePresence>
        {particles.map(p => (
          <motion.div
            key={p.id}
            initial={{ x: `${p.x}vw`, y: `${p.y}vh`, opacity: 1, scale: 1 }}
            animate={{
              x: `${p.x + (Math.random() - 0.5) * 40}vw`,
              y: `${p.y - 20 - Math.random() * 30}vh`,
              opacity: 0,
              scale: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
