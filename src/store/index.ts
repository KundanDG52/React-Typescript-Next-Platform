import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserState } from '../types'
import { ACHIEVEMENTS, getLevelFromXP } from '../utils/constants'

interface AppStore extends UserState {
  addXP: (n: number) => void
  completeTrack: (id: string) => void
  solvePuzzle: (id: string) => void
  checkAchievement: (id: string) => void
  updateStreak: () => void
  reset: () => void
}

const initial: UserState = {
  xp: 0, level: 1, streak: 0, lastVisitDate: '',
  trackProgress: {}, achievements: ACHIEVEMENTS.map(a => ({ ...a })), solvedPuzzles: [],
}

export const useStore = create<AppStore>()(
  persist((set, get) => ({
    ...initial,
    addXP: (n) => set(s => { const xp = s.xp + n; return { xp, level: getLevelFromXP(xp) } }),
    completeTrack: (id) => {
      set(s => {
        if (s.trackProgress[id]?.completed) return s
        const xp = s.xp + 100
        return { xp, level: getLevelFromXP(xp), trackProgress: { ...s.trackProgress, [id]: { completed: true, xpEarned: 100 } } }
      })
      get().checkAchievement('first_step')
      const map: Record<string, string> = { hooks: 'hook_master', performance: 'perf_guru', patterns: 'pattern_pro', internals: 'fiber_wizard', typescript: 'type_wizard', nextjs: 'app_router_architect' }
      if (map[id]) get().checkAchievement(map[id])
      const all = ['fundamentals', 'hooks', 'performance', 'patterns', 'internals', 'typescript', 'nextjs']
      if (all.every(t => get().trackProgress[t]?.completed)) get().checkAchievement('completionist')
    },
    solvePuzzle: (id) => {
      set(s => s.solvedPuzzles.includes(id) ? s : { xp: s.xp + 50, level: getLevelFromXP(s.xp + 50), solvedPuzzles: [...s.solvedPuzzles, id] })
      if (get().solvedPuzzles.length >= 3) get().checkAchievement('puzzle_solver')
    },
    checkAchievement: (id) => set(s => ({ achievements: s.achievements.map(a => a.id === id && !a.earned ? { ...a, earned: true } : a) })),
    updateStreak: () => {
      const today = new Date().toDateString()
      if (get().lastVisitDate === today) return
      const yest = new Date(Date.now() - 864e5).toDateString()
      const streak = get().lastVisitDate === yest ? get().streak + 1 : 1
      set({ lastVisitDate: today, streak })
      if (streak >= 7) get().checkAchievement('streak_7')
    },
    reset: () => set({ ...initial }),
  }), { name: 'react-platform-v1' })
)
