import { motion } from 'framer-motion'
import { resultThemes } from '../utils/resultThemes'

export default function ResultReveal({ resultChar, name1, name2, onReset }) {
  const theme = resultThemes[resultChar]
  if (!theme) return null

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      className="text-center"
    >
      <motion.div
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        className="text-7xl mb-4"
      >
        {theme.emoji}
      </motion.div>

      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-5xl font-bold mb-2 glow-text"
        style={{
          fontFamily: 'Dancing Script',
          color: theme.bgColor,
        }}
      >
        {theme.label}
      </motion.h2>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-white/70 text-lg mb-2"
      >
        {theme.description}
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-white/50 text-sm mb-8"
      >
        {name1} & {name2}
      </motion.p>

      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onReset}
        className="px-8 py-3 rounded-xl bg-white/15 border border-white/25 text-white font-semibold hover:bg-white/25 transition-colors cursor-pointer"
      >
        Play Again {'\u2728'}
      </motion.button>
    </motion.div>
  )
}
