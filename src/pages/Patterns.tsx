import { useEffect } from 'react'
import { SplitDemo, TrackHeader } from '../components/shared/Demo'
import { RenderPropsDemo, CompoundDemo, ErrorBoundaryDemo, PortalDemo, ForwardRefDemo } from '../components/patterns/PatternDemos'
import { useStore } from '../store'

export function Patterns() {
  const { completeTrack, addXP } = useStore()
  useEffect(() => { addXP(10); completeTrack('patterns') }, [])

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col gap-6">
      <TrackHeader icon="🧩" name="Advanced Patterns" sub="Render props • compound • error boundaries • portals • forwardRef" color="#a855f7" />

      <SplitDemo title="Render Props" color="#61dafb" delay={0.05}
        description="A component takes a function as a prop and calls it with internal state — sharing behavior, not markup."
        code={`<MouseTracker render={({x, y}) => (
  <Cursor x={x} y={y} />
)} />`}>
        <RenderPropsDemo />
      </SplitDemo>

      <SplitDemo title="Compound Components" color="#22c55e" delay={0.1}
        description="Related components share implicit state via context, giving a clean declarative API."
        code={`<Accordion>
  <AccItem id="a">…</AccItem>
  <AccItem id="b">…</AccItem>
</Accordion>`}>
        <CompoundDemo />
      </SplitDemo>

      <SplitDemo title="Error Boundaries" color="#ef4444" delay={0.15}
        description="A class component with getDerivedStateFromError catches render errors and shows fallback UI."
        code={`class ErrorBoundary extends Component {
  static getDerivedStateFromError() {
    return { hasError: true }
  }
}`}>
        <ErrorBoundaryDemo />
      </SplitDemo>

      <SplitDemo title="Portals" color="#a855f7" delay={0.2}
        description="Render children into a DOM node outside the parent hierarchy — modals, tooltips, dropdowns."
        code={`createPortal(<Modal/>, document.body)`}>
        <PortalDemo />
      </SplitDemo>

      <SplitDemo title="forwardRef + useImperativeHandle" color="#ec4899" delay={0.25}
        description="Expose imperative methods from a child to a parent through a ref."
        code={`const Input = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({ shake, clear }))
})`}>
        <ForwardRefDemo />
      </SplitDemo>
    </div>
  )
}
