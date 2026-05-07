import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useProfileStore } from '../store/profileStore'
import { useGameStore } from '../store/gameStore'
import { useSettingsStore } from '../store/settingsStore'
import { getRankForBerries } from '../utils/rankHelpers'
import { getTranslations, type Lang } from '../i18n/translations'

const LANGS: Lang[] = ['en', 'es', 'ca']

export function StartScreen() {
  const { profiles, createProfile, setActiveProfile, deleteProfile } = useProfileStore()
  const { setPhase } = useGameStore()
  const { language, setLanguage, toggleSound, soundEnabled } = useSettingsStore()
  const t = getTranslations(language)

  const [selectedId, setSelectedId] = useState<string | null>(
    () => useProfileStore.getState().activeProfileId ?? profiles[0]?.id ?? null
  )
  const [showCreate, setShowCreate] = useState(false)
  const [name, setName] = useState('')

  const handleCreate = () => {
    if (!name.trim()) return
    createProfile(name.trim().toUpperCase())
    setName('')
    setShowCreate(false)
  }

  const handleSail = () => {
    if (!selectedId) return
    setActiveProfile(selectedId)
    setPhase('hub')
  }

  const canSail = selectedId !== null && profiles.some(p => p.id === selectedId)

  return (
    <div className="flex flex-col h-full bg-op-ocean-dark">

      {/* ── Header ── */}
      <div className="flex-shrink-0 text-center px-4 pt-10 pb-6">
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <div className="text-6xl mb-3">🏴‍☠️</div>
          <h1 className="font-title text-5xl text-op-gold tracking-widest leading-none">
            PALABRA
          </h1>
          <h2 className="font-title text-2xl text-op-cyan tracking-widest">
            HUNTER
          </h2>
        </motion.div>
      </div>

      {/* ── Profile grid ── */}
      <div className="flex-1 overflow-y-auto px-4 pb-2">
        <p className="font-body text-sm text-white/40 text-center mb-4">
          {profiles.length === 0 ? t.noProfiles : t.selectProfile}
        </p>

        <div className="grid grid-cols-2 gap-3">
          {profiles.slice(0, 6).map(profile => {
            const rank = getRankForBerries(profile.berries)
            const isSelected = profile.id === selectedId
            return (
              <motion.button
                key={profile.id}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setSelectedId(profile.id)}
                className={`
                  relative flex flex-col items-center gap-2 p-4 rounded-2xl border-4 text-center transition-all
                  ${isSelected
                    ? 'border-op-gold bg-op-gold/10 shadow-manga'
                    : 'border-white/10 bg-white/[0.04] hover:border-white/25'}
                `}
              >
                {/* Delete button */}
                <button
                  onClick={e => {
                    e.stopPropagation()
                    if (selectedId === profile.id) setSelectedId(null)
                    deleteProfile(profile.id)
                  }}
                  className="absolute top-1.5 right-2 text-white/25 hover:text-op-red text-sm leading-none"
                >
                  ✕
                </button>

                <div className="text-3xl">☠️</div>
                <div className="font-title text-lg text-op-gold leading-tight truncate w-full">
                  {profile.name}
                </div>
                <div className={`font-body text-xs px-2 py-0.5 rounded-full ${isSelected ? 'bg-op-gold text-op-ink' : 'bg-white/10 text-white/50'}`}>
                  {rank.label}
                </div>
                <div className="font-body text-xs text-op-gold/60">
                  🍇 {profile.berries.toLocaleString()}
                </div>
              </motion.button>
            )
          })}

          {/* Add profile slot */}
          {profiles.length < 6 && (
            <motion.button
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setShowCreate(true)}
              className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-4 border-dashed border-white/15 text-white/30 hover:border-op-gold/40 hover:text-op-gold/50 transition-colors min-h-[130px]"
            >
              <span className="text-2xl">+</span>
              <span className="font-title text-sm">{t.newProfile}</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* ── Bottom: settings + CTA ── */}
      <div className="flex-shrink-0 px-4 pb-6 pt-3">
        {/* Settings row */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <button
            onClick={toggleSound}
            className="font-body text-sm text-white/40 hover:text-white/70 transition-colors"
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>
          <div className="flex gap-1">
            {LANGS.map(l => (
              <button
                key={l}
                onClick={() => setLanguage(l)}
                className={`font-body text-xs px-2 py-1 rounded-lg uppercase font-bold transition-colors ${
                  l === language
                    ? 'bg-op-gold text-op-ink'
                    : 'bg-white/8 text-white/35 hover:bg-white/15'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Set Sail button */}
        <motion.button
          whileTap={canSail ? { scale: 0.97 } : {}}
          onClick={handleSail}
          disabled={!canSail}
          className={`
            w-full py-4 rounded-2xl font-title text-2xl tracking-widest transition-all
            ${canSail
              ? 'bg-op-gold text-op-ink border-4 border-op-ink shadow-manga hover:brightness-105'
              : 'bg-white/8 text-white/25 border-4 border-transparent cursor-default'}
          `}
        >
          ⚓ {t.play}
        </motion.button>
      </div>

      {/* ── Create profile modal ── */}
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
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
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
                autoFocus
                className="w-full bg-white/5 border-2 border-op-gold/40 rounded-xl px-4 py-3 font-title text-2xl text-op-gold placeholder:text-op-gold/30 outline-none focus:border-op-gold mb-4"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCreate(false)}
                  className="flex-1 py-3 rounded-xl border-2 border-white/15 text-white/50 font-title text-xl"
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
