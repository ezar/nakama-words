import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useProfileStore } from '../store/profileStore'
import { useGameStore } from '../store/gameStore'
import { useSettingsStore } from '../store/settingsStore'
import { getRankForBerries } from '../utils/rankHelpers'
import { getTranslations } from '../i18n/translations'

export function StartScreen() {
  const { profiles, createProfile, setActiveProfile } = useProfileStore()
  const { setPhase } = useGameStore()
  const { language, toggleSound, soundEnabled } = useSettingsStore()
  const t = getTranslations(language)

  const [showCreate, setShowCreate] = useState(false)
  const [name, setName] = useState('')

  const handleCreate = () => {
    if (!name.trim()) return
    createProfile(name.trim().toUpperCase())
    setName('')
    setShowCreate(false)
  }

  const handleSelect = (id: string) => {
    setActiveProfile(id)
    setPhase('hub')
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-op-ocean-dark px-5 py-10">

      {/* Hero */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-10"
      >
        <div className="text-7xl mb-3 leading-none">🏴‍☠️</div>
        <h1 className="font-title text-6xl text-op-gold tracking-widest leading-none drop-shadow-lg">
          PALABRA
        </h1>
        <h2 className="font-title text-4xl text-op-cyan tracking-[0.3em]">
          HUNTER
        </h2>
        <p className="font-body text-xs text-white/30 mt-2 tracking-widest">
          HUNT SPANISH WORDS — PIRATE STYLE
        </p>
      </motion.div>

      {/* Profile list */}
      <div className="w-full max-w-sm flex-1 flex flex-col">
        {profiles.length > 0 && (
          <p className="font-body text-sm text-white/40 text-center mb-3 tracking-wide">
            {t.selectProfile}
          </p>
        )}

        <div className="flex flex-col gap-3 mb-3">
          {profiles.slice(0, 6).map((profile, i) => {
            const rank = getRankForBerries(profile.berries)
            return (
              <motion.button
                key={profile.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.06 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleSelect(profile.id)}
                className="flex items-center gap-4 px-5 py-4 rounded-2xl border-4 border-op-ink bg-op-parchment shadow-manga text-left hover:brightness-105 active:brightness-95 transition-all"
              >
                <span className="text-4xl leading-none">🏴‍☠️</span>
                <div className="flex-1 min-w-0">
                  <div className="font-title text-2xl text-op-ink leading-tight truncate">
                    {profile.name}
                  </div>
                  <div className="font-body text-xs text-op-ink/60">
                    {rank.label} · 🍇 {profile.berries.toLocaleString()}
                  </div>
                </div>
                <span className="text-op-ink/40 text-xl">▶</span>
              </motion.button>
            )
          })}
        </div>

        {profiles.length < 6 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowCreate(true)}
            className="w-full py-4 rounded-2xl border-4 border-dashed border-op-gold/50 text-op-gold font-title text-xl hover:border-op-gold hover:bg-op-gold/10 transition-all"
          >
            + {t.newProfile}
          </motion.button>
        )}

        {profiles.length === 0 && (
          <p className="font-body text-sm text-white/30 text-center mt-4">
            {t.noProfiles}
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="flex flex-col items-center gap-1 mt-6">
        <button
          onClick={toggleSound}
          className="font-body text-xs text-white/30 hover:text-op-cyan transition-colors"
        >
          {soundEnabled ? '🔊 ' + t.soundOn : '🔇 ' + t.soundOff}
        </button>
        <p className="font-body text-xs text-white/15">
          v{(globalThis as { __BUILD_VERSION__?: string }).__BUILD_VERSION__ ?? '—'}
        </p>
      </div>

      {/* Create profile modal */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-6"
            onClick={() => setShowCreate(false)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-sm bg-op-ocean-dark border-4 border-op-gold rounded-2xl shadow-manga p-6"
            >
              <div className="text-5xl text-center mb-2">🏴‍☠️</div>
              <h3 className="font-title text-3xl text-op-gold text-center mb-5">
                {t.newProfile}
              </h3>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value.toUpperCase())}
                onKeyDown={e => e.key === 'Enter' && handleCreate()}
                placeholder={t.enterName}
                maxLength={16}
                className="w-full bg-white/5 border-2 border-op-gold/50 rounded-xl px-4 py-3 font-title text-2xl text-op-gold placeholder:text-op-gold/25 outline-none focus:border-op-gold mb-5 tracking-wider"
                autoFocus
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCreate(false)}
                  className="flex-1 py-3 rounded-xl border-2 border-white/20 text-white/50 font-title text-xl hover:border-white/40 transition-colors"
                >
                  ✕
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!name.trim()}
                  className="flex-[2] py-3 rounded-xl bg-op-gold border-4 border-op-ink text-op-ink font-title text-xl shadow-manga-sm disabled:opacity-30 transition-opacity"
                >
                  {t.start}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
