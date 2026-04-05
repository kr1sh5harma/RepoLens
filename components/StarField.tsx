'use client'
import { useEffect, useRef } from 'react'

interface Star {
  x: number; y: number; z: number
  size: number; opacity: number; speed: number
  twinkleSpeed: number; twinklePhase: number
}

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    let raf: number

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const STAR_COUNT = 220
    const stars: Star[] = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      z: Math.random(),
      size: Math.random() * 1.5 + 0.3,
      opacity: Math.random() * 0.7 + 0.1,
      speed: Math.random() * 0.12 + 0.02,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      twinklePhase: Math.random() * Math.PI * 2,
    }))

    // A few brighter "feature" stars
    for (let i = 0; i < 15; i++) {
      stars[i].size = Math.random() * 2.5 + 1.5
      stars[i].opacity = Math.random() * 0.4 + 0.5
    }

    let t = 0
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      t += 1

      for (const star of stars) {
        star.twinklePhase += star.twinkleSpeed
        const tw = 0.6 + 0.4 * Math.sin(star.twinklePhase)
        const alpha = star.opacity * tw

        // Drift
        star.x -= star.speed
        star.y += star.speed * 0.15
        if (star.x < -5) { star.x = canvas.width + 5; star.y = Math.random() * canvas.height }
        if (star.y > canvas.height + 5) { star.y = -5; star.x = Math.random() * canvas.width }

        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${alpha})`
        ctx.fill()

        // Halo on brighter stars
        if (star.size > 1.8) {
          ctx.beginPath()
          ctx.arc(star.x, star.y, star.size * 2.5, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(200,210,255,${alpha * 0.08})`
          ctx.fill()
        }
      }

      // Subtle nebula clouds (static, low opacity blobs)
      const nebulas = [
        { x: canvas.width * 0.2, y: canvas.height * 0.3, r: 200, color: '80,80,160' },
        { x: canvas.width * 0.75, y: canvas.height * 0.65, r: 160, color: '60,90,120' },
        { x: canvas.width * 0.55, y: canvas.height * 0.15, r: 130, color: '90,60,100' },
      ]
      for (const n of nebulas) {
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r)
        grad.addColorStop(0, `rgba(${n.color},0.04)`)
        grad.addColorStop(1, `rgba(${n.color},0)`)
        ctx.fillStyle = grad
        ctx.fillRect(n.x - n.r, n.y - n.r, n.r * 2, n.r * 2)
      }

      raf = requestAnimationFrame(draw)
    }

    raf = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 invert dark:invert-0 opacity-40 dark:opacity-100"
      aria-hidden="true"
    />
  )
}
