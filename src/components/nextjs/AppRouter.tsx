import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const NX = '#ffffff'

// ─── Module 1: File-system routing ───────────────────────────────────────────
const FILES = [
  { path: 'app/page.tsx', route: '/', on: true },
  { path: 'app/about/page.tsx', route: '/about', on: true },
  { path: 'app/blog/[slug]/page.tsx', route: '/blog/:slug', on: true },
  { path: 'app/(marketing)/pricing/page.tsx', route: '/pricing', on: false, note: '(marketing) group → not in URL' },
  { path: 'app/shop/[...cats]/page.tsx', route: '/shop/a/b/c', on: false, note: 'catch-all segment' },
]
export function FileTreeRouter() {
  const [files, setFiles] = useState(FILES)
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-white/40 mb-1.5">file system</div>
          <div className="rounded-lg p-2 font-mono text-xs space-y-1" style={{ background: '#0f0f12', border: '1px solid #27272a' }}>
            {files.map((f, i) => (
              <button key={f.path} onClick={() => setFiles(fs => fs.map((x, j) => j === i ? { ...x, on: !x.on } : x))} className="flex items-center gap-2 w-full text-left rounded px-1 py-0.5 hover:bg-white/5">
                <span className="w-3 h-3 rounded-sm border flex items-center justify-center text-[8px]" style={{ borderColor: f.on ? NX : '#3f3f46', background: f.on ? NX : 'transparent', color: '#000' }}>{f.on && '✓'}</span>
                <span style={{ color: f.on ? '#e5e5e5' : '#52525b' }}>📄 {f.path}</span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-white/40 mb-1.5">generated routes</div>
          <div className="rounded-lg p-2 font-mono text-xs space-y-1 min-h-[120px]" style={{ background: '#0f0f12', border: '1px solid #27272a' }}>
            <AnimatePresence>
              {files.filter(f => f.on).map(f => (
                <motion.div key={f.route} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }} className="flex items-center gap-2">
                  <span className="text-emerald-400">→</span><span className="text-white">{f.route}</span>
                  {f.note && <span className="text-[9px] text-white/30 ml-auto">{f.note}</span>}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <p className="text-xs text-white/40">In the App Router, the folder structure <i>is</i> the routing table. A <code className="text-white">page.tsx</code> makes a segment publicly routable.</p>
    </div>
  )
}

// ─── Module 1: Dynamic segments ──────────────────────────────────────────────
const SEGS = [
  { syntax: '[id]', desc: 'single dynamic segment', matches: ['/posts/1', '/posts/abc'], rejects: ['/posts', '/posts/a/b'] },
  { syntax: '[...slug]', desc: 'catch-all (1+ segments)', matches: ['/docs/a', '/docs/a/b/c'], rejects: ['/docs'] },
  { syntax: '[[...slug]]', desc: 'optional catch-all (0+)', matches: ['/docs', '/docs/a', '/docs/a/b'], rejects: [] },
]
export function DynamicSegments() {
  const [i, setI] = useState(0)
  const s = SEGS[i]
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-1.5 flex-wrap">{SEGS.map((x, idx) => <button key={idx} onClick={() => setI(idx)} className="px-2.5 py-1 rounded-lg text-xs font-mono" style={{ background: i === idx ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.04)', border: i === idx ? `1px solid ${NX}` : '1px solid transparent', color: i === idx ? NX : 'rgba(255,255,255,0.55)' }}>{x.syntax}</button>)}</div>
      <div className="font-mono text-xs text-white/50">app/posts/<span className="text-white font-bold">{s.syntax}</span>/page.tsx — {s.desc}</div>
      <div className="grid grid-cols-2 gap-2">
        <motion.div key={`m${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-lg p-2.5 border" style={{ borderColor: '#22c55e40', background: '#22c55e0a' }}>
          <div className="text-[10px] text-emerald-400 mb-1">✓ matches</div>{s.matches.map(m => <div key={m} className="font-mono text-xs text-white/65">{m}</div>)}
        </motion.div>
        <motion.div key={`r${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.08 }} className="rounded-lg p-2.5 border" style={{ borderColor: '#f43f5e40', background: '#f43f5e0a' }}>
          <div className="text-[10px] text-rose-400 mb-1">✗ no match</div>{s.rejects.length ? s.rejects.map(m => <div key={m} className="font-mono text-xs text-white/65">{m}</div>) : <div className="text-xs text-white/30">— always matches —</div>}
        </motion.div>
      </div>
    </div>
  )
}

// ─── Module 1: Nested layouts ────────────────────────────────────────────────
export function LayoutNesting() {
  const [route, setRoute] = useState('/dashboard/settings')
  const layers = [
    { name: 'RootLayout', file: 'app/layout.tsx', active: true },
    { name: 'DashboardLayout', file: 'app/dashboard/layout.tsx', active: route.startsWith('/dashboard') },
    { name: 'SettingsPage', file: 'app/dashboard/settings/page.tsx', active: route === '/dashboard/settings' },
  ]
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-1.5">{['/', '/dashboard', '/dashboard/settings'].map(r => <button key={r} onClick={() => setRoute(r)} className="px-2.5 py-1 rounded-lg text-xs font-mono" style={{ background: route === r ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.04)', border: route === r ? `1px solid ${NX}` : '1px solid transparent', color: route === r ? NX : 'rgba(255,255,255,0.5)' }}>{r}</button>)}</div>
      <div className="space-y-0 p-1">
        {layers.map((l, i) => (
          <motion.div key={l.name} animate={{ opacity: l.active ? 1 : 0.3 }} className="rounded-lg p-2 border" style={{ marginLeft: i * 16, borderColor: l.active ? `${NX}40` : '#27272a', background: l.active ? 'rgba(255,255,255,0.04)' : 'transparent' }}>
            <div className="font-mono text-xs" style={{ color: l.active ? '#fff' : '#52525b' }}>{i < 2 ? '▭ ' : '▢ '}{l.name}</div>
            <div className="font-mono text-[9px] text-white/30">{l.file}</div>
          </motion.div>
        ))}
      </div>
      <p className="text-xs text-white/40">Layouts <b className="text-white">persist</b> across navigation — only the changing leaf re-renders. A <code className="text-white">template.tsx</code> would remount on every navigation instead.</p>
    </div>
  )
}
