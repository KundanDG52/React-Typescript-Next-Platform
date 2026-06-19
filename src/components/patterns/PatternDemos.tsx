import { useState, useRef, useContext, createContext, forwardRef, useImperativeHandle, Component, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Render Props: mouse tracker ─────────────────────────────────────────────
function MouseTracker({ render }: { render: (p: { x: number; y: number }) => ReactNode }) {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  return (
    <div onMouseMove={e => { const r = e.currentTarget.getBoundingClientRect(); setPos({ x: Math.round(e.clientX - r.left), y: Math.round(e.clientY - r.top) }) }}
      className="relative h-32 rounded-xl border border-react/20 bg-react/05 overflow-hidden cursor-crosshair">
      {render(pos)}
    </div>
  )
}
export function RenderPropsDemo() {
  return (
    <div className="flex flex-col gap-3">
      <MouseTracker render={({ x, y }) => (
        <>
          <div className="absolute text-xs font-mono text-react top-2 left-2">{`{ x: ${x}, y: ${y} }`}</div>
          <motion.div className="absolute w-4 h-4 rounded-full bg-react pointer-events-none" style={{ boxShadow: '0 0 12px #61dafb' }} animate={{ left: x - 8, top: y - 8 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
        </>
      )} />
      <p className="text-xs text-white/40">The <code className="text-react">MouseTracker</code> owns the position state and calls <code className="text-react">render(pos)</code> — the consumer decides how to display it. Move your mouse over the box.</p>
    </div>
  )
}

// ─── Compound Components: accordion via context ──────────────────────────────
const AccCtx = createContext<{ open: string | null; setOpen: (id: string | null) => void }>({ open: null, setOpen: () => {} })
function Accordion({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState<string | null>('a')
  return <AccCtx.Provider value={{ open, setOpen }}><div className="flex flex-col gap-1.5">{children}</div></AccCtx.Provider>
}
function AccItem({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  const { open, setOpen } = useContext(AccCtx)
  const isOpen = open === id
  return (
    <div className="rounded-lg border border-white/08 overflow-hidden">
      <button onClick={() => setOpen(isOpen ? null : id)} className="w-full px-3 py-2 flex items-center justify-between text-sm text-white/75 hover:bg-white/03">
        {title}<motion.span animate={{ rotate: isOpen ? 180 : 0 }} className="text-react text-xs">▾</motion.span>
      </button>
      <AnimatePresence>{isOpen && <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden"><div className="px-3 py-2 text-xs text-white/50 border-t border-white/06">{children}</div></motion.div>}</AnimatePresence>
    </div>
  )
}
export function CompoundDemo() {
  return (
    <div className="flex flex-col gap-3">
      <Accordion>
        <AccItem id="a" title="What are compound components?">Components that share implicit state through context — like &lt;select&gt; and &lt;option&gt;.</AccItem>
        <AccItem id="b" title="How is state shared?">A parent Provider holds state; children consume it via useContext. No props passed manually.</AccItem>
        <AccItem id="c" title="Why use them?">A clean, flexible API: &lt;Accordion&gt;&lt;AccItem/&gt;&lt;/Accordion&gt; with no prop drilling.</AccItem>
      </Accordion>
      <p className="text-xs text-white/40">Only one item opens at a time — the <code className="text-react">Accordion</code> shares <code>open</code> state with each <code className="text-react">AccItem</code> through context.</p>
    </div>
  )
}

// ─── Error Boundary ──────────────────────────────────────────────────────────
class ErrorBoundary extends Component<{ children: ReactNode; onReset: () => void }, { hasError: boolean }> {
  state = { hasError: false }
  static getDerivedStateFromError() { return { hasError: true } }
  reset = () => { this.setState({ hasError: false }); this.props.onReset() }
  render() {
    if (this.state.hasError) return (
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="rounded-xl p-4 border-2 border-red-500/50 bg-red-500/10 text-center">
        <div className="text-2xl mb-1">🧱</div>
        <div className="text-sm font-semibold text-red-400 mb-1">Error caught by boundary</div>
        <div className="text-xs text-white/40 mb-3">The fallback UI renders instead of a white screen.</div>
        <button onClick={this.reset} className="btn-ghost text-xs">Reset boundary</button>
      </motion.div>
    )
    return this.props.children
  }
}
function Bomb({ explode }: { explode: boolean }) { if (explode) throw new Error('💥 boom'); return <div className="rounded-xl p-4 border border-green/30 bg-green/05 text-center text-sm text-green">✓ Component rendering fine</div> }
export function ErrorBoundaryDemo() {
  const [explode, setExplode] = useState(false)
  const [key, setKey] = useState(0)
  return (
    <div className="flex flex-col gap-3">
      <ErrorBoundary key={key} onReset={() => { setExplode(false); setKey(k => k + 1) }}><Bomb explode={explode} /></ErrorBoundary>
      <button onClick={() => setExplode(true)} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500/20 border border-red-500/40 text-red-400 self-start">Trigger error</button>
      <p className="text-xs text-white/40">An <code className="text-react">ErrorBoundary</code> class catches render errors in its subtree via <code>getDerivedStateFromError</code> and shows fallback UI instead of crashing the whole app.</p>
    </div>
  )
}

// ─── Portals ─────────────────────────────────────────────────────────────────
export function PortalDemo() {
  const [show, setShow] = useState(false)
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-xl p-3 border border-white/08 bg-white/02 text-xs font-mono text-white/50">
        &lt;div className="parent" style="overflow:hidden"&gt;
        <div className="ml-3 my-1 text-react">{show ? '→ modal renders at document.body, not here' : '<button>Open modal</button>'}</div>
        &lt;/div&gt;
      </div>
      <button onClick={() => setShow(true)} className="btn-primary text-xs self-start">Open portal modal</button>
      {show && createPortal(
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShow(false)}>
          <motion.div initial={{ scale: 0.9, y: 10 }} animate={{ scale: 1, y: 0 }} onClick={e => e.stopPropagation()} className="card rounded-2xl p-6 max-w-sm mx-4 text-center glow-react">
            <div className="text-3xl mb-2">🚪</div>
            <h3 className="font-bold mb-1">Rendered via Portal</h3>
            <p className="text-sm text-white/50 mb-4">This modal is a child of <code className="text-react">document.body</code>, escaping the parent's <code>overflow:hidden</code> & z-index.</p>
            <button onClick={() => setShow(false)} className="btn-ghost text-xs">Close</button>
          </motion.div>
        </motion.div>, document.body
      )}
      <p className="text-xs text-white/40"><code className="text-react">createPortal(child, document.body)</code> renders outside the parent DOM hierarchy — essential for modals, tooltips & dropdowns.</p>
    </div>
  )
}

// ─── forwardRef + useImperativeHandle ────────────────────────────────────────
interface FancyHandle { shake: () => void; clear: () => void }
const FancyInput = forwardRef<FancyHandle, {}>(function FancyInput(_, ref) {
  const [val, setVal] = useState('')
  const [shake, setShake] = useState(false)
  useImperativeHandle(ref, () => ({ shake: () => { setShake(true); setTimeout(() => setShake(false), 500) }, clear: () => setVal('') }))
  return <motion.input animate={shake ? { x: [-6, 6, -6, 6, 0] } : {}} transition={{ duration: 0.4 }} value={val} onChange={e => setVal(e.target.value)} placeholder="child input" className="w-full bg-bg/60 border border-border rounded-lg px-3 py-1.5 text-sm outline-none focus:border-react/50" />
})
export function ForwardRefDemo() {
  const ref = useRef<FancyHandle>(null)
  return (
    <div className="flex flex-col gap-3">
      <FancyInput ref={ref} />
      <div className="flex gap-2">
        <button onClick={() => ref.current?.shake()} className="btn-ghost text-xs">parent → child.shake()</button>
        <button onClick={() => ref.current?.clear()} className="btn-ghost text-xs">child.clear()</button>
      </div>
      <p className="text-xs text-white/40"><code className="text-react">forwardRef</code> + <code className="text-react">useImperativeHandle</code> let a parent call methods on a child through a ref — imperative escape hatch for focus, animations, etc.</p>
    </div>
  )
}
