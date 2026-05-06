import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { type Lang, detectLanguage } from '../i18n/translations'
import { soundEngine } from '../audio/SoundEngine'

interface SettingsState {
  soundEnabled: boolean
  language: Lang
  toggleSound: () => void
  setLanguage: (lang: Lang) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      soundEnabled: true,
      language: detectLanguage(),
      toggleSound: () =>
        set(s => {
          const next = !s.soundEnabled
          soundEngine.setEnabled(next)
          return { soundEnabled: next }
        }),
      setLanguage: (language) => set({ language }),
    }),
    { name: 'ph-settings' },
  ),
)
