import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const NX = '#ffffff'

// ─── Module 2: RSC vs Client boundary ────────────────────────────────────────
// tree: Page(server) > [Nav(server), Sidebar(server), Cart(client)>[Counter]]
export function RSCBoundary() {
  const [clientRoot, setClientRoot] = useState<string | null>('cart')
  const nodes = [
    { id: 'page', label: 'Page', depth: 0 },
    { id: 'nav', label: 'Nav', depth: 1 },
    { id: 'cart', label: 'Cart  (interactive)', depth: 1, canClient: true },
    { id: 'counter', label: 'Counter', depth: 2, parent: 'cart' },
  ]
  const isClient = (n: any) => clientRoot === n.id || n.parent === clientRoot
  const bundle = clientRoot ? 18 : 0
  return (
    <div className="flex flex-col gap-3">
      <div className="space-y-1">
        {nodes.map(n => {
          const client = isClient(n)
          return (
            <div key={n.id} className="flex items-center gap-2" style={{ marginLeft: n.depth * 18 }}>
              <motion.div animate={{ background: client ? '#06b6d420' : '#3b82f620', borderColor: client ? '#06b6d4' : '#3b82f6' }} className="px-2.5 py-1 rounded border font-mono text-xs flex items-center gap-1.5" style={{ color: client ? '#22d3ee' : '#60a5fa' }}>
                {n.label}
                {n.canClient && <button onClick={() => setClientRoot(clientRoot === n.id ? null : n.id)} className="text-[9px] px-1 rounded" style={{ background: client ? '#06b6d440' : 'rgba(255,255,255,0.1)' }}>{client ? "'use client'" : '+ client'}</button>}
              </motion.div>
              <span className="text-[9px]" style={{ color: client ? '#22d3ee' : '#60a5fa' }}>{client ? 'client' : 'server'}</span>
            </div>
          )
        })}
      </div>
      <div className="flex items-center gap-2 text-xs">
        <span className="text-white/40">client JS bundle:</span>
        <div className="flex-1 h-3 rounded bg-white/5 overflow-hidden"><motion.div className="h-full rounded" animate={{ width: `${(bundle / 18) * 100}%`, background: bundle ? '#22d3ee' : '#3b82f6' }} /></div>
        <span className="font-mono" style={{ color: bundle ? '#22d3ee' : '#22c55e' }}>{bundle} KB</span>
      </div>
      <p className="text-xs text-white/40"><span className="text-blue-400">Server Components</span> ship zero JS. A <code className="text-cyan-400">'use client'</code> directive marks a boundary — that subtree hydrates and adds to the bundle.</p>
    </div>
  )
}

// ─── Module 2: SSG / SSR / ISR ───────────────────────────────────────────────
const STRATS: Record<string, { when: string; cache: string; fresh: string; use: string; color: string }> = {
  SSG: { when: 'at build time', cache: 'cached forever on CDN', fresh: 'stale until rebuild', use: 'marketing pages, docs, blog', color: '#22c55e' },
  ISR: { when: 'build + revalidated', cache: 'cached, refreshed on a timer', fresh: 'eventually fresh (revalidate: N)', use: 'product pages, feeds', color: '#f59e0b' },
  SSR: { when: 'on every request', cache: 'not cached (dynamic)', fresh: 'always fresh', use: 'dashboards, personalized', color: '#06b6d4' },
}
export function StrategyCompare() {
  const [s, setS] = useState('ISR')
  const d = STRATS[s]
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-1.5">{Object.keys(STRATS).map(k => <button key={k} onClick={() => setS(k)} className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold" style={{ background: s === k ? `${STRATS[k].color}22` : 'rgba(255,255,255,0.04)', border: s === k ? `1px solid ${STRATS[k].color}` : '1px solid transparent', color: s === k ? STRATS[k].color : 'rgba(255,255,255,0.5)' }}>{k}</button>)}</div>
      <motion.div key={s} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="flex items-center justify-center gap-2 py-2 font-mono text-[11px]">
        <span className="px-2 py-1 rounded bg-white/5">request</span><span className="text-white/30">→</span>
        <span className="px-2 py-1 rounded" style={{ background: `${d.color}20`, color: d.color }}>{s === 'SSR' ? 'server renders' : 'CDN'}</span><span className="text-white/30">→</span>
        <span className="px-2 py-1 rounded bg-white/5">HTML</span>
      </motion.div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        {[['rendered', d.when], ['cache', d.cache], ['freshness', d.fresh], ['best for', d.use]].map(([k, v]) => (
          <div key={k} className="rounded-lg p-2" style={{ background: '#0f0f12', border: '1px solid #27272a' }}><div className="text-[10px] text-white/35">{k}</div><div style={{ color: d.color }}>{v}</div></div>
        ))}
      </div>
      {s === 'ISR' && <p className="text-xs text-white/40"><code className="text-amber">export const revalidate = 60</code> — serves cached HTML, regenerates in the background after 60s. <code className="text-amber">revalidatePath()</code> forces it on-demand.</p>}
    </div>
  )
}

// ─── Module 2: Streaming & Suspense ──────────────────────────────────────────
export function StreamingSuspense() {
  const [mode, setMode] = useState<'idle' | 'loading' | 'done'>('idle')
  function run() { setMode('loading'); setTimeout(() => setMode('done'), 1400) }
  return (
    <div className="flex flex-col gap-3">
      <pre className="code-block text-xs text-white/75">{`<Suspense fallback={<Skeleton />}>\n  <SlowFeed />   {/* streamed in when ready */}\n</Suspense>`}</pre>
      <div className="rounded-lg p-3 min-h-[80px] flex flex-col gap-2" style={{ background: '#0f0f12', border: '1px solid #27272a' }}>
        <div className="h-5 rounded bg-white/10 w-1/3" />{/* instant shell */}
        <AnimatePresence mode="wait">
          {mode === 'loading' && <motion.div key="s" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-1.5">{[1, 2, 3].map(i => <motion.div key={i} animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: i * 0.15 }} className="h-3 rounded bg-white/10" style={{ width: `${90 - i * 12}%` }} />)}</motion.div>}
          {mode === 'done' && <motion.div key="d" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-white/70 space-y-1"><div>✦ Streamed post #1 — arrived after server fetch</div><div>✦ Streamed post #2</div><div>✦ Streamed post #3</div></motion.div>}
          {mode === 'idle' && <div key="i" className="text-xs text-white/25">click run — shell paints instantly, slow content streams in</div>}
        </AnimatePresence>
      </div>
      <button onClick={run} className="px-3 py-1.5 rounded-lg text-xs font-semibold self-start" style={{ background: NX, color: '#000' }}>▶ stream response</button>
      <p className="text-xs text-white/40">Streaming SSR sends the static shell immediately, then flushes Suspense boundaries as their data resolves — no all-or-nothing waterfall.</p>
    </div>
  )
}
