import { motion } from 'framer-motion'
import { useProfileStore } from '../store/profileStore'
import { useGameStore } from '../store/gameStore'
import { useSettingsStore } from '../store/settingsStore'
import { WORLDS, type WorldId } from '../data/words'
import { getRankForBerries, getNextRank, getRankProgress } from '../utils/rankHelpers'
import { getTranslations } from '../i18n/translations'
import { todayString } from '../engine/rng'

export function HubScreen() {
  const { getActiveProfile } = useProfileStore()
  const { setPhase, startRound } = useGameStore()
  const { language } = useSettingsStore()
  const t = getTranslations(language)

  const profile = getActiveProfile()
  if (!profile) {
    setPhase('start')
    return null
  }

  const rank = getRankForBerries(profile.berries)
  const nextRank = getNextRank(profile.berries)
  const progress = getRankProgress(profile.berries)
  const today = todayString()
  const dailyDone = profile.lastDailyDate === today

  const handleWorldSelect = (worldId: WorldId) => {
    const world = WORLDS.find(w => w.id === worldId)!
    if (profile.berries < world.berriesRequired) return
    startRound(worldId, false)
  }

  const handleDaily = () => {
    // Use first available world for daily (animals as fallback)
    startRound('animals', true)
  }

  return (
    <div className="flex flex-col min-h-screen bg-op-ocean-dark px-4 py-6">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setPhase('start')}
          className="font-body text-op-cyan/70 hover:text-op-cyan text-sm"
        >
          ← {t.back}
        </button>
        <div className="flex gap-3">
          <button
            onClick={() => setPhase('achievements')}
            className="font-body text-xs text-op-gold/60 hover:text-op-gold"
          >
            {t.achievements}
          </button>
          <button
            onClick={() => setPhase('ranking')}
            className="font-body text-xs text-op-gold/60 hover:text-op-gold"
          >
            {t.ranking}
          </button>
        </div>
      </div>

      {/* Rank HUD */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-op-ink/20 rounded-2xl border-2 border-op-gold/30 p-4 mb-5"
      >
        <div className="flex justify-between items-baseline mb-1">
          <span className="font-title text-xl text-op-gold">{profile.name}</span>
          <span className="font-body text-xs text-op-gold/70">🍇 {profile.berries.toLocaleString()}</span>
        </div>
        <div className="font-body text-sm text-op-cyan mb-2">{rank.label}</div>
        <div className="h-3 rounded-full bg-op-ink/40 overflow-hidden border border-op-ink/60">
          <motion.div
            className="h-full bg-op-gold rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
        {nextRank && (
          <div className="font-body text-xs text-op-gold/50 mt-1 text-right">
            → {nextRank.label} @ {nextRank.berries.toLocaleString()} 🍇
          </div>
        )}
      </motion.div>

      {/* Daily challenge */}
      <motion.button
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        onClick={handleDaily}
        disabled={dailyDone}
        className={`
          w-full mb-5 py-4 rounded-xl border-4 font-title text-2xl tracking-wide shadow-manga
          ${dailyDone
            ? 'border-op-ink/30 text-op-ink/30 bg-transparent'
            : 'border-op-cyan bg-op-cyan/10 text-op-cyan hover:bg-op-cyan/20'}
        `}
      >
        {dailyDone ? '✓ DAILY DONE' : `⚡ ${t.daily}`}
      </motion.button>

      {/* World grid */}
      <h2 className="font-title text-2xl text-op-gold mb-3">{t.worldSelect}</h2>
      <div className="grid grid-cols-1 gap-3 flex-1">
        {WORLDS.map((world, i) => {
          const locked = profile.berries < world.berriesRequired
          return (
            <motion.button
              key={world.id}
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.15 + i * 0.07 }}
              whileTap={locked ? {} : { scale: 0.97 }}
              onClick={() => handleWorldSelect(world.id)}
              className={`
                flex items-center gap-4 px-5 py-4 rounded-xl border-4 text-left shadow-manga-sm
                ${locked
                  ? 'border-op-ink/20 bg-op-ink/10 opacity-50'
                  : 'border-op-ink bg-op-parchment hover:brightness-110'}
              `}
            >
              <span className="text-4xl">{world.emoji}</span>
              <div className="flex-1">
                <div className={`font-title text-2xl ${locked ? 'text-op-ink/40' : 'text-op-ink'}`}>
                  {world.name}
                </div>
                {locked && (
                  <div className="font-body text-xs text-op-ink/40">
                    🔒 {world.berriesRequired.toLocaleString()} {t.berriesNeeded}
                  </div>
                )}
              </div>
              {!locked && <span className="text-2xl">▶</span>}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
