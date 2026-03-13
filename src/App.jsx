import { useState } from 'react'
import Scene from './three/Scene'
import FlamesGame from './components/FlamesGame'

export default function App() {
  const [resultTheme, setResultTheme] = useState(null)

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* 3D Background — receives pointer events for mouse tracking */}
      <div className="fixed inset-0 z-0">
        <Scene resultTheme={resultTheme} />
      </div>

      {/* Game UI Overlay — pointer-events only on the card itself */}
      <div className="relative z-10 flex items-center justify-center min-h-screen" style={{ pointerEvents: 'none' }}>
        <div style={{ pointerEvents: 'auto' }}>
          <FlamesGame onResultChange={setResultTheme} />
        </div>
      </div>
    </div>
  )
}
