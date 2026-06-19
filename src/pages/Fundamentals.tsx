import { useEffect } from 'react'
import { SplitDemo, TrackHeader } from '../components/shared/Demo'
import { JSXExplorer } from '../components/fundamentals/JSXExplorer'
import { LifecycleTimeline } from '../components/fundamentals/LifecycleTimeline'
import { VirtualDOM } from '../components/fundamentals/VirtualDOM'
import { PropsState } from '../components/fundamentals/PropsState'
import { useStore } from '../store'

export function Fundamentals() {
  const { completeTrack, addXP } = useStore()
  useEffect(() => { addXP(10); completeTrack('fundamentals') }, [])

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col gap-6">
      <TrackHeader icon="⚛️" name="React Fundamentals" sub="JSX • Lifecycle • Props & State • Virtual DOM" color="#61dafb" />

      <SplitDemo title="JSX Explorer" color="#61dafb" delay={0.05}
        description="Toggle between examples to see how JSX compiles to React.createElement calls.">
        <JSXExplorer />
      </SplitDemo>

      <SplitDemo title="Component Lifecycle" color="#22c55e" delay={0.1}
        description="Every component moves through three phases. Click a phase to expand its steps and the hook that replaces the old class lifecycle method."
        code={`function Comp() {
  useEffect(() => {
    // mount
    return () => {/* unmount cleanup */}
  }, [])
}`}>
        <LifecycleTimeline />
      </SplitDemo>

      <SplitDemo title="Virtual DOM & Reconciliation" color="#818cf8" delay={0.15}
        description="React keeps a lightweight copy of the DOM in memory. On re-render it diffs the new tree against the old and patches only what changed.">
        <VirtualDOM />
      </SplitDemo>

      <SplitDemo title="Props & State" color="#a855f7" delay={0.2}
        description="Props flow one way (parent → child). State must be updated immutably so React's reference comparison detects the change.">
        <PropsState />
      </SplitDemo>
    </div>
  )
}
