import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import NameInput from './NameInput'
import LetterCancellation from './LetterCancellation'
import FlamesWheel from './FlamesWheel'
import ResultReveal from './ResultReveal'
import { cancelCommonLetters, runFlames } from '../utils/flamesLogic'
import { resultThemes } from '../utils/resultThemes'

export default function FlamesGame({ onResultChange }) {
  const [phase, setPhase] = useState('input')
  const [name1, setName1] = useState('')
  const [name2, setName2] = useState('')
  const [cancellationData, setCancellationData] = useState(null)
  const [flamesData, setFlamesData] = useState(null)
  const [remainingCount, setRemainingCount] = useState(0)
  const [resultChar, setResultChar] = useState(null)

  const handleSubmit = () => {
    if (!name1.trim() || !name2.trim()) return

    const data = cancelCommonLetters(name1, name2)
    setCancellationData(data)
    const count = data.name1Remaining.length + data.name2Remaining.length

    if (count === 0) {
      // Same name edge case — skip to a special result
      setResultChar('L')
      setPhase('result')
      onResultChange(resultThemes['L'])
      return
    }

    setRemainingCount(count)
    const flames = runFlames(count)
    setFlamesData(flames)
    setResultChar(flames.resultChar)
    setPhase('cancelling')
  }

  const handleCancellationDone = () => {
    setPhase('cycling')
  }

  const handleCyclingDone = () => {
    setPhase('result')
    onResultChange(resultThemes[resultChar])
  }

  const handleReset = () => {
    setPhase('input')
    setName1('')
    setName2('')
    setCancellationData(null)
    setFlamesData(null)
    setResultChar(null)
    setRemainingCount(0)
    onResultChange(null)
  }

  return (
    <div className="glass rounded-3xl p-8 shadow-2xl max-w-md w-full mx-4"
      style={{ minHeight: 380 }}
    >
      <AnimatePresence mode="wait">
        {phase === 'input' && (
          <NameInput
            key="input"
            name1={name1}
            name2={name2}
            onName1Change={setName1}
            onName2Change={setName2}
            onSubmit={handleSubmit}
          />
        )}
        {phase === 'cancelling' && cancellationData && (
          <LetterCancellation
            key="cancel"
            data={cancellationData}
            name1={name1}
            name2={name2}
            onDone={handleCancellationDone}
          />
        )}
        {phase === 'cycling' && flamesData && (
          <FlamesWheel
            key="wheel"
            flamesData={flamesData}
            remainingCount={remainingCount}
            onDone={handleCyclingDone}
          />
        )}
        {phase === 'result' && resultChar && (
          <ResultReveal
            key="result"
            resultChar={resultChar}
            name1={name1}
            name2={name2}
            onReset={handleReset}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
