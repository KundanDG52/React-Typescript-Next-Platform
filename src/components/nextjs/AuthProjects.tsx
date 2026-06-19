import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const NX = '#ffffff'

// ─── M7: Auth.js flow ────────────────────────────────────────────────────────
const AUTH_STEPS = [
  { from: 'Client', label: 'signIn("github")', c: '#fff' },
  { from: 'Auth.js', label: 'redirect → GitHub OAuth', c: '#f59e0b' },
  { from: 'GitHub', label: 'callback ?code=…', c: '#a855f7' },
  { from: 'Auth.js', label: 'exchange code → tokens', c: '#22c55e' },
  { from: 'Auth.js', label: 'set session cookie', c: '#22d3ee' },
]
export function AuthFlow() {
  const [step, setStep] = useState(-1)
  function run() { setStep(-1); let i = 0; const id = setInterval(() => { setStep(i); i++; if (i >= AUTH_STEPS.length) clearInterval(id) }, 700) }
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        {AUTH_STEPS.map((s, i) => (
          <motion.div key={i} animate={{ opacity: step >= i ? 1 : 0.25, x: step === i ? 6 : 0 }} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono" style={{ background: step >= i ? `${s.c}12` : 'transparent', border: `1px solid ${step >= i ? s.c + '40' : '#1f1f23'}` }}>
            <span className="font-bold w-16" style={{ color: s.c }}>{s.from}</span><span className="text-white/60">{s.label}</span>
          </motion.div>
        ))}
      </div>
      <button onClick={run} className="px-3 py-1.5 rounded-lg text-xs font-semibold self-start" style={{ background: NX, color: '#000' }}>▶ run sign-in flow</button>
      <p className="text-xs text-white/40">Auth.js (NextAuth) handles the OAuth dance and issues a session. In RSC you read it with <code className="text-white">await auth()</code> — no client round-trip.</p>
    </div>
  )
}

// ─── M7: JWT vs DB sessions ──────────────────────────────────────────────────
export function SessionCompare() {
  const [mode, setMode] = useState<'jwt' | 'db'>('jwt')
  const data = {
    jwt: { store: 'signed cookie (stateless)', read: 'verify signature — no DB', revoke: 'hard (wait for expiry)', scale: 'trivial — no shared store', c: '#22c55e' },
    db: { store: 'session row in database', read: 'DB lookup per request', revoke: 'instant (delete row)', scale: 'needs a shared session store', c: '#06b6d4' },
  }[mode]
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">{(['jwt', 'db'] as const).map(m => <button key={m} onClick={() => setMode(m)} className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold" style={{ background: mode === m ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.04)', border: mode === m ? `1px solid ${NX}` : '1px solid transparent', color: mode === m ? NX : 'rgba(255,255,255,0.5)' }}>{m === 'jwt' ? 'JWT session' : 'Database session'}</button>)}</div>
      <motion.div key={mode} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 gap-2 text-xs">
        {[['stored as', data.store], ['read cost', data.read], ['revoke', data.revoke], ['scaling', data.scale]].map(([k, v]) => <div key={k} className="rounded-lg p-2" style={{ background: '#0f0f12', border: '1px solid #27272a' }}><div className="text-[10px] text-white/35">{k}</div><div style={{ color: data.c }}>{v}</div></div>)}
      </motion.div>
      <p className="text-xs text-white/40">JWT trades instant revocation for stateless scale; DB sessions trade a lookup for full control. Auth.js supports both via the <code className="text-white">session.strategy</code> option.</p>
    </div>
  )
}

// ─── M8: Project walkthroughs ────────────────────────────────────────────────
const PROJECTS: Record<string, { steps: { feature: string; strategy: string; c: string }[] }> = {
  'E-commerce': { steps: [
    { feature: 'Product listing', strategy: 'SSG + ISR (revalidate: 3600)', c: '#22c55e' },
    { feature: 'Product detail', strategy: 'Dynamic SSR (live stock/price)', c: '#06b6d4' },
    { feature: 'Cart', strategy: "Client Component ('use client') + Server Action", c: '#a855f7' },
    { feature: 'Checkout', strategy: 'Server Action → Stripe → revalidateTag', c: '#f59e0b' },
  ] },
  'Dashboard': { steps: [
    { feature: 'Auth', strategy: 'Auth.js session in RSC', c: '#22c55e' },
    { feature: 'Route protection', strategy: 'middleware matcher → redirect', c: '#f59e0b' },
    { feature: 'Live data', strategy: 'Streaming SSR + Suspense', c: '#06b6d4' },
    { feature: 'Mutations', strategy: 'Server Action + useOptimistic', c: '#a855f7' },
  ] },
  'Blog': { steps: [
    { feature: 'Posts', strategy: 'MDX → RSC, generateStaticParams', c: '#22c55e' },
    { feature: 'Tag pages', strategy: 'ISR + revalidateTag("posts")', c: '#f59e0b' },
    { feature: 'Comments', strategy: 'Server Action + optimistic insert', c: '#a855f7' },
    { feature: 'RSS feed', strategy: 'Route Handler (app/feed.xml/route.ts)', c: '#06b6d4' },
  ] },
}
export function ProjectWalkthrough() {
  const [proj, setProj] = useState('E-commerce')
  const [step, setStep] = useState(0)
  const steps = PROJECTS[proj].steps
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-1.5">{Object.keys(PROJECTS).map(p => <button key={p} onClick={() => { setProj(p); setStep(0) }} className="px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: proj === p ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.04)', border: proj === p ? `1px solid ${NX}` : '1px solid transparent', color: proj === p ? NX : 'rgba(255,255,255,0.5)' }}>{p}</button>)}</div>
      <div className="flex gap-1">{steps.map((_, i) => <button key={i} onClick={() => setStep(i)} className="flex-1 h-1.5 rounded-full transition-all" style={{ background: step >= i ? steps[i].c : '#27272a' }} />)}</div>
      <motion.div key={`${proj}-${step}`} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} className="rounded-lg p-3 border" style={{ borderColor: `${steps[step].c}40`, background: `${steps[step].c}0a` }}>
        <div className="text-[10px] text-white/35 mb-1">step {step + 1}/{steps.length}</div>
        <div className="font-bold text-sm" style={{ color: steps[step].c }}>{steps[step].feature}</div>
        <div className="font-mono text-xs text-white/60 mt-1">{steps[step].strategy}</div>
      </motion.div>
      <div className="flex gap-2"><button onClick={() => setStep(s => Math.max(0, s - 1))} className="btn-ghost text-xs">◀ prev</button><button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} className="px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: NX, color: '#000' }}>next ▶</button></div>
      <p className="text-xs text-white/40">Each feature maps to the rendering/data strategy that fits it — the core skill of building real Next.js apps.</p>
    </div>
  )
}
