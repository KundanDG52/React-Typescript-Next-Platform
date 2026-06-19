import { useEffect } from 'react'
import { SplitDemo, TrackHeader } from '../components/shared/Demo'
import { MemoDemo, ConcurrentDemo, LazyDemo } from '../components/performance/PerfDemos'
import { GlassCard } from '../components/shared/GlassCard'
import { useStore } from '../store'

export function Performance() {
  const { completeTrack, addXP } = useStore()
  useEffect(() => { addXP(10); completeTrack('performance') }, [])

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col gap-6">
      <TrackHeader icon="⚡" name="Performance & Optimization" sub="memo • code splitting • concurrent React 18 • profiling" color="#22c55e" />

      <SplitDemo title="React.memo — skip needless renders" color="#22c55e" delay={0.05}
        description="Wrap a component in memo() to bail out of re-rendering when its props haven't changed by reference."
        code={`const Child = React.memo(function Child({ label }) {
  return <div>{label}</div>
})`}>
        <MemoDemo />
      </SplitDemo>

      <SplitDemo title="Concurrent — useTransition & useDeferredValue" color="#61dafb" delay={0.1}
        description="React 18 lets you mark updates as non-urgent so high-priority work (typing) stays responsive."
        code={`const [isPending, startTransition] = useTransition()
startTransition(() => setFilter(value))
const deferred = useDeferredValue(filter)`}>
        <ConcurrentDemo />
      </SplitDemo>

      <SplitDemo title="Code Splitting — React.lazy + Suspense" color="#a855f7" delay={0.15}
        description="Split heavy components into separate chunks loaded on demand, shrinking the initial bundle."
        code={`const Chart = React.lazy(() => import('./Chart'))
<Suspense fallback={<Spinner/>}>
  <Chart />
</Suspense>`}>
        <LazyDemo />
      </SplitDemo>

      <GlassCard delay={0.2} className="p-6">
        <h2 className="text-base font-bold mb-4">Optimization Checklist</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { t: 'React.memo', d: 'Memoize components with stable props', c: '#22c55e' },
            { t: 'useMemo / useCallback', d: 'Cache values & function identities', c: '#61dafb' },
            { t: 'Code splitting', d: 'Lazy-load routes & heavy deps', c: '#a855f7' },
            { t: 'Virtualization', d: 'Render only visible list items', c: '#f59e0b' },
            { t: 'Transitions', d: 'Deprioritize non-urgent updates', c: '#ec4899' },
            { t: 'Key stability', d: 'Stable keys to avoid remounts', c: '#6366f1' },
          ].map(x => (
            <div key={x.t} className="rounded-xl p-3 border" style={{ background: `${x.c}08`, borderColor: `${x.c}25` }}>
              <h3 className="font-semibold text-sm mb-0.5" style={{ color: x.c }}>{x.t}</h3>
              <p className="text-xs text-white/45">{x.d}</p>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
