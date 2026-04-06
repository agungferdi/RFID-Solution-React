import { Canvas, useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { Suspense, useMemo, useRef } from 'react'
import * as THREE from 'three'

function DevicePlane({ texture, progress }) {
  const groupRef = useRef(null)

  const planeSize = useMemo(() => {
    const width = texture?.image?.width ?? 720
    const height = texture?.image?.height ?? 1280
    const aspect = width / height
    const targetHeight = 2.12
    const targetWidth = targetHeight * aspect
    return [targetWidth, targetHeight]
  }, [texture])

  useFrame((_, delta) => {
    if (!groupRef.current) {
      return
    }

    const targetY = (progress - 0.5) * 0.16
    const targetX = Math.sin(progress * Math.PI * 2) * 0.04
    const targetTilt = Math.cos(progress * Math.PI * 2) * 0.02

    groupRef.current.position.x = THREE.MathUtils.damp(
      groupRef.current.position.x,
      targetX,
      4.2,
      delta,
    )
    groupRef.current.rotation.y = THREE.MathUtils.damp(
      groupRef.current.rotation.y,
      targetY,
      4.2,
      delta,
    )
    groupRef.current.rotation.x = THREE.MathUtils.damp(
      groupRef.current.rotation.x,
      targetTilt,
      4.2,
      delta,
    )
  })

  return (
    <group ref={groupRef}>
      <mesh>
        <planeGeometry args={[planeSize[0], planeSize[1], 1, 1]} />
        <meshBasicMaterial map={texture} transparent toneMapped={false} />
      </mesh>
    </group>
  )
}

function Atmosphere({ progress }) {
  const leftRef = useRef(null)
  const rightRef = useRef(null)

  useFrame((state, delta) => {
    const drift = Math.sin(progress * Math.PI * 2)

    if (leftRef.current) {
      leftRef.current.position.x = THREE.MathUtils.damp(
        leftRef.current.position.x,
        -1.25 + drift * 0.18,
        3,
        delta,
      )
      leftRef.current.position.y = THREE.MathUtils.damp(
        leftRef.current.position.y,
        0.52 + Math.cos(state.clock.elapsedTime * 0.35) * 0.05,
        3,
        delta,
      )
    }

    if (rightRef.current) {
      rightRef.current.position.x = THREE.MathUtils.damp(
        rightRef.current.position.x,
        1.25 - drift * 0.2,
        3,
        delta,
      )
      rightRef.current.position.y = THREE.MathUtils.damp(
        rightRef.current.position.y,
        -0.45 + Math.sin(state.clock.elapsedTime * 0.33) * 0.06,
        3,
        delta,
      )
    }
  })

  return (
    <group>
      <mesh ref={leftRef} position={[-1.25, 0.52, -0.45]}>
        <circleGeometry args={[0.68, 48]} />
        <meshBasicMaterial color="#35b39a" transparent opacity={0.1} />
      </mesh>
      <mesh ref={rightRef} position={[1.25, -0.45, -0.4]}>
        <circleGeometry args={[0.74, 48]} />
        <meshBasicMaterial color="#f19a55" transparent opacity={0.1} />
      </mesh>
    </group>
  )
}

function StageContent({ frameUrls, frameIndex, progress }) {
  const textures = useTexture(frameUrls)

  const normalizedTextures = useMemo(() => {
    const list = Array.isArray(textures) ? textures : [textures]
    list.forEach((texture) => {
      texture.colorSpace = THREE.SRGBColorSpace
      texture.anisotropy = 8
      texture.generateMipmaps = false
      texture.minFilter = THREE.LinearFilter
      texture.magFilter = THREE.LinearFilter
      texture.needsUpdate = true
    })
    return list
  }, [textures])

  const clampedIndex = Math.min(
    normalizedTextures.length - 1,
    Math.max(0, frameIndex ?? 0),
  )
  const activeTexture = normalizedTextures[clampedIndex]

  if (!activeTexture) {
    return null
  }

  return (
    <>
      <ambientLight intensity={1.25} />
      <directionalLight position={[2.4, 2.4, 3]} intensity={0.52} color="#6ad6be" />
      <directionalLight position={[-2.5, 0.9, 2.3]} intensity={0.5} color="#f2a764" />

      <Atmosphere progress={progress} />
      <DevicePlane texture={activeTexture} progress={progress} />
    </>
  )
}

export function SequenceStage({ frameUrls, frameIndex, progress }) {
  if (!frameUrls?.length) {
    return null
  }

  return (
    <Canvas
      dpr={[1, 1.8]}
      camera={{ fov: 34, position: [0, 0, 4.15] }}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
    >
      <Suspense fallback={null}>
        <StageContent frameUrls={frameUrls} frameIndex={frameIndex} progress={progress} />
      </Suspense>
    </Canvas>
  )
}
