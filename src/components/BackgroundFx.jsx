import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

function Particles() {
  const pointsRef = useRef(null)

  const particleData = useMemo(() => {
    const count = 1600
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    for (let i = 0; i < count; i += 1) {
      const i3 = i * 3
      positions[i3] = (Math.random() - 0.5) * 24
      positions[i3 + 1] = (Math.random() - 0.5) * 16
      positions[i3 + 2] = -Math.random() * 10

      const mix = Math.random()
      if (mix > 0.5) {
        colors[i3] = 1.0
        colors[i3 + 1] = 0.41
        colors[i3 + 2] = 0.12
      } else {
        colors[i3] = 0.0
        colors[i3 + 1] = 0.78
        colors[i3 + 2] = 1.0
      }
    }

    return { positions, colors }
  }, [])

  useFrame((state) => {
    if (!pointsRef.current) {
      return
    }

    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.018
    pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.09) * 0.05
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particleData.positions, 3]}
        />
        <bufferAttribute attach="attributes-color" args={[particleData.colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        transparent
        opacity={0.55}
        vertexColors
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

function PulseRings() {
  const ringARef = useRef(null)
  const ringBRef = useRef(null)

  const ringA = useMemo(() => new THREE.RingGeometry(2.4, 2.44, 72), [])
  const ringB = useMemo(() => new THREE.RingGeometry(3.1, 3.14, 72), [])

  useFrame((state) => {
    const t = state.clock.elapsedTime

    if (ringARef.current) {
      ringARef.current.rotation.z = t * 0.08
      ringARef.current.material.opacity = 0.16 + Math.sin(t * 1.1) * 0.03
    }

    if (ringBRef.current) {
      ringBRef.current.rotation.z = -t * 0.06
      ringBRef.current.material.opacity = 0.1 + Math.cos(t * 0.9) * 0.025
    }
  })

  return (
    <group position={[0, 0, -3.8]}>
      <mesh ref={ringARef} geometry={ringA}>
        <meshBasicMaterial color="#00c8ff" transparent opacity={0.16} />
      </mesh>
      <mesh ref={ringBRef} geometry={ringB}>
        <meshBasicMaterial color="#ff6820" transparent opacity={0.1} />
      </mesh>
    </group>
  )
}

export function BackgroundFx() {
  return (
    <div className="bg-canvas-wrap" aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ fov: 52, position: [0, 0, 8.5] }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.25} />
        <Particles />
        <PulseRings />
      </Canvas>
    </div>
  )
}
