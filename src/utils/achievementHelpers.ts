import { ACHIEVEMENTS } from '../config/achievements'
import type { WorldId } from '../data/words'

interface ProfileSnapshot {
  berries: number
  totalCorrect: number
  maxStreak: number
  dailyStreak: number
  unlockedWorlds: WorldId[]
  completedDaily: boolean
  earnedAchievements: string[]
}

const WORLD_ACHIEVEMENT: Partial<Record<WorldId, string>> = {
  animals:    'animal_expert',
  food:       'food_fanatic',
  colors:     'color_wizard',
  family:     'family_champ',
  body:       'body_language',
  numbers:    'number_cruncher',
  clothes:    'fashion_pirate',
  house:      'home_crew',
  school:     'top_student',
  nature:     'nature_lover',
  fruits:     'fruit_ninja',
  vegetables: 'veggie_hero',
  sports:     'sports_star',
  emotions:   'feel_it_all',
  actions:    'action_hero',
  transport:  'transport_ace',
  weather:    'weather_watcher',
  professions:  'career_explorer',
  instruments:  'music_maestro',
  countries:    'world_explorer',
  planets:      'space_cadet',
  shapes:       'geometry_genius',
  tools:        'master_builder',
  time:         'time_keeper',
}

export function checkNewAchievements(snapshot: ProfileSnapshot): string[] {
  const already = new Set(snapshot.earnedAchievements)
  const newOnes: string[] = []

  function check(id: string, condition: boolean) {
    if (condition && !already.has(id)) newOnes.push(id)
  }

  check('first_combo',    snapshot.maxStreak >= 3)
  check('gear_second',    snapshot.maxStreak >= 5)
  check('gear_third',     snapshot.maxStreak >= 10)
  check('unstoppable',    snapshot.maxStreak >= 15)

  check('word_rookie',    snapshot.totalCorrect >= 10)
  check('word_hunter',    snapshot.totalCorrect >= 100)
  check('word_master',    snapshot.totalCorrect >= 500)
  check('pirate_scholar', snapshot.totalCorrect >= 1000)

  for (const [worldId, achId] of Object.entries(WORLD_ACHIEVEMENT)) {
    check(achId, snapshot.unlockedWorlds.includes(worldId as WorldId))
  }

  check('daily_hunter', snapshot.completedDaily)
  check('streak_7',     snapshot.dailyStreak >= 7)
  check('streak_30',    snapshot.dailyStreak >= 30)

  check('rank_first_mate', snapshot.berries >= 3500)
  check('rank_emperor',    snapshot.berries >= 30000)

  return newOnes
}

export function getAchievementById(id: string) {
  return ACHIEVEMENTS.find(a => a.id === id)
}
