import { useState, useEffect, useRef, useMemo } from 'react'
import { motion } from 'framer-motion'

// ─── useState: batching + functional updates ─────────────────────────────────
export function UseStateDemo() {
  const [count, setCount] = useState(0)
  const [renders, setRenders] = useState(0)
  const renderRef = useRef(0)
  renderRef.current++

  function batched() {
    // three calls — React batches into ONE render
    setCount(c => c + 1); setCount(c => c + 1); setCount(c => c + 1)
    setRenders(r => r + 1)
  }
  function naive() {
    // reads stale `count` three times → only +1
    setCount(count + 1); setCount(count + 1); setCount(count + 1)
    setRenders(r => r + 1)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-4">
        <motion.div key={count} initial={{ scale: 1.3 }} animate={{ scale: 1 }} className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black bg-react/15 border border-react/40 text-react">{count}</motion.div>
        <div className="text-xs text-white/50 space-y-1">
          <div>state updates: <span className="text-react font-mono">{renders}</span></div>
          <div>actual renders: <span className="text-purple font-mono">{renderRef.current}</span></div>
        </div>
      </div>
      <div className="flex gap-2 flex-wrap">
        <button onClick={batched} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-green/20 border border-green/40 text-green">setCount(c =&gt; c+1) ×3 → +3</button>
        <button onClick={naive} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500/20 border border-red-500/40 text-red-400">setCount(count+1) ×3 → +1</button>
        <button onClick={() => setCount(0)} className="btn-ghost text-xs">Reset</button>
      </div>
      <p className="text-xs text-white/40">Both buttons call setState 3× and trigger <b>one</b> batched render. Functional updates <code className="text-green">c =&gt; c+1</code> see the latest value; raw <code className="text-red-400">count+1</code> reads a stale closure.</p>
    </div>
  )
}

// ─── useEffect: dependency array visualizer ──────────────────────────────────
export function UseEffectDemo() {
  const [a, setA] = useState(0)
  const [b, setB] = useState(0)
  const [deps, setDeps] = useState<('a' | 'b')[]>(['a'])
  const [fires, setFires] = useState(0)
  const log = useRef<string[]>([])
  const depKey = deps.join(',')

  useEffect(() => {
    setFires(f => f + 1)
    log.current = [`effect fired (deps: [${depKey || ''}])`, ...log.current].slice(0, 4)
  }, [depKey, deps.includes('a') ? a : 0, deps.includes('b') ? b : 0]) // eslint-disable-line

  function toggleDep(d: 'a' | 'b') { setDeps(p => p.includes(d) ? p.filter(x => x !== d) : [...p, d]) }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-4">
        {[['a', a, setA] as const, ['b', b, setB] as const].map(([name, val, set]) => (
          <div key={name} className="flex items-center gap-2">
            <button onClick={() => set(v => v + 1)} className="w-9 h-9 rounded-lg bg-white/5 border border-border text-sm font-mono hover:bg-white/10">{name}+</button>
            <span className="font-mono text-sm text-white/70">{val}</span>
            <button onClick={() => toggleDep(name)} className="px-2 py-1 rounded text-[10px] font-semibold" style={{ background: deps.includes(name) ? '#61dafb20' : 'rgba(255,255,255,0.05)', border: deps.includes(name) ? '1px solid #61dafb50' : '1px solid transparent', color: deps.includes(name) ? '#61dafb' : 'rgba(255,255,255,0.4)' }}>{deps.includes(name) ? 'in deps' : 'add dep'}</button>
          </div>
        ))}
      </div>
      <div className="font-mono text-xs text-white/50 bg-bg/60 rounded-lg px-3 py-2 border border-border">useEffect(fn, [{depKey}]) — fired <span className="text-react">{fires}</span>×</div>
      <div className="flex flex-col gap-0.5">{log.current.map((l, i) => <span key={i} className="text-[11px] font-mono text-white/40">{l}</span>)}</div>
      <p className="text-xs text-white/40">Increment a value that's <b>in the dependency array</b> to fire the effect. Changing a value not listed won't re-run it.</p>
    </div>
  )
}

// ─── useRef: ref doesn't trigger render ──────────────────────────────────────
export function UseRefDemo() {
  const [stateCount, setStateCount] = useState(0)
  const refCount = useRef(0)
  const renders = useRef(0)
  renders.current++
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl p-3 border border-react/30 bg-react/05 text-center">
          <div className="text-2xl font-black text-react">{stateCount}</div>
          <div className="text-[10px] text-white/40 mb-2">useState</div>
          <button onClick={() => setStateCount(c => c + 1)} className="text-xs btn-ghost w-full">+1 (re-renders)</button>
        </div>
        <div className="rounded-xl p-3 border border-purple/30 bg-purple/05 text-center">
          <div className="text-2xl font-black text-purple">{refCount.current}</div>
          <div className="text-[10px] text-white/40 mb-2">useRef</div>
          <button onClick={() => { refCount.current++; }} className="text-xs btn-ghost w-full">+1 (no render)</button>
        </div>
      </div>
      <div className="text-xs text-white/50 text-center">Component renders: <span className="font-mono text-amber">{renders.current}</span></div>
      <div className="flex gap-2">
        <input ref={inputRef} placeholder="DOM ref demo" className="flex-1 bg-bg/60 border border-border rounded-lg px-3 py-1.5 text-sm outline-none focus:border-react/50" />
        <button onClick={() => inputRef.current?.focus()} className="btn-ghost text-xs">focus()</button>
      </div>
      <p className="text-xs text-white/40">Mutating a ref updates <code>.current</code> without re-rendering (the purple number only updates when something else renders). Refs also point at DOM nodes.</p>
    </div>
  )
}

// ─── useMemo: skip expensive recompute ───────────────────────────────────────
function slowSquare(n: number) { let x = 0; for (let i = 0; i < 8e6; i++) x += Math.sqrt(i % 7); return n * n + (x * 0) }

export function UseMemoDemo() {
  const [num, setNum] = useState(8)
  const [other, setOther] = useState(0)
  const [memoOn, setMemoOn] = useState(true)
  const computeLog = useRef(0)

  const memoized = useMemo(() => { computeLog.current++; return slowSquare(num) }, [num])
  const live = memoOn ? memoized : (() => { computeLog.current++; return slowSquare(num) })()

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="text-xs text-white/50">memoization</span>
        <button onClick={() => setMemoOn(v => !v)} className="px-3 py-1 rounded-lg text-xs font-semibold" style={{ background: memoOn ? '#22c55e20' : '#ef444420', border: `1px solid ${memoOn ? '#22c55e50' : '#ef444450'}`, color: memoOn ? '#22c55e' : '#f87171' }}>{memoOn ? 'ON' : 'OFF'}</button>
        <span className="ml-auto text-xs text-white/40">slowSquare ran <span className="font-mono text-amber">{computeLog.current}</span>×</span>
      </div>
      <div className="font-mono text-sm bg-bg/60 rounded-lg px-3 py-2 border border-border">slowSquare({num}) = <span className="text-react">{live}</span></div>
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setNum(n => n + 1)} className="btn-ghost text-xs">change input (recompute)</button>
        <button onClick={() => setOther(o => o + 1)} className="btn-ghost text-xs">unrelated render ({other})</button>
      </div>
      <p className="text-xs text-white/40">With memo <b>ON</b>, clicking "unrelated render" skips the expensive calc. With it <b>OFF</b>, every render recomputes — watch the counter.</p>
    </div>
  )
}
