import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../../store'

const NX = '#ffffff'

// ─── M5: next/image ──────────────────────────────────────────────────────────
export function ImageOptim() {
  const [opt, setOpt] = useState(true)
  const [mode, setMode] = useState('responsive')
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2"><span className="text-xs text-white/40">next/image optimization</span><button onClick={() => setOpt(o => !o)} className="px-2.5 py-1 rounded text-xs font-mono" style={{ background: opt ? '#22c55e20' : 'rgba(255,255,255,0.05)', border: opt ? '1px solid #22c55e50' : '1px solid transparent', color: opt ? '#22c55e' : '#a1a1aa' }}>{opt ? 'ON' : 'OFF'}</button></div>
      <div className="flex flex-col gap-1.5">
        {[{ l: 'original PNG', v: 100, c: '#f43f5e' }, { l: opt ? 'optimized WebP' : 'served as-is', v: opt ? 22 : 100, c: opt ? '#22c55e' : '#f43f5e' }].map(b => (
          <div key={b.l} className="flex items-center gap-2 text-xs"><span className="w-28 text-white/45">{b.l}</span><div className="flex-1 h-3 rounded bg-white/5 overflow-hidden"><motion.div className="h-full rounded" animate={{ width: `${b.v}%`, background: b.c }} /></div><span className="font-mono w-12 text-right" style={{ color: b.c }}>{Math.round(b.v * 4.8)}KB</span></div>
        ))}
      </div>
      <div className="flex gap-1.5">{['fill', 'responsive', 'fixed'].map(x => <button key={x} onClick={() => setMode(x)} className="px-2 py-1 rounded text-[11px] font-mono" style={{ background: mode === x ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.04)', border: mode === x ? `1px solid ${NX}` : '1px solid transparent', color: mode === x ? NX : 'rgba(255,255,255,0.45)' }}>{x}</button>)}</div>
      <p className="text-xs text-white/40">{opt ? 'next/image auto-converts to WebP/AVIF, lazy-loads, and shows a blur placeholder — ~78% smaller here.' : 'Unoptimized: full-size PNG ships eagerly, hurting LCP.'} Layout mode: <code className="text-white">{mode}</code>.</p>
    </div>
  )
}

// ─── M5: next/font CLS ───────────────────────────────────────────────────────
export function FontCLS() {
  const [optimized, setOptimized] = useState(true)
  const cls = optimized ? 0 : 0.31
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">{[true, false].map(v => <button key={String(v)} onClick={() => setOptimized(v)} className="px-3 py-1.5 rounded-lg text-xs font-mono" style={{ background: optimized === v ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.04)', border: optimized === v ? `1px solid ${NX}` : '1px solid transparent', color: optimized === v ? NX : 'rgba(255,255,255,0.5)' }}>{v ? 'next/font' : 'external <link>'}</button>)}</div>
      <div className="rounded-lg p-3 overflow-hidden" style={{ background: '#0f0f12', border: '1px solid #27272a' }}>
        <motion.div animate={optimized ? {} : { y: [0, 14, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
          <div className="text-sm font-bold text-white">Heading text</div>
          <div className="text-xs text-white/50">Body content that {optimized ? 'stays put' : 'jumps when the font swaps in'}.</div>
        </motion.div>
      </div>
      <div className="flex items-center gap-2 text-xs"><span className="text-white/40">CLS score:</span><motion.span key={cls} className="font-mono font-bold" style={{ color: cls === 0 ? '#22c55e' : '#f43f5e' }}>{cls.toFixed(2)}</motion.span><span className="text-white/30">{cls === 0 ? '(perfect)' : '(poor — layout shift)'}</span></div>
      <p className="text-xs text-white/40"><code className="text-white">next/font</code> self-hosts &amp; preloads fonts with a matched fallback metric → zero layout shift.</p>
    </div>
  )
}

// ─── M5: next/script + prefetch ──────────────────────────────────────────────
export function ScriptStrategies() {
  const [run, setRun] = useState(0)
  const strats = [{ s: 'beforeInteractive', t: 0, c: '#f43f5e' }, { s: 'afterInteractive', t: 1, c: '#f59e0b' }, { s: 'lazyOnload', t: 2.4, c: '#22c55e' }]
  return (
    <div className="flex flex-col gap-3">
      <button onClick={() => setRun(r => r + 1)} className="px-3 py-1.5 rounded-lg text-xs font-semibold self-start" style={{ background: NX, color: '#000' }}>▶ load page</button>
      <div className="relative h-20 rounded-lg" style={{ background: '#0f0f12', border: '1px solid #27272a' }}>
        <div className="absolute left-0 top-1/2 w-full border-t border-dashed border-white/10" />
        {strats.map(st => (
          <motion.div key={`${st.s}-${run}`} initial={{ left: 0, opacity: 0 }} animate={{ left: `${20 + st.t * 26}%`, opacity: 1 }} transition={{ delay: st.t * 0.4 }} className="absolute top-1/2 -translate-y-1/2 px-2 py-1 rounded text-[10px] font-mono" style={{ background: `${st.c}20`, border: `1px solid ${st.c}`, color: st.c }}>{st.s}</motion.div>
        ))}
        <span className="absolute bottom-1 left-2 text-[9px] text-white/30">hydration timeline →</span>
      </div>
      <p className="text-xs text-white/40"><code className="text-white">next/script</code> strategies control load order: <span className="text-rose-400">beforeInteractive</span> (blocking) → <span className="text-amber">afterInteractive</span> → <span className="text-emerald-400">lazyOnload</span> (idle).</p>
    </div>
  )
}

export function Prefetch() {
  const [hovered, setHovered] = useState(false)
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-center gap-4 py-3">
        <button onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} className="px-3 py-1.5 rounded-lg text-xs font-mono" style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${NX}40`, color: NX }}>&lt;Link href="/about"&gt;</button>
        <motion.span animate={{ opacity: hovered ? 1 : 0.2, x: hovered ? 0 : -6 }} className="text-xs">→</motion.span>
        <motion.div animate={{ opacity: hovered ? 1 : 0.25, scale: hovered ? 1 : 0.95 }} className="px-3 py-1.5 rounded-lg text-xs font-mono" style={{ background: hovered ? '#22c55e15' : 'rgba(255,255,255,0.04)', border: `1px solid ${hovered ? '#22c55e' : '#27272a'}`, color: hovered ? '#22c55e' : '#52525b' }}>{hovered ? 'about chunk preloaded ✓' : 'about.js (not loaded)'}</motion.div>
      </div>
      <p className="text-xs text-white/40">Hover the link — <code className="text-white">next/link</code> prefetches the route's RSC payload + JS chunk into the Router Cache, so navigation is instant. Links also prefetch on viewport entry.</p>
    </div>
  )
}

// ─── M6: Build output ────────────────────────────────────────────────────────
const ROUTES = [
  { r: '/', type: 'Static', sym: '○', c: '#22c55e' },
  { r: '/blog/[slug]', type: 'ISR', sym: '◐', c: '#f59e0b' },
  { r: '/dashboard', type: 'Dynamic (SSR)', sym: 'λ', c: '#06b6d4' },
  { r: '/api/users', type: 'Route Handler', sym: 'ƒ', c: '#a855f7' },
]
export function BuildOutput() {
  return (
    <div className="flex flex-col gap-2">
      <div className="font-mono text-[11px] text-white/40">$ next build</div>
      <div className="rounded-lg p-2 font-mono text-xs space-y-1" style={{ background: '#0f0f12', border: '1px solid #27272a' }}>
        {ROUTES.map((x, i) => <motion.div key={x.r} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className="flex items-center gap-2"><span style={{ color: x.c }}>{x.sym}</span><span className="text-white/75 w-32">{x.r}</span><span style={{ color: x.c }}>{x.type}</span></motion.div>)}
      </div>
      <p className="text-xs text-white/40"><span className="text-emerald-400">○ Static</span> · <span className="text-amber">◐ ISR</span> · <span className="text-cyan-400">λ SSR</span> · <span className="text-purple-400">ƒ Handler</span> — the build report tells you exactly how each route renders.</p>
    </div>
  )
}

// ─── M6: Edge runtime (awards edge_native) ───────────────────────────────────
export function EdgeRuntime() {
  const [edge, setEdge] = useState(false)
  const checkAchievement = useStore(s => s.checkAchievement)
  useEffect(() => { if (edge) checkAchievement('edge_native') }, [edge])
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">{[false, true].map(v => <button key={String(v)} onClick={() => setEdge(v)} className="px-3 py-1.5 rounded-lg text-xs font-mono" style={{ background: edge === v ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.04)', border: edge === v ? `1px solid ${NX}` : '1px solid transparent', color: edge === v ? NX : 'rgba(255,255,255,0.5)' }}>{v ? "runtime = 'edge'" : "runtime = 'nodejs'"}</button>)}</div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        {[{ k: 'cold start', node: '~250ms', edge: '~0ms' }, { k: 'location', node: '1 region', edge: '~300 PoPs' }, { k: 'APIs', node: 'full Node.js', edge: 'Web APIs only' }, { k: 'latency', node: 'higher', edge: 'near user' }].map(row => (
          <div key={row.k} className="rounded-lg p-2" style={{ background: '#0f0f12', border: '1px solid #27272a' }}><div className="text-[10px] text-white/35">{row.k}</div><div style={{ color: edge ? '#22c55e' : '#a1a1aa' }}>{edge ? row.edge : row.node}</div></div>
        ))}
      </div>
      <p className="text-xs text-white/40">{edge ? 'Edge functions run on a global network close to users — instant cold starts, but only Web-standard APIs.' : 'The Node.js runtime gives full API access but runs in a single region with cold starts.'}</p>
    </div>
  )
}

// ─── M6: Env vars + Middleware ───────────────────────────────────────────────
export function EnvVars() {
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg p-2.5" style={{ background: '#22c55e0a', border: '1px solid #22c55e40' }}><div className="text-[10px] text-emerald-400 mb-1">NEXT_PUBLIC_* → browser</div><code className="text-[11px] text-white/65 block">NEXT_PUBLIC_API_URL</code><div className="text-[9px] text-white/30 mt-1">inlined at build, visible to client</div></div>
        <div className="rounded-lg p-2.5" style={{ background: '#f43f5e0a', border: '1px solid #f43f5e40' }}><div className="text-[10px] text-rose-400 mb-1">server-only 🔒</div><code className="text-[11px] text-white/65 block">DATABASE_URL · STRIPE_SECRET</code><div className="text-[9px] text-white/30 mt-1">never sent to the browser</div></div>
      </div>
      <div className="font-mono text-[11px] text-white/45">load order: <span className="text-white">.env</span> → .env.local → .env.[mode] → .env.[mode].local</div>
      <p className="text-xs text-white/40">Only <code className="text-emerald-400">NEXT_PUBLIC_</code>-prefixed vars cross the boundary into client bundles. Everything else stays server-side.</p>
    </div>
  )
}

export function Middleware() {
  const [path, setPath] = useState('/dashboard')
  const protectedPath = path.startsWith('/dashboard')
  return (
    <div className="flex flex-col gap-3">
      <pre className="code-block text-xs text-white/75">{`export const config = {\n  matcher: ['/dashboard/:path*']\n}`}</pre>
      <div className="flex gap-1.5">{['/', '/about', '/dashboard'].map(p => <button key={p} onClick={() => setPath(p)} className="px-2.5 py-1 rounded-lg text-xs font-mono" style={{ background: path === p ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.04)', border: path === p ? `1px solid ${NX}` : '1px solid transparent', color: path === p ? NX : 'rgba(255,255,255,0.5)' }}>{p}</button>)}</div>
      <motion.div key={path} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 font-mono text-xs">
        <span className="px-2 py-1 rounded bg-white/5">{path}</span><span className="text-white/30">→</span>
        <span className="px-2 py-1 rounded" style={{ background: protectedPath ? '#f59e0b20' : '#22c55e20', color: protectedPath ? '#f59e0b' : '#22c55e' }}>{protectedPath ? 'middleware runs → auth check → redirect /login' : 'matcher skips → straight through'}</span>
      </motion.div>
      <p className="text-xs text-white/40">Middleware runs at the edge <i>before</i> the cache, only on routes matching <code className="text-white">matcher</code> — ideal for auth, geo, and A/B redirects.</p>
    </div>
  )
}
