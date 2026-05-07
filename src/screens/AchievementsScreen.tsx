import { motion } from 'framer-motion'
import { useProfileStore } from '../store/profileStore'
import { useGameStore } from '../store/gameStore'
import { useSettingsStore } from '../store/settingsStore'
import { ACHIEVEMENTS } from '../config/achievements'
import { getTranslations } from '../i18n/translations'

export function AchievementsScreen() {
  const { getActiveProfile } = useProfileStore()
  const { setPhase } = useGameStore()
  const { language } = useSettingsStore()
  const t = getTranslations(language)

  const profile = getActiveProfile()
  const earned = new Set(profile?.achievements ?? [])
  const total = ACHIEVEMENTS.length
  const count = ACHIEVEMENTS.filter(a => earned.has(a.id)).length

  const categories = ['streak', 'volume', 'world', 'consistency', 'rank'] as const
  const categoryLabels: Record<string, string> = {
    streak: '🔥 Streak',
    volume: '📚 Volume',
    world: '🌍 Worlds',
    consistency: '📅 Consistency',
    rank: '⚓ Rank',
  }

  return (
    <div className="flex flex-col min-h-screen bg-op-ocean-dark px-4 py-6">
      <div className="flex items-center gap-4 mb-2">
        <button
          onClick={() => setPhase('hub')}
          className="font-body text-op-cyan/70 hover:text-op-cyan text-sm"
        >
          ← {t.back}
        </button>
        <h1 className="font-title text-3xl text-op-gold">{t.achievements}</h1>
      </div>

      <div className="mb-5">
        <div className="flex justify-between font-body text-xs text-op-cyan/60 mb-1.5">
          <span>{count} / {total} unlocked</span>
          <span>{Math.round((count / total) * 100)}%</span>
        </div>
        <div className="h-2.5 rounded-full bg-op-ink/40 overflow-hidden border border-op-ink/60">
          <motion.div
            className="h-full bg-op-gold rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(count / total) * 100}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-6 overflow-y-auto">
        {categories.map(cat => {
          const list = ACHIEVEMENTS.filter(a => a.category === cat)
          return (
            <div key={cat}>
              <div className="font-title text-xl text-op-gold mb-2">{categoryLabels[cat]}</div>
              <div className="grid grid-cols-1 gap-2">
                {list.map((ach, i) => {
                  const unlocked = earned.has(ach.id)
                  return (
                    <motion.div
                      key={ach.id}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.04 }}
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-xl border-2
                        ${unlocked
                          ? 'border-op-gold/60 bg-op-gold/10'
                          : 'border-op-ink/20 bg-op-ink/10 opacity-50'}
                      `}
                    >
                      <span className={`text-3xl ${unlocked ? '' : 'grayscale'}`}>
                        {unlocked ? ach.icon : '🔒'}
                      </span>
                      <div>
                        <div className={`font-title text-lg ${unlocked ? 'text-op-gold' : 'text-white/40'}`}>
                          {ach.title}
                        </div>
                        <div className="font-body text-xs text-white/50">
                          {ach.description}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
