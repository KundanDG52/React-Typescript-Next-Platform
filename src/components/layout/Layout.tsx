import { useEffect, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Navbar } from './Navbar'
import { ReactLogo } from './ReactLogo'
import { useStore } from '../../store'

export function Layout({ children }: { children: ReactNode }) {
  const loc = useLocation()
  const updateStreak = useStore(s => s.updateStreak)
  useEffect(() => { updateStreak() }, [updateStreak])

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div className="fixed top-1/4 -right-40 -z-10"><ReactLogo size={700} opacity={0.04} /></div>
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main key={loc.pathname}
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: 'easeOut' }} className="flex-1 pt-14">
          {children}
        </motion.main>
      </AnimatePresence>
    </div>
  )
}
