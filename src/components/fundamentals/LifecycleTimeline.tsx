import { useState } from 'react'
import { motion } from 'framer-motion'

const PHASES = [
  { id: 'mount', label: 'Mounting', color: '#22c55e', steps: ['Constructor / initial state', 'Render → Virtual DOM', 'Commit to real DOM', 'useEffect(() => {…}, [])'], hook: 'useEffect with [] runs once after first paint' },
  { id: 'update', label: 'Updating', color: '#61dafb', steps: ['State/props change', 'Re-render → new Virtual DOM', 'Diff & reconcile', 'useEffect(() => {…}, [dep]) re-runs'], hook: 'useEffect with deps runs when a dep changes' },
  { id: 'unmount', label: 'Unmounting', color: '#ec4899', steps: ['Component removed from tree', 'Cleanup functions run', 'Listeners / timers torn down'], hook: 'return () => {…} inside useEffect is the cleanup' },
]

export function LifecycleTimeline() {
  const [active, setActive] = useState(0)
  const phase = PHASES[active]
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        {PHASES.map((p, i) => (
          <div key={p.id} className="flex items-center gap-2 flex-1">
            <button onClick={() => setActive(i)} className="flex-1 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all"
              style={{ background: active === i ? `${p.color}22` : 'rgba(255,255,255,0.04)', border: active === i ? `1px solid ${p.color}` : '1px solid rgba(255,255,255,0.06)', color: active === i ? p.color : 'rgba(255,255,255,0.5)', boxShadow: active === i ? `0 0 18px ${p.color}40` : 'none' }}>
              {p.label}
            </button>
            {i < PHASES.length - 1 && <span className="text-white/20">→</span>}
          </div>
        ))}
      </div>
      <motion.div key={phase.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl p-4 border" style={{ borderColor: `${phase.color}30`, background: `${phase.color}08` }}>
        <div className="flex flex-col gap-2">
          {phase.steps.map((s, i) => (
            <motion.div key={s} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0" style={{ background: `${phase.color}25`, color: phase.color }}>{i + 1}</div>
              <span className="text-sm text-white/75">{s}</span>
            </motion.div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-white/10 text-xs"><span className="text-white/40">Hook equivalent: </span><code style={{ color: phase.color }}>{phase.hook}</code></div>
      </motion.div>
    </div>
  )
}
