import { motion } from 'framer-motion'

interface Props { percent: number; size?: number; stroke?: number; color?: string; label?: string; sublabel?: string }

export function ProgressRing({ percent, size = 80, stroke = 6, color = '#61dafb', label, sublabel }: Props) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const offset = c - (percent / 100) * c
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} fill="none" />
        <motion.circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke} fill="none" strokeLinecap="round"
          strokeDasharray={c} initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }} style={{ filter: `drop-shadow(0 0 6px ${color}80)` }} />
      </svg>
      {label && (
        <div className="absolute flex flex-col items-center">
          <span className="text-sm font-bold">{label}</span>
          {sublabel && <span className="text-[10px] text-white/50">{sublabel}</span>}
        </div>
      )}
    </div>
  )
}
