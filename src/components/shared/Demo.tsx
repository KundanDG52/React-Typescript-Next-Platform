import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { CodeBlock } from './CodeBlock'

/** Split-pane: concept/explanation (left) + live demo (right) */
export function SplitDemo({ title, description, code, children, color = '#61dafb', delay = 0 }: {
  title: string; description?: ReactNode; code?: string; children: ReactNode; color?: string; delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.4, delay }}
      className="card rounded-2xl overflow-hidden"
    >
      <div className="px-5 py-3 border-b border-white/5 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
        <h3 className="font-bold text-sm" style={{ color }}>{title}</h3>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="p-5 border-b lg:border-b-0 lg:border-r border-white/5 flex flex-col gap-3">
          {description && <div className="text-sm text-white/55 leading-relaxed">{description}</div>}
          {code && <CodeBlock code={code} />}
        </div>
        <div className="p-5 flex flex-col gap-3 bg-white/[0.015]">
          <span className="text-[10px] uppercase tracking-wider text-white/30 font-semibold">Live Demo</span>
          {children}
        </div>
      </div>
    </motion.div>
  )
}

export function TrackHeader({ icon, name, sub, color }: { icon: string; name: string; sub: string; color: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl" style={{ background: `${color}15`, border: `1px solid ${color}30` }}>{icon}</div>
      <div>
        <h1 className="text-2xl font-black">{name}</h1>
        <p className="text-white/40 text-sm">{sub}</p>
      </div>
    </motion.div>
  )
}
