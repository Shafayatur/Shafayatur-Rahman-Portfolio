'use client'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onComplete, 500)
    }, 1800)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="preloader"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="preloader-logo">AC</div>
          <div className="preloader-bar">
            <div className="preloader-bar-fill" />
          </div>
          <p style={{ color: 'rgba(232,232,232,0.4)', fontSize: '0.75rem', letterSpacing: '0.1em' }}>
            LOADING
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
