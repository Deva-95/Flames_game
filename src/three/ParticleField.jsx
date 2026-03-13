import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'

export default function ParticleField({ resultTheme }) {
  const particlesRef = useRef()
  const count = 500

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 30
      arr[i * 3 + 1] = (Math.random() - 0.5) * 30
      arr[i * 3 + 2] = (Math.random() - 0.5) * 30
    }
    return arr
  }, [])

  const groupRef = useRef()

  useFrame((state, delta) => {
    if (!particlesRef.current) return
    const pos = particlesRef.current.geometry.attributes.position.array
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += delta * 0.3
      if (pos[i * 3 + 1] > 15) pos[i * 3 + 1] = -15
    }
    particlesRef.current.geometry.attributes.position.needsUpdate = true

    // Shift entire particle group with mouse for subtle parallax
    if (groupRef.current) {
      groupRef.current.rotation.y += (state.mouse.x * 0.15 - groupRef.current.rotation.y) * 0.02
      groupRef.current.rotation.x += (state.mouse.y * 0.1 - groupRef.current.rotation.x) * 0.02
    }
  })

  return (
    <group ref={groupRef}>
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color={resultTheme?.particleColor || '#818cf8'}
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
    </group>
  )
}
