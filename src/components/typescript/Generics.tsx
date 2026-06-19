import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../../store'

const TS = '#3178c6'

// ─── Module 3: Generic function flow ─────────────────────────────────────────
const CALLS = [
  { arg: '42', argT: 'number' },
  { arg: '"hi"', argT: 'string' },
  { arg: 'true', argT: 'boolean' },
  { arg: '[1,2]', argT: 'number[]' },
]
export function GenericFlow() {
  const [i, setI] = useState(0)
  const c = CALLS[i]
  return (
    <div className="flex flex-col gap-3">
      <pre className="code-block text-xs text-white/75">{`function identity<T>(value: T): T {\n  return value\n}`}</pre>
      <div className="flex gap-1.5 flex-wrap">{CALLS.map((x, idx) => <button key={idx} onClick={() => setI(idx)} className="px-2.5 py-1 rounded-lg text-xs font-mono" style={{ background: i === idx ? `${TS}22` : 'rgba(255,255,255,0.04)', border: i === idx ? `1px solid ${TS}` : '1px solid transparent', color: i === idx ? TS : 'rgba(255,255,255,0.55)' }}>identity({x.arg})</button>)}</div>
      <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-2 font-mono text-xs rounded-xl p-4 border" style={{ borderColor: `${TS}30`, background: `${TS}08` }}>
        <span className="text-white/70">{c.arg}</span>
        <span className="text-white/30">→</span>
        <span className="px-2 py-0.5 rounded font-bold" style={{ background: `${TS}25`, color: TS }}>T = {c.argT}</span>
        <span className="text-white/30">→ returns</span>
        <span className="px-2 py-0.5 rounded font-bold" style={{ background: `${TS}25`, color: TS }}>{c.argT}</span>
      </motion.div>
      <p className="text-xs text-white/40"><code style={{ color: TS }}>T</code> is inferred from the argument at the call site and flows through to the return type — full type safety, zero annotations.</p>
    </div>
  )
}

// ─── Module 3: Stack<T> ──────────────────────────────────────────────────────
export function StackDemo() {
  const [stack, setStack] = useState<number[]>([])
  const [val, setVal] = useState(1)
  const checkAchievement = useStore(s => s.checkAchievement)
  function push() { setStack(s => [...s, val]); setVal(v => v + 1); checkAchievement('generic_guru') }
  function pop() { setStack(s => s.slice(0, -1)) }
  return (
    <div className="flex flex-col gap-3">
      <pre className="code-block text-xs text-white/75">{`class Stack<T> {\n  private items: T[] = []\n  push(x: T) { this.items.push(x) }\n  pop(): T | undefined { return this.items.pop() }\n}\nconst s = new Stack<number>()`}</pre>
      <div className="flex items-end gap-3">
        <div className="flex flex-col-reverse gap-1 min-h-[110px] justify-start">
          <AnimatePresence>
            {stack.map((x, i) => <motion.div key={`${x}-${i}`} initial={{ opacity: 0, y: -16, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, x: 20 }} className="w-16 h-8 rounded flex items-center justify-center font-mono font-bold text-sm" style={{ background: `${TS}20`, border: `1px solid ${TS}`, color: TS }}>{x}</motion.div>)}
          </AnimatePresence>
          {!stack.length && <div className="text-xs text-white/25">empty</div>}
        </div>
        <div className="flex flex-col gap-2">
          <button onClick={push} className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold" style={{ background: TS, color: '#fff' }}>push({val})</button>
          <button onClick={pop} disabled={!stack.length} className="btn-ghost text-xs disabled:opacity-30">pop()</button>
        </div>
      </div>
      <p className="text-xs text-white/40">The compiler enforces <code style={{ color: TS }}>T = number</code> — pushing a string would be a compile error. Push to earn the <b style={{ color: TS }}>Generic Guru</b> badge.</p>
    </div>
  )
}

// ─── Module 3: Constraints ───────────────────────────────────────────────────
const INPUTS = [
  { v: '"hello"', ok: true, t: 'string', reason: 'has .length' },
  { v: '[1,2,3]', ok: true, t: 'number[]', reason: 'arrays have .length' },
  { v: '{ length: 5 }', ok: true, t: '{ length: number }', reason: 'satisfies the constraint shape' },
  { v: '42', ok: false, t: 'number', reason: 'number has no .length ❌' },
]
export function Constraints() {
  const [i, setI] = useState(0)
  const c = INPUTS[i]
  return (
    <div className="flex flex-col gap-3">
      <pre className="code-block text-xs text-white/75">{`function len<T extends { length: number }>(x: T) {\n  return x.length\n}`}</pre>
      <div className="flex gap-1.5 flex-wrap">{INPUTS.map((x, idx) => <button key={idx} onClick={() => setI(idx)} className="px-2.5 py-1 rounded-lg text-xs font-mono" style={{ background: i === idx ? `${TS}22` : 'rgba(255,255,255,0.04)', border: i === idx ? `1px solid ${TS}` : '1px solid transparent', color: i === idx ? TS : 'rgba(255,255,255,0.55)' }}>len({x.v})</button>)}</div>
      <motion.div key={i} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="rounded-xl p-3 border flex items-center gap-3" style={{ borderColor: c.ok ? '#22c55e50' : '#f43f5e50', background: c.ok ? '#22c55e0a' : '#f43f5e0a' }}>
        <div className="text-2xl">{c.ok ? '🟢' : '🚧'}</div>
        <div className="text-xs font-mono"><div style={{ color: c.ok ? '#22c55e' : '#f43f5e' }}>{c.ok ? 'accepted' : 'blocked by constraint'}</div><div className="text-white/45 mt-0.5">{c.reason}</div></div>
      </motion.div>
      <p className="text-xs text-white/40">The <code style={{ color: TS }}>extends</code> clause is a constraint wall — only types with a <code>length: number</code> member pass through.</p>
    </div>
  )
}
