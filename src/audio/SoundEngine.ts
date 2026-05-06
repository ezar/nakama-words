class SoundEngine {
  private ctx: AudioContext | null = null
  private enabled = true

  setEnabled(enabled: boolean) {
    this.enabled = enabled
  }

  private getCtx(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext()
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume()
    }
    return this.ctx
  }

  private tone(
    freq: number,
    duration: number,
    type: OscillatorType = 'sine',
    gain = 0.3,
    startDelay = 0,
  ) {
    if (!this.enabled) return
    try {
      const ctx = this.getCtx()
      const osc = ctx.createOscillator()
      const gainNode = ctx.createGain()
      osc.connect(gainNode)
      gainNode.connect(ctx.destination)
      osc.type = type
      osc.frequency.setValueAtTime(freq, ctx.currentTime + startDelay)
      gainNode.gain.setValueAtTime(gain, ctx.currentTime + startDelay)
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startDelay + duration)
      osc.start(ctx.currentTime + startDelay)
      osc.stop(ctx.currentTime + startDelay + duration)
    } catch {
      // AudioContext not available (SSR/test)
    }
  }

  playCorrect() {
    // Ascending chime 220→440 Hz
    this.tone(220, 0.08)
    this.tone(440, 0.12, 'sine', 0.25, 0.07)
  }

  playWrong() {
    // Low buzz
    this.tone(80, 0.2, 'sawtooth', 0.2)
  }

  playStreak() {
    // C major arpeggio
    const notes = [261.63, 329.63, 392, 523.25]
    notes.forEach((freq, i) => this.tone(freq, 0.12, 'sine', 0.2, i * 0.08))
  }

  playRankUp() {
    // Full ascending sequence
    const notes = [261.63, 329.63, 392, 523.25, 659.25, 783.99]
    notes.forEach((freq, i) => this.tone(freq, 0.15, 'sine', 0.25, i * 0.1))
  }

  playTick() {
    // Timer tick
    this.tone(600, 0.05, 'square', 0.15)
  }
}

export const soundEngine = new SoundEngine()
