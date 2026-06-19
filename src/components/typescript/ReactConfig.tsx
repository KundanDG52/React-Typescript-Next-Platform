import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Check } from 'lucide-react'

const TS = '#3178c6'

// ─── Module 7: Discriminated union props ─────────────────────────────────────
type Variant = 'text' | 'icon'
export function DiscriminatedProps() {
  const [variant, setVariant] = useState<Variant>('text')
  return (
    <div className="flex flex-col gap-3">
      <pre className="code-block text-xs text-white/75">{`type ButtonProps =\n  | { variant: 'text'; label: string }\n  | { variant: 'icon'; icon: string }\n// TS forces the right props per variant`}</pre>
      <div className="flex gap-2">{(['text', 'icon'] as Variant[]).map(v => <button key={v} onClick={() => setVariant(v)} className="px-3 py-1.5 rounded-lg text-xs font-mono" style={{ background: variant === v ? `${TS}22` : 'rgba(255,255,255,0.04)', border: variant === v ? `1px solid ${TS}` : '1px solid transparent', color: variant === v ? TS : 'rgba(255,255,255,0.5)' }}>variant="{v}"</button>)}</div>
      <motion.div key={variant} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl p-3 border flex items-center justify-between" style={{ borderColor: `${TS}30`, background: `${TS}08` }}>
        <div className="font-mono text-xs">
          <span className="text-white/40">required prop: </span>
          <span style={{ color: TS }}>{variant === 'text' ? 'label: string' : 'icon: string'}</span>
          <div className="text-white/30 mt-1 text-[11px]">{variant === 'text' ? '"icon" prop → ❌ error' : '"label" prop → ❌ error'}</div>
        </div>
        <button className="px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: TS, color: '#fff' }}>{variant === 'text' ? 'Save' : '⚙️'}</button>
      </motion.div>
      <p className="text-xs text-white/40">A discriminated union on <code style={{ color: TS }}>variant</code> makes props conditional — the compiler demands exactly the right ones per variant.</p>
    </div>
  )
}

// ─── Module 7: Event & ref types ─────────────────────────────────────────────
const EVENTS = [
  { el: '<input onChange>', type: 'React.ChangeEvent<HTMLInputElement>' },
  { el: '<button onClick>', type: 'React.MouseEvent<HTMLButtonElement>' },
  { el: '<form onSubmit>', type: 'React.FormEvent<HTMLFormElement>' },
  { el: '<input onKeyDown>', type: 'React.KeyboardEvent<HTMLInputElement>' },
  { el: 'useRef(null)', type: 'useRef<HTMLInputElement>(null)' },
]
export function EventTypes() {
  const [i, setI] = useState(0)
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-1.5">{EVENTS.map((e, idx) => <button key={idx} onClick={() => setI(idx)} className="px-2.5 py-1 rounded-lg text-xs font-mono" style={{ background: i === idx ? `${TS}22` : 'rgba(255,255,255,0.04)', border: i === idx ? `1px solid ${TS}` : '1px solid transparent', color: i === idx ? TS : 'rgba(255,255,255,0.55)' }}>{e.el}</button>)}</div>
      <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl p-4 border font-mono text-xs text-center" style={{ borderColor: `${TS}30`, background: `${TS}08`, color: TS }}>{EVENTS[i].type}</motion.div>
      <p className="text-xs text-white/40">React ships precise event &amp; ref types — annotate handlers with them to get autocompletion on <code>e.target.value</code>, <code>ref.current</code>, etc.</p>
    </div>
  )
}

// ─── Module 8: tsconfig explorer ─────────────────────────────────────────────
const FLAGS = [
  { key: 'noImplicitAny', sample: 'function greet(name) {}', error: "Parameter 'name' implicitly has an 'any' type." },
  { key: 'strictNullChecks', sample: 'const s: string = maybeNull()', error: "Type 'string | null' is not assignable to type 'string'." },
  { key: 'noUnusedLocals', sample: 'const unused = 42', error: "'unused' is declared but its value is never read." },
  { key: 'strictFunctionTypes', sample: 'cb: (x: Animal) => void = (x: Dog) => {}', error: "Types of parameters are incompatible (contravariance)." },
]
export function TsconfigExplorer() {
  const [on, setOn] = useState<Record<string, boolean>>({ noImplicitAny: true, strictNullChecks: false, noUnusedLocals: false, strictFunctionTypes: false })
  function toggle(k: string) { setOn(s => ({ ...s, [k]: !s[k] })) }
  function strictAll() { setOn({ noImplicitAny: true, strictNullChecks: true, noUnusedLocals: true, strictFunctionTypes: true }) }
  const errors = FLAGS.filter(f => on[f.key])
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="text-xs text-white/40 font-mono">"compilerOptions":</span>
        <button onClick={strictAll} className="ml-auto px-2.5 py-1 rounded-lg text-xs font-mono font-semibold" style={{ background: `${TS}22`, border: `1px solid ${TS}`, color: TS }}>"strict": true</button>
      </div>
      <div className="flex flex-col gap-1.5">
        {FLAGS.map(f => (
          <div key={f.key} className="flex items-center gap-2">
            <button onClick={() => toggle(f.key)} className="w-9 h-5 rounded-full relative transition-all shrink-0" style={{ background: on[f.key] ? TS : '#2a2a3e' }}>
              <motion.span className="absolute top-0.5 w-4 h-4 rounded-full bg-white" animate={{ left: on[f.key] ? 18 : 2 }} />
            </button>
            <span className="font-mono text-xs" style={{ color: on[f.key] ? TS : 'rgba(255,255,255,0.45)' }}>{f.key}</span>
          </div>
        ))}
      </div>
      <div className="rounded-xl p-3 border space-y-2" style={{ borderColor: errors.length ? '#f43f5e40' : '#22c55e40', background: errors.length ? '#f43f5e08' : '#22c55e08' }}>
        <AnimatePresence>
          {errors.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-xs text-emerald-400"><Check size={13} /> no type errors with current flags</motion.div>
          ) : errors.map(f => (
            <motion.div key={f.key} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="text-xs font-mono">
              <div className="text-white/55">{f.sample}</div>
              <div className="flex items-start gap-1.5 text-rose-400 mt-0.5"><AlertTriangle size={11} className="mt-0.5 shrink-0" /> {f.error}</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <p className="text-xs text-white/40">Each flag tightens the compiler. <code style={{ color: TS }}>strict: true</code> turns them all on at once — enable them and watch the errors surface.</p>
    </div>
  )
}
