import { motion } from 'framer-motion'

export function Badge({ icon, name, description, earned, color = '#61dafb' }: { icon: string; name: string; description: string; earned: boolean; color?: string }) {
  return (
    <motion.div whileHover={{ scale: 1.05 }} className={`flex flex-col items-center gap-2 ${!earned ? 'opacity-40 grayscale' : ''}`} title={description}>
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border"
        style={{ background: earned ? `${color}20` : 'rgba(255,255,255,0.04)', borderColor: earned ? `${color}60` : 'rgba(255,255,255,0.08)', boxShadow: earned ? `0 0 20px ${color}30` : 'none' }}>
        {icon}
      </div>
      <span className="text-[11px] font-medium text-white/70 text-center leading-tight max-w-[72px]">{name}</span>
    </motion.div>
  )
}

export function DifficultyStars({ difficulty, color = '#61dafb' }: { difficulty: number; color?: string }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className="w-2 h-2 rounded-sm" style={{ background: i < difficulty ? color : 'rgba(255,255,255,0.12)' }} />
      ))}
    </div>
  )
}

export function Pill({ children, color = '#61dafb' }: { children: React.ReactNode; color?: string }) {
  return <span className="text-[10px] px-2 py-0.5 rounded-full border" style={{ borderColor: `${color}30`, color: `${color}cc` }}>{children}</span>
}
