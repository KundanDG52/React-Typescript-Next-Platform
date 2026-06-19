import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'

const TS = '#3178c6'

// ─── Module 2: Narrowing guards ──────────────────────────────────────────────
const GUARDS = [
  { id: 'typeof', label: 'typeof', code: `function f(x: string | number) {\n  if (typeof x === 'string') {\n    // x: string  ← narrowed\n  } else {\n    // x: number  ← narrowed\n  }\n}`, t1: 'string', t2: 'number', in1: 'typeof x === "string"' },
  { id: 'instanceof', label: 'instanceof', code: `function f(x: Dog | Cat) {\n  if (x instanceof Dog) {\n    // x: Dog\n  } else {\n    // x: Cat\n  }\n}`, t1: 'Dog', t2: 'Cat', in1: 'x instanceof Dog' },
  { id: 'in', label: 'in', code: `function f(x: Fish | Bird) {\n  if ('swim' in x) {\n    // x: Fish\n  } else {\n    // x: Bird\n  }\n}`, t1: 'Fish', t2: 'Bird', in1: '"swim" in x' },
  { id: 'predicate', label: 'type predicate', code: `function isStr(x: unknown): x is string {\n  return typeof x === 'string'\n}\nif (isStr(v)) {\n  // v: string\n}`, t1: 'string', t2: 'unknown', in1: 'isStr(v) → v is string' },
]
export function NarrowingGuards() {
  const [g, setG] = useState(0)
  const guard = GUARDS[g]
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-1.5">
        {GUARDS.map((x, i) => <button key={x.id} onClick={() => setG(i)} className="px-2.5 py-1 rounded-lg text-xs font-mono transition-all" style={{ background: g === i ? `${TS}22` : 'rgba(255,255,255,0.04)', border: g === i ? `1px solid ${TS}` : '1px solid transparent', color: g === i ? TS : 'rgba(255,255,255,0.55)' }}>{x.label}</button>)}
      </div>
      <pre className="code-block text-xs text-white/75 whitespace-pre-wrap">{guard.code}</pre>
      <div className="grid grid-cols-2 gap-2">
        <motion.div key={`a${g}`} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="rounded-lg p-3 border text-center" style={{ borderColor: '#22c55e50', background: '#22c55e10' }}>
          <div className="text-[10px] text-white/40 mb-1">if ({guard.in1})</div>
          <div className="font-mono font-bold text-sm text-emerald-400">x: {guard.t1}</div>
        </motion.div>
        <motion.div key={`b${g}`} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="rounded-lg p-3 border text-center" style={{ borderColor: '#f59e0b50', background: '#f59e0b10' }}>
          <div className="text-[10px] text-white/40 mb-1">else branch</div>
          <div className="font-mono font-bold text-sm text-amber">x: {guard.t2}</div>
        </motion.div>
      </div>
      <p className="text-xs text-white/40">Each guard shrinks the type within its branch — TypeScript's control-flow analysis tracks the narrowed type per scope.</p>
    </div>
  )
}

// ─── Module 2: Exhaustiveness check ──────────────────────────────────────────
const SHAPES = ['circle', 'square', 'triangle'] as const
export function Exhaustiveness() {
  const [handled, setHandled] = useState<string[]>(['circle', 'square'])
  const missing = SHAPES.filter(s => !handled.includes(s))
  const exhaustive = missing.length === 0
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-white/50">Toggle the cases you handle in the <code style={{ color: TS }}>switch</code>:</p>
      <div className="flex gap-1.5">
        {SHAPES.map(s => { const on = handled.includes(s); return <button key={s} onClick={() => setHandled(h => on ? h.filter(x => x !== s) : [...h, s])} className="px-3 py-1.5 rounded-lg text-xs font-mono transition-all" style={{ background: on ? '#22c55e20' : 'rgba(255,255,255,0.04)', border: on ? '1px solid #22c55e50' : '1px solid #ffffff10', color: on ? '#22c55e' : 'rgba(255,255,255,0.4)' }}>case "{s}"</button> })}
      </div>
      <pre className="code-block text-xs whitespace-pre-wrap"><span className="text-white/75">{`switch (shape.kind) {`}</span>
{handled.map(h => <span key={h} className="text-emerald-400 block">{`  case "${h}": return draw${h[0].toUpperCase() + h.slice(1)}()`}</span>)}
<span className="block" style={{ color: exhaustive ? '#22c55e' : '#f43f5e' }}>{`  default: const _exhaustive: never = shape`}{!exhaustive && '  // ❌ error!'}</span>
<span className="text-white/75">{`}`}</span></pre>
      <motion.div key={String(exhaustive)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-xs font-mono rounded-lg p-2.5 border" style={{ borderColor: exhaustive ? '#22c55e40' : '#f43f5e40', background: exhaustive ? '#22c55e0a' : '#f43f5e0a' }}>
        {exhaustive ? <><Check size={14} className="text-emerald-400" /><span className="text-emerald-400">Exhaustive — every case handled, <code>never</code> assignment compiles.</span></>
          : <><X size={14} className="text-rose-400" /><span className="text-rose-400">"{missing.join('", "')}" not assignable to <code>never</code> — add the missing case!</span></>}
      </motion.div>
    </div>
  )
}
