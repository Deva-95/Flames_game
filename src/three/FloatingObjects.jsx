import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function createHeartShape() {
  const shape = new THREE.Shape()
  const x = 0, y = 0
  shape.moveTo(x, y)
  shape.bezierCurveTo(x, y - 0.3, x - 0.5, y - 0.7, x - 1, y - 0.7)
  shape.bezierCurveTo(x - 1.7, y - 0.7, x - 1.7, y + 0.2, x - 1.7, y + 0.2)
  shape.bezierCurveTo(x - 1.7, y + 0.7, x - 1.2, y + 1.2, x, y + 1.7)
  shape.bezierCurveTo(x + 1.2, y + 1.2, x + 1.7, y + 0.7, x + 1.7, y + 0.2)
  shape.bezierCurveTo(x + 1.7, y + 0.2, x + 1.7, y - 0.7, x + 1, y - 0.7)
  shape.bezierCurveTo(x + 0.5, y - 0.7, x, y - 0.3, x, y)
  return shape
}

const heartShape = createHeartShape()
const heartGeometry = new THREE.ExtrudeGeometry(heartShape, {
  depth: 0.3,
  bevelEnabled: true,
  bevelSegments: 3,
  bevelSize: 0.1,
  bevelThickness: 0.1,
})

function FloatingObject({ position, scale, rotSpeed, floatSpeed, floatAmp, type, color, parallax, lerpRate }) {
  const ref = useRef()
  const offset = useMemo(() => Math.random() * Math.PI * 2, [])
  const smoothPos = useRef({ x: position[0], y: position[1] })
  const smoothRot = useRef({ x: 0, z: 0 })

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const mx = state.mouse.x
    const my = state.mouse.y

    // Target = base position + mouse parallax (front layers shift WAY more than back)
    const targetX = position[0] + mx * parallax
    const targetY = position[1] + my * parallax * 0.7 + Math.sin(t * floatSpeed + offset) * floatAmp

    // Smooth lerp — each layer tracks at its own speed (front=fast, back=laggy)
    smoothPos.current.x += (targetX - smoothPos.current.x) * lerpRate
    smoothPos.current.y += (targetY - smoothPos.current.y) * lerpRate

    ref.current.position.x = smoothPos.current.x
    ref.current.position.y = smoothPos.current.y

    // Base spin
    ref.current.rotation.y += rotSpeed * 0.01

    // Mouse-driven tilt — objects lean toward cursor
    const tiltScale = parallax / 2
    const targetRotX = my * 0.5 * tiltScale
    const targetRotZ = -mx * 0.4 * tiltScale
    smoothRot.current.x += (targetRotX - smoothRot.current.x) * 0.05
    smoothRot.current.z += (targetRotZ - smoothRot.current.z) * 0.05
    ref.current.rotation.x = smoothRot.current.x
    ref.current.rotation.z = smoothRot.current.z
  })

  return (
    <mesh ref={ref} position={position} scale={scale}>
      {type === 'heart' && <primitive object={heartGeometry.clone()} attach="geometry" />}
      {type === 'icosa' && <icosahedronGeometry args={[1, 0]} />}
      {type === 'torus' && <torusKnotGeometry args={[0.6, 0.2, 64, 16]} />}
      {type === 'octa' && <octahedronGeometry args={[1, 0]} />}
      {type === 'dodeca' && <dodecahedronGeometry args={[1, 0]} />}
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.3}
        transparent
        opacity={0.6}
        roughness={0.3}
        metalness={0.5}
      />
    </mesh>
  )
}

// 3 DEPTH LAYERS — creates "looking through a window" illusion
// FRONT (z:-1 to -2)  → parallax:2.2-3.0, lerpRate:0.07-0.10 (big fast shift)
// MIDDLE (z:-3 to -4) → parallax:1.0-1.4, lerpRate:0.04-0.05 (moderate)
// BACK (z:-5 to -7)   → parallax:0.2-0.35, lerpRate:0.015-0.02 (subtle slow drift)

const objectConfigs = [
  // FRONT — these fly around dramatically
  { pos: [5, -2, -1.5], scale: 0.55, rotSpeed: 1.2, floatSpeed: 0.7, floatAmp: 0.3, type: 'icosa', color: '#818cf8', parallax: 2.5, lerpRate: 0.08 },
  { pos: [-5, 0, -2],   scale: 0.5,  rotSpeed: 0.9, floatSpeed: 0.8, floatAmp: 0.35, type: 'octa', color: '#a78bfa', parallax: 2.2, lerpRate: 0.07 },
  { pos: [4, 3, -1.5],  scale: 0.35, rotSpeed: 0.6, floatSpeed: 0.5, floatAmp: 0.45, type: 'dodeca', color: '#34d399', parallax: 2.8, lerpRate: 0.09 },
  { pos: [-6, -3, -2],  scale: 0.25, rotSpeed: 1.0, floatSpeed: 0.7, floatAmp: 0.35, type: 'heart', color: '#fca5a5', parallax: 2.4, lerpRate: 0.08 },
  { pos: [7, 1, -1],    scale: 0.2,  rotSpeed: 1.2, floatSpeed: 0.5, floatAmp: 0.6,  type: 'heart', color: '#f9a8d4', parallax: 3.0, lerpRate: 0.1 },

  // MIDDLE — steady responsive movement
  { pos: [-6, 3, -3],    scale: 0.3,  rotSpeed: 0.8, floatSpeed: 0.5, floatAmp: 0.5, type: 'heart', color: '#f472b6', parallax: 1.3, lerpRate: 0.05 },
  { pos: [-3, -3, -3.5], scale: 0.4,  rotSpeed: 0.6, floatSpeed: 0.4, floatAmp: 0.6, type: 'torus', color: '#f9a8d4', parallax: 1.1, lerpRate: 0.04 },
  { pos: [6, -3, -4],    scale: 0.25, rotSpeed: 0.5, floatSpeed: 0.7, floatAmp: 0.6, type: 'heart', color: '#f472b6', parallax: 1.0, lerpRate: 0.04 },
  { pos: [-7, -1, -3],   scale: 0.45, rotSpeed: 1.1, floatSpeed: 0.6, floatAmp: 0.4, type: 'icosa', color: '#fbbf24', parallax: 1.4, lerpRate: 0.05 },
  { pos: [7, 2, -3.5],   scale: 0.3,  rotSpeed: 1.0, floatSpeed: 0.6, floatAmp: 0.4, type: 'heart', color: '#fca5a5', parallax: 1.2, lerpRate: 0.05 },

  // BACK — barely moves, anchoring the depth
  { pos: [3, 4, -6],    scale: 0.35, rotSpeed: 0.7, floatSpeed: 0.5, floatAmp: 0.5, type: 'dodeca', color: '#6ee7b7', parallax: 0.3, lerpRate: 0.02 },
  { pos: [0, 4, -5.5],  scale: 0.4,  rotSpeed: 0.8, floatSpeed: 0.4, floatAmp: 0.3, type: 'torus', color: '#c4b5fd', parallax: 0.35, lerpRate: 0.02 },
  { pos: [-4, 3, -6],   scale: 0.3,  rotSpeed: 1.3, floatSpeed: 0.9, floatAmp: 0.5, type: 'octa', color: '#60a5fa', parallax: 0.25, lerpRate: 0.015 },
  { pos: [2, -4, -5],   scale: 0.45, rotSpeed: 0.7, floatSpeed: 0.6, floatAmp: 0.5, type: 'icosa', color: '#f87171', parallax: 0.3, lerpRate: 0.02 },
  { pos: [-6, -3, -7],  scale: 0.3,  rotSpeed: 0.9, floatSpeed: 0.8, floatAmp: 0.4, type: 'torus', color: '#818cf8', parallax: 0.2, lerpRate: 0.015 },
]

export default function FloatingObjects({ resultTheme }) {
  return (
    <group>
      {objectConfigs.map((cfg, i) => (
        <FloatingObject
          key={i}
          position={cfg.pos}
          scale={cfg.scale}
          rotSpeed={cfg.rotSpeed}
          floatSpeed={cfg.floatSpeed}
          floatAmp={cfg.floatAmp}
          type={cfg.type}
          color={resultTheme?.particleColor || cfg.color}
          parallax={cfg.parallax}
          lerpRate={cfg.lerpRate}
        />
      ))}
    </group>
  )
}
