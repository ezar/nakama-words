import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { type Lang, detectLanguage } from '../i18n/translations'
import { type TargetLang } from '../data/words'
import { soundEngine } from '../audio/SoundEngine'

interface SettingsState {
  soundEnabled: boolean
  language: Lang
  learnLang: TargetLang
  toggleSound: () => void
  setLanguage: (lang: Lang) => void
  setLearnLang: (lang: TargetLang) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      soundEnabled: true,
      language: detectLanguage(),
      learnLang: 'es',
      toggleSound: () =>
        set(s => {
          const next = !s.soundEnabled
          soundEngine.setEnabled(next)
          return { soundEnabled: next }
        }),
      setLanguage: (language) => set({ language }),
      setLearnLang: (learnLang) => set({ learnLang }),
    }),
    { name: 'ph-settings' },
  ),
)
