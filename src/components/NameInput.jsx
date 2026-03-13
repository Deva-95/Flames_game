import { motion } from 'framer-motion'

export default function NameInput({ name1, name2, onName1Change, onName2Change, onSubmit }) {
  const isValid = name1.trim().length > 0 && name2.trim().length > 0

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && isValid) onSubmit()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5 }}
    >
      <h1
        className="text-5xl font-bold text-white text-center mb-2"
        style={{ fontFamily: 'Dancing Script' }}
      >
        FLAMES
      </h1>
      <p className="text-white/60 text-center mb-8 text-sm">
        Discover your relationship destiny
      </p>

      <input
        type="text"
        placeholder="Enter first name"
        value={name1}
        onChange={(e) => onName1Change(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full bg-white/10 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/40 mb-4 focus:border-pink-400 focus:outline-none transition-colors text-center text-lg"
      />

      <motion.div
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        className="text-3xl text-center my-3"
      >
        {'\u{1F497}'}
      </motion.div>

      <input
        type="text"
        placeholder="Enter second name"
        value={name2}
        onChange={(e) => onName2Change(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full bg-white/10 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/40 mb-6 focus:border-pink-400 focus:outline-none transition-colors text-center text-lg"
      />

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onSubmit}
        disabled={!isValid}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold text-lg shadow-lg disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-opacity"
      >
        Find Your Flame {'\u{1F525}'}
      </motion.button>
    </motion.div>
  )
}
