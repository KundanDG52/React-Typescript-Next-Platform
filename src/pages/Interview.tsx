import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Check } from 'lucide-react'
import { TrackHeader } from '../components/shared/Demo'
import { CodeBlock } from '../components/shared/CodeBlock'

// ─── Types ────────────────────────────────────────────────────────────────────
interface QA { id: string; q: string; a: string; tag: string; code?: string }
interface CodeQA { id: string; title: string; tag: string; code: string; question: string; answer: string; explanation: string }

// ─── Theory Q&A data ─────────────────────────────────────────────────────────
const THEORY: QA[] = [
  {
    id: 't1', tag: 'React',
    q: 'What is the Virtual DOM and how does React use it?',
    a: 'The Virtual DOM is a lightweight in-memory copy of the real DOM. When state changes, React re-renders the component tree into a new Virtual DOM tree, diffs it against the previous one (reconciliation), and applies only the minimal set of real DOM changes — avoiding expensive full re-paints.',
  },
  {
    id: 't2', tag: 'React',
    q: 'What are the Rules of Hooks and why do they exist?',
    a: 'Hooks must be called at the top level (never inside conditions, loops, or nested functions) and only from React function components or custom hooks. React relies on the call order to match hook state between renders — breaking that order corrupts the internal linked list that stores hook state.',
  },
  {
    id: 't3', tag: 'React',
    q: 'What is React Fiber?',
    a: 'Fiber is React\'s internal reconciler architecture (since React 16). It represents each component as a "fiber" node in a linked list, enabling work to be split into units and paused/resumed. This is what powers concurrent features like useTransition, Suspense, and priority-based scheduling.',
  },
  {
    id: 't4', tag: 'React',
    q: 'What is the difference between controlled and uncontrolled components?',
    a: 'A controlled component stores form value in React state and passes it back via value + onChange — React is the source of truth. An uncontrolled component lets the DOM manage its own state and you read it via a ref. Controlled components are easier to validate and synchronize; uncontrolled components are simpler for one-off DOM integrations.',
  },
  {
    id: 't5', tag: 'React',
    q: 'When should you use useCallback vs useMemo?',
    a: 'useCallback memoizes a function reference — use it when passing a callback to a memoized child (React.memo) or as a dependency of another hook, to prevent unnecessary re-renders. useMemo memoizes a computed value — use it when a calculation is expensive and its inputs rarely change. Both return the cached version until dependencies change.',
  },
  {
    id: 't6', tag: 'React',
    q: 'What is the difference between useEffect and useLayoutEffect?',
    a: 'useEffect runs asynchronously after the browser has painted. useLayoutEffect runs synchronously after DOM mutations but before the paint — the same timing as componentDidMount/Update. Use useLayoutEffect only when you need to read or mutate the DOM before the user sees it (e.g., measuring element size for animations) to avoid a visual flicker.',
  },
  {
    id: 't7', tag: 'React',
    q: 'What is prop drilling and how do you avoid it?',
    a: 'Prop drilling is passing props through multiple intermediate components that don\'t use them, just to reach a deeply nested consumer. Avoid it with: (1) React Context — useContext for global/theme/auth data, (2) component composition — lifting JSX up so the consumer is closer to the data, (3) a state manager like Zustand/Redux for complex shared state.',
  },
  {
    id: 't8', tag: 'React',
    q: 'How does React batching work in React 18?',
    a: 'React 18 introduced automatic batching: multiple state updates inside any async context (setTimeout, Promise, native events) are now batched into a single re-render, just like they always were inside React event handlers. Previously only synchronous React event handler updates were batched. Use flushSync() to opt out.',
  },
  {
    id: 't9', tag: 'TypeScript',
    q: 'What is the difference between `type` and `interface`?',
    a: 'Both describe object shapes, but they differ in two key ways: (1) Interfaces can be re-opened (declaration merging) — useful for augmenting external library types. Types cannot. (2) Types can express unions, intersections, tuples, and mapped/conditional types that interfaces cannot. For object shapes, either works; prefer interface for public API shapes (mergeable) and type for unions and computed types.',
  },
  {
    id: 't10', tag: 'TypeScript',
    q: 'What is the difference between `unknown` and `any`?',
    a: '`any` disables type checking entirely — you can do anything with it. `unknown` is the type-safe counterpart: you can assign anything to it, but you cannot use it until you narrow the type (via typeof, instanceof, or a type guard). Prefer `unknown` over `any` when receiving data from external sources.',
  },
  {
    id: 't11', tag: 'TypeScript',
    q: 'What are utility types? Give three examples.',
    a: 'Utility types are built-in generic helpers that transform existing types. Examples: Partial<T> makes all properties optional; Pick<T, K> extracts a subset of keys; ReturnType<F> extracts the return type of a function; Readonly<T> prevents mutation; Record<K, V> constructs an object type with keys K and values V.',
  },
  {
    id: 't12', tag: 'TypeScript',
    q: 'What is type narrowing?',
    a: 'Narrowing is TypeScript refining a broad type to a more specific one inside a conditional block. Techniques: typeof (for primitives), instanceof (for class instances), in (for property checks), discriminated unions (checking a literal tag field), and custom type predicates (function that returns "x is T").',
  },
  {
    id: 't13', tag: 'Next.js',
    q: 'What is the difference between SSR, SSG, and ISR?',
    a: 'SSR (Server-Side Rendering) generates HTML on each request — always fresh, but slower. SSG (Static Site Generation) pre-renders HTML at build time — instant delivery, but data can be stale. ISR (Incremental Static Regeneration) is SSG with a revalidate interval: pages are served statically and re-generated in the background when the time expires.',
  },
  {
    id: 't14', tag: 'Next.js',
    q: 'What are React Server Components (RSC)?',
    a: 'RSC are components that render exclusively on the server and send serialized UI (not JS) to the client. They can directly access databases, filesystems, and secrets without exposing them. They never hydrate, so they add zero JS to the client bundle. Client Components (marked "use client") hydrate normally and handle interactivity.',
  },
  {
    id: 't15', tag: 'Next.js',
    q: 'What is the App Router and how does it differ from Pages Router?',
    a: 'The App Router (Next.js 13+) uses the app/ directory and is built on React Server Components. Layouts, pages, loading, and error UIs are co-located as special files. Data fetching happens directly in components (no getServerSideProps). The Pages Router uses pages/ with file-based routing, getStaticProps/getServerSideProps, and class-based data fetching patterns.',
  },
  {
    id: 't16', tag: 'Next.js',
    q: 'What are Server Actions?',
    a: 'Server Actions are async functions marked with "use server" that run on the server and can be called directly from Client Components (via form actions or event handlers). They replace API routes for mutations — no manual fetch needed. They integrate with revalidatePath/revalidateTag for cache purging after writes.',
  },
]

// ─── Code Q&A data ───────────────────────────────────────────────────────────
const CODE_QAS: CodeQA[] = [
  {
    id: 'c1', tag: 'useState', title: 'Stale closure in setState',
    code: `function Counter() {
  const [count, setCount] = useState(0)

  function increment() {
    setCount(count + 1)
    setCount(count + 1)
    setCount(count + 1)
  }

  return <button onClick={increment}>{count}</button>
}`,
    question: 'After one click, what is count?',
    answer: '1',
    explanation: 'All three calls read the same stale count (0) from the render closure, so each sets count to 0 + 1 = 1. Fix: use the functional form setCount(c => c + 1) so each update receives the latest value.',
  },
  {
    id: 'c2', tag: 'useEffect', title: 'Stale interval bug',
    code: `useEffect(() => {
  const id = setInterval(() => {
    setCount(count + 1)  // stale!
  }, 1000)
  return () => clearInterval(id)
}, []) // empty deps`,
    question: 'What value does count reach?',
    answer: '1 — then stops',
    explanation: 'The empty dependency array means the effect runs once and captures count = 0 forever. The interval always sets count to 0 + 1 = 1. Fix: use setCount(c => c + 1) to avoid the stale closure, or add count to the deps (which restarts the interval on every change).',
  },
  {
    id: 'c3', tag: 'TypeScript', title: 'Infer the type',
    code: `function first<T>(arr: T[]): T | undefined {
  return arr[0]
}

const result = first([1, 2, 3])
//    ^ what is the type of result?`,
    question: 'What TypeScript type does `result` have?',
    answer: 'number | undefined',
    explanation: 'TypeScript infers T = number from the [1, 2, 3] argument. The return type T | undefined means result is number | undefined — you must narrow (check for undefined) before using it as a number.',
  },
  {
    id: 'c4', tag: 'TypeScript', title: 'Fix the type error',
    code: `interface User {
  name: string
  age: number
}

function greet(user: User) {
  return \`Hello \${user.name}\`
}

// Error on next line — why?
greet({ name: 'Alice', age: 30, role: 'admin' })`,
    question: 'Why does TypeScript error here?',
    answer: 'Excess property check',
    explanation: 'TypeScript applies excess property checks on object literals passed directly to a typed parameter. The { role: "admin" } field is not on User. Fix: either add role to the interface, use a type assertion (as User), or assign the object to a variable first (excess check is skipped on variables).',
  },
  {
    id: 'c5', tag: 'React.memo', title: 'Broken memoization',
    code: `const Child = React.memo(({ onClick }) => (
  <button onClick={onClick}>Click</button>
))

function Parent() {
  const [n, setN] = useState(0)
  const handle = () => console.log('clicked')
  return (
    <>
      <button onClick={() => setN(n + 1)}>n={n}</button>
      <Child onClick={handle} />
    </>
  )
}`,
    question: 'Does Child re-render when n changes?',
    answer: 'Yes — every time',
    explanation: '`handle` is re-created on every Parent render, so its reference changes and React.memo\'s shallow comparison fails. Fix: wrap handle in useCallback(() => console.log("clicked"), []) to keep the reference stable across renders.',
  },
  {
    id: 'c6', tag: 'Custom Hook', title: 'Implement useLocalStorage',
    code: `// Implement a hook that syncs state with localStorage.
// Usage:
const [name, setName] = useLocalStorage('name', 'Guest')

function useLocalStorage<T>(key: string, initial: T) {
  // your implementation here
}`,
    question: 'Implement useLocalStorage<T>',
    answer: 'useState + useEffect + JSON parse/stringify',
    explanation: `Lazy-initialize state from localStorage (or fall back to initial), then sync back with a useEffect whenever value changes:

const [value, setValue] = useState<T>(() => {
  try {
    const s = localStorage.getItem(key)
    return s ? JSON.parse(s) : initial
  } catch { return initial }
})
useEffect(() => {
  localStorage.setItem(key, JSON.stringify(value))
}, [key, value])
return [value, setValue] as const`,
  },
  {
    id: 'c7', tag: 'Next.js', title: 'Server vs Client Component',
    code: `// app/dashboard/page.tsx
import { cookies } from 'next/headers'

export default async function Page() {
  const session = cookies().get('session')
  const data = await fetch('/api/stats').then(r => r.json())

  return <Dashboard data={data} session={session} />
}`,
    question: 'Is this a Server or Client Component? What can\'t it do?',
    answer: 'Server Component',
    explanation: 'No "use client" directive → it\'s a Server Component. It can access cookies(), await fetch, and database calls directly. What it cannot do: use hooks (useState, useEffect), attach event listeners, or access browser APIs (window, localStorage). Interactive parts should be extracted into separate "use client" child components.',
  },
  {
    id: 'c8', tag: 'TypeScript', title: 'Discriminated union narrowing',
    code: `type Result =
  | { status: 'ok'; data: string }
  | { status: 'error'; message: string }

function handle(r: Result) {
  if (r.status === 'ok') {
    console.log(r.data)    // ✅ or ❌?
    console.log(r.message) // ✅ or ❌?
  }
}`,
    question: 'Which property accesses are valid inside the if block?',
    answer: 'r.data ✅ — r.message ❌',
    explanation: 'The status === "ok" check narrows the union to { status: "ok"; data: string }. Inside the block TypeScript knows r has data but not message. Outside the if, only status is safely accessible without further narrowing.',
  },
]

// ─── Theory accordion ─────────────────────────────────────────────────────────
const TAG_COLORS: Record<string, string> = {
  React: '#61dafb',
  TypeScript: '#3178c6',
  'Next.js': '#ffffff',
}

function TheoryCard({ item, index }: { item: QA; index: number }) {
  const [open, setOpen] = useState(false)
  const color = TAG_COLORS[item.tag] ?? '#61dafb'
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ delay: index * 0.03 }}
      className="card rounded-xl overflow-hidden"
    >
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-start gap-3 px-5 py-4 text-left hover:bg-white/[0.03] transition-colors"
      >
        <span className="mt-0.5 shrink-0 text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}>{item.tag}</span>
        <span className="flex-1 text-sm font-medium text-white/85 leading-snug">{item.q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="shrink-0 mt-0.5">
          <ChevronDown size={15} className="text-white/30" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4 flex flex-col gap-3 border-t border-white/5">
              <p className="text-sm text-white/60 leading-relaxed pt-3">{item.a}</p>
              {item.code && <CodeBlock code={item.code} />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── Code Q&A card ────────────────────────────────────────────────────────────
function CodeCard({ item, index }: { item: CodeQA; index: number }) {
  const [revealed, setRevealed] = useState(false)
  const color = TAG_COLORS[item.tag] ?? '#61dafb'
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ delay: index * 0.04 }}
      className="card rounded-2xl overflow-hidden"
    >
      <div className="px-5 py-3 border-b border-white/5 flex items-center gap-2">
        <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}>{item.tag}</span>
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
              <motion.button
                key="btn"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                onClick={() => setRevealed(true)}
                className="self-start px-4 py-2 rounded-lg text-xs font-semibold border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
              >
                Reveal Answer
              </motion.button>
            ) : (
              <motion.div key="ans" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-2">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: `${color}12`, border: `1px solid ${color}30` }}>
                  <Check size={13} style={{ color }} />
                  <span className="font-mono text-sm font-bold" style={{ color }}>{item.answer}</span>
                </div>
                <p className="text-xs text-white/55 leading-relaxed whitespace-pre-line">{item.explanation}</p>
                <button onClick={() => setRevealed(false)} className="self-start text-xs text-white/30 hover:text-white/60 transition-colors">Hide</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Filter bar ───────────────────────────────────────────────────────────────
const TAGS = ['All', 'React', 'TypeScript', 'Next.js']

// ─── Page ────────────────────────────────────────────────────────────────────
export function Interview() {
  const [tab, setTab] = useState<'theory' | 'code'>('theory')
  const [filter, setFilter] = useState('All')

  const visibleTheory = filter === 'All' ? THEORY : THEORY.filter(q => q.tag === filter)
  const visibleCode = filter === 'All' ? CODE_QAS : CODE_QAS.filter(q => q.tag === filter)

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col gap-6">
      <TrackHeader icon="🎯" name="Interview Prep" sub="Theory Q&A · Code challenges · React · TypeScript · Next.js" color="#f59e0b" />

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/8 self-start">
        {(['theory', 'code'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{
              background: tab === t ? 'rgba(255,255,255,0.1)' : 'transparent',
              color: tab === t ? '#fff' : 'rgba(255,255,255,0.4)',
            }}
          >
            {t === 'theory' ? '📖 Theory Q&A' : '💻 Code Q&A'}
          </button>
        ))}
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        {TAGS.map(tag => {
          const color = TAG_COLORS[tag]
          const active = filter === tag
          return (
            <button
              key={tag}
              onClick={() => setFilter(tag)}
              className="px-3 py-1 rounded-full text-xs font-semibold transition-all"
              style={{
                background: active ? (color ? `${color}20` : 'rgba(255,255,255,0.12)') : 'rgba(255,255,255,0.04)',
                border: active ? `1px solid ${color ?? 'rgba(255,255,255,0.3)'}` : '1px solid transparent',
                color: active ? (color ?? '#fff') : 'rgba(255,255,255,0.45)',
              }}
            >
              {tag}
            </button>
          )
        })}
        <span className="ml-auto text-xs text-white/30">
          {tab === 'theory' ? visibleTheory.length : visibleCode.length} questions
        </span>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {tab === 'theory' ? (
          <motion.div key="theory" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-3">
            {visibleTheory.map((item, i) => <TheoryCard key={item.id} item={item} index={i} />)}
          </motion.div>
        ) : (
          <motion.div key="code" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-4">
            {visibleCode.map((item, i) => <CodeCard key={item.id} item={item} index={i} />)}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
