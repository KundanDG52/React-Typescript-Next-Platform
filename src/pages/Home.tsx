import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Zap, Trophy, Flame, Crown, Clock, ChevronRight } from 'lucide-react'
import { TRACKS, LEADERBOARD, getLevelFromXP, getXPToNextLevel, LEVEL_TITLES } from '../utils/constants'
import { useStore } from '../store'
import { ReactLogo } from '../components/layout/ReactLogo'
import { ProgressRing } from '../components/shared/ProgressRing'
import { Badge, DifficultyStars, Pill } from '../components/shared/Badge'

function Hero() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center -z-10"><ReactLogo size={520} opacity={0.07} /></div>
      <div className="absolute inset-0 bg-gradient-radial from-react/5 via-transparent to-transparent" />
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-7">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-2 bg-react/10 border border-react/30 rounded-full px-4 py-1.5 text-xs font-semibold text-react">
          <Sparkles size={12} /> Interactive React Learning Platform
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-7xl font-black leading-tight">
          Master <span className="gradient-text">React</span> Visually
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="text-lg md:text-xl text-white/50 max-w-2xl leading-relaxed">
          From JSX to Fiber internals. Interactive demos for hooks, performance, advanced patterns, and the reconciliation engine — learn by watching it happen.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex flex-wrap gap-4 justify-center">
          <Link to="/fundamentals" className="btn-primary flex items-center gap-2 font-bold">Start Learning <ArrowRight size={16} /></Link>
          <Link to="/puzzles" className="btn-ghost">Try Puzzles</Link>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="flex flex-wrap justify-center gap-8 pt-3">
          {[['5', 'Tracks'], ['30+', 'Demos'], ['18', 'React 18 APIs'], ['5', 'Puzzles']].map(([v, l]) => (
            <div key={l} className="flex flex-col items-center"><span className="text-2xl font-black gradient-text">{v}</span><span className="text-xs text-white/40">{l}</span></div>
          ))}
        </motion.div>
      </div>
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-bg to-transparent" />
    </section>
  )
}

function XPSection() {
  const { xp, streak, achievements } = useStore()
  const level = getLevelFromXP(xp)
  const { current, needed, percent } = getXPToNextLevel(xp)
  const title = LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)]
  const earned = achievements.filter(a => a.earned).length

  return (
    <section className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="card rounded-2xl p-5 md:col-span-2 flex items-center gap-6">
        <ProgressRing percent={percent} size={72} color="#61dafb" label={`Lv.${level}`} sublabel={title} />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold">{title}</span>
            <span className="flex items-center gap-1 text-react text-sm font-bold"><Zap size={13} /> {xp.toLocaleString()} XP</span>
          </div>
          <div className="h-2.5 bg-white/8 rounded-full overflow-hidden">
            <motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg,#61dafb,#a855f7)' }} initial={{ width: 0 }} animate={{ width: `${percent}%` }} transition={{ duration: 1.2, delay: 0.3 }} />
          </div>
          <div className="flex justify-between mt-1.5 text-xs text-white/30"><span>{current} XP</span><span>{needed} to next</span></div>
        </div>
      </div>
      <div className="card rounded-2xl p-5 flex flex-col justify-around">
        <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-amber/15 border border-amber/30 flex items-center justify-center"><Flame size={18} className="text-amber" /></div><div><div className="text-2xl font-black">{streak}</div><div className="text-xs text-white/40">Day Streak</div></div></div>
        <div className="flex items-center gap-3 mt-2"><div className="w-10 h-10 rounded-xl bg-purple/15 border border-purple/30 flex items-center justify-center"><Trophy size={18} className="text-purple" /></div><div><div className="text-2xl font-black">{earned}</div><div className="text-xs text-white/40">Badges</div></div></div>
      </div>
      <div className="card rounded-2xl p-5 md:col-span-3">
        <h3 className="text-sm font-semibold text-white/60 mb-4">Achievements</h3>
        <div className="flex flex-wrap gap-4">
          {achievements.map(a => <Badge key={a.id} {...a} />)}
        </div>
      </div>
    </section>
  )
}

function TrackGrid() {
  const trackProgress = useStore(s => s.trackProgress)
  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex items-end justify-between mb-6">
        <div><h2 className="text-2xl font-bold">Learning Tracks</h2><p className="text-white/40 text-sm mt-1">Five tracks from fundamentals to internals</p></div>
        <span className="text-xs text-white/30">{Object.values(trackProgress).filter(p => p.completed).length}/{TRACKS.length} done</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {TRACKS.map((t, i) => {
          const pct = trackProgress[t.id]?.completed ? 100 : 0
          return (
            <motion.div key={t.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
              <Link to={t.path} className="card rounded-2xl p-5 block hover:-translate-y-1 transition-transform group" style={{ borderColor: pct ? `${t.color}30` : undefined }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: `${t.color}15`, border: `1px solid ${t.color}30` }}>{t.icon}</div>
                  <ProgressRing percent={pct} size={44} stroke={4} color={t.color} label={`${pct}%`} />
                </div>
                <h3 className="font-bold text-base mb-1" style={{ color: pct ? t.color : 'white' }}>{t.name}</h3>
                <p className="text-xs text-white/40 mb-3 leading-relaxed">{t.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1.5"><DifficultyStars difficulty={t.difficulty} color={t.color} /><span className="flex items-center gap-1 text-xs text-white/30"><Clock size={10} /> {t.estimatedMinutes}min</span></div>
                  <ChevronRight size={16} className="text-white/20 group-hover:text-white/60 group-hover:translate-x-1 transition-all" />
                </div>
                <div className="mt-3 flex flex-wrap gap-1">{t.modules.slice(0, 3).map(m => <Pill key={m} color={t.color}>{m}</Pill>)}{t.modules.length > 3 && <span className="text-[10px] px-1.5 text-white/20">+{t.modules.length - 3}</span>}</div>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}

function Leaderboard() {
  const { xp, level } = useStore()
  const all = [...LEADERBOARD, { name: 'You', xp, level, avatar: '★', color: '#61dafb' }].sort((a, b) => b.xp - a.xp).slice(0, 6)
  return (
    <section className="max-w-7xl mx-auto px-6 pb-16">
      <div className="card rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4"><Crown size={14} className="text-purple" /><span className="text-xs font-semibold text-purple uppercase tracking-wider">Leaderboard</span></div>
        <div className="flex flex-col gap-2">
          {all.map((p, i) => {
            const me = p.name === 'You'
            return (
              <div key={p.name} className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: me ? `${p.color}12` : 'rgba(255,255,255,0.03)', border: me ? `1px solid ${p.color}30` : '1px solid transparent' }}>
                <span className="w-5 text-center text-xs font-bold">{i < 3 ? ['🥇', '🥈', '🥉'][i] : i + 1}</span>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold" style={{ background: `${p.color}20`, color: p.color }}>{p.avatar}</div>
                <span className="flex-1 text-sm font-medium truncate">{p.name}</span>
                <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: p.color }}><Zap size={10} /> {p.xp.toLocaleString()}</span>
                <span className="text-xs text-white/30 font-mono w-12 text-right">Lv.{p.level}</span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function Home() {
  return <div><Hero /><XPSection /><TrackGrid /><Leaderboard /></div>
}
