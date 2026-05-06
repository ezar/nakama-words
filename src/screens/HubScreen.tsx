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
    startRound('animals', true)
  }

  return (
    <div className="flex flex-col min-h-screen bg-op-ocean-dark px-4 pt-5 pb-8">

      {/* Top bar */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setPhase('start')}
          className="font-body text-sm text-white/50 hover:text-white flex items-center gap-1"
        >
          ← {t.back}
        </button>
        <div className="flex gap-4">
          <button
            onClick={() => setPhase('achievements')}
            className="font-body text-xs font-bold text-op-gold/70 hover:text-op-gold"
          >
            🏆 {t.achievements}
          </button>
          <button
            onClick={() => setPhase('ranking')}
            className="font-body text-xs font-bold text-op-gold/70 hover:text-op-gold"
          >
            📊 {t.ranking}
          </button>
        </div>
      </div>

      {/* Rank HUD */}
      <motion.div
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="rounded-2xl border-2 border-op-gold/40 bg-white/5 p-4 mb-4"
      >
        <div className="flex items-center justify-between mb-1">
          <span className="font-title text-2xl text-op-gold leading-none">{profile.name}</span>
          <span className="font-title text-lg text-op-gold">🍇 {profile.berries.toLocaleString()}</span>
        </div>

        <div className="flex items-center justify-between mb-2">
          <span className="font-body text-sm text-op-cyan">⚓ {rank.label}</span>
          {nextRank && (
            <span className="font-body text-xs text-white/40">
              → {nextRank.label} @ {nextRank.berries.toLocaleString()}
            </span>
          )}
        </div>

        {/* Progress bar */}
        <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-op-gold to-yellow-300"
            initial={{ width: 0 }}
            animate={{ width: `${Math.max(progress * 100, progress > 0 ? 3 : 0)}%` }}
            transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }}
          />
        </div>
      </motion.div>

      {/* Daily challenge */}
      <motion.button
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        whileTap={dailyDone ? {} : { scale: 0.97 }}
        onClick={dailyDone ? undefined : handleDaily}
        disabled={dailyDone}
        className={`
          w-full mb-5 py-4 rounded-2xl border-4 font-title text-2xl tracking-widest
          transition-colors
          ${dailyDone
            ? 'border-white/10 text-white/25 bg-transparent cursor-default'
            : 'border-op-cyan bg-op-cyan/15 text-op-cyan shadow-[0_0_20px_rgba(0,229,255,0.25)] hover:bg-op-cyan/25'}
        `}
      >
        {dailyDone ? '✓ DAILY DONE' : `⚡ ${t.daily}`}
      </motion.button>

      {/* World list */}
      <h2 className="font-title text-xl text-op-gold/80 mb-3 tracking-widest">{t.worldSelect}</h2>

      <div className="flex flex-col gap-3">
        {WORLDS.map((world, i) => {
          const locked = profile.berries < world.berriesRequired
          return (
            <motion.button
              key={world.id}
              initial={{ x: -24, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.15 + i * 0.07, type: 'spring', stiffness: 300 }}
              whileTap={locked ? {} : { scale: 0.97 }}
              onClick={() => !locked && handleWorldSelect(world.id)}
              className={`
                flex items-center gap-4 px-4 py-3 rounded-2xl border-4 text-left
                transition-colors
                ${locked
                  ? 'border-white/10 bg-white/5 cursor-default'
                  : 'border-op-ink bg-op-parchment shadow-manga hover:brightness-105 active:brightness-95'}
              `}
            >
              {/* Emoji icon */}
              <span className="text-4xl leading-none flex-shrink-0">
                {world.emoji}
              </span>

              {/* Name + lock info */}
              <div className="flex-1 min-w-0">
                <div className={`font-title text-2xl leading-tight ${locked ? 'text-white/35' : 'text-op-ink'}`}>
                  {world.label}
                </div>
                {locked ? (
                  <div className="font-body text-xs text-white/35 mt-0.5">
                    🔒 Necesitas {world.berriesRequired.toLocaleString()} 🍇
                  </div>
                ) : (
                  <div className="font-body text-xs text-op-ink/50 mt-0.5">
                    {world.words.length} palabras
                  </div>
                )}
              </div>

              {/* Arrow or lock */}
              {locked
                ? <span className="text-white/20 text-xl flex-shrink-0">🔒</span>
                : <span className="text-op-ink/60 text-xl flex-shrink-0">▶</span>
              }
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
