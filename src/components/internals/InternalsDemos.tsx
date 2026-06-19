import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Fiber work loop ─────────────────────────────────────────────────────────
const FIBER_NODES = [
  { id: 'root', label: 'HostRoot', depth: 0, x: 50 },
  { id: 'app', label: 'App', depth: 1, x: 50 },
  { id: 'header', label: 'Header', depth: 2, x: 25 },
  { id: 'main', label: 'Main', depth: 2, x: 75 },
  { id: 'list', label: 'List', depth: 3, x: 75 },
]
const WORK_ORDER = ['root', 'app', 'header', 'main', 'list']

export function FiberTree() {
  const [phase, setPhase] = useState<'idle' | 'render' | 'commit'>('idle')
  const [active, setActive] = useState(-1)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  function run() {
    if (timer.current) clearInterval(timer.current)
    setPhase('render'); setActive(0)
    let i = 0
    timer.current = setInterval(() => {
      i++
      if (i < WORK_ORDER.length) setActive(i)
      else { clearInterval(timer.current!); setPhase('commit'); setTimeout(() => setPhase('idle'), 1200); setActive(-1) }
    }, 600)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        {(['render', 'commit'] as const).map(p => (
          <div key={p} className="px-3 py-1 rounded-lg text-xs font-semibold transition-all" style={{ background: phase === p ? (p === 'render' ? '#61dafb22' : '#22c55e22') : 'rgba(255,255,255,0.04)', border: `1px solid ${phase === p ? (p === 'render' ? '#61dafb' : '#22c55e') : 'transparent'}`, color: phase === p ? (p === 'render' ? '#61dafb' : '#22c55e') : 'rgba(255,255,255,0.4)' }}>{p} phase</div>
        ))}
      </div>
      <div className="relative h-44 rounded-xl border border-white/06 bg-bg/40">
        <svg className="absolute inset-0 w-full h-full">
          {[['root', 'app'], ['app', 'header'], ['app', 'main'], ['main', 'list']].map(([a, b]) => {
            const na = FIBER_NODES.find(n => n.id === a)!, nb = FIBER_NODES.find(n => n.id === b)!
            return <line key={`${a}${b}`} x1={`${na.x}%`} y1={na.depth * 42 + 22} x2={`${nb.x}%`} y2={nb.depth * 42 + 22} stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
          })}
        </svg>
        {FIBER_NODES.map(n => {
          const idx = WORK_ORDER.indexOf(n.id)
          const isActive = active === idx
          const done = active > idx || phase === 'commit'
          const color = phase === 'commit' ? '#22c55e' : isActive ? '#61dafb' : done ? '#818cf8' : '#23234a'
          return (
            <motion.div key={n.id} className="absolute -translate-x-1/2 px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold border"
              style={{ left: `${n.x}%`, top: n.depth * 42 + 10, borderColor: color, background: `${color}22`, color: isActive || done || phase === 'commit' ? color : 'rgba(255,255,255,0.4)' }}
              animate={{ scale: isActive ? 1.15 : 1, boxShadow: isActive ? `0 0 14px ${color}` : 'none' }}>
              {n.label}
            </motion.div>
          )
        })}
      </div>
      <button onClick={run} className="btn-primary text-xs self-start">Run work loop</button>
      <p className="text-xs text-white/40">React processes the <b className="text-react">work-in-progress</b> fiber tree depth-first during the interruptible <b className="text-react">render phase</b>, then applies all changes at once in the synchronous <b className="text-green">commit phase</b>.</p>
    </div>
  )
}

// ─── Reconciliation: keys ────────────────────────────────────────────────────
export function ReconciliationDemo() {
  const [items, setItems] = useState([{ id: 1, c: '#61dafb' }, { id: 2, c: '#a855f7' }, { id: 3, c: '#22c55e' }])
  const [useKeys, setUseKeys] = useState(true)
  function shuffle() { setItems(prev => [...prev].sort(() => Math.random() - 0.5)) }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="text-xs text-white/50">key strategy</span>
        <button onClick={() => setUseKeys(true)} className="px-2.5 py-1 rounded text-[11px] font-semibold" style={{ background: useKeys ? '#22c55e20' : 'rgba(255,255,255,0.05)', border: useKeys ? '1px solid #22c55e50' : '1px solid transparent', color: useKeys ? '#22c55e' : 'rgba(255,255,255,0.4)' }}>key={'{item.id}'}</button>
        <button onClick={() => setUseKeys(false)} className="px-2.5 py-1 rounded text-[11px] font-semibold" style={{ background: !useKeys ? '#ef444420' : 'rgba(255,255,255,0.05)', border: !useKeys ? '1px solid #ef444450' : '1px solid transparent', color: !useKeys ? '#f87171' : 'rgba(255,255,255,0.4)' }}>key={'{index}'}</button>
      </div>
      <div className="flex gap-2">
        {items.map((it, i) => (
          <motion.div key={useKeys ? it.id : i} layout transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="flex-1 h-16 rounded-xl flex items-center justify-center font-mono text-sm font-bold border"
            style={{ background: `${it.c}20`, borderColor: it.c, color: it.c }}>
            #{it.id}
          </motion.div>
        ))}
      </div>
      <button onClick={shuffle} className="btn-ghost text-xs self-start">Shuffle list</button>
      <p className="text-xs text-white/40">With <b className="text-green">stable keys</b> React moves existing DOM nodes (smooth). With <b className="text-red-400">index keys</b> it mismatches identity and patches contents instead — buggy for stateful items.</p>
    </div>
  )
}
