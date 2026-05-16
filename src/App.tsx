import { AnimatePresence, motion } from 'framer-motion'
import { useGameStore } from './store/gameStore'
import { StartScreen } from './screens/StartScreen'
import { HubScreen } from './screens/HubScreen'
import { GameScreen } from './screens/GameScreen'
import { ResultScreen } from './screens/ResultScreen'
import { RankingScreen } from './screens/RankingScreen'
import { AchievementsScreen } from './screens/AchievementsScreen'
import { WordStatsScreen } from './screens/WordStatsScreen'

function Screen({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -14, scale: 1.02 }}
      transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{ position: 'absolute', inset: 0, overflowY: 'auto' }}
    >
      {children}
    </motion.div>
  )
}

export function App() {
  const phase = useGameStore(s => s.phase)

  return (
    <div className="
      h-dvh overflow-hidden bg-op-ocean-dark relative
      md:w-[500px] md:mx-auto
      md:shadow-[4px_0_40px_rgba(0,0,0,0.7),-4px_0_40px_rgba(0,0,0,0.7)]
    ">
      <AnimatePresence mode="wait">
        {phase === 'start'        && <Screen key="start"><StartScreen /></Screen>}
        {phase === 'hub'          && <Screen key="hub"><HubScreen /></Screen>}
        {phase === 'game'         && <Screen key="game"><GameScreen /></Screen>}
        {phase === 'result'       && <Screen key="result"><ResultScreen /></Screen>}
        {phase === 'ranking'      && <Screen key="ranking"><RankingScreen /></Screen>}
        {phase === 'achievements' && <Screen key="achievements"><AchievementsScreen /></Screen>}
        {phase === 'progress'     && <Screen key="progress"><WordStatsScreen /></Screen>}
      </AnimatePresence>
    </div>
  )
}
