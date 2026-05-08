import { motion } from 'framer-motion'
import { useProfileStore } from '../store/profileStore'
import { useGameStore } from '../store/gameStore'
import { useSettingsStore } from '../store/settingsStore'
import { WORLDS, type WorldId } from '../data/words'
import { getRankForBerries, getNextRank, getRankProgress } from '../utils/rankHelpers'
import { getTranslations, type Lang } from '../i18n/translations'
import { todayString } from '../engine/rng'

const LANGS: Lang[] = ['en', 'es', 'ca']

export function HubScreen() {
  const { getActiveProfile } = useProfileStore()
  const { setPhase, startRound } = useGameStore()
  const { language, setLanguage, toggleSound, soundEnabled, learnLang, setLearnLang } = useSettingsStore()
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
    <div className="flex flex-col h-full bg-op-ocean-dark">

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2 flex-shrink-0">
        <button
          onClick={() => setPhase('start')}
          className="font-body text-op-cyan/70 hover:text-op-cyan text-sm"
        >
          ← {t.back}
        </button>
        <div className="flex items-center gap-3">
          <button onClick={() => setPhase('achievements')} className="font-body text-xs text-op-gold/60 hover:text-op-gold">
            {t.achievements}
          </button>
          <button onClick={() => setPhase('ranking')} className="font-body text-xs text-op-gold/60 hover:text-op-gold">
            {t.ranking}
          </button>
          <button
            onClick={toggleSound}
            title={soundEnabled ? t.soundOn : t.soundOff}
            className="font-body text-sm text-op-cyan/50 hover:text-op-cyan"
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>
          <div className="flex gap-0.5 border border-white/10 rounded p-0.5">
            {(['es', 'ca'] as const).map(l => (
              <button
                key={l}
                onClick={() => setLearnLang(l)}
                className={`font-body text-[10px] px-1.5 py-0.5 rounded uppercase transition-colors ${
                  l === learnLang ? 'text-op-cyan bg-op-cyan/20' : 'text-white/30 hover:text-white/60'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
          <div className="flex gap-0.5">
            {LANGS.map(l => (
              <button
                key={l}
                onClick={() => setLanguage(l)}
                className={`font-body text-[10px] px-1.5 py-0.5 rounded uppercase transition-colors ${
                  l === language ? 'text-op-gold bg-op-gold/20' : 'text-white/30 hover:text-white/60'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Rank HUD ── */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-op-ink/20 rounded-2xl border-2 border-op-gold/30 p-4 mx-4 mb-3 flex-shrink-0"
      >
        <div className="flex justify-between items-baseline mb-1">
          <span className="font-title text-xl text-op-gold">{profile.name}</span>
          <div className="flex items-center gap-3">
            {profile.dailyStreak > 0 && (
              <span className="font-title text-sm text-op-cyan">📅 ×{profile.dailyStreak}</span>
            )}
            <span className="font-body text-xs text-op-gold/70">🍇 {profile.berries.toLocaleString()}</span>
          </div>
        </div>
        <div className="font-body text-sm text-op-cyan mb-2">{rank.label}</div>
        <div className="h-2.5 rounded-full bg-op-ink/40 overflow-hidden border border-op-ink/60">
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

      {/* ── Daily challenge ── */}
      <motion.button
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        onClick={dailyDone ? undefined : handleDaily}
        disabled={dailyDone}
        className={`
          mx-4 mb-3 py-3.5 rounded-xl border-4 font-title text-xl tracking-wide flex-shrink-0
          ${dailyDone
            ? 'border-white/10 text-white/25 bg-transparent cursor-default'
            : 'border-op-cyan bg-op-cyan/10 text-op-cyan hover:bg-op-cyan/20 shadow-manga'}
        `}
      >
        {dailyDone ? '✓ DAILY DONE' : `⚡ ${t.daily}`}
      </motion.button>

      {/* ── World list (scrolls inside the fixed container) ── */}
      <h2 className="font-title text-base text-op-gold/80 tracking-widest px-4 mb-2 flex-shrink-0">{t.worldSelect}</h2>
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="grid grid-cols-2 gap-3">
          {WORLDS.map((world, i) => {
            const locked = profile.berries < world.berriesRequired
            return (
              <motion.button
                key={world.id}
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.08 + i * 0.03, type: 'spring', stiffness: 320 }}
                whileTap={locked ? {} : { scale: 0.95 }}
                onClick={() => !locked && handleWorldSelect(world.id)}
                className={`
                  flex flex-col items-center gap-2 px-3 py-4 rounded-2xl border-2 text-center transition-colors
                  ${locked
                    ? 'border-white/8 bg-white/[0.03] cursor-default'
                    : 'border-op-ink bg-op-parchment hover:brightness-110 shadow-manga-sm'}
                `}
              >
                <span className={`text-4xl leading-none ${locked ? 'grayscale opacity-30' : ''}`}>
                  {world.emoji}
                </span>
                <div className={`font-title text-sm leading-tight ${locked ? 'text-white/25' : 'text-op-ink'}`}>
                  {world.label}
                </div>
                <div className={`font-body text-[10px] leading-tight ${locked ? 'text-white/20' : 'text-op-ink/50'}`}>
                  {locked
                    ? `🔒 ${world.berriesRequired.toLocaleString()}🍇`
                    : `${world.words.length} ${t.words}`}
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
