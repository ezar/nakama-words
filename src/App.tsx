import { useGameStore } from './store/gameStore'
import { StartScreen } from './screens/StartScreen'
import { HubScreen } from './screens/HubScreen'
import { GameScreen } from './screens/GameScreen'
import { ResultScreen } from './screens/ResultScreen'
import { RankingScreen } from './screens/RankingScreen'
import { AchievementsScreen } from './screens/AchievementsScreen'

export function App() {
  const phase = useGameStore(s => s.phase)

  return (
    <div className="max-w-md mx-auto bg-op-ocean-dark min-h-screen">
      {phase === 'start'        && <StartScreen />}
      {phase === 'hub'          && <HubScreen />}
      {phase === 'game'         && <GameScreen />}
      {phase === 'result'       && <ResultScreen />}
      {phase === 'ranking'      && <RankingScreen />}
      {phase === 'achievements' && <AchievementsScreen />}
    </div>
  )
}
