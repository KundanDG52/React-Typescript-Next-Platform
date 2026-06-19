import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CodeBlock } from '../shared/CodeBlock'

const TS = '#3178c6'

// ─── Module 1: Type Inspector ────────────────────────────────────────────────
const VALUES: { expr: string; inferred: string; note: string }[] = [
  { expr: '42', inferred: 'number', note: 'numeric literal widens to number' },
  { expr: '"hello"', inferred: 'string', note: 'string literal widens to string' },
  { expr: 'true', inferred: 'boolean', note: 'boolean literal' },
  { expr: '[1, 2, 3]', inferred: 'number[]', note: 'array of numbers' },
  { expr: '{ x: 1, y: 2 }', inferred: '{ x: number; y: number }', note: 'object literal shape' },
  { expr: 'null', inferred: 'null', note: 'the null type' },
  { expr: '() => 42', inferred: '() => number', note: 'return type inferred from body' },
  { expr: 'const c = "hi"', inferred: '"hi"', note: 'const → narrow literal type!' },
]
export function TypeInspector() {
  const [sel, setSel] = useState(0)
  const v = VALUES[sel]
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-1.5">
        {VALUES.map((x, i) => (
          <button key={i} onClick={() => setSel(i)} className="px-2.5 py-1 rounded-lg text-xs font-mono transition-all"
            style={{ background: sel === i ? `${TS}22` : 'rgba(255,255,255,0.04)', border: sel === i ? `1px solid ${TS}` : '1px solid transparent', color: sel === i ? TS : 'rgba(255,255,255,0.55)' }}>
            {x.expr}
          </button>
        ))}
      </div>
      <motion.div key={sel} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl p-4 border" style={{ borderColor: `${TS}30`, background: `${TS}08` }}>
        <div className="font-mono text-sm flex items-center gap-2 flex-wrap">
          <span className="text-white/50">hover:</span>
          <span className="text-white/90">{v.expr}</span>
          <span className="text-white/30">:</span>
          <motion.span initial={{ scale: 1.2 }} animate={{ scale: 1 }} className="px-2 py-0.5 rounded font-bold" style={{ background: `${TS}25`, color: TS }}>{v.inferred}</motion.span>
        </div>
        <p className="text-xs text-white/45 mt-2">{v.note}</p>
      </motion.div>
      <p className="text-xs text-white/40">TypeScript infers a type for every expression — no annotation needed. <code style={{ color: TS }}>const</code> infers a narrow literal; <code style={{ color: TS }}>let</code> widens it.</p>
    </div>
  )
}

// ─── Module 1: type vs interface ─────────────────────────────────────────────
const TYPE_CODE = `type User = {
  id: number
  name: string
}
// unions, tuples, mapped, conditional
type ID = string | number
type Pair = [number, number]`
const IFACE_CODE = `interface User {
  id: number
  name: string
}
// declaration merging — re-open it!
interface User { email: string }
// User now has id, name, email`
export function TypeVsInterface() {
  const [mode, setMode] = useState<'type' | 'interface'>('type')
  const rows = [
    { feature: 'Objects & shapes', type: '✅', iface: '✅' },
    { feature: 'Unions / tuples', type: '✅', iface: '❌' },
    { feature: 'Declaration merging', type: '❌', iface: '✅' },
    { feature: 'extends / implements', type: '✅ (&)', iface: '✅' },
    { feature: 'Computed/mapped types', type: '✅', iface: '❌' },
  ]
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        {(['type', 'interface'] as const).map(m => (
          <button key={m} onClick={() => setMode(m)} className="px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all"
            style={{ background: mode === m ? `${TS}22` : 'rgba(255,255,255,0.04)', border: mode === m ? `1px solid ${TS}` : '1px solid transparent', color: mode === m ? TS : 'rgba(255,255,255,0.5)' }}>
            {m}
          </button>
        ))}
      </div>
      <motion.div key={mode} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}>
        <CodeBlock code={mode === 'type' ? TYPE_CODE : IFACE_CODE} />
      </motion.div>
      <table className="text-xs w-full">
        <thead><tr className="text-white/40 border-b border-white/10"><th className="text-left py-1 font-medium">Feature</th><th className="py-1">type</th><th className="py-1">interface</th></tr></thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.feature} className="border-b border-white/5">
              <td className="py-1.5 text-white/65">{r.feature}</td>
              <td className="py-1.5 text-center" style={{ color: mode === 'type' ? TS : 'rgba(255,255,255,0.4)' }}>{r.type}</td>
              <td className="py-1.5 text-center" style={{ color: mode === 'interface' ? TS : 'rgba(255,255,255,0.4)' }}>{r.iface}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Module 1: Union & Intersection ──────────────────────────────────────────
export function UnionIntersection() {
  const [op, setOp] = useState<'union' | 'intersect'>('union')
  // A = {name, age}, B = {age, role}
  const A = ['name', 'age'], B = ['age', 'role']
  const union = [...new Set([...A, ...B])]
  const intersect = A.filter(x => B.includes(x))
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <button onClick={() => setOp('union')} className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold" style={{ background: op === 'union' ? `${TS}22` : 'rgba(255,255,255,0.04)', border: op === 'union' ? `1px solid ${TS}` : '1px solid transparent', color: op === 'union' ? TS : 'rgba(255,255,255,0.5)' }}>A | B (union)</button>
        <button onClick={() => setOp('intersect')} className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold" style={{ background: op === 'intersect' ? '#a855f722' : 'rgba(255,255,255,0.04)', border: op === 'intersect' ? '1px solid #a855f7' : '1px solid transparent', color: op === 'intersect' ? '#a855f7' : 'rgba(255,255,255,0.5)' }}>A &amp; B (intersect)</button>
      </div>
      <svg viewBox="0 0 280 130" className="w-full max-w-xs mx-auto">
        <motion.circle cx="105" cy="65" r="55" fill={`${TS}20`} stroke={TS} strokeWidth="1.5" animate={{ fillOpacity: op === 'union' ? 0.3 : 0.12 }} />
        <motion.circle cx="175" cy="65" r="55" fill="#a855f720" stroke="#a855f7" strokeWidth="1.5" animate={{ fillOpacity: op === 'union' ? 0.3 : 0.12 }} />
        {op === 'intersect' && <motion.ellipse initial={{ opacity: 0 }} animate={{ opacity: 1 }} cx="140" cy="65" rx="20" ry="45" fill="#a855f750" />}
        <text x="80" y="40" fill={TS} fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">A</text>
        <text x="195" y="40" fill="#a855f7" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">B</text>
      </svg>
      <div className="font-mono text-xs text-center">
        <span className="text-white/50">result: </span>
        <span style={{ color: op === 'union' ? TS : '#a855f7' }}>{'{ '}{(op === 'union' ? union : intersect).join(', ')}{' }'}</span>
      </div>
      <p className="text-xs text-white/40">{op === 'union'
        ? 'A | B accepts either shape — you may only safely access members common to both (age).'
        : 'A & B requires all members of both — the combined shape (name, age, role).'}</p>
    </div>
  )
}
