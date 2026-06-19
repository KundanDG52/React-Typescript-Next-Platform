import { memo, useState, useTransition, useDeferredValue, useRef } from 'react'
import { motion } from 'framer-motion'

// ─── React.memo: which children re-render ────────────────────────────────────
const Child = memo(function Child({ label }: { label: string }) {
  const renders = useRef(0); renders.current++
  return (
    <motion.div animate={{ backgroundColor: ['rgba(239,68,68,0.25)', 'rgba(255,255,255,0.03)'] }} transition={{ duration: 0.6 }}
      className="rounded-lg px-3 py-2 border border-white/06 text-xs flex justify-between" key={renders.current}>
      <span className="text-white/60">{label}</span>
      <span className="font-mono text-amber">{renders.current} renders</span>
    </motion.div>
  )
})
const PlainChild = function PlainChild({ label }: { label: string }) {
  const renders = useRef(0); renders.current++
  return (
    <motion.div animate={{ backgroundColor: ['rgba(239,68,68,0.25)', 'rgba(255,255,255,0.03)'] }} transition={{ duration: 0.6 }}
      className="rounded-lg px-3 py-2 border border-white/06 text-xs flex justify-between" key={renders.current}>
      <span className="text-white/60">{label}</span>
      <span className="font-mono text-red-400">{renders.current} renders</span>
    </motion.div>
  )
}
export function MemoDemo() {
  const [count, setCount] = useState(0)
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <button onClick={() => setCount(c => c + 1)} className="btn-primary text-xs">Re-render parent ({count})</button>
        <span className="text-xs text-white/40">flashing red = re-rendered</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-2"><div className="text-[10px] text-green font-semibold uppercase">memo() child</div><Child label="props unchanged" /></div>
        <div className="space-y-2"><div className="text-[10px] text-red-400 font-semibold uppercase">plain child</div><PlainChild label="re-renders always" /></div>
      </div>
      <p className="text-xs text-white/40"><code className="text-green">React.memo</code> skips re-rendering when props are referentially equal. The left child stays put while the parent (and right child) re-render.</p>
    </div>
  )
}

// ─── useTransition + useDeferredValue ────────────────────────────────────────
function buildList(filter: string): string[] {
  const items: string[] = []
  for (let i = 0; i < 4000; i++) { const s = `Item ${i}`; if (!filter || s.includes(filter)) items.push(s) }
  return items.slice(0, 80)
}
export function ConcurrentDemo() {
  const [input, setInput] = useState('')
  const [isPending, startTransition] = useTransition()
  const [filter, setFilter] = useState('')
  const deferred = useDeferredValue(filter)
  const list = buildList(deferred)

  return (
    <div className="flex flex-col gap-3">
      <input value={input} onChange={e => { const v = e.target.value; setInput(v); startTransition(() => setFilter(v)) }}
        placeholder="Filter 4000 items…" className="bg-bg/60 border border-border rounded-lg px-3 py-1.5 text-sm outline-none focus:border-react/50" />
      <div className="flex items-center gap-2 text-xs">
        <span className="text-white/40">input (urgent):</span><span className="font-mono text-react">{input || '—'}</span>
        {isPending && <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 0.7 }} className="ml-auto text-amber">● list updating (transition)…</motion.span>}
      </div>
      <div className="rounded-xl border border-white/06 bg-bg/40 p-2 h-32 overflow-auto" style={{ opacity: isPending ? 0.5 : 1, transition: 'opacity 0.2s' }}>
        <div className="grid grid-cols-3 gap-1">
          {list.map(item => <div key={item} className="text-[10px] font-mono text-white/50 px-1.5 py-0.5 rounded bg-white/03">{item}</div>)}
        </div>
      </div>
      <p className="text-xs text-white/40">Typing stays snappy (urgent update) while the heavy list filtering is marked low-priority via <code className="text-react">startTransition</code> + <code className="text-react">useDeferredValue</code>. The input never lags.</p>
    </div>
  )
}

// ─── Code splitting / lazy bundle visualizer ─────────────────────────────────
export function LazyDemo() {
  const [lazy, setLazy] = useState(false)
  const segments = lazy
    ? [{ n: 'main.js', size: 45, c: '#61dafb' }, { n: 'vendor.js', size: 80, c: '#a855f7' }, { n: '(chart.js lazy)', size: 0, c: '#22c55e' }]
    : [{ n: 'main.js', size: 45, c: '#61dafb' }, { n: 'vendor.js', size: 80, c: '#a855f7' }, { n: 'chart.js', size: 120, c: '#ef4444' }]
  const total = segments.reduce((a, s) => a + s.size, 0)
  const lazyTotal = lazy ? 120 : 0

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="text-xs text-white/50">React.lazy + Suspense</span>
        <button onClick={() => setLazy(v => !v)} className="px-3 py-1 rounded-lg text-xs font-semibold" style={{ background: lazy ? '#22c55e20' : 'rgba(255,255,255,0.05)', border: lazy ? '1px solid #22c55e50' : '1px solid transparent', color: lazy ? '#22c55e' : 'rgba(255,255,255,0.5)' }}>{lazy ? 'ON' : 'OFF'}</button>
      </div>
      <div>
        <div className="flex justify-between text-[10px] text-white/40 mb-1"><span>Initial bundle</span><span className="font-mono">{total} KB</span></div>
        <div className="h-6 rounded-lg overflow-hidden flex border border-white/06">
          {segments.filter(s => s.size > 0).map(s => (
            <motion.div key={s.n} layout className="flex items-center justify-center text-[9px] font-mono text-black/70 font-bold" style={{ width: `${(s.size / 245) * 100}%`, background: s.c }} title={`${s.n} ${s.size}KB`}>{s.size > 40 ? s.n : ''}</motion.div>
          ))}
        </div>
      </div>
      {lazy && (
        <div>
          <div className="flex justify-between text-[10px] text-white/40 mb-1"><span>Loaded on demand</span><span className="font-mono text-green">{lazyTotal} KB</span></div>
          <div className="h-6 rounded-lg overflow-hidden flex border border-dashed border-green/40">
            <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} className="flex items-center justify-center text-[9px] font-mono text-green bg-green/15">chart.js — fetched when rendered</motion.div>
          </div>
        </div>
      )}
      <p className="text-xs text-white/40">Lazy-loading <code className="text-green">chart.js</code> cuts the initial bundle from <b className="text-red-400">245KB</b> to <b className="text-react">125KB</b>. The chunk loads only when its component first renders.</p>
    </div>
  )
}
