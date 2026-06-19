export interface Track {
  id: string
  name: string
  icon: string
  description: string
  path: string
  color: string
  difficulty: 1 | 2 | 3 | 4 | 5
  estimatedMinutes: number
  modules: string[]
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  earned: boolean
  xpReward: number
  color: string
}

export interface UserState {
  xp: number
  level: number
  streak: number
  lastVisitDate: string
  trackProgress: Record<string, { completed: boolean; xpEarned: number }>
  achievements: Achievement[]
  solvedPuzzles: string[]
}
