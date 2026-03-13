import { Canvas } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import FloatingObjects from './FloatingObjects'
import ParticleField from './ParticleField'
import MouseTracker from './MouseTracker'

export default function Scene({ resultTheme }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 60 }}
      dpr={[1, 2]}
      style={{ background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' }}
    >
      <ambientLight intensity={0.3} />
      <MouseTracker resultTheme={resultTheme} />
      <FloatingObjects resultTheme={resultTheme} />
      <ParticleField resultTheme={resultTheme} />
      <Stars radius={50} depth={50} count={2000} factor={4} fade speed={1} />
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          intensity={0.8}
        />
      </EffectComposer>
    </Canvas>
  )
}
