import { useState } from 'react'
import { motion } from 'framer-motion'
import { CodeBlock } from '../shared/CodeBlock'

export function PropsState() {
  const [parentMsg, setParentMsg] = useState('Hello')
  const [mutateLog, setMutateLog] = useState<string[]>([])

  // immutable vs mutable demo
  const [arr, setArr] = useState([1, 2, 3])
  const [renderCount, setRenderCount] = useState(0)

  function mutateWrong() {
    arr.push(arr.length + 1) // mutates in place — same reference, no re-render guarantee
    setMutateLog(l => ['❌ arr.push() — same reference, React may skip render', ...l].slice(0, 4))
  }
  function updateRight() {
    setArr(prev => [...prev, prev.length + 1]) // new reference
    setRenderCount(c => c + 1)
    setMutateLog(l => ['✅ [...arr, x] — new reference, render triggered', ...l].slice(0, 4))
  }

  return (
    <div className="flex flex-col gap-5">
      {/* prop flow */}
      <div>
        <span className="text-[10px] uppercase tracking-wider text-react font-semibold mb-2 block">Props flow down: Parent → Child</span>
        <div className="flex items-center gap-3">
          <div className="rounded-xl p-3 border border-react/30 bg-react/05 flex-1">
            <div className="text-[10px] text-react font-semibold mb-1">Parent</div>
            <input value={parentMsg} onChange={e => setParentMsg(e.target.value)} className="w-full bg-bg/60 border border-border rounded-lg px-2 py-1 text-sm font-mono text-white outline-none focus:border-react/50" />
          </div>
          <motion.div animate={{ x: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-react text-xl">→</motion.div>
          <div className="rounded-xl p-3 border border-purple/30 bg-purple/05 flex-1">
            <div className="text-[10px] text-purple font-semibold mb-1">Child (props.msg)</div>
            <div className="bg-bg/60 border border-border rounded-lg px-2 py-1 text-sm font-mono text-white/80 truncate">{parentMsg}</div>
          </div>
        </div>
      </div>

      {/* mutable vs immutable */}
      <div>
        <span className="text-[10px] uppercase tracking-wider text-amber font-semibold mb-2 block">State updates: mutate vs immutable</span>
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <div className="font-mono text-sm text-white/70 bg-bg/60 rounded-lg px-3 py-1.5 border border-border">arr = [{arr.join(', ')}]</div>
          <span className="text-xs text-white/30">renders: {renderCount}</span>
        </div>
        <div className="flex gap-2 mb-2">
          <button onClick={mutateWrong} className="px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: '#ef444420', border: '1px solid #ef444450', color: '#f87171' }}>arr.push(x)</button>
          <button onClick={updateRight} className="px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: '#22c55e20', border: '1px solid #22c55e50', color: '#22c55e' }}>setArr([...arr, x])</button>
        </div>
        <div className="flex flex-col gap-1">
          {mutateLog.map((l, i) => <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs font-mono text-white/55">{l}</motion.div>)}
        </div>
      </div>

      <CodeBlock code={`// ❌ Mutation — React compares by reference, sees "same" array
arr.push(4)

// ✅ Immutable — new reference signals a real change
setArr(prev => [...prev, 4])`} />
    </div>
  )
}
