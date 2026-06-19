import { motion } from 'framer-motion'
import type { ReactNode, CSSProperties } from 'react'

interface Props {
  children: ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
  delay?: number
  style?: CSSProperties
}

export function GlassCard({ children, className = '', hover, onClick, delay = 0, style }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      whileHover={hover ? { y: -4 } : undefined}
      onClick={onClick}
      style={style}
      className={`card ${hover ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </motion.div>
  )
}
