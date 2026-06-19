import { useEffect } from 'react'
import { SplitDemo, TrackHeader } from '../components/shared/Demo'
import { UseStateDemo, UseEffectDemo, UseRefDemo, UseMemoDemo } from '../components/hooks/CoreHooks'
import { UseContextDemo, UseReducerDemo, CustomHooksDemo } from '../components/hooks/MoreHooks'
import { useStore } from '../store'

export function Hooks() {
  const { completeTrack, addXP } = useStore()
  useEffect(() => { addXP(10); completeTrack('hooks') }, [])

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col gap-6">
      <TrackHeader icon="🪝" name="Hooks Deep Dive" sub="State, effects, refs, memoization, context & reducers" color="#818cf8" />

      <SplitDemo title="useState — batching & functional updates" color="#61dafb" delay={0.05}
        description="React batches multiple setState calls into a single render. Functional updaters read the freshest value."
        code={`setCount(c => c + 1) // ✅ latest
setCount(count + 1)  // ❌ stale closure`}>
        <UseStateDemo />
      </SplitDemo>

      <SplitDemo title="useEffect — dependency array" color="#22c55e" delay={0.1}
        description="The effect re-runs only when a value in its dependency array changes. Toggle deps and watch the fire count."
        code={`useEffect(() => {
  // runs when a or b changes
}, [a, b])`}>
        <UseEffectDemo />
      </SplitDemo>

      <SplitDemo title="useRef — mutable, no re-render" color="#a855f7" delay={0.15}
        description="Refs persist across renders without causing them, and can hold DOM nodes."
        code={`const ref = useRef(0)
ref.current++       // no render
inputRef.current.focus()`}>
        <UseRefDemo />
      </SplitDemo>

      <SplitDemo title="useMemo — cache expensive work" color="#f59e0b" delay={0.2}
        description="Memoize a costly computation so it only re-runs when its dependencies change."
        code={`const result = useMemo(
  () => slowSquare(num),
  [num] // recompute only on num change
)`}>
        <UseMemoDemo />
      </SplitDemo>

      <SplitDemo title="useContext — skip prop drilling" color="#ec4899" delay={0.25}
        description="Consume shared state anywhere in the subtree without threading props through every level."
        code={`const { theme } = useContext(ThemeCtx)`}>
        <UseContextDemo />
      </SplitDemo>

      <SplitDemo title="useReducer — predictable transitions" color="#6366f1" delay={0.3}
        description="A reducer centralizes state logic. Every update is an explicit dispatched action."
        code={`const [state, dispatch] = useReducer(reducer, init)
dispatch({ type: 'add', text })`}>
        <UseReducerDemo />
      </SplitDemo>

      <SplitDemo title="Custom Hooks — useDebounce + useFetch" color="#61dafb" delay={0.35}
        description="Extract reusable logic into your own hooks. Here, debounced input drives a simulated fetch."
        code={`function useDebounce(value, delay) {
  const [v, setV] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setV(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return v
}`}>
        <CustomHooksDemo />
      </SplitDemo>
    </div>
  )
}
