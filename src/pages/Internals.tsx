import { useEffect } from 'react'
import { SplitDemo, TrackHeader } from '../components/shared/Demo'
import { FiberTree, ReconciliationDemo } from '../components/internals/InternalsDemos'
import { GlassCard } from '../components/shared/GlassCard'
import { useStore } from '../store'

export function Internals() {
  const { completeTrack, addXP } = useStore()
  useEffect(() => { addXP(10); completeTrack('internals') }, [])

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col gap-6">
      <TrackHeader icon="🔬" name="React Internals" sub="Fiber architecture • work loop • priority lanes • reconciliation" color="#ec4899" />

      <SplitDemo title="Fiber Architecture & Work Loop" color="#61dafb" delay={0.05}
        description="Each element gets a fiber node. React builds a work-in-progress tree during a pausable render phase, then commits synchronously."
        code={`// simplified work loop
while (nextUnitOfWork && !shouldYield()) {
  nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
}`}>
        <FiberTree />
      </SplitDemo>

      <SplitDemo title="Reconciliation & Keys" color="#22c55e" delay={0.1}
        description="Keys give list items a stable identity across renders so React can move nodes instead of rebuilding them."
        code={`{items.map(item =>
  <Row key={item.id} {...item} /> // ✅ stable
)}`}>
        <ReconciliationDemo />
      </SplitDemo>

      <GlassCard delay={0.15} className="p-6">
        <h2 className="text-base font-bold mb-4">Priority Lanes</h2>
        <p className="text-sm text-white/50 mb-4">React 18 assigns updates to <b className="text-react">lanes</b> — a bitmask of priorities. Higher-priority work can interrupt lower-priority work.</p>
        <div className="flex flex-col gap-2">
          {[
            { lane: 'SyncLane', use: 'Discrete events: click, input, keydown', color: '#ef4444', w: '100%' },
            { lane: 'InputContinuousLane', use: 'Continuous: scroll, drag, hover', color: '#f59e0b', w: '78%' },
            { lane: 'DefaultLane', use: 'Normal updates, network responses', color: '#61dafb', w: '55%' },
            { lane: 'TransitionLane', use: 'startTransition — non-urgent', color: '#a855f7', w: '32%' },
            { lane: 'IdleLane', use: 'Offscreen / lowest priority', color: '#64748b', w: '15%' },
          ].map(l => (
            <div key={l.lane} className="flex items-center gap-3">
              <div className="w-44 shrink-0">
                <div className="text-xs font-mono font-semibold" style={{ color: l.color }}>{l.lane}</div>
                <div className="text-[10px] text-white/35">{l.use}</div>
              </div>
              <div className="flex-1 h-2 rounded-full bg-white/06 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: l.w, background: l.color }} />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
