import { useEffect } from 'react'
import { ConfettiCanvas } from '../components/ConfettiCanvas'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { useProfileStore } from '../store/profileStore'
import { useSettingsStore } from '../store/settingsStore'
import { StarRating } from '../components/StarRating'
import { getTranslations } from '../i18n/translations'
import { soundEngine } from '../audio/SoundEngine'
import { ACHIEVEMENT_MAP } from '../config/achievements'
import { WORLD_MAP } from '../data/words'

export function ResultScreen() {
  const { lastResult, setPhase, currentWorldId, resetRound, newAchievements, rankedUp, newRankLabel } = useGameStore()
  const { getActiveProfile } = useProfileStore()
  const { language, learnLang } = useSettingsStore()
  const t = getTranslations(language)

  useEffect(() => {
    if (rankedUp) soundEngine.playRankUp()
  }, [rankedUp])

  if (!lastResult) return null

  const { score, berriesEarned, maxStreak, correctWords, wrongWords, totalQuestions, perfectBonus, newlyUnlockedWorlds, gameOver } = lastResult

  const handleShare = async () => {
    const profile = getActiveProfile()
    const name = profile?.name ?? 'Pirate'

    // Load Bangers font into canvas context
    try {
      const f = new FontFace('Bangers', 'url(https://fonts.gstatic.com/s/bangers/v24/FeVQS0BTqb0h60ALNw.woff2)')
      await f.load()
      document.fonts.add(f)
    } catch { /* fallback to serif */ }

    const W = 800, H = 800
    const canvas = document.createElement('canvas')
    canvas.width = W; canvas.height = H
    const ctx = canvas.getContext('2d')!

    function rr(x: number, y: number, w: number, h: number, r: number) {
      ctx.beginPath()
      ctx.moveTo(x + r, y)
      ctx.lineTo(x + w - r, y); ctx.arcTo(x + w, y, x + w, y + r, r)
      ctx.lineTo(x + w, y + h - r); ctx.arcTo(x + w, y + h, x + w - r, y + h, r)
      ctx.lineTo(x + r, y + h); ctx.arcTo(x, y + h, x, y + h - r, r)
      ctx.lineTo(x, y + r); ctx.arcTo(x, y, x + r, y, r)
      ctx.closePath()
    }

    // Background gradient
    const bg = ctx.createLinearGradient(0, 0, 0, H)
    bg.addColorStop(0, '#0d2d4a')
    bg.addColorStop(1, '#0a2240')
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H)

    // Subtle dot grid
    ctx.fillStyle = 'rgba(255,255,255,0.025)'
    for (let x = 30; x < W; x += 40) for (let y = 30; y < H; y += 40) { ctx.beginPath(); ctx.arc(x, y, 1.5, 0, Math.PI * 2); ctx.fill() }

    // Gold border with glow
    ctx.shadowColor = '#f5c518'; ctx.shadowBlur = 16
    ctx.strokeStyle = '#f5c518'; ctx.lineWidth = 5
    rr(10, 10, W - 20, H - 20, 28); ctx.stroke()
    ctx.shadowBlur = 0

    ctx.textAlign = 'center'

    // Main emoji
    ctx.font = '80px serif'
    ctx.fillText(gameOver ? '💀' : perfectBonus > 0 ? '🌟' : '🏴‍☠️', W / 2, 110)

    // Title — Bangers font
    ctx.font = '64px Bangers, serif'; ctx.fillStyle = '#f5c518'
    ctx.letterSpacing = '6px'
    ctx.fillText('PALABRA HUNTER', W / 2, 178)
    ctx.letterSpacing = '0px'

    // Player name
    ctx.font = '28px Arial, sans-serif'; ctx.fillStyle = 'rgba(255,255,255,0.55)'
    ctx.fillText(name.toUpperCase(), W / 2, 215)

    // Divider
    ctx.strokeStyle = 'rgba(245,197,24,0.25)'; ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(80, 232); ctx.lineTo(W - 80, 232); ctx.stroke()

    // Stars
    const stars = Math.round((correctWords.length / Math.max(totalQuestions, 1)) * 3)
    ctx.font = '48px serif'; ctx.fillStyle = '#f5c518'
    ctx.fillText('★'.repeat(stars) + '☆'.repeat(3 - stars), W / 2, 290)

    // Stat boxes
    const stats = [
      { v: String(score),            l: 'SCORE',   c: '#ffffff' },
      { v: `🍇 ${berriesEarned}`,    l: 'BERRIES', c: '#f5c518' },
      { v: `🔥 ${maxStreak}`,        l: 'STREAK',  c: '#2dd4bf' },
    ]
    stats.forEach(({ v, l, c }, i) => {
      const bx = 44 + i * 244, by = 312
      ctx.fillStyle = 'rgba(255,255,255,0.06)'; rr(bx, by, 218, 96, 16); ctx.fill()
      ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 1; rr(bx, by, 218, 96, 16); ctx.stroke()
      ctx.font = '36px Bangers, serif'; ctx.fillStyle = c; ctx.fillText(v, bx + 109, by + 46)
      ctx.font = '16px Arial, sans-serif'; ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.fillText(l, bx + 109, by + 72)
    })

    // Correct/wrong bar
    const bw = W - 80, barX = 40, barY = 428, barH = 28
    ctx.fillStyle = 'rgba(255,255,255,0.06)'; rr(barX, barY, bw, barH, 14); ctx.fill()
    const cw = (correctWords.length / Math.max(totalQuestions, 1)) * bw
    if (cw > 2) { ctx.fillStyle = '#4ade80'; rr(barX, barY, cw, barH, 14); ctx.fill() }
    ctx.font = 'bold 15px Arial'; ctx.fillStyle = '#052010'
    if (correctWords.length > 0) ctx.fillText(`✓ ${correctWords.length}`, barX + Math.min(cw / 2, cw - 10), barY + 19)
    ctx.fillStyle = 'rgba(255,255,255,0.5)'
    if (wrongWords.length > 0) ctx.fillText(`✗ ${wrongWords.length}`, barX + cw + (bw - cw) / 2, barY + 19)

    // Word grid — 2 columns
    ctx.textAlign = 'left'
    const shown = correctWords.slice(0, 8)
    shown.forEach((w, i) => {
      const col = i % 2, row = Math.floor(i / 2)
      const wx = 44 + col * 368, wy = 482 + row * 66
      ctx.fillStyle = 'rgba(74,222,128,0.07)'; rr(wx - 6, wy - 28, 352, 58, 12); ctx.fill()
      ctx.font = '26px serif'; ctx.fillText(w.icon, wx, wy)
      ctx.font = 'bold 20px Arial, sans-serif'; ctx.fillStyle = 'rgba(255,255,255,0.88)'; ctx.fillText(w.en, wx + 36, wy)
      ctx.font = '16px Arial, sans-serif'; ctx.fillStyle = '#4ade80'; ctx.fillText(`→ ${w[learnLang] ?? w.es}`, wx + 36, wy + 22)
    })

    // Footer
    ctx.textAlign = 'center'
    ctx.font = '15px Arial, sans-serif'; ctx.fillStyle = 'rgba(255,255,255,0.18)'
    ctx.fillText(`palabrahunter.app · ${new Date().toLocaleDateString()}`, W / 2, H - 20)

    canvas.toBlob(async (blob) => {
      if (!blob) return
      const file = new File([blob], 'palabra-hunter.png', { type: 'image/png' })
      const fallbackText = `🏴‍☠️ ${name} — Palabra Hunter\n⭐ ${correctWords.length}/${totalQuestions} correct · 🍇 ${berriesEarned} · 🔥 ${maxStreak}`
      const shareData = { title: 'Palabra Hunter', text: fallbackText, files: [file] }
      if (navigator.canShare?.(shareData)) {
        await navigator.share(shareData).catch(() => null)
      } else if (navigator.share) {
        await navigator.share({ title: 'Palabra Hunter', text: fallbackText }).catch(() => null)
      } else {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a'); a.href = url; a.download = 'palabra-hunter.png'; a.click()
        URL.revokeObjectURL(url)
      }
    }, 'image/png')
  }

  return (
    <div className="flex flex-col h-full bg-op-ocean-dark">

      {perfectBonus > 0 && <ConfettiCanvas />}

      {/* ── Rank-up overlay ── */}
      <AnimatePresence>
        {rankedUp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex flex-col items-center justify-center bg-op-ocean-dark z-50 px-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1], rotate: [0, -8, 8, 0] }}
              transition={{ duration: 0.6, times: [0, 0.6, 0.8, 1] }}
              className="text-8xl mb-6"
            >
              🏴‍☠️
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <div className="font-title text-5xl text-op-gold tracking-widest mb-1">{t.rankUp}</div>
              <div className="font-body text-base text-white/60 mb-2">{t.newRank}</div>
              <div className="font-title text-4xl text-op-cyan">{newRankLabel}</div>
            </motion.div>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
              onClick={() => useGameStore.setState({ rankedUp: false })}
              className="mt-10 font-title text-2xl text-op-gold border-4 border-op-gold px-10 py-3 rounded-2xl shadow-manga"
            >
              ▶ CONTINUE
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Scrollable content ── */}
      <div className="flex-1 overflow-y-auto">

        {/* ── Hero header ── */}
        <div className="relative bg-gradient-to-b from-[#0d2d4a] to-op-ocean-dark pt-10 pb-6 px-5 text-center">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <div className="text-6xl mb-3">
              {gameOver ? '💀' : perfectBonus > 0 ? '🌟' : '🏴‍☠️'}
            </div>
            <h1 className={`font-title text-4xl tracking-widest ${gameOver ? 'text-op-red' : 'text-op-gold'}`}>
              {gameOver ? t.gameOver : perfectBonus > 0 ? t.perfectRound : t.roundComplete}
            </h1>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-4"
          >
            <StarRating correct={correctWords.length} total={totalQuestions} />
          </motion.div>
        </div>

        <div className="px-4 pb-4 flex flex-col gap-4">

          {/* ── Score strip ── */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="grid grid-cols-3 gap-3"
          >
            {[
              { value: score,                  label: t.points,        color: 'text-white'   },
              { value: `🍇 ${berriesEarned}`,  label: t.berriesEarned, color: 'text-op-gold' },
              { value: `🔥 ${maxStreak}`,       label: t.bestStreak,    color: 'text-op-cyan' },
            ].map((stat, i) => (
              <div key={i} className="bg-white/5 border-2 border-white/10 rounded-2xl py-4 px-2 text-center">
                <div className={`font-title text-2xl ${stat.color} leading-tight`}>{stat.value}</div>
                <div className="font-body text-[10px] text-white/40 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* ── Perfect round bonus ── */}
          {perfectBonus > 0 && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 400 }}
              className="border-4 border-op-gold bg-op-gold/15 rounded-2xl p-4 text-center"
            >
              <div className="font-title text-2xl text-op-gold">🌟 {t.perfectRound}</div>
              <div className="font-body text-sm text-op-gold/70 mt-1">+{perfectBonus} {t.perfectBonus} 🍇</div>
            </motion.div>
          )}

          {/* ── Correct / wrong count bar ── */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="rounded-2xl overflow-hidden flex h-8 border-2 border-white/10"
            style={{ transformOrigin: 'left' }}
          >
            <div
              className="bg-op-green flex items-center justify-center font-title text-sm text-op-ink"
              style={{ width: `${(correctWords.length / totalQuestions) * 100}%` }}
            >
              {correctWords.length > 0 && `✓ ${correctWords.length}`}
            </div>
            <div
              className="bg-op-red/60 flex items-center justify-center font-title text-sm text-white"
              style={{ width: `${(wrongWords.length / totalQuestions) * 100}%` }}
            >
              {wrongWords.length > 0 && `✗ ${wrongWords.length}`}
            </div>
          </motion.div>

          {/* ── Newly unlocked worlds ── */}
          {newlyUnlockedWorlds.length > 0 && (
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.28 }}
              className="border-2 border-op-cyan/50 bg-op-cyan/10 rounded-2xl p-4"
            >
              <div className="font-title text-lg text-op-cyan mb-3">🔓 {t.newWorldsUnlocked}</div>
              <div className="flex flex-col gap-2">
                {newlyUnlockedWorlds.map(wId => {
                  const world = WORLD_MAP[wId]
                  return (
                    <div key={wId} className="flex items-center gap-3 bg-op-cyan/10 rounded-xl px-3 py-2">
                      <span className="text-2xl">{world.emoji}</span>
                      <span className="font-title text-base text-op-cyan">{world.name}</span>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* ── New achievements ── */}
          {newAchievements.length > 0 && (
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="border-2 border-op-gold/50 bg-op-gold/10 rounded-2xl p-4"
            >
              <div className="font-title text-lg text-op-gold mb-3">🏆 ¡Nuevos logros!</div>
              <div className="flex flex-col gap-2">
                {newAchievements.map(id => {
                  const ach = ACHIEVEMENT_MAP[id]
                  if (!ach) return null
                  return (
                    <div key={id} className="flex items-center gap-3 bg-op-gold/10 rounded-xl px-3 py-2">
                      <span className="text-2xl">{ach.icon}</span>
                      <div>
                        <div className="font-title text-base text-op-gold leading-tight">{ach.title}</div>
                        <div className="font-body text-xs text-white/40">{ach.description}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* ── Words learned ── */}
          {correctWords.length > 0 && (
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="border-2 border-op-green/40 bg-op-green/5 rounded-2xl p-4"
            >
              <div className="font-title text-lg text-op-green mb-3">✓ {t.wordsLearned}</div>
              <div className="flex flex-col gap-2">
                {correctWords.map((w, i) => (
                  <motion.div
                    key={w.en}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + i * 0.04 }}
                    className="flex items-center justify-between bg-white/5 rounded-xl px-3 py-2"
                  >
                    <span className="font-body text-sm text-white/70 flex items-center gap-2">
                      <span className="text-lg">{w.icon}</span>
                      {w.en}
                    </span>
                    <span className="font-title text-base text-op-green">→ {w[learnLang] ?? w.es}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── Words to practice ── */}
          {wrongWords.length > 0 && (
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="border-2 border-op-red/30 bg-op-red/5 rounded-2xl p-4"
            >
              <div className="font-title text-lg text-op-red mb-3">✗ {t.practiceMore}</div>
              <div className="flex flex-col gap-2">
                {wrongWords.map((w, i) => (
                  <motion.div
                    key={w.en}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.04 }}
                    className="flex items-center justify-between bg-white/5 rounded-xl px-3 py-2"
                  >
                    <span className="font-body text-sm text-white/50 flex items-center gap-2">
                      <span className="text-lg">{w.icon}</span>
                      {w.en}
                    </span>
                    <span className="font-title text-base text-op-red/80">→ {w[learnLang] ?? w.es}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

        </div>
      </div>

      {/* ── Action buttons — always visible at the bottom ── */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.45 }}
        className="flex-shrink-0 flex flex-col gap-2 px-4 pb-4 pt-2 border-t border-white/5"
      >
        <div className="flex gap-3">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => { resetRound(); setPhase('hub') }}
            className="flex-1 py-4 rounded-2xl border-4 border-white/20 text-white/60 font-title text-xl hover:border-op-cyan hover:text-op-cyan transition-colors"
          >
            🏴‍☠️ HUB
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => { resetRound(); if (currentWorldId) useGameStore.getState().startRound(currentWorldId) }}
            className="flex-[2] py-4 rounded-2xl border-4 border-op-ink bg-op-gold text-op-ink font-title text-2xl shadow-manga hover:brightness-105 transition-all"
          >
            {t.playAgain}
          </motion.button>
        </div>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={handleShare}
          className="w-full py-2.5 rounded-2xl border-2 border-white/15 text-white/40 font-body text-sm hover:text-white/70 transition-colors flex items-center justify-center gap-2"
        >
          📤 {t.shareResult}
        </motion.button>
      </motion.div>
    </div>
  )
}
