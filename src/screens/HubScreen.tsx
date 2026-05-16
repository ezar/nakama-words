import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useProfileStore } from '../store/profileStore'
import { useGameStore, type GameMode } from '../store/gameStore'
import { useSettingsStore } from '../store/settingsStore'
import { WORLDS, type WorldId } from '../data/words'
import { getRankForBerries, getNextRank, getRankProgress } from '../utils/rankHelpers'
import { getTranslations, type Lang } from '../i18n/translations'
import { todayString } from '../engine/rng'
import { TutorialOverlay } from '../components/TutorialOverlay'

const LANGS: Lang[] = ['en', 'es', 'ca']

export function HubScreen() {
  const { getActiveProfile } = useProfileStore()
  const { setPhase, startRound, gameMode, setGameMode } = useGameStore()
  const { language, setLanguage, toggleSound, soundEnabled, learnLang, setLearnLang, tutorialSeen, setTutorialSeen } = useSettingsStore()
  const t = getTranslations(language)

  const [settingsOpen, setSettingsOpen] = useState(false)

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

  return (
    <div className="flex flex-col h-full bg-op-ocean-dark">

      <AnimatePresence>
        {!tutorialSeen && <TutorialOverlay onDone={setTutorialSeen} />}
      </AnimatePresence>

      {/* ── Settings bottom sheet ── */}
      <AnimatePresence>
        {settingsOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSettingsOpen(false)}
              className="fixed inset-0 bg-black/60 z-40"
            />
            {/* Panel */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 36 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-[#0d2d4a] border-t-4 border-op-gold/40 rounded-t-3xl px-6 pb-8 pt-5 md:w-[500px] md:mx-auto"
            >
              {/* Handle */}
              <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-5" />

              <h2 className="font-title text-2xl text-op-gold mb-5">⚙️ {t.settings}</h2>

              <div className="flex flex-col gap-4">

                {/* Sound */}
                <div className="flex items-center justify-between py-3 border-b border-white/8">
                  <span className="font-body text-base text-white/70">{t.sound}</span>
                  <button
                    onClick={toggleSound}
                    className={`relative w-14 h-7 rounded-full border-2 transition-colors ${
                      soundEnabled ? 'bg-op-cyan/20 border-op-cyan' : 'bg-white/5 border-white/20'
                    }`}
                  >
                    <motion.div
                      animate={{ x: soundEnabled ? 28 : 4 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className={`absolute top-0.5 w-5 h-5 rounded-full ${soundEnabled ? 'bg-op-cyan' : 'bg-white/30'}`}
                    />
                  </button>
                </div>

                {/* UI Language */}
                <div className="flex items-center justify-between py-3 border-b border-white/8">
                  <span className="font-body text-base text-white/70">{t.uiLanguage}</span>
                  <div className="flex gap-1">
                    {LANGS.map(l => (
                      <button
                        key={l}
                        onClick={() => setLanguage(l)}
                        className={`font-title text-sm px-3 py-1.5 rounded-xl border-2 uppercase transition-colors ${
                          l === language
                            ? 'border-op-gold bg-op-gold/20 text-op-gold'
                            : 'border-white/15 text-white/40 hover:text-white/70'
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Learn Language */}
                <div className="flex items-center justify-between py-3">
                  <span className="font-body text-base text-white/70">{t.learnIn}</span>
                  <div className="flex gap-1">
                    {(['es', 'ca'] as const).map(l => (
                      <button
                        key={l}
                        onClick={() => setLearnLang(l)}
                        className={`font-title text-sm px-3 py-1.5 rounded-xl border-2 uppercase transition-colors ${
                          l === learnLang
                            ? 'border-op-cyan bg-op-cyan/20 text-op-cyan'
                            : 'border-white/15 text-white/40 hover:text-white/70'
                        }`}
                      >
                        {l === 'es' ? '🇪🇸 ES' : '🏴󠁥󠁳󠁣󠁴󠁿 CA'}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              <button
                onClick={() => setSettingsOpen(false)}
                className="mt-6 w-full py-3.5 rounded-2xl border-4 border-op-gold/40 text-op-gold font-title text-xl"
              >
                ✓ {t.back}
              </button>
              <div className="mt-4 text-center font-body text-[10px] text-white/20 tracking-widest">
                v{__BUILD_VERSION__}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2 flex-shrink-0">
        <button
          onClick={() => setPhase('start')}
          className="font-body text-op-cyan/70 hover:text-op-cyan text-sm"
        >
          ← {t.back}
        </button>
        <div className="flex items-center gap-3">
          <button onClick={() => setPhase('progress')} className="font-body text-xs text-op-gold/60 hover:text-op-gold">
            {t.progress}
          </button>
          <button onClick={() => setPhase('achievements')} className="font-body text-xs text-op-gold/60 hover:text-op-gold">
            {t.achievements}
          </button>
          <button onClick={() => setPhase('ranking')} className="font-body text-xs text-op-gold/60 hover:text-op-gold">
            {t.ranking}
          </button>
          <button
            onClick={() => setSettingsOpen(true)}
            className="font-body text-lg text-white/50 hover:text-white transition-colors"
            title={t.settings}
          >
            ⚙️
          </button>
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
        onClick={dailyDone ? undefined : () => startRound('daily' as WorldId, true)}
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

      {/* ── Game mode selector ── */}
      <div className="mx-4 mb-3 flex-shrink-0 flex gap-2">
        {([['normal', t.normalMode], ['survival', t.survivalMode], ['reverse', t.reverseMode]] as [GameMode, string][]).map(([mode, label]) => (
          <button
            key={mode}
            onClick={() => setGameMode(mode)}
            className={`flex-1 py-1.5 rounded-xl border-2 font-body text-xs transition-colors ${
              gameMode === mode
                ? 'border-op-gold bg-op-gold/20 text-op-gold'
                : 'border-white/15 text-white/35 hover:text-white/60'
            }`}
          >
            {mode === 'normal' ? '🎯' : mode === 'survival' ? '❤️' : '🔄'} {label}
          </button>
        ))}
      </div>

      {/* ── World list ── */}
      <h2 className="font-title text-base text-op-gold/80 tracking-widest px-4 mb-2 flex-shrink-0">{t.worldSelect}</h2>
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="grid grid-cols-2 gap-3">
          {WORLDS.map((world, i) => {
            const locked = profile.berries < world.berriesRequired
            const learnedKeys = (profile.wordProgress ?? {})[learnLang]?.[world.id] ?? []
            const learnedCount = learnedKeys.length
            const totalWords = world.words.length
            const mastered = !locked && learnedCount >= totalWords
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
                    : mastered
                      ? 'border-op-green bg-op-parchment hover:brightness-110 shadow-manga-sm'
                      : 'border-op-ink bg-op-parchment hover:brightness-110 shadow-manga-sm'}
                `}
              >
                <span className={`text-4xl leading-none ${locked ? 'grayscale opacity-30' : ''}`}>
                  {world.emoji}
                </span>
                <div className={`font-title text-sm leading-tight ${locked ? 'text-white/25' : 'text-op-ink'}`}>
                  {world.label}
                </div>
                {locked ? (
                  <div className="font-body text-[10px] leading-tight text-white/20">
                    {`🔒 ${world.berriesRequired.toLocaleString()}🍇`}
                  </div>
                ) : (
                  <>
                    <div className="w-full h-1 rounded-full bg-op-ink/20 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${mastered ? 'bg-op-green' : 'bg-op-cyan'}`}
                        style={{ width: `${(learnedCount / totalWords) * 100}%` }}
                      />
                    </div>
                    <div className={`font-body text-[10px] leading-tight ${mastered ? 'text-op-green' : 'text-op-ink/50'}`}>
                      {mastered ? '✓ mastered' : `${learnedCount}/${totalWords}`}
                    </div>
                  </>
                )}
              </motion.button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
