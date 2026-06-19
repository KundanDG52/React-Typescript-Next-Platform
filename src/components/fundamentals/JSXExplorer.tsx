import { useState } from 'react'
import { motion } from 'framer-motion'
import { CodeBlock } from '../shared/CodeBlock'

const SAMPLES = [
  {
    label: 'Element',
    jsx: `<h1 className="title">Hello</h1>`,
    js: `React.createElement(
  "h1",
  { className: "title" },
  "Hello"
)`,
  },
  {
    label: 'Nested',
    jsx: `<div className="card">
  <h2>Title</h2>
  <p>Body text</p>
</div>`,
    js: `React.createElement(
  "div",
  { className: "card" },
  React.createElement("h2", null, "Title"),
  React.createElement("p", null, "Body text")
)`,
  },
  {
    label: 'Component + props',
    jsx: `<Button onClick={save} primary>
  Save
</Button>`,
    js: `React.createElement(
  Button,
  { onClick: save, primary: true },
  "Save"
)`,
  },
]

export function JSXExplorer() {
  const [i, setI] = useState(0)
  const s = SAMPLES[i]
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        {SAMPLES.map((x, idx) => (
          <button key={x.label} onClick={() => setI(idx)} className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{ background: i === idx ? '#61dafb20' : 'rgba(255,255,255,0.05)', border: i === idx ? '1px solid #61dafb50' : '1px solid transparent', color: i === idx ? '#61dafb' : 'rgba(255,255,255,0.5)' }}>
            {x.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <motion.div key={`jsx${i}`} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
          <span className="text-[10px] uppercase tracking-wider text-react font-semibold mb-1 block">JSX</span>
          <CodeBlock code={s.jsx} />
        </motion.div>
        <motion.div key={`js${i}`} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
          <span className="text-[10px] uppercase tracking-wider text-purple font-semibold mb-1 block">Compiled JS</span>
          <CodeBlock code={s.js} />
        </motion.div>
      </div>
      <p className="text-xs text-white/40">JSX is syntactic sugar — Babel compiles every tag into a <code className="text-react">React.createElement(type, props, ...children)</code> call that returns a plain JS object (a React element).</p>
    </div>
  )
}
