import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Zap, Flame } from 'lucide-react'
import { useStore } from '../../store'
import { TRACKS, getLevelFromXP, getXPToNextLevel, LEVEL_TITLES } from '../../utils/constants'

export function Navbar() {
  const loc = useLocation()
  const [open, setOpen] = useState(false)
  const xp = useStore(s => s.xp)
  const streak = useStore(s => s.streak)
  const level = getLevelFromXP(xp)
  const { percent } = getXPToNextLevel(xp)
  const title = LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)]

  return (
    <header className="fixed top-0 inset-x-0 z-50 glass-surface border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <svg className="animate-spin-slow" width="22" height="22" viewBox="-12 -11 24 22"><circle r="2" fill="#61dafb" /><g stroke="#61dafb" strokeWidth="1" fill="none"><ellipse rx="10" ry="4.5" /><ellipse rx="10" ry="4.5" transform="rotate(60)" /><ellipse rx="10" ry="4.5" transform="rotate(120)" /></g></svg>
          <span className="hidden sm:block gradient-text text-sm font-extrabold tracking-tight">React Mastery</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1 flex-1">
          {TRACKS.map(t => {
            const active = loc.pathname === t.path
            return (
              <Link key={t.path} to={t.path} className="relative px-3 py-1.5 rounded-lg text-xs font-medium transition-all" style={{ color: active ? t.color : 'rgba(255,255,255,0.5)' }}>
                {active && <motion.div layoutId="nav-ind" className="absolute inset-0 rounded-lg" style={{ background: `${t.color}12`, border: `1px solid ${t.color}30` }} />}
                <span className="relative">{t.name.replace('React ', '')}</span>
              </Link>
            )
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          {streak > 0 && <div className="hidden sm:flex items-center gap-1 text-xs font-semibold text-amber"><Flame size={12} /> {streak}d</div>}
          <Link to="/" className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1">
            <Zap size={11} className="text-react" />
            <span className="text-xs font-bold text-react">{xp.toLocaleString()} XP</span>
            <div className="w-14 h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div className="h-full rounded-full bg-react" initial={{ width: 0 }} animate={{ width: `${percent}%` }} transition={{ duration: 0.8 }} />
            </div>
            <span className="text-[10px] text-white/40">Lv.{level} {title}</span>
          </Link>
          <Link to="/puzzles" className="btn-ghost text-xs hidden md:block">Puzzles</Link>
          <button className="lg:hidden p-1.5 rounded-lg hover:bg-white/10" onClick={() => setOpen(v => !v)}>{open ? <X size={16} /> : <Menu size={16} />}</button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="lg:hidden border-t border-white/5 overflow-hidden">
            <nav className="p-4 flex flex-col gap-1">
              {TRACKS.map(t => (
                <Link key={t.path} to={t.path} onClick={() => setOpen(false)} className="px-4 py-2.5 rounded-xl text-sm font-medium" style={{ color: loc.pathname === t.path ? t.color : 'rgba(255,255,255,0.6)', background: loc.pathname === t.path ? `${t.color}10` : 'transparent' }}>{t.name}</Link>
              ))}
              <Link to="/puzzles" onClick={() => setOpen(false)} className="px-4 py-2.5 rounded-xl text-sm font-medium text-white/60">Puzzles</Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
