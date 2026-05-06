export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  category: 'streak' | 'volume' | 'world' | 'consistency' | 'rank'
}

export const ACHIEVEMENTS: Achievement[] = [
  // Streak
  { id: 'first_combo',   title: 'First Combo',    description: 'Get 3 correct in a row',   icon: '🔥',  category: 'streak' },
  { id: 'gear_second',   title: 'Gear Second',    description: 'Get 5 correct in a row',   icon: '⚡',  category: 'streak' },
  { id: 'gear_third',    title: 'Gear Third',     description: 'Get 10 correct in a row',  icon: '👑',  category: 'streak' },
  { id: 'unstoppable',   title: 'Unstoppable',    description: 'Get 15 correct in a row',  icon: '🌟',  category: 'streak' },

  // Volume
  { id: 'word_rookie',   title: 'Word Rookie',    description: 'Answer 10 words correctly',   icon: '📚', category: 'volume' },
  { id: 'word_hunter',   title: 'Word Hunter',    description: 'Answer 100 words correctly',  icon: '🎯', category: 'volume' },
  { id: 'word_master',   title: 'Word Master',    description: 'Answer 500 words correctly',  icon: '🏆', category: 'volume' },
  { id: 'pirate_scholar',title: 'Pirate Scholar', description: 'Answer 1000 words correctly', icon: '🦜', category: 'volume' },

  // World unlocks
  { id: 'animal_expert', title: 'Animal Expert',  description: 'Unlock the Animals world',   icon: '🦁', category: 'world' },
  { id: 'food_fanatic',  title: 'Food Fanatic',   description: 'Unlock the Food world',      icon: '🍕', category: 'world' },
  { id: 'color_wizard',  title: 'Color Wizard',   description: 'Unlock the Colors world',    icon: '🎨', category: 'world' },
  { id: 'family_champ',  title: 'Family Champ',   description: 'Unlock the Family world',    icon: '👨‍👩‍👧‍👦', category: 'world' },
  { id: 'body_language', title: 'Body Language',  description: 'Unlock the Body Parts world', icon: '💪', category: 'world' },

  // Consistency
  { id: 'daily_hunter',  title: 'Daily Hunter',   description: 'Complete a daily challenge',        icon: '📅', category: 'consistency' },
  { id: 'streak_7',      title: '7-Day Streak',   description: '7 consecutive daily challenges',    icon: '🗓️', category: 'consistency' },
  { id: 'streak_30',     title: '30-Day Streak',  description: '30 consecutive daily challenges',   icon: '🏅', category: 'consistency' },

  // Rank
  { id: 'rank_first_mate', title: 'Rank Up!',     description: 'Reach First Mate rank',   icon: '⚓', category: 'rank' },
  { id: 'rank_emperor',    title: 'Almost There', description: 'Reach Emperor rank',      icon: '👒', category: 'rank' },
]

export const ACHIEVEMENT_MAP: Record<string, Achievement> = Object.fromEntries(
  ACHIEVEMENTS.map(a => [a.id, a])
)
