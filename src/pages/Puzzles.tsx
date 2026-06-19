import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, Zap } from 'lucide-react'
import { TrackHeader } from '../components/shared/Demo'
import { CodeBlock } from '../components/shared/CodeBlock'
import { useStore } from '../store'

interface Puzzle {
  id: string
  title: string
  tag: string
  code: string
  question: string
  options: string[]
  answer: number
  explanation: string
}

const PUZZLES: Puzzle[] = [
  {
    id: 'p1', title: 'Predict the output', tag: 'useState',
    code: `function App() {
  const [n, setN] = useState(0)
  function click() {
    setN(n + 1)
    setN(n + 1)
    setN(n + 1)
  }
  return <button onClick={click}>{n}</button>
}`,
    question: 'After one click, what is n?',
    options: ['3', '1', '0', '2'],
    answer: 1,
    explanation: 'All three calls read the same stale `n` (0) from the render closure, so each sets n to 1. Use the functional form setN(c => c + 1) to get 3.',
  },
  {
    id: 'p2', title: 'Fix the broken hook', tag: 'Rules of Hooks',
    code: `function Profile({ user }) {
  if (!user) return null
  const [name, setName] = useState(user.name) // ⚠️
  return <input value={name} />
}`,
    question: 'Why is this broken?',
    options: [
      'useState is called conditionally (after an early return)',
      'You can\'t pass props to useState',
      'Missing dependency array',
      'Nothing is wrong',
    ],
    answer: 0,
    explanation: 'Hooks must run in the same order every render. The early return makes useState conditional, violating the Rules of Hooks. Move the hook above the if.',
  },
  {
    id: 'p3', title: 'Trace the re-renders', tag: 'React.memo',
    code: `const Child = React.memo(({ onClick }) => <button onClick={onClick}>X</button>)

function Parent() {
  const [n, setN] = useState(0)
  const handle = () => {}          // new fn each render
  return <><span>{n}</span><Child onClick={handle} /></>
}`,
    question: 'Does Child re-render when n changes?',
    options: [
      'No — it\'s wrapped in memo',
      'Yes — handle is a new reference every render',
      'Only on first render',
      'Never',
    ],
    answer: 1,
    explanation: '`handle` is recreated each render, so its reference changes and memo\'s shallow prop check fails. Wrap it in useCallback(handle, []) to keep it stable.',
  },
  {
    id: 'p4', title: 'useEffect dependency', tag: 'useEffect',
    code: `useEffect(() => {
  const id = setInterval(() => {
    setCount(count + 1)
  }, 1000)
  return () => clearInterval(id)
}, []) // empty deps`,
    question: 'What happens to count?',
    options: [
      'Increments forever correctly',
      'Stops at 1 — stale closure over count',
      'Throws an error',
      'Never starts',
    ],
    answer: 1,
    explanation: 'With empty deps the effect captures count=0 once. It keeps setting count to 1. Fix: setCount(c => c + 1) so it doesn\'t depend on the closed-over value.',
  },
  {
    id: 'p5', title: 'Key prop importance', tag: 'Reconciliation',
    code: `{todos.map((todo, i) =>
  <TodoItem key={i} todo={todo} />
)}
// list gets reordered + items have local state`,
    question: 'What\'s the bug with key={i}?',
    options: [
      'Index keys are always fine',
      'State attaches to position, not item — wrong item state after reorder',
      'It causes a crash',
      'Keys must be strings',
    ],
    answer: 1,
    explanation: 'Index keys tie identity to position. After reordering, React reuses the DOM/state at each index, so a item\'s local state "sticks" to the wrong todo. Use a stable key={todo.id}.',
  },
]

function PuzzleCard({ puzzle, index }: { puzzle: Puzzle; index: number }) {
  const [selected, setSelected] = useState<number | null>(null)
  const { solvePuzzle, solvedPuzzles } = useStore()
  const alreadySolved = solvedPuzzles.includes(puzzle.id)
  const [revealed, setRevealed] = useState(false)

  function pick(i: number) {
    if (revealed) return
    setSelected(i); setRevealed(true)
    if (i === puzzle.answer && !alreadySolved) solvePuzzle(puzzle.id)
  }

  const correct = selected === puzzle.answer

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }} className="card rounded-2xl overflow-hidden">
      <div className="px-5 py-3 border-b border-white/5 flex items-center gap-2">
        <span className="w-6 h-6 rounded-lg bg-react/15 text-react flex items-center justify-center text-xs font-bold">{index + 1}</span>
        <h3 className="font-bold text-sm">{puzzle.title}</h3>
        <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-purple/15 text-purple border border-purple/30">{puzzle.tag}</span>
        {alreadySolved && <span className="text-[10px] text-green flex items-center gap-1"><Check size={10} /> solved</span>}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="p-5 border-b lg:border-b-0 lg:border-r border-white/5"><CodeBlock code={puzzle.code} /></div>
        <div className="p-5 flex flex-col gap-3">
          <p className="text-sm font-medium text-white/80">{puzzle.question}</p>
          <div className="flex flex-col gap-2">
            {puzzle.options.map((opt, i) => {
              const isAnswer = i === puzzle.answer
              const isPicked = selected === i
              let cls = 'border-white/08 bg-white/03 hover:bg-white/06 text-white/70'
              if (revealed && isAnswer) cls = 'border-green/50 bg-green/10 text-green'
              else if (revealed && isPicked && !isAnswer) cls = 'border-red-500/50 bg-red-500/10 text-red-400'
              return (
                <button key={i} onClick={() => pick(i)} disabled={revealed} className={`text-left px-3 py-2 rounded-lg text-xs border transition-all flex items-center gap-2 ${cls}`}>
                  <span className="font-mono text-[10px] opacity-50">{String.fromCharCode(65 + i)}</span>
                  <span className="flex-1">{opt}</span>
                  {revealed && isAnswer && <Check size={13} />}
                  {revealed && isPicked && !isAnswer && <X size={13} />}
                </button>
              )
            })}
          </div>
          <AnimatePresence>
            {revealed && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden">
                <div className={`rounded-lg p-3 text-xs leading-relaxed border ${correct ? 'border-green/30 bg-green/05 text-white/60' : 'border-amber/30 bg-amber/05 text-white/60'}`}>
                  <span className={`font-semibold ${correct ? 'text-green' : 'text-amber'}`}>{correct ? '✓ Correct! +50 XP' : 'Explanation:'} </span>
                  {puzzle.explanation}
                </div>
                {!correct && <button onClick={() => { setRevealed(false); setSelected(null) }} className="btn-ghost text-xs mt-2">Try again</button>}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

export function Puzzles() {
  const solved = useStore(s => s.solvedPuzzles.length)
  return (
    <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col gap-6">
      <TrackHeader icon="🧠" name="Puzzles & Exercises" sub="Predict output • fix the hook • trace re-renders" color="#f59e0b" />
      <div className="flex items-center gap-2 text-sm text-white/50">
        <Zap size={14} className="text-react" /> {solved}/{PUZZLES.length} solved · earn 50 XP each
      </div>
      {PUZZLES.map((p, i) => <PuzzleCard key={p.id} puzzle={p} index={i} />)}
    </div>
  )
}
