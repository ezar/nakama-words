import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useProfileStore } from '../store/profileStore'
import { useGameStore } from '../store/gameStore'
import { useSettingsStore } from '../store/settingsStore'
import { PlayerCard } from '../components/PlayerCard'
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
    <div className="flex flex-col items-center min-h-screen bg-op-ocean-dark px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-8"
      >
        <div className="text-6xl mb-2">🏴‍☠️</div>
        <h1 className="font-title text-5xl text-op-gold tracking-widest leading-none">
          PALABRA
        </h1>
        <h2 className="font-title text-3xl text-op-cyan tracking-widest">
          HUNTER
        </h2>
      </motion.div>

      {/* Profiles */}
      <div className="w-full max-w-sm flex-1">
        <p className="font-body text-op-gold/70 text-center text-sm mb-4">
          {profiles.length === 0 ? t.noProfiles : t.selectProfile}
        </p>

        <div className="flex flex-col gap-3 mb-4">
          {profiles.slice(0, 6).map(profile => (
            <PlayerCard
              key={profile.id}
              profile={profile}
              onClick={() => handleSelect(profile.id)}
            />
          ))}
        </div>

        {profiles.length < 6 && (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowCreate(true)}
            className="w-full py-3 rounded-xl border-4 border-dashed border-op-gold/40 text-op-gold/60 font-title text-xl hover:border-op-gold hover:text-op-gold transition-colors"
          >
            + {t.newProfile}
          </motion.button>
        )}
      </div>

      {/* Sound toggle */}
      <button
        onClick={toggleSound}
        className="mt-6 font-body text-xs text-op-cyan/50 hover:text-op-cyan"
      >
        {soundEnabled ? t.soundOn : t.soundOff}
      </button>

      {/* Build version */}
      <p className="mt-2 font-body text-xs text-op-ink/30">
        v{(globalThis as { __BUILD_VERSION__?: string }).__BUILD_VERSION__ ?? '—'}
      </p>

      {/* Create profile modal */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-6"
            onClick={() => setShowCreate(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-sm bg-op-ocean-dark border-4 border-op-gold rounded-2xl shadow-manga p-6"
            >
              <h3 className="font-title text-3xl text-op-gold text-center mb-4">
                {t.newProfile}
              </h3>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value.toUpperCase())}
                onKeyDown={e => e.key === 'Enter' && handleCreate()}
                placeholder={t.enterName}
                maxLength={16}
                className="w-full bg-op-ink/20 border-2 border-op-gold/40 rounded-xl px-4 py-3 font-title text-2xl text-op-gold placeholder:text-op-gold/30 outline-none focus:border-op-gold mb-4"
                autoFocus
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCreate(false)}
                  className="flex-1 py-3 rounded-xl border-2 border-op-ink/40 text-op-cyan/60 font-title text-xl"
                >
                  ✕
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!name.trim()}
                  className="flex-1 py-3 rounded-xl bg-op-gold border-4 border-op-ink text-op-ink font-title text-xl shadow-manga-sm disabled:opacity-40"
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
