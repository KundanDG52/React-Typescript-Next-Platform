import { useState } from 'react'
import { motion } from 'framer-motion'

interface VNode { tag: string; text: string; key: string }

function makeTree(count: number, label: string): VNode[] {
  return Array.from({ length: count }, (_, i) => ({ tag: 'li', text: `${label} item ${i + 1}`, key: `k${i}` }))
}

export function VirtualDOM() {
  const [tree, setTree] = useState<VNode[]>(makeTree(3, 'Todo'))
  const [changed, setChanged] = useState<number[]>([])

  function reRender() {
    // simulate: update item 2's text, add a new item → only those nodes "diff"
    setTree(prev => {
      const next = prev.map((n, i) => i === 1 ? { ...n, text: `Todo item 2 (edited)` } : n)
      next.push({ tag: 'li', text: `Todo item ${next.length + 1}`, key: `k${next.length}` })
      return next
    })
    setChanged([1, tree.length]) // edited index + appended index
    setTimeout(() => setChanged([]), 1500)
  }

  function resetTree() { setTree(makeTree(3, 'Todo')); setChanged([]) }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        {[{ t: 'Virtual DOM', c: '#61dafb' }, { t: 'Real DOM', c: '#22c55e' }].map(col => (
          <div key={col.t}>
            <span className="text-[10px] uppercase tracking-wider font-semibold mb-2 block" style={{ color: col.c }}>{col.t}</span>
            <div className="rounded-xl p-3 border space-y-1.5" style={{ borderColor: `${col.c}25`, background: `${col.c}06`, minHeight: 160 }}>
              <div className="text-xs font-mono text-white/40">&lt;ul&gt;</div>
              {tree.map((n, i) => {
                const isDiff = changed.includes(i)
                return (
                  <motion.div key={n.key} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1, backgroundColor: isDiff ? `${col.c}30` : 'rgba(255,255,255,0.02)' }}
                    className="ml-4 px-2 py-1 rounded-md text-xs font-mono flex items-center gap-2 border"
                    style={{ borderColor: isDiff ? col.c : 'transparent' }}>
                    <span className="text-white/30">&lt;li&gt;</span>
                    <span style={{ color: isDiff ? col.c : 'rgba(255,255,255,0.7)' }}>{n.text}</span>
                    {isDiff && <span className="ml-auto text-[9px] font-bold" style={{ color: col.c }}>● patched</span>}
                  </motion.div>
                )
              })}
              <div className="text-xs font-mono text-white/40">&lt;/ul&gt;</div>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-white/45 leading-relaxed">React builds a new Virtual DOM on each render, <span className="text-react">diffs</span> it against the previous one, and patches <span className="text-green">only the changed nodes</span> into the real DOM. Unchanged nodes are skipped entirely.</p>
      <div className="flex gap-2">
        <button onClick={reRender} className="btn-primary text-xs">Trigger Re-render</button>
        <button onClick={resetTree} className="btn-ghost text-xs">Reset</button>
      </div>
    </div>
  )
}
