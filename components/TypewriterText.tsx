'use client'
import { useState, useEffect } from 'react'

const WORDS = ['any codebase', 'any developer', 'open source', 'your GitHub DNA']

export default function TypewriterText({ text }: { text?: string }) {
  const words = text ? [text] : WORDS
  const isOneShot = !!text // Single animation mode when text prop is provided
  const [wordIndex, setWordIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)
  const [displayed, setDisplayed] = useState('')

  useEffect(() => {
    const current = words[wordIndex]
    let delay: number

    if (!deleting && charIndex < current.length) {
      delay = 75
      const t = setTimeout(() => {
        setDisplayed(current.slice(0, charIndex + 1))
        setCharIndex(i => i + 1)
      }, delay)
      return () => clearTimeout(t)
    }

    if (!deleting && charIndex === current.length) {
      // Stop after typing if single-shot mode, otherwise pause before deleting
      if (isOneShot) {
        return
      }
      const t = setTimeout(() => setDeleting(true), 2000)
      return () => clearTimeout(t)
    }

    if (deleting && charIndex > 0) {
      delay = 40
      const t = setTimeout(() => {
        setDisplayed(current.slice(0, charIndex - 1))
        setCharIndex(i => i - 1)
      }, delay)
      return () => clearTimeout(t)
    }

    if (deleting && charIndex === 0) {
      setDeleting(false)
      setWordIndex(i => (i + 1) % words.length)
    }
  }, [charIndex, deleting, wordIndex, words, isOneShot])

  return (
    <span className="text-zinc-400 relative">
      {displayed}
      <span className="animate-pulse ml-0.5 opacity-70">|</span>
    </span>
  )
}
