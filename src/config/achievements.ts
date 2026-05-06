export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  category: 'streak' | 'volume' | 'world' | 'consistency' | 'rank'
}

export const ACHIEVEMENTS: Achievement[] = [
  // Streak
  { id: 'first_combo',    title: 'First Combo',      description: 'Get 3 correct in a row',    icon: '🔥',  category: 'streak' },
  { id: 'gear_second',    title: 'Gear Second',      description: 'Get 5 correct in a row',    icon: '⚡',  category: 'streak' },
  { id: 'gear_third',     title: 'Gear Third',       description: 'Get 10 correct in a row',   icon: '👑',  category: 'streak' },
  { id: 'unstoppable',    title: 'Unstoppable',      description: 'Get 15 correct in a row',   icon: '🌟',  category: 'streak' },

  // Volume
  { id: 'word_rookie',    title: 'Word Rookie',      description: 'Answer 10 words correctly',   icon: '📚', category: 'volume' },
  { id: 'word_hunter',    title: 'Word Hunter',      description: 'Answer 100 words correctly',  icon: '🎯', category: 'volume' },
  { id: 'word_master',    title: 'Word Master',      description: 'Answer 500 words correctly',  icon: '🏆', category: 'volume' },
  { id: 'pirate_scholar', title: 'Pirate Scholar',   description: 'Answer 1000 words correctly', icon: '🦜', category: 'volume' },

  // World unlocks (15 worlds)
  { id: 'animal_expert',  title: 'Animal Expert',    description: 'Unlock Animals world',        icon: '🦁', category: 'world' },
  { id: 'food_fanatic',   title: 'Food Fanatic',     description: 'Unlock Food world',           icon: '🍕', category: 'world' },
  { id: 'color_wizard',   title: 'Color Wizard',     description: 'Unlock Colors world',         icon: '🎨', category: 'world' },
  { id: 'family_champ',   title: 'Family Champ',     description: 'Unlock Family world',         icon: '👨‍👩‍👧‍👦', category: 'world' },
  { id: 'body_language',  title: 'Body Language',    description: 'Unlock Body Parts world',     icon: '💪', category: 'world' },
  { id: 'number_cruncher',title: 'Number Cruncher',  description: 'Unlock Numbers world',        icon: '🔢', category: 'world' },
  { id: 'fashion_pirate', title: 'Fashion Pirate',   description: 'Unlock Clothes world',        icon: '👕', category: 'world' },
  { id: 'home_crew',      title: 'Home Crew',        description: 'Unlock House world',          icon: '🏠', category: 'world' },
  { id: 'top_student',    title: 'Top Student',      description: 'Unlock School world',         icon: '📚', category: 'world' },
  { id: 'nature_lover',   title: 'Nature Lover',     description: 'Unlock Nature world',         icon: '🌿', category: 'world' },
  { id: 'fruit_ninja',    title: 'Fruit Ninja',      description: 'Unlock Fruits world',         icon: '🍓', category: 'world' },
  { id: 'veggie_hero',    title: 'Veggie Hero',      description: 'Unlock Vegetables world',     icon: '🥦', category: 'world' },
  { id: 'sports_star',    title: 'Sports Star',      description: 'Unlock Sports world',         icon: '⚽', category: 'world' },
  { id: 'feel_it_all',    title: 'Feel It All',      description: 'Unlock Emotions world',       icon: '😊', category: 'world' },
  { id: 'action_hero',    title: 'Action Hero',      description: 'Unlock Actions world',        icon: '🏃', category: 'world' },

  // Consistency
  { id: 'daily_hunter',   title: 'Daily Hunter',     description: 'Complete a daily challenge',          icon: '📅', category: 'consistency' },
  { id: 'streak_7',       title: '7-Day Streak',     description: '7 consecutive daily challenges',      icon: '🗓️', category: 'consistency' },
  { id: 'streak_30',      title: '30-Day Streak',    description: '30 consecutive daily challenges',     icon: '🏅', category: 'consistency' },

  // Rank
  { id: 'rank_first_mate',title: 'Rank Up!',         description: 'Reach First Mate rank',      icon: '⚓', category: 'rank' },
  { id: 'rank_emperor',   title: 'Almost There',     description: 'Reach Emperor rank',         icon: '👒', category: 'rank' },
]

export const ACHIEVEMENT_MAP: Record<string, Achievement> = Object.fromEntries(
  ACHIEVEMENTS.map(a => [a.id, a])
)
