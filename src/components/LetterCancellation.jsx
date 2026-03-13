import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function LetterCancellation({ data, name1, name2, onDone }) {
  const [cancelledIndices1, setCancelledIndices1] = useState([])
  const [cancelledIndices2, setCancelledIndices2] = useState([])
  const [showCount, setShowCount] = useState(false)

  if (!data) return null

  const remainingCount = data.name1Remaining.length + data.name2Remaining.length

  useEffect(() => {
    // Animate cancellation one pair at a time
    const pairs = []
    const bUsed = new Array(data.name2Letters.length).fill(false)

    for (let i = 0; i < data.name1Letters.length; i++) {
      if (data.name1Used[i]) {
        for (let j = 0; j < data.name2Letters.length; j++) {
          if (!bUsed[j] && data.name2Used[j] && data.name1Letters[i] === data.name2Letters[j]) {
            pairs.push({ i1: i, i2: j })
            bUsed[j] = true
            break
          }
        }
      }
    }

    let step = 0
    const timer = setInterval(() => {
      if (step < pairs.length) {
        const { i1, i2 } = pairs[step]
        step++
        setCancelledIndices1(prev => [...prev, i1])
        setCancelledIndices2(prev => [...prev, i2])
      } else {
        clearInterval(timer)
        setShowCount(true)
        setTimeout(onDone, 1500)
      }
    }, 400)

    return () => clearInterval(timer)
  }, [])

  const renderLetters = (letters, usedArr, cancelledSet) => (
    <div className="flex flex-wrap justify-center gap-1">
      {letters.map((letter, i) => {
        const isCancelled = cancelledSet.includes(i)
        return (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: isCancelled ? 0.3 : 1,
              y: 0,
              scale: isCancelled ? 0.8 : 1,
            }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            className={`inline-flex items-center justify-center w-9 h-9 rounded-lg text-lg font-bold transition-all duration-300 ${
              isCancelled
                ? 'bg-red-500/30 text-red-300 line-through'
                : 'bg-white/15 text-white'
            }`}
            style={!isCancelled && usedArr[i] === false ? { textShadow: '0 0 8px currentColor' } : {}}
          >
            {letter.toUpperCase()}
          </motion.span>
        )
      })}
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      className="text-center"
    >
      <h2 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: 'Dancing Script' }}>
        Cancelling Letters...
      </h2>

      <div className="mb-4">
        <p className="text-white/60 text-sm mb-2">{name1}</p>
        {renderLetters(data.name1Letters, data.name1Used, cancelledIndices1)}
      </div>

      <div className="text-white/40 text-xl my-3">{'\u2764\uFE0F'}</div>

      <div className="mb-6">
        <p className="text-white/60 text-sm mb-2">{name2}</p>
        {renderLetters(data.name2Letters, data.name2Used, cancelledIndices2)}
      </div>

      {showCount && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mt-4"
        >
          <span className="text-white/70 text-sm">Remaining letters: </span>
          <span className="text-2xl font-bold text-pink-400 glow-text">{remainingCount}</span>
        </motion.div>
      )}
    </motion.div>
  )
}
