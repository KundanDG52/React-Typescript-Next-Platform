import { describe, it, expect } from 'vitest'
import { getLevelFromXP, getXPToNextLevel, TRACKS, ACHIEVEMENTS } from './constants'

describe('getLevelFromXP', () => {
  it('starts at level 1', () => { expect(getLevelFromXP(0)).toBe(1) })
  it('levels up at thresholds', () => {
    expect(getLevelFromXP(100)).toBe(2)
    expect(getLevelFromXP(250)).toBe(3)
    expect(getLevelFromXP(99)).toBe(1)
  })
  it('caps at max level', () => { expect(getLevelFromXP(999999)).toBe(11) })
})

describe('getXPToNextLevel', () => {
  it('computes percent within a level', () => {
    const r = getXPToNextLevel(50)
    expect(r.current).toBe(50)
    expect(r.needed).toBe(100)
    expect(r.percent).toBe(50)
  })
  it('clamps percent to 100', () => { expect(getXPToNextLevel(999999).percent).toBe(100) })
})

describe('data integrity', () => {
  it('has 5 tracks with unique paths', () => {
    expect(TRACKS).toHaveLength(5)
    expect(new Set(TRACKS.map(t => t.path)).size).toBe(5)
  })
  it('every achievement starts unearned', () => {
    expect(ACHIEVEMENTS.every(a => !a.earned)).toBe(true)
  })
})
