import type { Track, Achievement } from '../types'

export const TRACKS: Track[] = [
  { id: 'fundamentals', name: 'React Fundamentals', icon: '⚛️', description: 'JSX, components, props/state, Virtual DOM & reconciliation', path: '/fundamentals', color: '#61dafb', difficulty: 1, estimatedMinutes: 60, modules: ['JSX Explorer', 'Lifecycle', 'Props & State', 'Virtual DOM'] },
  { id: 'hooks', name: 'Hooks Deep Dive', icon: '🪝', description: 'useState, useEffect, useRef, useMemo, context, reducer & custom', path: '/hooks', color: '#818cf8', difficulty: 2, estimatedMinutes: 90, modules: ['useState', 'useEffect', 'useRef', 'useMemo', 'useContext', 'useReducer', 'Custom Hooks'] },
  { id: 'performance', name: 'Performance', icon: '⚡', description: 'memo, lazy loading, concurrent features, profiling', path: '/performance', color: '#22c55e', difficulty: 3, estimatedMinutes: 75, modules: ['React.memo', 'Code Splitting', 'Concurrent (18)', 'Profiler'] },
  { id: 'patterns', name: 'Advanced Patterns', icon: '🧩', description: 'HOCs, render props, compound components, portals, error boundaries', path: '/patterns', color: '#a855f7', difficulty: 4, estimatedMinutes: 90, modules: ['HOC', 'Render Props', 'Compound', 'Controlled', 'Error Boundary', 'Portals', 'forwardRef'] },
  { id: 'internals', name: 'React Internals', icon: '🔬', description: 'Fiber architecture, work loop, priority lanes, reconciliation', path: '/internals', color: '#ec4899', difficulty: 5, estimatedMinutes: 60, modules: ['Fiber Tree', 'Work Loop', 'Priority Lanes', 'Reconciliation'] },
  { id: 'typescript', name: 'TypeScript Mastery', icon: '🔷', description: 'Types, narrowing, generics, utility & advanced types, decorators, TS + React, tsconfig', path: '/typescript', color: '#3178c6', difficulty: 4, estimatedMinutes: 120, modules: ['Type System', 'Narrowing', 'Generics', 'Utility Types', 'Advanced Types', 'Decorators', 'TS + React', 'tsconfig'] },
  { id: 'nextjs', name: 'Next.js Mastery', icon: '▲', description: 'App Router, Server Components, rendering strategies, caching, Server Actions, deployment & auth', path: '/nextjs', color: '#ffffff', difficulty: 5, estimatedMinutes: 150, modules: ['App Router', 'Rendering', 'Data Fetching', 'Caching', 'Performance', 'Deployment', 'Auth', 'Projects'] },
]

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_step', name: 'First Render', description: 'Complete your first track', icon: '🚀', earned: false, xpReward: 50, color: '#61dafb' },
  { id: 'hook_master', name: 'Hook Master', description: 'Finish the Hooks track', icon: '🪝', earned: false, xpReward: 150, color: '#818cf8' },
  { id: 'perf_guru', name: 'Performance Guru', description: 'Master optimization', icon: '⚡', earned: false, xpReward: 150, color: '#22c55e' },
  { id: 'pattern_pro', name: 'Pattern Pro', description: 'Learn all advanced patterns', icon: '🧩', earned: false, xpReward: 200, color: '#a855f7' },
  { id: 'fiber_wizard', name: 'Fiber Wizard', description: 'Understand React internals', icon: '🔬', earned: false, xpReward: 250, color: '#ec4899' },
  { id: 'puzzle_solver', name: 'Puzzle Solver', description: 'Solve 3 puzzles', icon: '🧠', earned: false, xpReward: 100, color: '#f59e0b' },
  { id: 'type_wizard', name: 'Type Wizard', description: 'Finish the TypeScript track', icon: '🔷', earned: false, xpReward: 200, color: '#3178c6' },
  { id: 'generic_guru', name: 'Generic Guru', description: 'Master generics with Stack<T>', icon: '🧬', earned: false, xpReward: 150, color: '#3178c6' },
  { id: 'inference_master', name: 'Inference Master', description: 'Ace a type-inference puzzle', icon: '🔮', earned: false, xpReward: 150, color: '#3178c6' },
  { id: 'app_router_architect', name: 'App Router Architect', description: 'Finish the Next.js track', icon: '▲', earned: false, xpReward: 200, color: '#ffffff' },
  { id: 'cache_whisperer', name: 'Cache Whisperer', description: 'Trace all 4 Next.js cache layers', icon: '⚡', earned: false, xpReward: 150, color: '#e5e5e5' },
  { id: 'edge_native', name: 'Edge Native', description: 'Explore the Edge runtime', icon: '🌐', earned: false, xpReward: 150, color: '#e5e5e5' },
  { id: 'streak_7', name: '7-Day Streak', description: 'Visit 7 days running', icon: '🔥', earned: false, xpReward: 100, color: '#f59e0b' },
  { id: 'completionist', name: 'Completionist', description: 'Finish every track', icon: '💎', earned: false, xpReward: 500, color: '#ec4899' },
]

export const LEADERBOARD = [
  { name: 'Dan A.', xp: 5200, level: 12, avatar: 'D', color: '#61dafb' },
  { name: 'Sophie K.', xp: 4400, level: 11, avatar: 'S', color: '#a855f7' },
  { name: 'Marco B.', xp: 3850, level: 10, avatar: 'M', color: '#22c55e' },
  { name: 'Lena R.', xp: 3100, level: 9, avatar: 'L', color: '#ec4899' },
  { name: 'Tariq H.', xp: 2600, level: 8, avatar: 'T', color: '#f59e0b' },
]

export const LEVEL_THRESHOLDS = [0, 100, 250, 500, 900, 1500, 2400, 3600, 5000, 7000, 10000]
export const LEVEL_TITLES = ['Beginner', 'Learner', 'Developer', 'Practitioner', 'Skilled', 'Advanced', 'Expert', 'Master', 'Architect', 'Legend']

export function getLevelFromXP(xp: number): number {
  return LEVEL_THRESHOLDS.findLastIndex(t => xp >= t) + 1
}
export function getXPToNextLevel(xp: number) {
  const level = getLevelFromXP(xp)
  const cur = LEVEL_THRESHOLDS[level - 1] ?? 0
  const next = LEVEL_THRESHOLDS[level] ?? LEVEL_THRESHOLDS.at(-1)!
  const current = xp - cur, needed = next - cur
  return { current, needed, percent: Math.min(100, (current / needed) * 100) }
}
