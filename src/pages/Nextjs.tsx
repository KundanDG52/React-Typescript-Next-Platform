import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { SplitDemo, TrackHeader } from '../components/shared/Demo'
import { useStore } from '../store'
import { FileTreeRouter, DynamicSegments, LayoutNesting } from '../components/nextjs/AppRouter'
import { RSCBoundary, StrategyCompare, StreamingSuspense } from '../components/nextjs/Rendering'
import { FetchCache, RequestMemoization, ServerActions, RouteHandlers } from '../components/nextjs/DataFetching'
import { CacheLayers, CacheInvalidation } from '../components/nextjs/Caching'
import { ImageOptim, FontCLS, ScriptStrategies, Prefetch, BuildOutput, EdgeRuntime, EnvVars, Middleware } from '../components/nextjs/PerfDeploy'
import { AuthFlow, SessionCompare, ProjectWalkthrough } from '../components/nextjs/AuthProjects'

const NX = '#ffffff'

function ModuleHead({ n, title }: { n: string; title: string }) {
  return (
    <motion.div initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex items-center gap-3 mt-4">
      <span className="font-mono text-xs font-bold px-2 py-1 rounded" style={{ background: 'rgba(255,255,255,0.12)', color: NX, border: '1px solid rgba(255,255,255,0.2)' }}>{n}</span>
      <h2 className="text-lg font-bold text-white">{title}</h2>
      <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.3), transparent)' }} />
    </motion.div>
  )
}

// ─── Rendering Challenge ─────────────────────────────────────────────────────
const SCENARIOS = [
  { id: 'nx-ch1', q: 'A marketing landing page — content changes maybe once a month.', options: ['SSR on every request', 'Static (SSG)', 'Client-rendered SPA', 'no-store fetch'], answer: 1, explain: 'Static generation: build once, serve from CDN. Fastest + cheapest for rarely-changing content.' },
  { id: 'nx-ch2', q: 'A product page where price/stock should refresh ~every minute without a rebuild.', options: ['Pure SSG', 'ISR (revalidate: 60)', 'Client fetch in useEffect', 'SSR every request'], answer: 1, explain: 'ISR serves cached HTML and regenerates in the background on the revalidate interval — fast and fresh enough.' },
  { id: 'nx-ch3', q: 'A user-specific dashboard reading cookies for the logged-in user.', options: ['SSG', 'ISR', 'Dynamic SSR', 'Static + client fetch'], answer: 2, explain: 'Reading cookies()/headers() opts into dynamic rendering — it must render per-request (SSR).' },
  { id: 'nx-ch4', q: 'A "like" button that should feel instant but persist to the DB.', options: ['Route Handler + useEffect', 'Server Action + useOptimistic', 'SSG', 'Client-only state'], answer: 1, explain: 'A Server Action persists to the DB with no API route; useOptimistic updates the UI instantly, then reconciles.' },
]
function ChallengeCard({ s, i }: { s: typeof SCENARIOS[number]; i: number }) {
  const { solvePuzzle, solvedPuzzles } = useStore()
  const done = solvedPuzzles.includes(s.id)
  const [sel, setSel] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  function pick(idx: number) { if (revealed) return; setSel(idx); setRevealed(true); if (idx === s.answer && !done) solvePuzzle(s.id) }
  const correct = sel === s.answer
  return (
    <div className="card rounded-2xl overflow-hidden">
      <div className="px-4 py-2 border-b border-white/5 flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.04)' }}>
        <span className="w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)', color: NX }}>{i + 1}</span>
        <span className="text-xs font-semibold text-white/80">pick the rendering strategy</span>
        {done && <span className="ml-auto text-[10px] text-emerald-400 flex items-center gap-1"><Check size={10} /> solved</span>}
      </div>
      <div className="p-4 flex flex-col gap-3">
        <p className="text-sm text-white/80">{s.q}</p>
        <div className="flex flex-col gap-1.5">
          {s.options.map((o, idx) => {
            const isA = idx === s.answer, isP = sel === idx
            let cls = 'border-white/08 text-white/65 hover:border-white/30'
            if (revealed && isA) cls = 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
            else if (revealed && isP && !isA) cls = 'border-red-500/50 bg-red-500/10 text-red-400'
            return <button key={idx} onClick={() => pick(idx)} disabled={revealed} className={`text-left px-3 py-2 rounded-lg text-xs border transition-all flex items-center gap-2 ${cls}`}><span className="flex-1">{o}</span>{revealed && isA && <Check size={12} />}{revealed && isP && !isA && <X size={12} />}</button>
          })}
        </div>
        <AnimatePresence>{revealed && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden"><div className="rounded-lg p-2.5 text-xs border" style={{ borderColor: correct ? '#22c55e30' : 'rgba(255,255,255,0.2)', background: correct ? '#22c55e0a' : 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.6)' }}><span className="font-semibold" style={{ color: correct ? '#22c55e' : '#fff' }}>{correct ? '✓ +50 XP — ' : 'Answer: '}</span>{s.explain}</div>{!correct && <button onClick={() => { setRevealed(false); setSel(null) }} className="btn-ghost text-xs mt-2">try again</button>}</motion.div>}</AnimatePresence>
      </div>
    </div>
  )
}

export function NextjsTrack() {
  const { completeTrack, addXP } = useStore()
  useEffect(() => { addXP(10); completeTrack('nextjs') }, [])

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col gap-5">
      <TrackHeader icon="▲" name="Next.js Mastery" sub="App Router · Server Components · rendering · caching · Server Actions · deployment · auth" color={NX} />

      <ModuleHead n="M1" title="App Router Architecture" />
      <SplitDemo title="File-system routing" color={NX} description="Folders define routes. Toggle files to see the route table update.">{<FileTreeRouter />}</SplitDemo>
      <SplitDemo title="Dynamic segments" color={NX} delay={0.05} description="[id], [...slug] and [[...slug]] match different URL shapes.">{<DynamicSegments />}</SplitDemo>
      <SplitDemo title="Nested layouts" color={NX} delay={0.1} description="Layouts wrap segments and persist across navigation — only the leaf changes.">{<LayoutNesting />}</SplitDemo>

      <ModuleHead n="M2" title="Rendering Strategies" />
      <SplitDemo title="Server vs Client Components" color={NX} description="RSC ship zero JS; a 'use client' directive opens a hydration boundary.">{<RSCBoundary />}</SplitDemo>
      <SplitDemo title="SSG · ISR · SSR" color={NX} delay={0.05} description="When HTML is produced, how it's cached, and how fresh it stays.">{<StrategyCompare />}</SplitDemo>
      <SplitDemo title="Streaming & Suspense" color={NX} delay={0.1} description="Ship the shell instantly, stream slow content as it resolves.">{<StreamingSuspense />}</SplitDemo>

      <ModuleHead n="M3" title="Data Fetching" />
      <SplitDemo title="fetch() cache control" color={NX} description="force-cache stores results in the Data Cache; no-store always refetches.">{<FetchCache />}</SplitDemo>
      <SplitDemo title="Request memoization" color={NX} delay={0.05} description="Identical fetches in one render are automatically deduped.">{<RequestMemoization />}</SplitDemo>
      <SplitDemo title="Server Actions" color={NX} delay={0.1} description="Mutate on the server with no API route; optimistic UI for instant feedback.">{<ServerActions />}</SplitDemo>
      <SplitDemo title="Route Handlers" color={NX} delay={0.15} description="Export a function per HTTP verb in app/api/.../route.ts.">{<RouteHandlers />}</SplitDemo>

      <ModuleHead n="M4" title="Caching System" />
      <SplitDemo title="The 4 cache layers" color={NX} description="A request flows through four caches; a hit short-circuits the rest. View all to earn Cache Whisperer.">{<CacheLayers />}</SplitDemo>
      <SplitDemo title="Invalidation" color={NX} delay={0.05} description="See which layers each invalidation API clears.">{<CacheInvalidation />}</SplitDemo>

      <ModuleHead n="M5" title="Performance" />
      <SplitDemo title="next/image" color={NX} description="Automatic WebP/AVIF, lazy loading, blur placeholders.">{<ImageOptim />}</SplitDemo>
      <SplitDemo title="next/font — zero CLS" color={NX} delay={0.05} description="Self-hosted, preloaded fonts with matched fallback metrics.">{<FontCLS />}</SplitDemo>
      <SplitDemo title="next/script strategies" color={NX} delay={0.1} description="Control when third-party scripts load on the hydration timeline.">{<ScriptStrategies />}</SplitDemo>
      <SplitDemo title="Link prefetching" color={NX} delay={0.15} description="Routes prefetch on hover / viewport entry into the Router Cache.">{<Prefetch />}</SplitDemo>

      <ModuleHead n="M6" title="Deployment & Infrastructure" />
      <SplitDemo title="Build output" color={NX} description="next build reports how every route renders.">{<BuildOutput />}</SplitDemo>
      <SplitDemo title="Edge vs Node runtime" color={NX} delay={0.05} description="Toggle the runtime to compare cold start, reach & API access. (Earns Edge Native.)">{<EdgeRuntime />}</SplitDemo>
      <SplitDemo title="Middleware" color={NX} delay={0.1} description="Runs at the edge before the cache, only on matched routes.">{<Middleware />}</SplitDemo>
      <SplitDemo title="Environment variables" color={NX} delay={0.15} description="Only NEXT_PUBLIC_ vars reach the browser bundle.">{<EnvVars />}</SplitDemo>

      <ModuleHead n="M7" title="Authentication Patterns" />
      <SplitDemo title="Auth.js sign-in flow" color={NX} description="The OAuth dance, handled by Auth.js, ending in a session cookie.">{<AuthFlow />}</SplitDemo>
      <SplitDemo title="JWT vs Database sessions" color={NX} delay={0.05} description="Stateless scale vs instant revocation — pick per requirement.">{<SessionCompare />}</SplitDemo>

      <ModuleHead n="M8" title="Real Project Walkthroughs" />
      <SplitDemo title="Map features → strategies" color={NX} description="Step through three real apps and the strategy each feature uses.">{<ProjectWalkthrough />}</SplitDemo>

      <ModuleHead n="★" title="Rendering Challenge" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SCENARIOS.map((s, i) => <ChallengeCard key={s.id} s={s} i={i} />)}
      </div>
    </div>
  )
}
