import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const NX = '#ffffff'

// ─── Module 3: fetch cache ───────────────────────────────────────────────────
export function FetchCache() {
  const [opt, setOpt] = useState<'force-cache' | 'no-store'>('force-cache')
  const [log, setLog] = useState<{ hit: boolean }[]>([])
  const [warmed, setWarmed] = useState(false)
  function go() {
    const hit = opt === 'force-cache' && warmed
    setLog(l => [{ hit }, ...l].slice(0, 6))
    if (opt === 'force-cache') setWarmed(true)
  }
  function reset() { setLog([]); setWarmed(false) }
  return (
    <div className="flex flex-col gap-3">
      <pre className="code-block text-xs text-white/75">{`await fetch(url, { cache: '${opt}' })`}</pre>
      <div className="flex gap-1.5">{(['force-cache', 'no-store'] as const).map(o => <button key={o} onClick={() => { setOpt(o); reset() }} className="px-3 py-1.5 rounded-lg text-xs font-mono" style={{ background: opt === o ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.04)', border: opt === o ? `1px solid ${NX}` : '1px solid transparent', color: opt === o ? NX : 'rgba(255,255,255,0.5)' }}>{o}</button>)}</div>
      <div className="flex gap-2"><button onClick={go} className="px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: NX, color: '#000' }}>fetch()</button><button onClick={reset} className="btn-ghost text-xs">reset</button></div>
      <div className="flex gap-1 flex-wrap min-h-[24px]">{log.map((l, i) => <motion.span key={i} initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ background: l.hit ? '#22c55e20' : '#f59e0b20', color: l.hit ? '#22c55e' : '#f59e0b' }}>{l.hit ? 'CACHE HIT' : 'MISS→fetch'}</motion.span>)}</div>
      <p className="text-xs text-white/40">{opt === 'force-cache' ? 'force-cache (default) stores the result in the Data Cache — repeat calls hit it.' : 'no-store opts out entirely — every call refetches and forces dynamic rendering.'}</p>
    </div>
  )
}

// ─── Module 3: Request memoization ───────────────────────────────────────────
export function RequestMemoization() {
  const [deduped, setDeduped] = useState(false)
  const comps = ['Header', 'Sidebar', 'Footer']
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-white/50">3 components each call <code className="text-white font-mono">fetch('/api/user')</code> in one render:</p>
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-col gap-1.5">{comps.map((c, i) => <motion.div key={c} className="px-2.5 py-1 rounded text-xs font-mono border" style={{ background: 'rgba(255,255,255,0.04)', borderColor: '#27272a', color: '#a1a1aa' }}>{c} → fetch()</motion.div>)}</div>
        <div className="flex flex-col items-center gap-1">
          <AnimatePresence mode="wait">
            {deduped
              ? <motion.div key="d" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center"><div className="px-3 py-2 rounded-lg border font-mono text-xs" style={{ background: '#22c55e15', borderColor: '#22c55e', color: '#22c55e' }}>1 request</div><div className="text-[9px] text-white/30 mt-1">deduped</div></motion.div>
              : <motion.div key="n" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center"><div className="px-3 py-2 rounded-lg border font-mono text-xs" style={{ background: '#f43f5e15', borderColor: '#f43f5e', color: '#f43f5e' }}>3 requests</div><div className="text-[9px] text-white/30 mt-1">naive</div></motion.div>}
          </AnimatePresence>
        </div>
      </div>
      <button onClick={() => setDeduped(d => !d)} className="px-3 py-1.5 rounded-lg text-xs font-semibold self-start" style={{ background: NX, color: '#000' }}>{deduped ? 'show naive' : 'apply memoization'}</button>
      <p className="text-xs text-white/40">Within a single render pass, Next.js automatically <b className="text-white">memoizes</b> identical fetches into one request — no manual dedup needed.</p>
    </div>
  )
}

// ─── Module 3: Server Actions (optimistic) ───────────────────────────────────
export function ServerActions() {
  const [todos, setTodos] = useState(['Learn RSC'])
  const [pending, setPending] = useState<string | null>(null)
  const [text, setText] = useState('Ship it')
  function add() {
    if (!text.trim()) return
    setPending(text)            // optimistic — appears instantly
    setTimeout(() => { setTodos(t => [...t, text]); setPending(null); setText('') }, 1000) // server confirms
  }
  return (
    <div className="flex flex-col gap-3">
      <pre className="code-block text-xs text-white/75">{`async function add(formData) {\n  'use server'\n  await db.todo.create(...)\n  revalidatePath('/todos')\n}`}</pre>
      <div className="flex gap-2"><input value={text} onChange={e => setText(e.target.value)} className="flex-1 rounded px-2 py-1 text-xs font-mono outline-none" style={{ background: '#0f0f12', border: '1px solid #27272a', color: '#fff' }} /><button onClick={add} className="px-3 py-1 rounded text-xs font-semibold" style={{ background: NX, color: '#000' }}>add</button></div>
      <div className="flex flex-col gap-1">
        {todos.map((t, i) => <div key={i} className="px-2.5 py-1 rounded text-xs font-mono" style={{ background: 'rgba(255,255,255,0.04)', color: '#e5e5e5' }}>✓ {t}</div>)}
        {pending && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.55 }} className="px-2.5 py-1 rounded text-xs font-mono flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.04)', color: '#a1a1aa' }}><motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 0.8 }}>◌</motion.span> {pending} <span className="text-[9px] ml-auto">optimistic…</span></motion.div>}
      </div>
      <p className="text-xs text-white/40">A Server Action runs on the server with no API route. <code className="text-white">useOptimistic</code> shows the new item instantly, then reconciles when the server confirms.</p>
    </div>
  )
}

// ─── Module 3: Route handlers ────────────────────────────────────────────────
const METHODS = ['GET', 'POST', 'PUT', 'DELETE'] as const
export function RouteHandlers() {
  const [m, setM] = useState<typeof METHODS[number]>('GET')
  const resp: Record<string, string> = { GET: '200 OK  { users: [...] }', POST: '201 Created  { id: 42 }', PUT: '200 OK  { updated: true }', DELETE: '204 No Content' }
  return (
    <div className="flex flex-col gap-3">
      <div className="font-mono text-[11px] text-white/40">app/api/users/route.ts</div>
      <div className="flex gap-1.5">{METHODS.map(x => <button key={x} onClick={() => setM(x)} className="px-2.5 py-1 rounded-lg text-xs font-mono" style={{ background: m === x ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.04)', border: m === x ? `1px solid ${NX}` : '1px solid transparent', color: m === x ? NX : 'rgba(255,255,255,0.5)' }}>{x}</button>)}</div>
      <pre className="code-block text-xs text-white/75">{`export async function ${m}(req: Request) {\n  return Response.json(/* ... */)\n}`}</pre>
      <motion.div key={m} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-mono text-xs rounded-lg p-2.5" style={{ background: '#0f0f12', border: '1px solid #27272a', color: '#22c55e' }}>← {resp[m]}</motion.div>
      <p className="text-xs text-white/40">Route Handlers replace API routes — export a function per HTTP verb. They support streaming via <code className="text-white">ReadableStream</code> and run before the cache.</p>
    </div>
  )
}
