# 🏴‍☠️ Palabra Hunter

A pirate-themed vocabulary game for kids. Learn 315 words in Spanish or Catalan starting from English across 15 thematic worlds, earn Berries, climb the pirate ranks, and complete daily challenges.

## Features

- **315 words** across 15 thematic worlds (Animals, Food, Colors, Family, Body, Numbers, Clothes, House, School, Nature, Fruits, Vegetables, Sports, Emotions, Actions)
- **Dual learning language** — switch between English→Spanish and English→Catalan at any time; progress tracked separately per language per world
- **Multiple-choice flashcards** — 4 options, 10-second timer per question, 10 words per round
- **Berry economy** — score multiplies with streak (×1.5 at 3, ×2 at 5, ×3 at 10)
- **Daily challenge** — seeded random 8-word mix across all worlds, ×3 berry multiplier
- **8 pirate ranks** — Cabin Boy → Pirate King
- **29 achievements** across streak, volume, world, consistency, and rank categories
- **Streak milestone banners** — ON FIRE! / GEAR SECOND! / GEAR THIRD! animations
- **Perfect round bonus** — +50 berries for all correct
- **Word progress per world** — bar fills as you correctly answer each word; turns green when mastered
- **Haptic feedback** (mobile) and Web Audio API sound effects (no audio files)
- **Multi-profile** — up to 6 pirates per device, persistent via localStorage
- **3 UI languages** — interface in EN / ES / CA
- **Settings panel** — sound, UI language, and learning language grouped under a ⚙️ gear icon
- **PWA** — installable, offline-capable

## Tech stack

| | |
|---|---|
| Framework | React 18 + TypeScript (strict) |
| Build | Vite 5 |
| State | Zustand 5 + persist middleware |
| Animation | Framer Motion 11 |
| Styling | Tailwind CSS 3 |
| PWA | vite-plugin-pwa + Workbox |
| Tests | Vitest 2 — 750 tests |
| Deploy | GitHub Actions → GitHub Pages |

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
npm run type-check
npm test
npm run build
```

## Project structure

```
src/
  audio/          Web Audio sound engine
  components/     WordCard, TimerRing, OptionsGrid, ParticleEmitter…
  config/         Achievements, daily challenge config, ranks
  data/
    worlds/       15 world files (20–30 words each)
  engine/         QuestionEngine, seeded RNG
  i18n/           EN / ES / CA UI translations
  screens/        StartScreen, HubScreen, GameScreen, ResultScreen…
  store/          gameStore, profileStore, settingsStore
  utils/          rankHelpers, achievementHelpers, haptics
```

## Worlds & berry unlock thresholds

| World | Berries | Words |
|-------|---------|-------|
| Animals 🦁 | Free | 30 |
| Food 🍕 | 300 | 30 |
| Colors 🎨 | 800 | 15 |
| Family 👨‍👩‍👧‍👦 | 1,500 | 15 |
| Body 💪 | 3,000 | 25 |
| Numbers 🔢 | 5,000 | 20 |
| Clothes 👕 | 8,000 | 20 |
| House 🏠 | 12,000 | 20 |
| School 📚 | 17,000 | 20 |
| Nature 🌿 | 23,000 | 20 |
| Fruits 🍓 | 30,000 | 20 |
| Vegetables 🥦 | 38,000 | 20 |
| Sports ⚽ | 48,000 | 20 |
| Emotions 😊 | 60,000 | 20 |
| Actions 🏃 | 75,000 | 20 |

## Score formula

```
streak < 3  → 10 pts
streak < 5  → 15 pts  (×1.5)
streak < 10 → 20 pts  (×2)
streak ≥ 10 → 30 pts  (×3)

daily multiplier: earned_berries × 3
perfect round: +50 bonus berries
```
