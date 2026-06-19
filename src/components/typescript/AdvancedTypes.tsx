import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const TS = '#3178c6'

// ─── Module 5: Template literal explosion ────────────────────────────────────
export function TemplateLiteral() {
  const verbs = ['get', 'set']
  const props = ['Name', 'Age']
  const [v, setV] = useState<string[]>([...verbs])
  const [p, setP] = useState<string[]>([...props])
  const combos = v.flatMap(a => p.map(b => `${a}${b}`))
  return (
    <div className="flex flex-col gap-3">
      <pre className="code-block text-xs text-white/75">{`type Verb = ${v.map(x => `'${x}'`).join(' | ') || 'never'}\ntype Prop = ${p.map(x => `'${x}'`).join(' | ') || 'never'}\ntype Method = \`\${Verb}\${Prop}\``}</pre>
      <div className="flex gap-4">
        <div className="flex flex-col gap-1"><span className="text-[10px] text-white/40">Verb</span>{verbs.map(x => { const on = v.includes(x); return <button key={x} onClick={() => setV(s => on ? s.filter(y => y !== x) : [...s, x])} className="px-2 py-1 rounded text-xs font-mono" style={{ background: on ? `${TS}22` : 'rgba(255,255,255,0.04)', border: on ? `1px solid ${TS}` : '1px solid transparent', color: on ? TS : 'rgba(255,255,255,0.4)' }}>'{x}'</button> })}</div>
        <div className="flex flex-col gap-1"><span className="text-[10px] text-white/40">Prop</span>{props.map(x => { const on = p.includes(x); return <button key={x} onClick={() => setP(s => on ? s.filter(y => y !== x) : [...s, x])} className="px-2 py-1 rounded text-xs font-mono" style={{ background: on ? '#a855f722' : 'rgba(255,255,255,0.04)', border: on ? '1px solid #a855f7' : '1px solid transparent', color: on ? '#a855f7' : 'rgba(255,255,255,0.4)' }}>'{x}'</button> })}</div>
        <div className="flex-1">
          <span className="text-[10px] text-white/40">Method = {combos.length} types</span>
          <div className="flex flex-wrap gap-1 mt-1">
            <AnimatePresence>{combos.map(c => <motion.span key={c} layout initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.7 }} className="px-2 py-0.5 rounded text-[11px] font-mono font-bold" style={{ background: `${TS}20`, color: TS }}>{c}</motion.span>)}</AnimatePresence>
          </div>
        </div>
      </div>
      <p className="text-xs text-white/40">Template literal types take the cartesian product of their union slots — used for typed event names, CSS props & API routes.</p>
    </div>
  )
}

// ─── Module 5: Conditional + infer ───────────────────────────────────────────
const COND = [
  { t: 'string', branch: true }, { t: 'number', branch: false }, { t: '"hi"', branch: true }, { t: 'boolean', branch: false },
]
export function ConditionalType() {
  const [i, setI] = useState(0)
  const c = COND[i]
  return (
    <div className="flex flex-col gap-3">
      <pre className="code-block text-xs text-white/75">{`type IsString<T> = T extends string ? 'yes' : 'no'`}</pre>
      <div className="flex gap-1.5 flex-wrap">{COND.map((x, idx) => <button key={idx} onClick={() => setI(idx)} className="px-2.5 py-1 rounded-lg text-xs font-mono" style={{ background: i === idx ? `${TS}22` : 'rgba(255,255,255,0.04)', border: i === idx ? `1px solid ${TS}` : '1px solid transparent', color: i === idx ? TS : 'rgba(255,255,255,0.55)' }}>IsString&lt;{x.t}&gt;</button>)}</div>
      <div className="flex items-center justify-center gap-3 font-mono text-xs">
        <span className="text-white/60">{c.t} extends string?</span>
        <div className="flex gap-2">
          <motion.span animate={{ opacity: c.branch ? 1 : 0.25, scale: c.branch ? 1.1 : 1 }} className="px-2 py-1 rounded font-bold" style={{ background: '#22c55e20', color: '#22c55e' }}>'yes'</motion.span>
          <motion.span animate={{ opacity: !c.branch ? 1 : 0.25, scale: !c.branch ? 1.1 : 1 }} className="px-2 py-1 rounded font-bold" style={{ background: '#f59e0b20', color: '#f59e0b' }}>'no'</motion.span>
        </div>
      </div>
      <pre className="code-block text-xs text-white/75">{`// infer extracts inner types:\ntype Elem<T> = T extends (infer U)[] ? U : never\nElem<string[]>  // string\nElem<number[]>  // number`}</pre>
      <p className="text-xs text-white/40">Conditional types branch at the type level; <code style={{ color: TS }}>infer</code> pattern-matches and captures an inner type.</p>
    </div>
  )
}

// ─── Module 5: Mapped type ───────────────────────────────────────────────────
export function MappedType() {
  const [mods, setMods] = useState({ readonly: true, optional: true })
  const sig = `{ ${mods.readonly ? 'readonly ' : ''}[K in keyof T]${mods.optional ? '?' : ''}: T[K] }`
  return (
    <div className="flex flex-col gap-3">
      <pre className="code-block text-xs text-white/75">{`type Mapped<T> = ${sig}`}</pre>
      <div className="flex gap-2">
        {(['readonly', 'optional'] as const).map(m => { const on = mods[m]; return <button key={m} onClick={() => setMods(s => ({ ...s, [m]: !s[m] }))} className="px-3 py-1.5 rounded-lg text-xs font-mono" style={{ background: on ? `${TS}22` : 'rgba(255,255,255,0.04)', border: on ? `1px solid ${TS}` : '1px solid transparent', color: on ? TS : 'rgba(255,255,255,0.45)' }}>{m === 'readonly' ? 'readonly' : '?'} {on ? 'on' : 'off'}</button> })}
      </div>
      <div className="rounded-xl p-3 border font-mono text-xs space-y-0.5" style={{ borderColor: `${TS}30`, background: `${TS}06` }}>
        {['id: number', 'name: string'].map(f => <div key={f}>{mods.readonly && <span className="text-amber">readonly </span>}{f.split(':')[0]}{mods.optional && <span style={{ color: TS }}>?</span>}: <span className="text-emerald-400">{f.split(': ')[1]}</span></div>)}
      </div>
      <p className="text-xs text-white/40">Mapped types iterate <code style={{ color: TS }}>[K in keyof T]</code> and apply modifiers (<code>+?</code>/<code>-?</code>, <code>readonly</code>) — the engine behind Partial, Readonly, etc.</p>
    </div>
  )
}

// ─── Module 6: Decorators ────────────────────────────────────────────────────
export function Decorators() {
  const [log, setLog] = useState<string[]>([])
  function call() { setLog(l => ['@Log → before save()', '  save() executing…', '@Log → after save() (12ms)', ...l].slice(0, 6)) }
  return (
    <div className="flex flex-col gap-3">
      <pre className="code-block text-xs text-white/75">{`@Component({ selector: 'app' })\nclass UserService {\n  @Log\n  save(@Inject user: User) { /* ... */ }\n}`}</pre>
      <div className="relative p-3 rounded-xl" style={{ border: `1px dashed ${TS}`, background: `${TS}06` }}>
        <span className="absolute -top-2 left-3 text-[10px] px-1 font-mono" style={{ background: '#050510', color: TS }}>@Component wrapper</span>
        <div className="rounded-lg p-2 bg-white/5 border border-white/10 text-center font-mono text-xs text-white/70">class UserService</div>
      </div>
      <button onClick={call} className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold self-start" style={{ background: TS, color: '#fff' }}>call save()</button>
      <div className="flex flex-col gap-0.5 min-h-[60px]">{log.map((l, i) => <motion.span key={`${l}-${i}`} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="text-[11px] font-mono" style={{ color: l.startsWith('@') ? TS : 'rgba(255,255,255,0.5)' }}>{l}</motion.span>)}</div>
      <p className="text-xs text-white/40">Decorators wrap classes/methods/params to inject behavior — logging, DI, metadata. The basis of NestJS &amp; Angular.</p>
    </div>
  )
}
