import type { Profile } from '../store/profileStore'
import { getRankForBerries, getRankProgress } from '../utils/rankHelpers'

interface PlayerCardProps {
  profile: Profile
  onClick?: () => void
  active?: boolean
}

export function PlayerCard({ profile, onClick, active = false }: PlayerCardProps) {
  const rank = getRankForBerries(profile.berries)
  const progress = getRankProgress(profile.berries)

  return (
    <button
      onClick={onClick}
      className={`
        w-full rounded-xl border-4 p-4 text-left transition-all
        ${active
          ? 'border-op-gold bg-op-gold/10 shadow-manga'
          : 'border-op-ink/40 bg-op-ocean-dark/60 hover:border-op-cyan'}
      `}
    >
      <div className="font-title text-xl text-op-gold truncate">{profile.name}</div>
      <div className="font-body text-xs text-op-cyan">{rank.label}</div>
      <div className="mt-2 h-2 rounded-full bg-op-ink/30 overflow-hidden">
        <div
          className="h-full bg-op-gold rounded-full transition-all"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      <div className="mt-1 font-body text-xs text-op-gold/70">
        🍇 {profile.berries.toLocaleString()} Berries
      </div>
    </button>
  )
}
