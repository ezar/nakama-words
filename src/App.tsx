import { AnimatePresence, motion } from 'framer-motion'
import { useGameStore } from './store/gameStore'
import { StartScreen } from './screens/StartScreen'
import { HubScreen } from './screens/HubScreen'
import { GameScreen } from './screens/GameScreen'
import { ResultScreen } from './screens/ResultScreen'
import { RankingScreen } from './screens/RankingScreen'
import { AchievementsScreen } from './screens/AchievementsScreen'

function Screen({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.18, ease: 'easeInOut' }}
      style={{ position: 'absolute', inset: 0, overflowY: 'auto' }}
    >
      {children}
    </motion.div>
  )
}

export function App() {
  const phase = useGameStore(s => s.phase)

  return (
    <div className="max-w-md mx-auto bg-op-ocean-dark min-h-screen relative overflow-hidden">
      <AnimatePresence mode="wait">
        {phase === 'start' && (
          <Screen key="start"><StartScreen /></Screen>
        )}
        {phase === 'hub' && (
          <Screen key="hub"><HubScreen /></Screen>
        )}
        {phase === 'game' && (
          <Screen key="game"><GameScreen /></Screen>
        )}
        {phase === 'result' && (
          <Screen key="result"><ResultScreen /></Screen>
        )}
        {phase === 'ranking' && (
          <Screen key="ranking"><RankingScreen /></Screen>
        )}
        {phase === 'achievements' && (
          <Screen key="achievements"><AchievementsScreen /></Screen>
        )}
      </AnimatePresence>
    </div>
  )
}
