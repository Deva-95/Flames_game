import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const FLAMES_COLORS = {
  F: '#3b82f6',
  L: '#ef4444',
  A: '#ec4899',
  M: '#f59e0b',
  E: '#7c3aed',
  S: '#10b981',
}

export default function FlamesWheel({ flamesData, remainingCount, onDone }) {
  const [activeLetters, setActiveLetters] = useState(['F', 'L', 'A', 'M', 'E', 'S'])
  const [highlightIndex, setHighlightIndex] = useState(-1)
  const [eliminating, setEliminating] = useState(null)
  const [stepIndex, setStepIndex] = useState(-1)
  const timeoutRefs = useRef([])

  useEffect(() => {
    // Clean up on unmount
    return () => timeoutRefs.current.forEach(t => clearTimeout(t))
  }, [])

  useEffect(() => {
    let currentLetters = ['F', 'L', 'A', 'M', 'E', 'S']
    let currentIndex = 0
    let delay = 500

    const playStep = (si) => {
      if (si >= flamesData.steps.length) {
        const t = setTimeout(onDone, 800)
        timeoutRefs.current.push(t)
        return
      }

      const step = flamesData.steps[si]
      // Animate counting through letters
      const count = remainingCount
      let tick = 0

      const tickInterval = setInterval(() => {
        if (tick < count) {
          const idx = (currentIndex + tick) % currentLetters.length
          setHighlightIndex(idx)
          tick++
        } else {
          clearInterval(tickInterval)
          const elimIdx = (currentIndex + count - 1) % currentLetters.length
          setEliminating(currentLetters[elimIdx])

          const t1 = setTimeout(() => {
            currentLetters = currentLetters.filter((_, i) => i !== elimIdx)
            setActiveLetters([...currentLetters])
            setEliminating(null)
            setHighlightIndex(-1)
            setStepIndex(si)

            // Update starting index
            currentIndex = elimIdx >= currentLetters.length ? 0 : elimIdx

            const t2 = setTimeout(() => playStep(si + 1), 400)
            timeoutRefs.current.push(t2)
          }, 500)
          timeoutRefs.current.push(t1)
        }
      }, 150)

      timeoutRefs.current.push(tickInterval)
    }

    const t = setTimeout(() => playStep(0), 600)
    timeoutRefs.current.push(t)
  }, [])

  const radius = 100

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="text-center"
    >
      <h2 className="text-2xl font-bold text-white mb-8" style={{ fontFamily: 'Dancing Script' }}>
        F.L.A.M.E.S
      </h2>

      <div className="relative mx-auto" style={{ width: radius * 2 + 60, height: radius * 2 + 60 }}>
        <AnimatePresence>
          {activeLetters.map((letter, i) => {
            const angle = (i / activeLetters.length) * Math.PI * 2 - Math.PI / 2
            const x = Math.cos(angle) * radius + radius + 10
            const y = Math.sin(angle) * radius + radius + 10
            const isHighlighted = i === highlightIndex
            const isEliminating = letter === eliminating

            return (
              <motion.div
                key={letter}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: isEliminating ? [1, 1.3, 0] : isHighlighted ? 1.2 : 1,
                  opacity: isEliminating ? [1, 1, 0] : 1,
                  x: x,
                  y: y,
                }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: isEliminating ? 0.5 : 0.2 }}
                className="absolute flex items-center justify-center w-12 h-12 rounded-full text-xl font-bold text-white shadow-lg"
                style={{
                  backgroundColor: FLAMES_COLORS[letter],
                  boxShadow: isHighlighted
                    ? `0 0 20px ${FLAMES_COLORS[letter]}, 0 0 40px ${FLAMES_COLORS[letter]}`
                    : `0 0 10px ${FLAMES_COLORS[letter]}50`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {letter}
              </motion.div>
            )
          })}
        </AnimatePresence>

        {/* Center text */}
        <div
          className="absolute flex items-center justify-center text-white/40 text-sm font-medium"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          {activeLetters.length > 1 ? `Count: ${remainingCount}` : ''}
        </div>
      </div>
    </motion.div>
  )
}
