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
    /* Desktop: dark background with centered phone frame */
    <div className="min-h-screen bg-[#060c17] md:flex md:items-center md:justify-center md:p-6">
      <div
        className={`
          w-full max-w-[430px] mx-auto bg-op-ocean-dark
          min-h-screen
          md:min-h-0 md:h-[820px] md:rounded-[2.5rem]
          md:shadow-[0_0_0_6px_rgba(0,229,255,0.08),0_32px_80px_rgba(0,0,0,0.8)]
          md:border md:border-white/[0.06]
          relative overflow-hidden
        `}
      >
        <AnimatePresence mode="wait">
          {phase === 'start'        && <Screen key="start"><StartScreen /></Screen>}
          {phase === 'hub'          && <Screen key="hub"><HubScreen /></Screen>}
          {phase === 'game'         && <Screen key="game"><GameScreen /></Screen>}
          {phase === 'result'       && <Screen key="result"><ResultScreen /></Screen>}
          {phase === 'ranking'      && <Screen key="ranking"><RankingScreen /></Screen>}
          {phase === 'achievements' && <Screen key="achievements"><AchievementsScreen /></Screen>}
        </AnimatePresence>
      </div>
    </div>
  )
}
