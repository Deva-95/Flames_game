import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export default function MouseTracker({ resultTheme }) {
  const lightRef = useRef()
  const colorTarget = useRef('#a5b4fc')

  useFrame((state) => {
    const { mouse, camera } = state

    // Smooth camera parallax — stronger sway for immersive feel
    camera.position.x += (mouse.x * 2.5 - camera.position.x) * 0.04
    camera.position.y += (mouse.y * 1.8 - camera.position.y) * 0.04
    camera.lookAt(0, 0, 0)

    // Point light follows mouse with gentle lag
    if (lightRef.current) {
      lightRef.current.position.x += (mouse.x * 6 - lightRef.current.position.x) * 0.08
      lightRef.current.position.y += (mouse.y * 6 - lightRef.current.position.y) * 0.08
      // Subtle intensity pulse based on distance from center
      const dist = Math.sqrt(mouse.x * mouse.x + mouse.y * mouse.y)
      lightRef.current.intensity = 2 + dist * 1.5
    }
  })

  return (
    <pointLight
      ref={lightRef}
      position={[0, 0, 5]}
      intensity={2}
      color={resultTheme?.lightColor || '#a5b4fc'}
      distance={20}
    />
  )
}
