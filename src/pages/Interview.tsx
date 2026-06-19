import { useState, type FC } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Check } from 'lucide-react'
import { TrackHeader } from '../components/shared/Demo'
import { CodeBlock } from '../components/shared/CodeBlock'

const REACT = '#61dafb'
const TS    = '#3178c6'
const NX    = '#e5e5e5'
const GREEN = '#22c55e'
const AMBER = '#f59e0b'
const PURPLE = '#a855f7'

// ─── tiny shared pieces ───────────────────────────────────────────────────────
function Box({ label, color = REACT, dim }: { label: string; color?: string; dim?: boolean }) {
  return (
    <div className="px-2.5 py-1 rounded-lg font-mono text-xs font-semibold whitespace-nowrap"
      style={{ background: dim ? 'rgba(255,255,255,0.03)' : `${color}16`,
               border: `1px solid ${dim ? 'rgba(255,255,255,0.1)' : color + '40'}`,
               color: dim ? 'rgba(255,255,255,0.3)' : color }}>
      {label}
    </div>
  )
}
function Row({ label, color = 'rgba(255,255,255,0.45)' }: { label: string; color?: string }) {
  return <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color }} /><span className="text-[11px]" style={{ color }}>{label}</span></div>
}

// ─── DIAGRAMS ─────────────────────────────────────────────────────────────────

function VirtualDOMDiagram() {
  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-[1fr_40px_1fr] gap-2 items-start">
        <div className="rounded-xl p-3 border border-white/8 bg-white/[0.02]">
          <p className="text-[9px] text-white/35 font-semibold uppercase mb-2">Old VDOM</p>
          <div className="flex flex-col items-center gap-1"><Box label="div" /><div className="w-px h-2 bg-white/15"/><div className="flex gap-2"><div className="flex flex-col items-center gap-0.5"><Box label="h1" dim/><p className="text-[9px] text-white/25 font-mono">"Hello"</p></div><div className="flex flex-col items-center gap-0.5"><Box label="p" dim/><p className="text-[9px] text-white/25 font-mono">"world"</p></div></div></div>
        </div>
        <div className="self-center text-center text-white/30 text-xs pt-6">→<br/>diff</div>
        <div className="rounded-xl p-3 border border-amber/25 bg-amber/[0.04]">
          <p className="text-[9px] text-amber/60 font-semibold uppercase mb-2">New VDOM</p>
          <div className="flex flex-col items-center gap-1"><Box label="div" /><div className="w-px h-2 bg-white/15"/><div className="flex gap-2"><div className="flex flex-col items-center gap-0.5"><Box label="h1" dim/><p className="text-[9px] text-white/25 font-mono">"Hello"</p></div><div className="flex flex-col items-center gap-0.5"><Box label="p ✱" color={AMBER}/><p className="text-[9px] text-amber font-mono">"React!" ←</p></div></div></div>
        </div>
      </div>
      <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs border border-green/20 bg-green/[0.05]">
        <span className="text-green font-bold">Patch:</span>
        <code className="font-mono text-white/55">p.textContent = "React!"</code>
        <span className="ml-auto text-white/30">1 real DOM op</span>
      </div>
    </div>
  )
}

function FiberDiagram() {
  return (
    <div className="flex flex-col gap-2">
      <div className="relative rounded-xl border border-white/8 bg-bg/40" style={{ height: 220 }}>
        <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
          {[[[155,36],[155,66]],[[155,88],[70,118]],[[155,88],[240,118]],[[240,140],[240,170]]].map(([a,b],i)=>(
            <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="rgba(97,218,251,0.22)" strokeWidth="1.5" strokeDasharray="4,3"/>
          ))}
        </svg>
        {[{l:'HostRoot',x:155,y:16},{l:'App',x:155,y:66},{l:'Header',x:70,y:118},{l:'Main',x:240,y:118},{l:'List',x:240,y:168}].map(n=>(
          <div key={n.l} className="absolute -translate-x-1/2 px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold"
            style={{ left:n.x, top:n.y, background:`${REACT}18`, border:`1px solid ${REACT}40`, color:REACT }}>
            {n.l}
          </div>
        ))}
        <div className="absolute bottom-2 right-3 text-[9px] text-white/25 flex items-center gap-1">
          <span className="border-t border-dashed border-white/25 w-5 inline-block"/>child / sibling / return pointers
        </div>
      </div>
      <div className="grid grid-cols-3 gap-1.5 text-[11px]">
        {[['.child','first child',REACT],['.sibling','next sibling',PURPLE],['.return','parent node',AMBER]].map(([k,v,c])=>(
          <div key={k} className="rounded-lg p-2 border border-white/8 bg-white/[0.02]">
            <div className="font-mono font-bold" style={{color:c as string}}>{k}</div>
            <div className="text-white/40">{v}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function HooksRulesDiagram() {
  return (
    <div className="grid grid-cols-2 gap-2 text-[11px]">
      <div className="rounded-xl p-3 border border-green/25 bg-green/[0.04]">
        <p className="text-green font-bold mb-2">✅ Correct</p>
        <pre className="font-mono text-white/55 leading-loose text-[10px]">{`function App() {
  const [x] = useState(0) // ✓
  useEffect(() => {}, []) // ✓
  if (cond) { /* no hooks */ }
  return <div/>
}`}</pre>
      </div>
      <div className="rounded-xl p-3 border border-red-500/25 bg-red-500/[0.04]">
        <p className="text-red-400 font-bold mb-2">❌ Broken</p>
        <pre className="font-mono text-white/55 leading-loose text-[10px]">{`function App() {
  if (cond) {
    useState(0) // ✗ conditional
  }
  for (…) {
    useEffect(…) // ✗ in loop
  }
}`}</pre>
      </div>
    </div>
  )
}

function EffectTimelineDiagram() {
  return (
    <div className="flex flex-col gap-2">
      <div className="rounded-xl p-3 border border-white/8 bg-bg/40">
        <p className="text-[9px] text-white/35 font-semibold uppercase mb-2.5">Execution order (left = first)</p>
        <div className="flex gap-0.5 items-end">
          {[['Render',REACT,22],['DOM write',PURPLE,18],['useLayoutEffect',AMBER,20],['🖥 Paint','#475569',14],['useEffect',GREEN,20]].map(([l,c,h])=>(
            <div key={l as string} className="flex flex-col items-center gap-1.5 flex-1">
              <div className="w-full rounded-md" style={{ height: h as number, background:`${c as string}28`, border:`1px solid ${c as string}50` }}/>
              <span className="text-[8px] text-center leading-tight" style={{ color:c as string }}>{l as string}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-[11px]">
        <div className="rounded-lg p-2.5 border border-amber/25 bg-amber/[0.05]">
          <p className="font-bold text-amber mb-1">useLayoutEffect</p>
          <p className="text-white/45 leading-relaxed">Fires before paint. Use when you must read/write the DOM before the user sees it — e.g. measuring an element to position a tooltip.</p>
        </div>
        <div className="rounded-lg p-2.5 border border-green/25 bg-green/[0.05]">
          <p className="font-bold text-green mb-1">useEffect</p>
          <p className="text-white/45 leading-relaxed">Fires after paint. Use for data fetching, subscriptions, analytics — anything that doesn't block the visible frame.</p>
        </div>
      </div>
    </div>
  )
}

function ControlledDiagram() {
  return (
    <div className="grid grid-cols-2 gap-2 text-[10px]">
      {[{title:'Controlled',color:REACT,steps:['User types','onChange fires','setState(value)','Re-render','value prop = state ✓']},{title:'Uncontrolled',color:PURPLE,steps:['User types','DOM owns value','(no re-render)','ref.current.value','read on demand']}].map(({title,color,steps})=>(
        <div key={title} className="rounded-xl p-3 border border-white/8 bg-white/[0.02]">
          <p className="font-bold mb-2" style={{color}}>{title}</p>
          {steps.map((s,i)=>(
            <div key={i} className="flex items-start gap-1.5 mb-1">
              <div className="mt-1 w-1 h-1 rounded-full shrink-0" style={{background:color}}/>
              <span className="text-white/55">{s}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

function ContextDiagram() {
  return (
    <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
      <div className="rounded-xl p-3 border border-red-500/20 bg-red-500/[0.03]">
        <p className="font-bold text-red-400 mb-2 not-italic">❌ Prop Drilling</p>
        {['App (theme)','  Layout (theme →)','    Sidebar (theme →)','      Button ← needs it'].map((l,i)=><div key={i} className="text-white/50">{l}</div>)}
        <p className="text-white/25 mt-2 not-italic">3 components just passing props</p>
      </div>
      <div className="rounded-xl p-3 border border-green/20 bg-green/[0.03]">
        <p className="font-bold text-green mb-2 not-italic">✅ Context</p>
        {['<Provider value={theme}>','  Layout','    Sidebar','      useContext() ✓'].map((l,i)=><div key={i} className="text-white/50">{l}</div>)}
        <p className="text-white/25 mt-2 not-italic">Consumer reads directly</p>
      </div>
    </div>
  )
}

function BatchingDiagram() {
  return (
    <div className="flex flex-col gap-2 text-[11px]">
      {[{label:'React 17 — async context (no batching)',color:'#ef4444',note:'2 separate renders',code:`setTimeout(() => {
  setA(1)  // render 1
  setB(2)  // render 2  ← two renders!
}, 0)`},{label:'React 18 — automatic batching everywhere',color:GREEN,note:'1 combined render',code:`setTimeout(() => {
  setA(1)  // queued
  setB(2)  // queued → ONE render ✓
}, 0)`}].map(({label,color,note,code})=>(
      <div key={label} className="rounded-xl overflow-hidden border" style={{borderColor:color+'30'}}>
        <div className="px-3 py-1.5 text-[10px] font-semibold" style={{background:color+'14',color}}>{label}</div>
        <pre className="font-mono text-white/55 px-3 py-2 leading-relaxed text-[10px]">{code}</pre>
        <div className="px-3 py-1 text-[10px] border-t border-white/5" style={{color}}>{note}</div>
      </div>
    ))}
    </div>
  )
}

function TypeVsInterfaceDiagram() {
  return (
    <div className="grid grid-cols-2 gap-2 text-[11px]">
      {[{title:'interface',color:TS,pts:['✅ Declaration merging','✅ extends / implements','✅ Object shapes','❌ Cannot express unions','❌ No computed types']},{title:'type',color:PURPLE,pts:['✅ Union  A | B','✅ Intersection  A & B','✅ Mapped / conditional','✅ Tuple  [A, B]','❌ No declaration merging']}].map(({title,color,pts})=>(
      <div key={title} className="rounded-xl p-3 border border-white/8 bg-white/[0.02]">
        <p className="font-mono font-bold mb-2" style={{color}}>{title} {'{}'}</p>
        {pts.map((p,i)=><p key={i} className="text-white/55 mb-0.5">{p}</p>)}
      </div>
      ))}
    </div>
  )
}

function UnknownVsAnyDiagram() {
  return (
    <div className="grid grid-cols-2 gap-2 text-[10px]">
      {[{title:'any — no type safety',color:'#ef4444',code:`const x: any = api()
x.foo()        // TS: ✅
x.bar.baz()    // TS: ✅
// Runtime: 💥`},{title:'unknown — safe',color:GREEN,code:`const x: unknown = api()
x.foo()        // TS: ❌
if (typeof x === 'string') {
  x.toUpperCase() // TS: ✅
}`}].map(({title,color,code})=>(
      <div key={title} className="rounded-xl overflow-hidden border" style={{borderColor:color+'30'}}>
        <div className="px-2.5 py-1 text-[9px] font-semibold" style={{background:color+'12',color}}>{title}</div>
        <pre className="font-mono text-white/55 px-2.5 py-2 leading-relaxed">{code}</pre>
      </div>
    ))}
    </div>
  )
}

function NarrowingDiagram() {
  const rows = [
    {guard:'typeof x === "string"',result:'string',color:REACT},
    {guard:'x instanceof Date',result:'Date',color:PURPLE},
    {guard:'"id" in x',result:'{ id: ... }',color:AMBER},
    {guard:'x.kind === "circle"',result:'Circle',color:GREEN},
    {guard:'isUser(x)  ← predicate',result:'User',color:TS},
  ]
  return (
    <div className="flex flex-col gap-1.5">
      <div className="rounded-lg px-3 py-2 text-center font-mono text-xs border border-white/15 bg-white/[0.03] text-white/55">value: unknown | union type</div>
      {rows.map(({guard,result,color})=>(
        <div key={guard} className="flex items-center gap-2">
          <div className="flex-1 rounded-lg px-2.5 py-1.5 font-mono text-[10px] border border-white/8 text-white/50 bg-white/[0.02]">if ({guard})</div>
          <span className="text-white/25 text-xs">→</span>
          <div className="w-24 text-center rounded-lg px-2 py-1 font-mono text-[10px] font-bold" style={{background:color+'1e',color}}>{result}</div>
        </div>
      ))}
    </div>
  )
}

function RenderingDiagram() {
  return (
    <div className="flex flex-col gap-2">
      {[{name:'SSG',color:GREEN,steps:['🔨 Build','HTML cached','CDN serves','⚡ Instant']},{name:'ISR',color:AMBER,steps:['🔨 Build','Serve cache','⏱ TTL expires','🔄 Re-gen bg']},{name:'SSR',color:REACT,steps:['Request','⚙️ Server runs','HTML sent','💧 Hydrate']}].map(({name,color,steps})=>(
        <div key={name} className="flex items-center gap-2">
          <div className="w-9 shrink-0 rounded-lg px-1 py-2 text-center font-mono font-bold text-xs" style={{background:color+'18',border:`1px solid ${color}35`,color}}>{name}</div>
          <div className="flex-1 flex items-center gap-0.5">
            {steps.map((s,i)=>(
              <div key={i} className="flex items-center gap-0.5 flex-1">
                <div className="flex-1 rounded px-1.5 py-1.5 text-[9px] text-center border border-white/8" style={{background:color+'0b',color:'rgba(255,255,255,0.5)'}}>{s}</div>
                {i<steps.length-1&&<span className="text-white/20 text-[9px] shrink-0">›</span>}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function RSCDiagram() {
  return (
    <div className="rounded-xl overflow-hidden border border-white/10">
      <div className="grid grid-cols-2 divide-x divide-white/10">
        <div className="p-3 bg-blue-950/30">
          <p className="text-[9px] font-bold text-blue-400 mb-2">🖥 SERVER (Node.js)</p>
          {['page.tsx (RSC)','layout.tsx (RSC)','DB / fetch / secrets','No "use client" needed'].map((l,i)=><Row key={i} label={l} color="#60a5fa"/>)}
          <p className="text-[9px] text-blue-400/45 mt-1.5">Zero JS shipped to browser</p>
        </div>
        <div className="p-3 bg-purple-950/30">
          <p className="text-[9px] font-bold text-purple-400 mb-2">🌐 CLIENT (Browser)</p>
          {'use client' && <>
          {['"use client" directive','useState / useEffect','onClick, onChange','window / localStorage'].map((l,i)=><Row key={i} label={l} color="#c084fc"/>)}
          <p className="text-[9px] text-purple-400/45 mt-1.5">Hydrates & runs in browser</p>
          </>}
        </div>
      </div>
      <div className="px-3 py-2 border-t border-white/8 text-[9px] text-white/30 text-center">RSC serialises UI → streams to client → merges with client tree</div>
    </div>
  )
}

function AppRouterDiagram() {
  return (
    <div className="grid grid-cols-2 gap-2 font-mono text-[10px]">
      {[{title:'Pages Router',color:'#64748b',files:['pages/','  index.tsx','  blog/[slug].tsx','  _app.tsx  ← layout','  api/hello.ts'],note:'getStaticProps / getServerSideProps'},{title:'App Router ✓',color:NX,files:['app/','  page.tsx','  blog/[slug]/page.tsx','  layout.tsx  ← nested','  api/route.ts'],note:'async Server Components directly'}].map(({title,color,files,note})=>(
        <div key={title} className="rounded-xl p-3 border border-white/8 bg-white/[0.02]">
          <p className="font-bold mb-2 not-italic" style={{color}}>{title}</p>
          {files.map((f,i)=><div key={i} className="text-white/50">{f}</div>)}
          <p className="text-white/28 mt-2 text-[9px] not-italic">{note}</p>
        </div>
      ))}
    </div>
  )
}

function ServerActionDiagram() {
  const steps = [
    {side:'Client',label:'User submits <form action={savePost}>',color:PURPLE},
    {side:'Network',label:'Encrypted POST to /action endpoint',color:'#64748b'},
    {side:'Server',label:'"use server" fn runs → DB write',color:REACT},
    {side:'Server',label:'revalidatePath("/posts") called',color:REACT},
    {side:'Client',label:'UI re-fetches & updates automatically',color:PURPLE},
  ]
  return (
    <div className="flex flex-col gap-1.5">
      {steps.map((s,i)=>(
        <div key={i} className="flex items-center gap-2">
          <div className="w-14 shrink-0 text-[9px] font-bold text-center py-1 rounded" style={{background:s.color+'18',color:s.color}}>{s.side}</div>
          <div className="flex-1 rounded-lg px-2.5 py-1.5 text-[10px] border border-white/8 text-white/55 bg-white/[0.02]">{s.label}</div>
        </div>
      ))}
    </div>
  )
}

// ─── DATA ─────────────────────────────────────────────────────────────────────

interface QA {
  id: string; q: string; summary: string; detail: string
  tag: string; code?: string; Diagram?: FC
}
interface CodeQA {
  id: string; title: string; tag: string; code: string
  question: string; answer: string; explanation: string
}

const THEORY: QA[] = [
  {
    id:'t1', tag:'React',
    q:'What is the Virtual DOM and how does React use it?',
    summary:'An in-memory copy of the real DOM that React diffs to compute the minimal set of actual DOM updates.',
    detail:`The Virtual DOM (VDOM) is a plain JavaScript object tree that mirrors the real DOM structure. Every time state or props change React calls the render function and produces a brand-new VDOM tree — a cheap operation since there is no browser layout or paint involved.

React then runs a diffing algorithm (the reconciler) that compares the new tree against the previous one. It identifies exactly which nodes changed, were added, or were removed. Only those differences are applied to the real DOM in a single batch — avoiding expensive full re-paints.

The key insight: creating JS objects is orders of magnitude faster than touching the browser DOM. By keeping work in memory and pushing only the minimum patch to the DOM, React makes frequent UI updates feel instant.`,
    code:`// 1. JSX compiles to React.createElement calls (VDOM nodes)
const el = <p className="greeting">Hello</p>
// → { type: 'p', props: { className: 'greeting', children: 'Hello' } }

// 2. State change → new VDOM tree
setName('React')
// new: { type: 'p', props: { children: 'React' } }

// 3. Diff finds ONE change → one real DOM update
// document.querySelector('p').textContent = 'React'`,
    Diagram: VirtualDOMDiagram,
  },
  {
    id:'t2', tag:'React',
    q:'What is React Fiber and why was it introduced?',
    summary:'The internal reconciler rewrite (React 16+) that represents component work as a linked list of "fiber" nodes, enabling interruptible, prioritised rendering.',
    detail:`Before Fiber, React's reconciler (codename "Stack") was a recursive, synchronous process. Once React started diffing a tree it had to finish — it could not pause. This caused "jank" on large trees because the main thread was blocked, making animations and user input feel unresponsive.

Fiber rewrites every component as a fiber node: a plain JS object with pointers — child (first child), sibling (next peer), and return (parent). Instead of a call stack, React maintains this linked list and can walk it one node at a time. Between nodes it can yield control back to the browser.

This enables: time-slicing (split work across frames), priority lanes (urgent updates like typing skip ahead of low-priority renders), and Suspense (pause a subtree while data loads). It is the foundation of all concurrent features in React 18.`,
    code:`// Each fiber node holds:
{
  type:       'div',          // component / element type
  stateNode:  domNode,        // real DOM node (after commit)
  child:      fiberNode,      // first child
  sibling:    fiberNode,      // next sibling
  return:     fiberNode,      // parent
  pendingProps: {},
  memoizedState: hookList,    // linked list of hook state
  lanes:      SomeLaneBitmap, // scheduling priority
}`,
    Diagram: FiberDiagram,
  },
  {
    id:'t3', tag:'React',
    q:'What are the Rules of Hooks and why do they exist?',
    summary:'Hooks must be called unconditionally at the top level of a function component — never inside conditions, loops, or nested functions.',
    detail:`React stores hook state in a linked list attached to the fiber node. On every render React walks that list in order: first call gets slot 0, second gets slot 1, and so on. The order must be identical every render.

If a hook is called conditionally, its slot shifts — React reads the wrong state for every subsequent hook in that component. This produces silent data corruption or cryptic errors that are extremely hard to debug.

The second rule — hooks only from React functions — exists because React needs to find the currently-rendering component to attach the state to. Calling hooks from plain JS functions breaks that lookup.

The eslint-plugin-react-hooks package enforces both rules statically at lint time.`,
    code:`// ✅ Correct: always the same number of hooks, same order
function Profile({ userId }) {
  const [data, setData] = useState(null)           // slot 0
  const [loading, setLoading] = useState(true)     // slot 1
  useEffect(() => { fetchUser(userId).then(setData) }, [userId])
  return loading ? <Spinner /> : <User data={data} />
}

// ❌ Broken: useState only called when userId exists
function Profile({ userId }) {
  if (userId) {
    const [data, setData] = useState(null)  // skipped sometimes!
  }
  // slot order corrupted on every conditional render
}`,
    Diagram: HooksRulesDiagram,
  },
  {
    id:'t4', tag:'React',
    q:'What is the difference between useEffect and useLayoutEffect?',
    summary:'Both run after a render, but useLayoutEffect fires synchronously before the browser paints while useEffect fires asynchronously after paint.',
    detail:`The browser render pipeline for a state update goes: React renders → React commits DOM mutations → useLayoutEffect fires → browser paints the screen → useEffect fires.

useEffect is the right default for the vast majority of side effects — data fetching, subscriptions, logging. Because it runs after paint the user sees the updated UI without delay.

useLayoutEffect is the escape hatch when you need to read a DOM measurement (getBoundingClientRect, scrollHeight, etc.) and apply a DOM change before the user sees the frame. If you do this in useEffect you get a visual flash because the browser painted the first version already.

A common example: a tooltip that needs to read its trigger's position to decide whether to appear above or below it. That read-and-position must happen synchronously before paint.`,
    code:`// useEffect — runs AFTER paint, async
useEffect(() => {
  document.title = \`\${count} items\` // fine after paint
}, [count])

// useLayoutEffect — runs BEFORE paint, sync
useLayoutEffect(() => {
  const rect = ref.current.getBoundingClientRect()
  if (rect.bottom > window.innerHeight) {
    setFlipUp(true)   // position tooltip above before user sees it
  }
}, [])

// SSR note: useLayoutEffect logs a warning on the server —
// use useEffect or suppress with a client-only guard.`,
    Diagram: EffectTimelineDiagram,
  },
  {
    id:'t5', tag:'React',
    q:'What is the difference between controlled and uncontrolled components?',
    summary:'Controlled components store form value in React state (React is the source of truth); uncontrolled components let the DOM manage its own state (read via ref).',
    detail:`In a controlled component, the input's value prop is driven by React state and an onChange handler keeps them in sync. Every keystroke calls setState, React re-renders, and the input displays the new state. React has full authority — you can validate, format, or block characters on every change.

In an uncontrolled component, you do not supply a value prop. The DOM manages the current value internally. You access it imperatively through a ref — usually on form submit. This is simpler to set up but you lose the ability to react to every change.

The defaultValue prop on an uncontrolled input sets the initial value without making React control subsequent changes.

Most forms in production apps are controlled because they need validation, conditional disabling of the submit button, or syncing multiple fields.`,
    code:`// Controlled — React owns the value
function Controlled() {
  const [name, setName] = useState('')
  return (
    <input
      value={name}                            // React drives it
      onChange={e => setName(e.target.value)} // React updates on change
    />
  )
}

// Uncontrolled — DOM owns the value
function Uncontrolled() {
  const ref = useRef<HTMLInputElement>(null)
  function submit() {
    console.log(ref.current?.value)           // read on demand
  }
  return <input ref={ref} defaultValue="Guest" />
}`,
    Diagram: ControlledDiagram,
  },
  {
    id:'t6', tag:'React',
    q:'When should you use useCallback vs useMemo?',
    summary:'useCallback memoizes a function reference; useMemo memoizes a computed value. Both return the cached version until dependencies change.',
    detail:`useCallback(fn, deps) is equivalent to useMemo(() => fn, deps) — it simply returns the same function object across renders as long as deps are unchanged. Its primary use case is stabilising a callback passed to a memoized child component (React.memo) so the child does not re-render needlessly. It is also used when a function is listed as a dependency of another hook (useEffect, useMemo).

useMemo(fn, deps) runs fn once, caches the result, and only recomputes when deps change. Use it for expensive pure calculations — filtering large arrays, complex derived data. Do not use it as a premature optimisation; the overhead of the memoisation itself is sometimes larger than re-running a cheap calculation.

A practical rule: useCallback for stable function references; useMemo for expensive computed values. Neither is needed for simple primitives or objects that are only used in the same component.`,
    code:`// useCallback: stable function passed to memoised child
const handleClick = useCallback(() => {
  dispatch({ type: 'increment' })
}, [dispatch])                     // same reference if dispatch is stable

const Child = memo(({ onClick }) => <button onClick={onClick}>+</button>)
// Child won't re-render if handleClick reference is stable

// useMemo: expensive computation
const sortedList = useMemo(
  () => bigArray.slice().sort((a, b) => a.name.localeCompare(b.name)),
  [bigArray]   // only re-sort when bigArray changes
)`,
  },
  {
    id:'t7', tag:'React',
    q:'What is prop drilling and how do you avoid it?',
    summary:'Prop drilling is threading props through intermediate components that do not use them just to reach a deeply nested consumer.',
    detail:`As component trees grow, data that originates at the top (theme, user session, locale) needs to reach deeply nested components. The naive approach is to pass it as props at every level — but the middle components become polluted with props they never render, making refactoring painful and coupling the tree tightly.

There are three main solutions. React Context (useContext + createContext) is the built-in answer for cross-cutting concerns: theme, auth, locale. It short-circuits the tree and lets any descendant subscribe directly without the intermediaries knowing.

Component composition is an underused solution: instead of passing data down, pass already-rendered JSX down as children or render props, so the consuming component is a sibling of the data source rather than a deep descendant.

For complex global state — cart contents, server cache, derived async data — a dedicated state library (Zustand, Redux Toolkit, React Query) provides a store that any component can subscribe to without any prop chain.`,
    code:`// ❌ Prop drilling through Layout and Sidebar
<App theme="dark">
  <Layout theme="dark">       {/* doesn't use theme */}
    <Sidebar theme="dark">    {/* doesn't use theme */}
      <Button theme="dark" /> {/* finally uses it */}
    </Sidebar>
  </Layout>
</App>

// ✅ Context: any descendant reads directly
const ThemeCtx = createContext('light')

function App() {
  return (
    <ThemeCtx.Provider value="dark">
      <Layout />              {/* no theme prop */}
    </ThemeCtx.Provider>
  )
}
function Button() {
  const theme = useContext(ThemeCtx) // reads directly
  return <button data-theme={theme}>Click</button>
}`,
    Diagram: ContextDiagram,
  },
  {
    id:'t8', tag:'React',
    q:'How does React 18 automatic batching work?',
    summary:'React 18 batches multiple setState calls from any context (async, timers, native events) into a single re-render — previously only synchronous React event handlers were batched.',
    detail:`Batching means React collects multiple state updates and processes them together in one render pass instead of rendering after each individual call. This has always been true inside React synthetic event handlers (onClick, onChange, etc.).

In React 17 and earlier, updates triggered from inside setTimeout, Promises, or native addEventListener callbacks were NOT batched — each setState produced its own render. This was a surprising performance pitfall.

React 18 introduces automatic batching everywhere via the new root API (createRoot). Whether updates happen inside event handlers, timeouts, Promises, or native event listeners, React now defers and batches them automatically.

If you ever need to force an update to flush synchronously (e.g., you need the DOM to update before reading a measurement), use flushSync() from react-dom to opt out of batching for that block.`,
    code:`// React 17 — two renders inside setTimeout
setTimeout(() => {
  setCount(c => c + 1)  // render
  setFlag(f => !f)      // render  ← two separate renders
}, 1000)

// React 18 — one render inside setTimeout
setTimeout(() => {
  setCount(c => c + 1)  // queued
  setFlag(f => !f)      // queued → single render ✓
}, 1000)

// Opt-out when you need synchronous flushing
import { flushSync } from 'react-dom'
flushSync(() => setCount(c => c + 1)) // flushes immediately
flushSync(() => setFlag(f => !f))     // flushes immediately`,
    Diagram: BatchingDiagram,
  },

  // TypeScript
  {
    id:'t9', tag:'TypeScript',
    q:'What is the difference between `type` and `interface` in TypeScript?',
    summary:'Both describe shapes, but interface supports declaration merging and implements; type supports unions, intersections, mapped/conditional types.',
    detail:`interface and type aliases both define object shapes and are largely interchangeable for simple object types — TypeScript's structural type system makes them equivalent in most positions.

The key exclusive capability of interface is declaration merging: you can write interface Foo {} twice in the same or different files and TypeScript merges them into a single type. This is how library authors augment existing types (e.g., adding custom fields to Express's Request, or extending Window). Classes can also implement an interface.

The key exclusive capabilities of type are expressive power: unions (string | number), intersections (A & B), tuple types ([string, number]), mapped types ({ [K in keyof T]: ... }), and conditional types (T extends U ? X : Y). These cannot be expressed with interface.

A practical convention: use interface for public API shapes and class contracts (takes advantage of merging), use type for unions, utilities, and derived/computed types.`,
    code:`// interface: declaration merging
interface Window { myPlugin: Plugin }  // augments the global Window

// interface: extends
interface Admin extends User { role: 'admin' }

// type: union — impossible with interface
type Status = 'idle' | 'loading' | 'error' | 'success'

// type: intersection
type AdminUser = User & { permissions: string[] }

// type: conditional
type NonNullable<T> = T extends null | undefined ? never : T

// type: mapped
type Readonly<T> = { readonly [K in keyof T]: T[K] }`,
    Diagram: TypeVsInterfaceDiagram,
  },
  {
    id:'t10', tag:'TypeScript',
    q:'What is the difference between `unknown` and `any`?',
    summary:'`any` disables all type checking; `unknown` is type-safe — you can assign anything to it but must narrow the type before using it.',
    detail:`any is an escape hatch that tells TypeScript "I know what I'm doing — stop checking." You can call methods, access properties, and pass an any value anywhere. There is zero type safety. It silently propagates through your codebase — a variable typed as any infects everything that consumes it.

unknown is the type-safe counterpart introduced in TypeScript 3.0. Like any, every type is assignable to unknown. But unlike any, you cannot perform any operation on an unknown value without first narrowing it to a more specific type — typeof, instanceof, type guards, or assertion. TypeScript will refuse to compile unsafe access.

Use unknown whenever you accept external data (API responses, user input, JSON.parse, error objects) and intend to inspect the shape before use. Use any only as a last resort for genuinely dynamic third-party code or during a large migration where types are not yet written.`,
    code:`// any: TypeScript trusts you completely — no safety net
function processAny(data: any) {
  data.nonExistentMethod() // TypeScript: fine  Runtime: 💥
  return data * 2          // TypeScript: fine
}

// unknown: must narrow before use
function processUnknown(data: unknown) {
  data.nonExistentMethod() // TypeScript: ❌ Error
  if (typeof data === 'number') {
    return data * 2        // TypeScript: ✅ narrowed to number
  }
  if (typeof data === 'string') {
    return data.toUpperCase() // ✅ narrowed to string
  }
}

// Common: unknown for catch blocks (TS 4+)
try { riskyOp() }
catch (err: unknown) {
  if (err instanceof Error) console.log(err.message) // ✅
}`,
    Diagram: UnknownVsAnyDiagram,
  },
  {
    id:'t11', tag:'TypeScript',
    q:'What are utility types? Give examples.',
    summary:'Built-in generic helpers that transform existing types — Partial, Required, Pick, Omit, ReturnType, Record, Readonly, and more.',
    detail:`TypeScript ships a library of generic utility types that let you derive new types from existing ones without rewriting them. They are implemented with mapped and conditional types under the hood.

Partial<T> makes every property of T optional — useful for update/patch payloads where you only send changed fields. Required<T> is the inverse, making all properties required. Readonly<T> prevents mutation after creation.

Pick<T, K> extracts a subset of keys from T. Omit<T, K> is the complement — everything except those keys. Both are common for DTO shapes derived from a fuller model type.

ReturnType<F> extracts what a function returns without having to re-declare it. Parameters<F> does the same for the argument tuple. These are invaluable when consuming third-party functions whose return types aren't exported.

Record<K, V> constructs a plain object type with keys from K and values of type V — e.g., Record<string, number> is a dictionary.`,
    code:`interface User {
  id: number; name: string; email: string; role: string
}

type UserPatch  = Partial<User>          // all optional
type PublicUser = Omit<User, 'email'>    // no email
type UserPreview = Pick<User, 'id' | 'name'>

async function fetchUser(): Promise<User> { /* … */ }
type FetchResult = ReturnType<typeof fetchUser>  // Promise<User>
type Awaited<T> = T extends Promise<infer U> ? U : T  // → User

type RoleMap = Record<'admin' | 'editor' | 'viewer', string[]>
// { admin: string[]; editor: string[]; viewer: string[] }

// NonNullable removes null/undefined from a union
type MaybeUser = User | null | undefined
type DefiniteUser = NonNullable<MaybeUser>  // User`,
  },
  {
    id:'t12', tag:'TypeScript',
    q:'What is type narrowing?',
    summary:'TypeScript refining a broad type (union, unknown) to a more specific one inside a conditional block based on a runtime check.',
    detail:`TypeScript performs control-flow analysis: as it reads your code branch by branch, it tracks which types are still possible at each point. A check that eliminates some members of a union is called a type guard, and the narrowed type "sticks" for the rest of that branch.

typeof is the simplest guard for primitives — typeof x === "string" narrows to string. instanceof narrows class instances — x instanceof Date gives you Date with all its methods.

The in operator checks for a property's presence — "fly" in animal narrows to whatever union member has that property. Discriminated unions use a literal tag field (kind, type, status) as the discriminant — once you check kind === "circle" TypeScript knows which union member you have and all other properties become available.

Custom type predicates (function isUser(x: unknown): x is User) let you encapsulate complex checks and teach TypeScript the resulting type, enabling reuse across the codebase.`,
    code:`type Shape = { kind: 'circle'; r: number } | { kind: 'rect'; w: number; h: number }

function area(s: Shape): number {
  if (s.kind === 'circle') {
    return Math.PI * s.r ** 2  // TS knows: s is { kind:'circle'; r:number }
  }
  return s.w * s.h             // TS knows: s is { kind:'rect'; w; h }
}

// Custom type predicate
function isError(val: unknown): val is Error {
  return val instanceof Error
}
function handle(val: unknown) {
  if (isError(val)) {
    console.log(val.message)   // ✅ narrowed to Error
  }
}`,
    Diagram: NarrowingDiagram,
  },

  // Next.js
  {
    id:'t13', tag:'Next.js',
    q:'What is the difference between SSR, SSG, and ISR?',
    summary:'SSG generates HTML at build time; SSR generates it per request; ISR generates at build time then re-generates on a schedule or on-demand.',
    detail:`Static Site Generation (SSG) pre-builds every page into static HTML at deploy time. Pages load instantly from a CDN with no server involved. The trade-off is that data is as fresh as the last build — perfect for marketing pages, docs, and blog posts that change infrequently.

Server-Side Rendering (SSR) generates HTML on each request. Every visitor gets fully fresh data and the page is always up to date. The trade-off is latency — there is a server roundtrip before the first byte arrives. Use SSR for pages with user-specific data (dashboards, account pages) or real-time data (stock prices, live sports).

Incremental Static Regeneration (ISR) combines both: pages are statically built and cached, but you specify a revalidate interval in seconds. After the interval expires the page is regenerated in the background on the next request, and the new version is cached. The current visitor still gets the stale version instantly; the next visitor gets the new one. ISR is the sweet spot for most content sites.`,
    code:`// SSG — generate at build, no revalidation
export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map(p => ({ slug: p.slug }))
}

// ISR — static but revalidated every 60 s (App Router)
async function Page() {
  const data = await fetch('/api/posts', {
    next: { revalidate: 60 }  // ← ISR
  }).then(r => r.json())
  return <PostList posts={data} />
}

// SSR — fresh on every request (App Router)
async function Page() {
  const data = await fetch('/api/posts', {
    cache: 'no-store'         // ← SSR
  }).then(r => r.json())
  return <PostList posts={data} />
}`,
    Diagram: RenderingDiagram,
  },
  {
    id:'t14', tag:'Next.js',
    q:'What are React Server Components (RSC)?',
    summary:'Components that render exclusively on the server, send serialised UI (not JS) to the client, and can directly access databases, files, and secrets.',
    detail:`React Server Components solve a long-standing tension: components need data, but fetching it on the client requires a round-trip and exposes API details to the browser. RSC run on the server — they have direct access to databases, the file system, environment secrets, and any Node.js API — with no exposure to the client bundle.

RSC render to a special serialised format (the RSC payload), not HTML. The client React runtime deserialises it and merges it into the component tree. Because RSC never run in the browser they add zero kilobytes to the JS bundle.

The "server/client boundary" is marked with the "use client" directive. Any component below a "use client" file becomes a Client Component — it hydrates in the browser and can use hooks and event handlers. Client Components can receive plain-data props from their RSC parents, but RSC cannot receive functions or state from Client Components.

In Next.js App Router, all components are Server Components by default. You only opt in to "use client" when you need interactivity.`,
    code:`// app/posts/page.tsx — Server Component (default in App Router)
// No "use client" directive → runs on server only
async function PostsPage() {
  // Direct DB access — credentials never sent to browser
  const posts = await db.post.findMany({ orderBy: { date: 'desc' } })
  return (
    <main>
      <h1>Posts</h1>
      {posts.map(p => <PostCard key={p.id} post={p} />)}
      <LikeButton postId={posts[0].id} />  {/* Client Component */}
    </main>
  )
}

// components/LikeButton.tsx — Client Component
'use client'
import { useState } from 'react'
export function LikeButton({ postId }: { postId: string }) {
  const [liked, setLiked] = useState(false)  // ✅ hooks allowed
  return <button onClick={() => setLiked(l => !l)}>{liked ? '❤️' : '🤍'}</button>
}`,
    Diagram: RSCDiagram,
  },
  {
    id:'t15', tag:'Next.js',
    q:'What is the App Router and how does it differ from Pages Router?',
    summary:'App Router (Next.js 13+) uses the app/ directory, React Server Components, nested layouts, and co-located special files — a complete paradigm shift from Pages Router.',
    detail:`The Pages Router (pages/ directory) has been Next.js's routing system since v1. Routes are file-based, data fetching happens via exported functions (getStaticProps, getServerSideProps, getStaticPaths), and every page is a Client Component by default. Layouts are handled by _app.tsx or custom wrapper components.

The App Router (app/ directory, Next.js 13+ stable in 14) rebuilds routing on top of React Server Components. Every file in app/ is a Server Component by default. Special filenames have defined roles: page.tsx defines a route segment, layout.tsx wraps it (and persists across navigations), loading.tsx is a Suspense boundary, error.tsx is an error boundary, and route.ts is an API handler.

Data fetching happens directly in async Server Components using fetch() with Next.js cache options — no getServerSideProps ceremony. Nested layouts mean only the innermost segment re-renders on navigation, not the whole page. Streaming and Suspense are first-class, allowing progressive HTML delivery.`,
    code:`// app/blog/[slug]/page.tsx — App Router
export async function generateStaticParams() {
  return (await getPosts()).map(p => ({ slug: p.slug }))
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)  // direct async fetch
  return <article><h1>{post.title}</h1><p>{post.body}</p></article>
}

// app/blog/layout.tsx — persists across /blog/* navigations
export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="blog-wrapper">
      <Sidebar />   {/* ← stays mounted across navigations */}
      {children}
    </div>
  )
}`,
    Diagram: AppRouterDiagram,
  },
  {
    id:'t16', tag:'Next.js',
    q:'What are Server Actions?',
    summary:'Async functions marked "use server" that run on the server, called directly from Client Components via forms or event handlers — the App Router replacement for API routes for mutations.',
    detail:`Before Server Actions, every mutation (create, update, delete) required an API route: you wrote a route handler, then called it from the client with fetch, handled loading and error states, and invalidated the cache manually. That is a lot of boilerplate for a simple form submit.

Server Actions collapse this into a single function. You mark an async function with "use server" (either inline in a Server Component or at the top of a dedicated actions file). Next.js automatically creates a secure, encrypted POST endpoint for it. You pass the function directly to a form's action prop or call it from an event handler.

Inside the action you have full Node.js access — database writes, file operations, email sending. After the mutation, calling revalidatePath() or revalidateTag() purges the relevant cache entries and triggers a UI refresh automatically.

They compose beautifully with React's useOptimistic hook for instant UI feedback while the server round-trip is in progress.`,
    code:`// app/actions.ts
'use server'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string
  await db.post.create({ data: { title, userId: getCurrentUser() } })
  revalidatePath('/posts')  // purge cache → UI re-fetches
}

// app/posts/new/page.tsx — Server Component
import { createPost } from '../actions'
export default function NewPost() {
  return (
    <form action={createPost}>             {/* ← direct fn reference */}
      <input name="title" placeholder="Post title" />
      <button type="submit">Create</button>
    </form>
  )
}

// Client Component usage
'use client'
import { createPost } from '../actions'
export function NewPostButton() {
  return <button onClick={() => createPost(new FormData())}>Quick Post</button>
}`,
    Diagram: ServerActionDiagram,
  },
]

const CODE_QAS: CodeQA[] = [
  {
    id:'c1', tag:'useState', title:'Stale closure in setState',
    code:`function Counter() {
  const [count, setCount] = useState(0)

  function increment() {
    setCount(count + 1)  // all three read the same
    setCount(count + 1)  // stale count = 0
    setCount(count + 1)  // from the closure
  }

  return <button onClick={increment}>{count}</button>
}`,
    question:'After one click, what is count?',
    answer:'1 — not 3',
    explanation:`All three setCount calls read count from the render closure where count = 0. React batches them and the last value written wins, which is 0 + 1 = 1.

Fix: use the functional updater form so each call receives the latest queued value:
  setCount(c => c + 1)   // c=0 → 1
  setCount(c => c + 1)   // c=1 → 2
  setCount(c => c + 1)   // c=2 → 3 ✓

The functional form pulls the value from React's internal update queue rather than the closed-over snapshot.`,
  },
  {
    id:'c2', tag:'useEffect', title:'Stale interval',
    code:`function Timer() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1)   // stale count = 0 forever
    }, 1000)
    return () => clearInterval(id)
  }, [])   // ← empty deps: effect runs once

  return <p>{count}</p>
}`,
    question:'What does count reach over time?',
    answer:'Stops at 1 — stale closure',
    explanation:`The effect runs once (empty deps) and captures count = 0 from that render. Every tick sets count to 0 + 1 = 1. The interval never sees an updated count.

Two fixes:
1. Functional updater (preferred):
   setCount(c => c + 1)  — no dependency on count

2. Include count in deps (restarts interval on each tick — usually not what you want):
   useEffect(() => { … }, [count])

The functional updater is the idiomatic solution for counters and accumulators inside effects.`,
  },
  {
    id:'c3', tag:'TypeScript', title:'Infer the return type',
    code:`function first<T>(arr: T[]): T | undefined {
  return arr[0]
}

const a = first([1, 2, 3])
//    ^ type?

const b = first(['x', 'y'])
//    ^ type?

const c = first([])
//    ^ type?`,
    question:'What are the types of a, b, and c?',
    answer:'number | undefined,  string | undefined,  unknown',
    explanation:`TypeScript infers the type parameter T from the argument:
- first([1,2,3])   → T = number  → number | undefined
- first(['x','y']) → T = string  → string | undefined
- first([])        → T = unknown (empty array — no information to infer from)

The | undefined accounts for the case where arr is empty. Before using the returned value you must check that it is defined:
  if (a !== undefined) { a.toFixed(2) }  // ✅ safe after narrowing`,
  },
  {
    id:'c4', tag:'TypeScript', title:'Excess property check',
    code:`interface User { name: string; age: number }

function greet(u: User) {
  return \`Hello \${u.name}\`
}

// Which of these compiles?
greet({ name: 'Ali', age: 30 })            // A
greet({ name: 'Ali', age: 30, role: 'admin' }) // B

const obj = { name: 'Ali', age: 30, role: 'admin' }
greet(obj)                                  // C`,
    question:'Which calls (A/B/C) cause a TypeScript error?',
    answer:'Only B errors — C is fine',
    explanation:`TypeScript applies excess property checking only on fresh object literals passed directly to a typed position. B is a fresh literal with an extra role field → error.

C assigns the object to a variable first. At that point TypeScript widens it to { name: string; age: number; role: string } — a structural supertype of User — and allows it. This is structural subtyping: the variable has all User properties plus more, so it is compatible.

Fix for B: either remove role, add role to User, or use a type assertion (as User) if you're sure the extra property is intentional.`,
  },
  {
    id:'c5', tag:'React.memo', title:'Broken memoization',
    code:`const Child = React.memo(({ onClick }: { onClick: () => void }) => {
  console.log('Child rendered')
  return <button onClick={onClick}>+</button>
})

function Parent() {
  const [n, setN] = useState(0)
  const handle = () => setN(c => c + 1)  // ← new fn every render

  return (
    <>
      <p>Count: {n}</p>
      <Child onClick={handle} />
    </>
  )
}`,
    question:'Does memo prevent Child from re-rendering when n changes?',
    answer:'No — Child re-renders every time',
    explanation:`React.memo does a shallow comparison of props. handle is re-created as a new function object on every Parent render, so its reference changes every time. Memo's comparison sees a different onClick and re-renders Child.

Fix: wrap handle in useCallback with a stable dependency list:
  const handle = useCallback(() => setN(c => c + 1), [])

Now handle keeps the same reference across renders (the setState updater form needs no deps), memo's comparison passes, and Child only renders once.

Rule of thumb: React.memo is only effective when all props are stable — primitives, memoised objects, or useCallback functions.`,
  },
  {
    id:'c6', tag:'Custom Hook', title:'Implement useLocalStorage',
    code:`// Signature
function useLocalStorage<T>(key: string, initial: T): [T, (v: T) => void]

// Usage
const [theme, setTheme] = useLocalStorage('theme', 'dark')
// - reads from localStorage on first render
// - persists on every update
// - falls back to initial if key doesn't exist`,
    question:'Implement useLocalStorage<T>',
    answer:'useState (lazy init) + useEffect to sync',
    explanation:`function useLocalStorage<T>(key: string, initial: T): [T, (v: T) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored !== null ? JSON.parse(stored) : initial
    } catch {
      return initial
    }
  })

  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)) }
    catch { /* quota exceeded, SSR, etc. */ }
  }, [key, value])

  return [value, setValue]
}

Key points:
• Lazy initialiser (() => …) runs only once — avoids reading localStorage on every render.
• try/catch handles SSR (no window), quota errors, and invalid JSON.
• useEffect syncs after every value change.
• Return type matches useState's tuple so it's a drop-in replacement.`,
  },
  {
    id:'c7', tag:'Next.js', title:'Server vs Client Component',
    code:`// app/dashboard/page.tsx
import { cookies } from 'next/headers'
import { Chart } from '@/components/Chart'

export default async function Page() {
  const session = cookies().get('session')?.value
  const stats = await db.getStats(session)

  return (
    <section>
      <h1>Dashboard</h1>
      <p>Visits: {stats.visits}</p>
      <Chart data={stats.chartData} />
    </section>
  )
}`,
    question:'Is Page a Server or Client Component? What CAN\'T it do?',
    answer:'Server Component — no hooks, no events, no browser APIs',
    explanation:`No "use client" directive → Page is a Server Component. It can:
✅ use async/await directly
✅ call cookies(), headers() from next/headers
✅ query the DB without an API layer
✅ keep secrets (DB credentials) off the client bundle

It CANNOT:
❌ use useState, useEffect, or any hook
❌ attach onClick, onChange event handlers
❌ access window, document, localStorage
❌ use Context (consumer side)

Chart in this example would need to be a Client Component ("use client") if it has interactive tooltips, hover states, or animations — those need the browser and hooks. The data prop is passed from the server to the client boundary as plain serialisable JSON.`,
  },
  {
    id:'c8', tag:'TypeScript', title:'Discriminated union narrowing',
    code:`type ApiResult =
  | { status: 'ok';    data: string[] }
  | { status: 'error'; message: string }

function handle(r: ApiResult) {
  // Inside this if block, which accesses are valid?
  if (r.status === 'ok') {
    console.log(r.data)     // A
    console.log(r.message)  // B
  }

  // Outside the if?
  console.log(r.status)     // C
  console.log(r.data)       // D
}`,
    question:'Which property accesses (A/B/C/D) compile without error?',
    answer:'A ✅  B ❌  C ✅  D ❌',
    explanation:`Inside the if (r.status === 'ok') block, TypeScript narrows r to the first union member { status:'ok'; data:string[] }:
  A — r.data     ✅ available on this member
  B — r.message  ❌ that's on the 'error' member, not here

Outside the if, TypeScript sees the full union — both members:
  C — r.status   ✅ present on every member (the discriminant)
  D — r.data     ❌ only on 'ok' member; TypeScript can't guarantee it here

This is the power of discriminated unions: the shared literal field (status) acts as a type-safe switch. Add an else branch to handle the 'error' case and TypeScript will make message available there.`,
  },
]

// ─── UI ───────────────────────────────────────────────────────────────────────

const TAG_COLORS: Record<string, string> = { React: REACT, TypeScript: TS, 'Next.js': NX }

function TheoryCard({ item, index }: { item: QA; index: number }) {
  const [open, setOpen] = useState(false)
  const color = TAG_COLORS[item.tag] ?? REACT
  const D = item.Diagram
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ delay: index * 0.025 }}
      className="card rounded-xl overflow-hidden"
    >
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-start gap-3 px-5 py-4 text-left hover:bg-white/[0.025] transition-colors"
      >
        <span className="mt-0.5 shrink-0 text-[10px] px-2 py-0.5 rounded-full font-semibold"
          style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}>
          {item.tag}
        </span>
        <span className="flex-1 text-sm font-medium text-white/85 leading-snug">{item.q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.18 }} className="shrink-0 mt-0.5">
          <ChevronDown size={14} className="text-white/30" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/5 px-5 py-4 flex flex-col gap-4">
              {/* summary pill */}
              <div className="rounded-lg px-3 py-2 text-xs font-semibold leading-relaxed"
                style={{ background: `${color}10`, border: `1px solid ${color}25`, color: `${color}cc` }}>
                {item.summary}
              </div>

              {/* diagram */}
              {D && (
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-wider text-white/30 mb-2">Diagram</p>
                  <D />
                </div>
              )}

              {/* detailed explanation — split on double newline */}
              <div className="flex flex-col gap-3">
                <p className="text-[9px] font-semibold uppercase tracking-wider text-white/30">Explanation</p>
                {item.detail.split('\n\n').map((para, i) => (
                  <p key={i} className="text-sm text-white/60 leading-relaxed">{para}</p>
                ))}
              </div>

              {/* code */}
              {item.code && (
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-wider text-white/30 mb-2">Code Example</p>
                  <CodeBlock code={item.code} />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function CodeCard({ item, index }: { item: CodeQA; index: number }) {
  const [revealed, setRevealed] = useState(false)
  const color = TAG_COLORS[item.tag] ?? REACT
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ delay: index * 0.035 }}
      className="card rounded-2xl overflow-hidden"
    >
      <div className="px-5 py-3 border-b border-white/5 flex items-center gap-2">
        <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold shrink-0"
          style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}>
          {item.tag}
        </span>
        <h3 className="font-bold text-sm text-white/90">{item.title}</h3>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="p-5 border-b lg:border-b-0 lg:border-r border-white/5">
          <CodeBlock code={item.code} />
        </div>
        <div className="p-5 flex flex-col gap-3">
          <p className="text-sm font-semibold text-white/80">{item.question}</p>
          <AnimatePresence mode="wait">
            {!revealed ? (
              <motion.button key="btn" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                onClick={() => setRevealed(true)}
                className="self-start px-4 py-2 rounded-xl text-xs font-semibold border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] transition-colors">
                Reveal Answer
              </motion.button>
            ) : (
              <motion.div key="ans" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3">
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
                  style={{ background: `${color}12`, border: `1px solid ${color}30` }}>
                  <Check size={13} style={{ color }} />
                  <span className="font-mono text-sm font-bold" style={{ color }}>{item.answer}</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  {item.explanation.split('\n\n').map((p, i) => (
                    <p key={i} className="text-xs text-white/55 leading-relaxed whitespace-pre-line">{p}</p>
                  ))}
                </div>
                <button onClick={() => setRevealed(false)} className="self-start text-xs text-white/25 hover:text-white/55 transition-colors">Hide</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

const TAGS = ['All', 'React', 'TypeScript', 'Next.js']

export function Interview() {
  const [tab, setTab] = useState<'theory' | 'code'>('theory')
  const [filter, setFilter] = useState('All')

  const theory = filter === 'All' ? THEORY : THEORY.filter(q => q.tag === filter)
  const code   = filter === 'All' ? CODE_QAS : CODE_QAS.filter(q => q.tag === filter)

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col gap-6">
      <TrackHeader icon="🎯" name="Interview Prep"
        sub="Detailed definitions · visual diagrams · code examples · React · TypeScript · Next.js"
        color={AMBER} />

      {/* tabs */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/8 self-start">
        {(['theory','code'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{ background: tab===t ? 'rgba(255,255,255,0.1)' : 'transparent',
                     color: tab===t ? '#fff' : 'rgba(255,255,255,0.4)' }}>
            {t === 'theory' ? '📖 Theory Q&A' : '💻 Code Q&A'}
          </button>
        ))}
      </div>

      {/* filter */}
      <div className="flex items-center gap-2 flex-wrap">
        {TAGS.map(tag => {
          const c = TAG_COLORS[tag]
          const active = filter === tag
          return (
            <button key={tag} onClick={() => setFilter(tag)}
              className="px-3 py-1 rounded-full text-xs font-semibold transition-all"
              style={{
                background: active ? (c ? `${c}20` : 'rgba(255,255,255,0.12)') : 'rgba(255,255,255,0.04)',
                border: active ? `1px solid ${c ?? 'rgba(255,255,255,0.3)'}` : '1px solid transparent',
                color: active ? (c ?? '#fff') : 'rgba(255,255,255,0.45)',
              }}>
              {tag}
            </button>
          )
        })}
        <span className="ml-auto text-xs text-white/30">
          {tab === 'theory' ? theory.length : code.length} questions
        </span>
      </div>

      {/* content */}
      <AnimatePresence mode="wait">
        {tab === 'theory' ? (
          <motion.div key="theory" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col gap-3">
            {theory.map((item, i) => <TheoryCard key={item.id} item={item} index={i} />)}
          </motion.div>
        ) : (
          <motion.div key="code" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col gap-4">
            {code.map((item, i) => <CodeCard key={item.id} item={item} index={i} />)}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
