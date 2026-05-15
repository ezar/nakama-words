import { useMemo, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { useProfileStore } from '../store/profileStore'
import { useSettingsStore } from '../store/settingsStore'
import { WORLDS } from '../data/words'
import { getTranslations } from '../i18n/translations'
import { todayString } from '../engine/rng'

type Tab    = 'calendar' | 'words'
type Filter = 'all' | 'struggling' | 'learning' | 'mastered'

const LANG_VOICE: Record<string, string> = { es: 'es-ES', ca: 'ca-ES', en: 'en-US' }

function speak(en: string, translation: string, learnLang: string) {
  if (!window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const targetLang = LANG_VOICE[learnLang] ?? 'es-ES'
  const u1 = new SpeechSynthesisUtterance(en)
  u1.lang = 'en-US'
  u1.rate = 0.9
  const u2 = new SpeechSynthesisUtterance(translation)
  u2.lang = targetLang
  u2.rate = 0.9
  window.speechSynthesis.speak(u1)
  window.speechSynthesis.speak(u2)
}

function accuracy(c: number, w: number) {
  const total = c + w
  return total === 0 ? 1 : c / total
}

function buildCalendarDays(playedSet: Set<string>, weeks = 12) {
  const days: { date: string; played: boolean; isToday: boolean }[] = []
  const today = todayString()

  // Start from the Monday of `weeks` weeks ago
  const start = new Date()
  start.setDate(start.getDate() - (weeks * 7 - 1))

  for (let i = 0; i < weeks * 7; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    const str = d.toISOString().slice(0, 10).replace(/-/g, '')
    days.push({ date: str, played: playedSet.has(str), isToday: str === today })
  }
  return days
}

function longestStreakFrom(played: string[]): number {
  if (played.length === 0) return 0
  const sorted = [...played].sort()
  let best = 1, cur = 1
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]!.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'))
    const curr = new Date(sorted[i]!.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'))
    const diff = (curr.getTime() - prev.getTime()) / 86400000
    cur = diff === 1 ? cur + 1 : 1
    best = Math.max(best, cur)
  }
  return best
}

export function WordStatsScreen() {
  const { setPhase } = useGameStore()
  const { getActiveProfile } = useProfileStore()
  const { language, learnLang } = useSettingsStore()
  const t = getTranslations(language)

  const [tab, setTab] = useState<Tab>('calendar')
  const [filter, setFilter] = useState<Filter>('all')
  const [speaking, setSpeaking] = useState<string | null>(null)

  const handleSpeak = useCallback((en: string, translation: string) => {
    setSpeaking(en)
    speak(en, translation, learnLang)
    const total = (en.length + translation.length) * 70 + 800
    setTimeout(() => setSpeaking(null), total)
  }, [learnLang])

  const profile = getActiveProfile()
  if (!profile) { setPhase('hub'); return null }

  // ── Calendar data ──────────────────────────────────────────
  const playedSet = useMemo(() => new Set(profile.playedDates ?? []), [profile.playedDates])
  const calDays   = useMemo(() => buildCalendarDays(playedSet, 12), [playedSet])
  const totalDays = playedSet.size
  const longest   = useMemo(() => longestStreakFrom([...playedSet]), [playedSet])

  // Group into weeks (columns) for the grid
  const weeks = useMemo(() => {
    const w: typeof calDays[] = []
    for (let i = 0; i < calDays.length; i += 7) w.push(calDays.slice(i, i + 7))
    return w
  }, [calDays])

  // ── Words data ─────────────────────────────────────────────
  const wordMap = useMemo(() => {
    const map = new Map<string, { icon: string; en: string; translation: string; world: string }>()
    for (const world of WORLDS) {
      for (const w of world.words) {
        map.set(w.en, { icon: w.icon, en: w.en, translation: w[learnLang] ?? w.es, world: world.label })
      }
    }
    return map
  }, [learnLang])

  const langStats = (profile.wordStats ?? {})[learnLang] ?? {}

  const rows = useMemo(() => {
    return Object.entries(langStats)
      .map(([key, { c, w }]) => {
        const info = wordMap.get(key)
        if (!info) return null
        const acc = accuracy(c, w)
        return { ...info, c, w, acc, total: c + w }
      })
      .filter(Boolean)
      .sort((a, b) => a!.acc - b!.acc) as Array<{
        icon: string; en: string; translation: string; world: string
        c: number; w: number; acc: number; total: number
      }>
  }, [langStats, wordMap])

  const filtered = filter === 'all' ? rows
    : filter === 'struggling' ? rows.filter(r => r.acc < 0.5)
    : filter === 'learning'   ? rows.filter(r => r.acc >= 0.5 && r.acc < 0.85)
    : rows.filter(r => r.acc >= 0.85)

  const counts = {
    struggling: rows.filter(r => r.acc < 0.5).length,
    learning:   rows.filter(r => r.acc >= 0.5 && r.acc < 0.85).length,
    mastered:   rows.filter(r => r.acc >= 0.85).length,
  }

  function wordLabel(r: typeof rows[0]) {
    if (r.acc < 0.5)  return { color: 'text-op-red',   bar: 'bg-op-red' }
    if (r.acc < 0.85) return { color: 'text-op-gold',  bar: 'bg-op-gold' }
    return               { color: 'text-op-green', bar: 'bg-op-green' }
  }

  const FILTERS: { key: Filter; label: string; count?: number }[] = [
    { key: 'all',        label: 'ALL',               count: rows.length },
    { key: 'struggling', label: `🔴 ${t.struggling}`, count: counts.struggling },
    { key: 'learning',   label: `🟡 ${t.learning}`,   count: counts.learning },
    { key: 'mastered',   label: `🟢 ${t.mastered}`,   count: counts.mastered },
  ]

  const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

  return (
    <div className="flex flex-col h-full bg-op-ocean-dark">

      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3 flex-shrink-0">
        <button
          onClick={() => setPhase('hub')}
          className="font-body text-op-cyan/70 hover:text-op-cyan text-sm"
        >
          ← {t.back}
        </button>
        <h1 className="font-title text-lg text-op-gold tracking-widest">{t.progressTitle}</h1>
        <div className="w-12" />
      </div>

      {/* Tab selector */}
      <div className="flex gap-2 px-4 mb-3 flex-shrink-0">
        {([['calendar', `📅 ${t.calendarTab}`], ['words', `📊 ${t.wordsTab}`]] as [Tab, string][]).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 py-2 rounded-xl border-2 font-title text-sm uppercase tracking-widest transition-colors ${
              tab === key
                ? 'border-op-gold bg-op-gold/20 text-op-gold'
                : 'border-white/15 text-white/40 hover:text-white/60'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">

        {/* ── CALENDAR TAB ── */}
        {tab === 'calendar' && (
          <motion.div
            key="calendar"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 16 }}
            transition={{ duration: 0.15 }}
            className="flex-1 overflow-y-auto px-4 pb-6 flex flex-col gap-5"
          >
            {/* Stats strip */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: totalDays,  label: t.daysPlayed,    icon: '📅' },
                { value: longest,    label: t.longestStreak,  icon: '🔥' },
              ].map((s, i) => (
                <div key={i} className="bg-white/5 border-2 border-white/10 rounded-2xl py-4 text-center">
                  <div className="text-2xl mb-1">{s.icon}</div>
                  <div className="font-title text-3xl text-op-gold">{s.value}</div>
                  <div className="font-body text-[10px] text-white/40 mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            {totalDays === 0 ? (
              <div className="flex flex-col items-center justify-center flex-1 gap-4 text-center px-8">
                <span className="text-5xl">📅</span>
                <p className="font-body text-white/40 text-sm">{t.noStats}</p>
              </div>
            ) : (
              <div>
                {/* Day-of-week labels */}
                <div className="flex gap-1 mb-1 pl-0">
                  {DAY_LABELS.map((d, i) => (
                    <div key={i} className="flex-1 text-center font-body text-[9px] text-white/25">{d}</div>
                  ))}
                </div>
                {/* Week columns rendered as rows */}
                <div className="flex gap-1">
                  {weeks.map((week, wi) => (
                    <div key={wi} className="flex-1 flex flex-col gap-1">
                      {week.map(day => (
                        <div
                          key={day.date}
                          className={`aspect-square rounded-sm transition-all ${
                            day.played
                              ? day.isToday ? 'bg-op-cyan' : 'bg-op-green/80'
                              : day.isToday ? 'bg-white/15 ring-1 ring-op-cyan/50' : 'bg-white/8'
                          }`}
                        />
                      ))}
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-end gap-2 mt-3">
                  <div className="w-3 h-3 rounded-sm bg-white/8" />
                  <span className="font-body text-[9px] text-white/30">No</span>
                  <div className="w-3 h-3 rounded-sm bg-op-green/80" />
                  <span className="font-body text-[9px] text-white/30">Yes</span>
                  <div className="w-3 h-3 rounded-sm bg-op-cyan" />
                  <span className="font-body text-[9px] text-white/30">Today</span>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ── WORDS TAB ── */}
        {tab === 'words' && (
          <motion.div
            key="words"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.15 }}
            className="flex-1 flex flex-col min-h-0"
          >
            {/* Filter chips */}
            <div className="flex gap-2 px-4 mb-3 flex-shrink-0 overflow-x-auto">
              {FILTERS.map(f => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 font-title text-xs transition-colors ${
                    filter === f.key
                      ? 'border-op-gold bg-op-gold/20 text-op-gold'
                      : 'border-white/15 text-white/40 hover:text-white/70'
                  }`}
                >
                  {f.label}
                  {f.count !== undefined && (
                    <span className={`font-body text-[10px] ${filter === f.key ? 'text-op-gold/70' : 'text-white/25'}`}>
                      {f.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Word list */}
            <div className="flex-1 overflow-y-auto px-4 pb-6">
              {rows.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-8">
                  <span className="text-5xl">🎯</span>
                  <p className="font-body text-white/40 text-sm">{t.noStats}</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <p className="font-body text-white/30 text-sm">No words in this category yet</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {filtered.map((row, i) => {
                    const l = wordLabel(row)
                    return (
                      <motion.div
                        key={row.en}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.02 }}
                        className="bg-op-ink/20 rounded-2xl border border-white/8 px-4 py-3 flex items-center gap-3"
                      >
                        <span className="text-2xl leading-none flex-shrink-0">{row.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-2">
                            <span className="font-title text-sm text-white/90">{row.en}</span>
                            <span className="font-body text-xs text-white/40">→</span>
                            <span className={`font-title text-sm ${l.color}`}>{row.translation}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${l.bar}`}
                                style={{ width: `${row.acc * 100}%` }}
                              />
                            </div>
                            <span className={`font-body text-[10px] flex-shrink-0 ${l.color}`}>
                              {Math.round(row.acc * 100)}%
                            </span>
                          </div>
                          <div className="font-body text-[10px] text-white/25 mt-0.5">
                            ✓{row.c} ✗{row.w} · {row.total} {t.attempts} · {row.world}
                          </div>
                        </div>
                        <button
                          onClick={() => handleSpeak(row.en, row.translation)}
                          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                            speaking === row.en
                              ? 'bg-op-cyan/30 text-op-cyan'
                              : 'bg-white/8 text-white/40 hover:bg-white/15 hover:text-white/70'
                          }`}
                        >
                          {speaking === row.en ? '🔊' : '🔈'}
                        </button>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}
