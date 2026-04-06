import { useEffect, useState } from 'react'

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

export function useSmoothStoryProgress(storyRef) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const spring = {
      target: 0,
      current: 0,
    }

    let animationFrame = 0

    const updateTarget = () => {
      const storyElement = storyRef.current
      if (!storyElement) {
        return
      }

      const scrollableDistance = storyElement.offsetHeight - window.innerHeight
      const topOffset = -storyElement.getBoundingClientRect().top

      if (scrollableDistance <= 0) {
        spring.target = 0
        return
      }

      spring.target = clamp(topOffset / scrollableDistance, 0, 1)
    }

    const animate = () => {
      spring.current += (spring.target - spring.current) * 0.08

      if (Math.abs(spring.target - spring.current) < 0.0001) {
        spring.current = spring.target
      }

      setProgress(spring.current)
      animationFrame = window.requestAnimationFrame(animate)
    }

    updateTarget()
    animate()

    window.addEventListener('scroll', updateTarget, { passive: true })
    window.addEventListener('resize', updateTarget)

    return () => {
      window.cancelAnimationFrame(animationFrame)
      window.removeEventListener('scroll', updateTarget)
      window.removeEventListener('resize', updateTarget)
    }
  }, [storyRef])

  return progress
}
