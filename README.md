# 🏴‍☠️ Palabra Hunter

A mobile-first pirate-themed vocabulary game for kids. Learn 315 words in Spanish or Catalan from English across 15 thematic worlds, earn Berries, climb pirate ranks, and complete daily challenges.

## Features

- **315 words** across 15 thematic worlds — Animals, Food, Colors, Family, Body, Numbers, Clothes, House, School, Nature, Fruits, Vegetables, Sports, Emotions, Actions
- **Dual learning language** — English→Spanish or English→Catalan, switchable any time; word progress tracked separately per language per world
- **Multiple-choice flashcards** — 4 options, 10-second timer, 8 words per round
- **Berry economy** — score multiplies with streak (×1.5 at 3, ×2 at 5, ×3 at 10)
- **Daily challenge** — seeded random 8-word mix across all worlds, ×3 berry multiplier
- **8 pirate ranks** — Cabin Boy → Pirate King
- **33 achievements** across 5 categories: streak, volume, world, consistency, rank
- **Streak milestone banners** — ON FIRE! / GEAR SECOND! / GEAR THIRD! animations
- **Perfect round bonus** — +50 berries for all 8 correct
- **Per-world progress bar** — tracks which words mastered per language; turns green when complete
- **Haptic feedback** (Vibration API) and synthesised sound effects (Web Audio API, no audio files)
- **Multi-profile** — up to 6 pirates per device, persistent via localStorage
- **3 UI languages** — interface in EN / ES / CA, auto-detected on first launch
- **Settings panel** — sound, UI language, and learning language grouped under a ⚙️ gear icon bottom sheet
- **PWA** — installable, offline-capable, standalone display

## Tech stack

| | |
|---|---|
| Framework | React 18 + TypeScript 5 (strict) |
| Build | Vite 5 |
| State | Zustand 5 + persist middleware (localStorage) |
| Animation | Framer Motion 11 |
| Styling | Tailwind CSS 3 |
| PWA | vite-plugin-pwa + Workbox |
| Tests | Vitest 2 — 750 tests |

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
npm run type-check
npm test
npm run build
```

## Screens

| Screen | Phase | Description |
|--------|-------|-------------|
| StartScreen | `start` | Profile creation and selection |
| HubScreen | `hub` | World grid, daily challenge, rank HUD |
| GameScreen | `game` | Live round — timer, feedback, streak banners |
| ResultScreen | `result` | Score, berries earned, word review, unlocks |
| RankingScreen | `ranking` | All profiles sorted by berries |
| AchievementsScreen | `achievements` | 33 achievements with progress across 5 categories |

## Project structure

```
src/
  audio/          SoundEngine — Web Audio API synthesiser
  components/     WordCard, TimerRing, OptionsGrid, ParticleEmitter
  config/         achievements.ts, daily.ts, ranks.ts
  data/
    words.ts      World index, shared types (WordEntry, WorldId, TargetLang)
    worlds/       15 world files (20–30 words each)
  engine/         QuestionEngine.ts, rng.ts (Mulberry32 seeded RNG)
  i18n/           translations.ts — EN / ES / CA strings
  screens/        6 screen components
  store/          gameStore, profileStore, settingsStore
  utils/          rankHelpers, achievementHelpers, haptics
```

## Worlds & unlock thresholds

| World | Emoji | Berries | Words |
|-------|-------|---------|-------|
| Animals | 🦁 | Free | 30 |
| Food | 🍕 | 300 | 30 |
| Colors | 🎨 | 800 | 15 |
| Family | 👨‍👩‍👧‍👦 | 1,500 | 15 |
| Body | 💪 | 3,000 | 25 |
| Numbers | 🔢 | 5,000 | 20 |
| Clothes | 👕 | 8,000 | 20 |
| House | 🏠 | 12,000 | 20 |
| School | 📚 | 17,000 | 20 |
| Nature | 🌿 | 23,000 | 20 |
| Fruits | 🍓 | 30,000 | 20 |
| Vegetables | 🥦 | 38,000 | 20 |
| Sports | ⚽ | 48,000 | 20 |
| Emotions | 😊 | 60,000 | 20 |
| Actions | 🏃 | 75,000 | 20 |

## Rank system

| Rank | Label | Berries |
|------|-------|---------|
| 1 | Cabin Boy | 0 |
| 2 | Sailor | 500 |
| 3 | Pirate | 1,500 |
| 4 | First Mate | 3,500 |
| 5 | Captain | 7,000 |
| 6 | Warlord | 15,000 |
| 7 | Emperor | 30,000 |
| 8 | Pirate King | 60,000 |

## Achievements (33 total)

| Category | Count | Examples |
|----------|-------|---------|
| Streak | 4 | 🔥 first_combo (3), ⚡ gear_second (5), 👑 gear_third (10), 🌟 unstoppable (15) |
| Volume | 4 | 📚 word_rookie (10 correct), 🎯 word_hunter (100), 🏆 word_master (500), 🦜 pirate_scholar (1000) |
| World | 15 | One per world unlocked (e.g. animal_expert, food_fanatic, …, action_hero) |
| Consistency | 3 | 📅 daily_hunter (1st daily), 🗓️ streak_7 (7 consecutive), 🏅 streak_30 (30 consecutive) |
| Rank | 2 | ⚓ rank_first_mate (3,500 🍇), 👒 rank_emperor (30,000 🍇) |

## Score formula

```
streak 0–2  → 10 pts per question
streak 3–4  → 15 pts  (×1.5)
streak 5–9  → 20 pts  (×2)
streak ≥ 10 → 30 pts  (×3)

perfect round bonus:  +50 berries (all 8 correct)
daily multiplier:     × 3 applied to total berries earned
```

## Data model

### WordEntry
```ts
interface WordEntry {
  en: string    // English (uppercase)
  es: string    // Spanish (uppercase)
  ca?: string   // Catalan (uppercase, optional)
  hint: string  // Player-facing clue
  icon: string  // Emoji
}
```

### Profile
```ts
interface Profile {
  id: string
  name: string
  berries: number
  totalCorrect: number
  maxEverStreak: number
  dailyStreak: number
  lastDailyDate: string | null          // YYYYMMDD
  unlockedWorlds: WorldId[]
  achievements: string[]
  createdAt: number
  wordProgress: Partial<Record<TargetLang, Partial<Record<WorldId, string[]>>>>
}
```

## Design system

Custom Tailwind tokens:

| Token | Value | Use |
|-------|-------|-----|
| `op-ocean-dark` | `#0a2240` | Primary background |
| `op-gold` | `#FFD600` | Accent, berries, rank |
| `op-cyan` | `#00E5FF` | Highlights, secondary |
| `op-green` | `#00E676` | Correct answers, mastered |
| `op-red` | `#D32F2F` | Wrong answers, danger |
| `op-parchment` | `#FFF8E1` | Card backgrounds |
| `op-ink` | `#1A1A1A` | Text, borders |
| `shadow-manga` | `5px 5px 0 #1A1A1A` | Comic book drop shadow |
| `font-title` | Bangers | Headers, scores |
| `font-body` | Nunito | Body text, labels |
