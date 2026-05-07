export function vibrate(pattern: number | number[]) {
  try {
    if ('vibrate' in navigator) navigator.vibrate(pattern)
  } catch {
    // ignore — not supported in all browsers
  }
}

export const HapticPattern = {
  correct: 40,
  wrong:   [80, 40, 80],
  streak:  [30, 20, 30, 20, 60],
  rankUp:  [50, 30, 50, 30, 100],
}
