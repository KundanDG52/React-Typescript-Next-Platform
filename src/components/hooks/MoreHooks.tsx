import { createContext, useContext, useReducer, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── useContext: theme without prop drilling ─────────────────────────────────
const ThemeCtx = createContext<{ theme: string; toggle: () => void }>({ theme: 'dark', toggle: () => {} })
function DeepChild() {
  const { theme } = useContext(ThemeCtx)
  return <div className="rounded-lg px-3 py-2 text-xs font-mono transition-colors" style={{ background: theme === 'dark' ? '#0a0a18' : '#f1f5f9', color: theme === 'dark' ? '#61dafb' : '#6366f1', border: '1px solid rgba(255,255,255,0.1)' }}>Deep child reads context: theme = "{theme}"</div>
}
export function UseContextDemo() {
  const [theme, setTheme] = useState('dark')
  return (
    <ThemeCtx.Provider value={{ theme, toggle: () => setTheme(t => t === 'dark' ? 'light' : 'dark') }}>
      <div className="flex flex-col gap-3">
        <div className="rounded-xl p-3 border border-react/20 bg-react/05">
          <div className="text-[10px] text-react font-semibold mb-2">Provider</div>
          <div className="ml-3 rounded-lg p-2 border border-white/10 bg-white/02">
            <div className="text-[10px] text-white/40 mb-2">↓ no props passed ↓</div>
            <DeepChild />
          </div>
        </div>
        <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} className="btn-primary text-xs self-start">Toggle theme via context</button>
        <p className="text-xs text-white/40">The deep child reads <code className="text-react">useContext(ThemeCtx)</code> directly — no props threaded through intermediate components (no "prop drilling").</p>
      </div>
    </ThemeCtx.Provider>
  )
}

// ─── useReducer: todo state machine ──────────────────────────────────────────
interface Todo { id: number; text: string; done: boolean }
type Action = { type: 'add'; text: string } | { type: 'toggle'; id: number } | { type: 'remove'; id: number }
function reducer(state: Todo[], action: Action): Todo[] {
  switch (action.type) {
    case 'add': return [...state, { id: Date.now(), text: action.text, done: false }]
    case 'toggle': return state.map(t => t.id === action.id ? { ...t, done: !t.done } : t)
    case 'remove': return state.filter(t => t.id !== action.id)
  }
}
export function UseReducerDemo() {
  const [todos, dispatch] = useReducer(reducer, [{ id: 1, text: 'Learn useReducer', done: false }])
  const [text, setText] = useState('')
  const [lastAction, setLastAction] = useState('init')
  function run(a: Action) { dispatch(a); setLastAction(a.type === 'add' ? `add "${a.text}"` : `${a.type}(${a.type !== 'add' ? a.id : ''})`) }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 text-xs">
        <span className="text-white/40">dispatch →</span>
        <motion.span key={lastAction} initial={{ scale: 1.2, color: '#61dafb' }} animate={{ scale: 1, color: '#94a3b8' }} className="font-mono px-2 py-0.5 rounded bg-react/10">{lastAction}</motion.span>
      </div>
      <div className="flex gap-2">
        <input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && text.trim()) { run({ type: 'add', text }); setText('') } }} placeholder="New todo…" className="flex-1 bg-bg/60 border border-border rounded-lg px-3 py-1.5 text-sm outline-none focus:border-react/50" />
        <button onClick={() => { if (text.trim()) { run({ type: 'add', text }); setText('') } }} className="btn-primary text-xs">add</button>
      </div>
      <div className="flex flex-col gap-1.5">
        <AnimatePresence>
          {todos.map(t => (
            <motion.div key={t.id} layout initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/03 border border-white/06">
              <button onClick={() => run({ type: 'toggle', id: t.id })} className="w-4 h-4 rounded border flex items-center justify-center text-[10px]" style={{ borderColor: t.done ? '#22c55e' : 'rgba(255,255,255,0.3)', background: t.done ? '#22c55e20' : 'transparent', color: '#22c55e' }}>{t.done && '✓'}</button>
              <span className={`flex-1 text-sm ${t.done ? 'line-through text-white/30' : 'text-white/75'}`}>{t.text}</span>
              <button onClick={() => run({ type: 'remove', id: t.id })} className="text-white/20 hover:text-red-400 text-xs">✕</button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <p className="text-xs text-white/40">Every change goes through <code className="text-react">dispatch(action)</code> → the reducer returns the next state. Predictable, Redux-style transitions.</p>
    </div>
  )
}

// ─── Custom hooks: useDebounce ───────────────────────────────────────────────
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => { const id = setTimeout(() => setDebounced(value), delay); return () => clearTimeout(id) }, [value, delay])
  return debounced
}
export function CustomHooksDemo() {
  const [input, setInput] = useState('')
  const debounced = useDebounce(input, 500)
  const [fetchState, setFetchState] = useState<'idle' | 'loading' | 'done'>('idle')

  useEffect(() => {
    if (!debounced) { setFetchState('idle'); return }
    setFetchState('loading')
    const id = setTimeout(() => setFetchState('done'), 700)
    return () => clearTimeout(id)
  }, [debounced])

  return (
    <div className="flex flex-col gap-3">
      <input value={input} onChange={e => setInput(e.target.value)} placeholder="Type to search…" className="bg-bg/60 border border-border rounded-lg px-3 py-1.5 text-sm outline-none focus:border-react/50" />
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-lg p-2 bg-white/03 border border-white/06"><div className="text-white/40 mb-1">live value</div><div className="font-mono text-white/70 truncate">{input || '—'}</div></div>
        <div className="rounded-lg p-2 bg-react/05 border border-react/20"><div className="text-react/70 mb-1">debounced (500ms)</div><div className="font-mono text-react truncate">{debounced || '—'}</div></div>
      </div>
      <div className="flex items-center gap-2 text-xs">
        <span className="text-white/40">useFetch:</span>
        {fetchState === 'idle' && <span className="text-white/30">idle</span>}
        {fetchState === 'loading' && <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 0.8 }} className="text-amber">● fetching…</motion.span>}
        {fetchState === 'done' && <motion.span initial={{ scale: 1.2 }} animate={{ scale: 1 }} className="text-green">✓ data loaded for "{debounced}"</motion.span>}
      </div>
      <p className="text-xs text-white/40"><code className="text-react">useDebounce</code> delays the value 500ms after typing stops, then <code className="text-react">useFetch</code> simulates a request — the classic search-as-you-type pattern.</p>
    </div>
  )
}
