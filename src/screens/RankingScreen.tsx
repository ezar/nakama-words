import { motion } from 'framer-motion'
import { useProfileStore } from '../store/profileStore'
import { useGameStore } from '../store/gameStore'
import { useSettingsStore } from '../store/settingsStore'
import { getRankForBerries } from '../utils/rankHelpers'
import { getTranslations } from '../i18n/translations'

export function RankingScreen() {
  const { profiles, activeProfileId } = useProfileStore()
  const { setPhase } = useGameStore()
  const { language } = useSettingsStore()
  const t = getTranslations(language)

  const sorted = [...profiles].sort((a, b) => b.berries - a.berries)

  return (
    <div className="flex flex-col min-h-screen bg-op-ocean-dark px-4 py-6">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => setPhase('hub')}
          className="font-body text-op-cyan/70 hover:text-op-cyan text-sm"
        >
          ← {t.back}
        </button>
        <h1 className="font-title text-3xl text-op-gold">{t.ranking}</h1>
      </div>

      <div className="flex flex-col gap-3">
        {sorted.map((profile, i) => {
          const rank = getRankForBerries(profile.berries)
          const isActive = profile.id === activeProfileId
          const medals = ['🥇', '🥈', '🥉']
          return (
            <motion.div
              key={profile.id}
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className={`
                flex items-center gap-4 px-4 py-3 rounded-xl border-4
                ${isActive
                  ? 'border-op-gold bg-op-gold/10 shadow-manga'
                  : 'border-op-ink/30 bg-op-ink/10'}
              `}
            >
              <span className="text-2xl w-8 text-center">
                {medals[i] ?? `#${i + 1}`}
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-title text-xl text-op-gold truncate">{profile.name}</div>
                <div className="font-body text-xs text-op-cyan">{rank.label}</div>
              </div>
              <div className="font-title text-xl text-op-gold text-right">
                🍇 {profile.berries.toLocaleString()}
              </div>
            </motion.div>
          )
        })}

        {sorted.length === 0 && (
          <div className="text-center font-body text-op-gold/40 mt-8">No pirates yet</div>
        )}
      </div>
    </div>
  )
}
