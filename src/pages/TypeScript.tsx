import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { SplitDemo, TrackHeader } from '../components/shared/Demo'
import { useStore } from '../store'
import { TypeInspector, TypeVsInterface, UnionIntersection } from '../components/typescript/TypeBasics'
import { NarrowingGuards, Exhaustiveness } from '../components/typescript/Narrowing'
import { GenericFlow, StackDemo, Constraints } from '../components/typescript/Generics'
import { UtilityTransformer } from '../components/typescript/UtilityTypes'
import { TemplateLiteral, ConditionalType, MappedType, Decorators } from '../components/typescript/AdvancedTypes'
import { DiscriminatedProps, EventTypes, TsconfigExplorer } from '../components/typescript/ReactConfig'

const TS = '#3178c6'

function ModuleHead({ n, title }: { n: string; title: string }) {
  return (
    <motion.div initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex items-center gap-3 mt-4">
      <span className="font-mono text-xs font-bold px-2 py-1 rounded" style={{ background: `${TS}20`, color: TS }}>{n}</span>
      <h2 className="text-lg font-bold text-white">{title}</h2>
      <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${TS}40, transparent)` }} />
    </motion.div>
  )
}

// ─── Inference puzzles ───────────────────────────────────────────────────────
const PUZZLES = [
  { id: 'ts-infer-1', q: 'const x = "hello" — what type does TS infer for x?', code: 'const x = "hello"', options: ['string', '"hello"', 'any', 'String'], answer: 1, explain: 'const bindings infer the narrow literal type "hello", not the widened string. Use let to widen.' },
  { id: 'ts-infer-2', q: 'What is the return type of: <T>(arr: T[]) => arr[0]?', code: 'function first<T>(arr: T[]) {\n  return arr[0]\n}\nfirst([1, 2, 3])', options: ['T', 'number', 'number[]', 'unknown'], answer: 1, explain: 'T is inferred as number from [1,2,3], so arr[0] — and the return — is number.' },
  { id: 'ts-infer-3', q: 'After `if (typeof x === "number")`, what is x inside the block if x: string | number?', code: 'function f(x: string | number) {\n  if (typeof x === "number") {\n    // x: ???\n  }\n}', options: ['string | number', 'number', 'string', 'never'], answer: 1, explain: 'The typeof guard narrows x to number inside the block via control-flow analysis.' },
]
function InferencePuzzle({ p, i }: { p: typeof PUZZLES[number]; i: number }) {
  const { solvePuzzle, solvedPuzzles, checkAchievement } = useStore()
  const done = solvedPuzzles.includes(p.id)
  const [sel, setSel] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  function pick(idx: number) { if (revealed) return; setSel(idx); setRevealed(true); if (idx === p.answer) { if (!done) solvePuzzle(p.id); checkAchievement('inference_master') } }
  const correct = sel === p.answer
  return (
    <div className="card rounded-2xl overflow-hidden">
      <div className="px-4 py-2 border-b border-white/5 flex items-center gap-2" style={{ background: `${TS}08` }}>
        <span className="w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center" style={{ background: `${TS}20`, color: TS }}>{i + 1}</span>
        <span className="text-xs font-semibold" style={{ color: TS }}>infer the type</span>
        {done && <span className="ml-auto text-[10px] text-emerald-400 flex items-center gap-1"><Check size={10} /> solved</span>}
      </div>
      <div className="p-4 flex flex-col gap-3">
        <pre className="code-block text-xs text-white/75 whitespace-pre-wrap">{p.code}</pre>
        <p className="text-sm text-white/80">{p.q}</p>
        <div className="flex flex-col gap-1.5">
          {p.options.map((o, idx) => {
            const isA = idx === p.answer, isP = sel === idx
            let cls = 'border-white/08 text-white/65 hover:border-white/30'
            if (revealed && isA) cls = 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
            else if (revealed && isP && !isA) cls = 'border-red-500/50 bg-red-500/10 text-red-400'
            return <button key={idx} onClick={() => pick(idx)} disabled={revealed} className={`text-left px-3 py-2 rounded-lg text-xs border font-mono transition-all flex items-center gap-2 ${cls}`}><span className="flex-1">{o}</span>{revealed && isA && <Check size={12} />}{revealed && isP && !isA && <X size={12} />}</button>
          })}
        </div>
        <AnimatePresence>{revealed && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden"><div className="rounded-lg p-2.5 text-xs border" style={{ borderColor: correct ? '#22c55e30' : `${TS}30`, background: correct ? '#22c55e0a' : `${TS}0a`, color: 'rgba(255,255,255,0.6)' }}><span className="font-semibold" style={{ color: correct ? '#22c55e' : TS }}>{correct ? '✓ +50 XP — ' : 'Answer: '}</span>{p.explain}</div>{!correct && <button onClick={() => { setRevealed(false); setSel(null) }} className="btn-ghost text-xs mt-2">try again</button>}</motion.div>}</AnimatePresence>
      </div>
    </div>
  )
}

export function TypeScriptTrack() {
  const { completeTrack, addXP } = useStore()
  useEffect(() => { addXP(10); completeTrack('typescript') }, [])

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col gap-5">
      <TrackHeader icon="🔷" name="TypeScript Mastery" sub="Type system · narrowing · generics · utility & advanced types · decorators · TS + React" color={TS} />

      <ModuleHead n="M1" title="Type System Fundamentals" />
      <SplitDemo title="Type Inspector — inference" color={TS} description="Hover any expression to see the type TypeScript infers — no annotations required."><TypeInspector /></SplitDemo>
      <SplitDemo title="type vs interface" color={TS} delay={0.05} description="Two ways to name a shape. Toggle to compare their distinct capabilities."><TypeVsInterface /></SplitDemo>
      <SplitDemo title="Union & Intersection" color={TS} delay={0.1} description="A | B accepts either; A & B requires both. Watch the Venn regions and resulting members."><UnionIntersection /></SplitDemo>

      <ModuleHead n="M2" title="Type Narrowing & Control Flow" />
      <SplitDemo title="Narrowing guards" color={TS} description="typeof, instanceof, in, and custom predicates each shrink the type within a branch."><NarrowingGuards /></SplitDemo>
      <SplitDemo title="Exhaustiveness check" color={TS} delay={0.05} description="A never-assignment in default makes the compiler force you to handle every case."><Exhaustiveness /></SplitDemo>

      <ModuleHead n="M3" title="Generics" />
      <SplitDemo title="Generic functions" color={TS} description="A type parameter <T> flows from the argument to the return type, inferred per call."><GenericFlow /></SplitDemo>
      <SplitDemo title="Generic class — Stack<T>" color={TS} delay={0.05} description="The element type is fixed at instantiation and enforced on every operation."><StackDemo /></SplitDemo>
      <SplitDemo title="Constraints — extends" color={TS} delay={0.1} description="extends restricts which types satisfy a parameter — a compile-time wall."><Constraints /></SplitDemo>

      <ModuleHead n="M4" title="Utility Types" />
      <SplitDemo title="Utility transformer" color={TS} description="Apply a built-in utility to a base type and watch the result transform field-by-field."><UtilityTransformer /></SplitDemo>

      <ModuleHead n="M5" title="Advanced Types" />
      <SplitDemo title="Template literal types" color={TS} description="Combine union slots into a cartesian product of string-literal types."><TemplateLiteral /></SplitDemo>
      <SplitDemo title="Conditional types & infer" color={TS} delay={0.05} description="T extends U ? X : Y branches at the type level; infer captures inner types."><ConditionalType /></SplitDemo>
      <SplitDemo title="Mapped types" color={TS} delay={0.1} description="Iterate keyof T and apply modifiers — the machinery behind Partial, Readonly, etc."><MappedType /></SplitDemo>

      <ModuleHead n="M6" title="Decorators & Metadata" />
      <SplitDemo title="Decorators" color={TS} description="Class, method & parameter decorators wrap targets to inject behavior (logging, DI)."><Decorators /></SplitDemo>

      <ModuleHead n="M7" title="TypeScript + React Patterns" />
      <SplitDemo title="Discriminated union props" color={TS} description="A variant discriminator makes a component's props conditional and type-safe."><DiscriminatedProps /></SplitDemo>
      <SplitDemo title="Event & ref types" color={TS} delay={0.05} description="React's built-in event and ref generics give precise handler typing."><EventTypes /></SplitDemo>

      <ModuleHead n="M8" title="TypeScript Compiler & Config" />
      <SplitDemo title="tsconfig explorer" color={TS} description="Toggle compiler flags (or flip strict on) and watch type errors appear live."><TsconfigExplorer /></SplitDemo>

      <ModuleHead n="★" title="Inference Puzzles" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PUZZLES.map((p, i) => <InferencePuzzle key={p.id} p={p} i={i} />)}
      </div>
    </div>
  )
}
