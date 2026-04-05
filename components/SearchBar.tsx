'use client'
import { useState, FormEvent, KeyboardEvent } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function SearchBar({ defaultValue = '', compact = false }: { defaultValue?: string; compact?: boolean }) {
  const [value, setValue] = useState(defaultValue)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const go = (e?: FormEvent) => {
    e?.preventDefault()
    const u = value.trim().replace('@', '')
    if (!u) return
    setLoading(true)
    router.push(`/${u}`)
  }

  if (compact) {
    return (
      <motion.form
        onSubmit={go}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="flex items-center gap-2"
      >
        <motion.div
          className="flex items-center bg-white dark:bg-[#111] border border-zinc-200 dark:border-[#2a2a2a] rounded-lg overflow-hidden focus-within:border-zinc-400 dark:focus-within:border-[#444] transition-colors"
          whileFocus={{ borderColor: '#444' }}
        >
          <span className="pl-3 text-slate-400 dark:text-zinc-500 text-sm font-mono">@</span>
          <input
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder="username"
            className="bg-transparent text-sm text-slate-900 dark:text-zinc-200 placeholder-slate-400 dark:placeholder-zinc-600 font-mono px-2 py-2 w-36 outline-none"
            autoComplete="off" spellCheck={false}
          />
          <motion.button
            type="submit"
            disabled={loading || !value.trim()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-slate-900 dark:bg-white text-white dark:text-black text-xs font-medium px-3 py-1.5 m-1 rounded-md hover:opacity-80 transition-opacity disabled:opacity-40 cursor-pointer"
          >
            {loading ? '...' : 'Go'}
          </motion.button>
        </motion.div>
      </motion.form>
    )
  }

  return (
    <motion.form
      onSubmit={go}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="w-full max-w-lg"
    >
      <motion.div
        className="flex items-center bg-white dark:bg-[#111] border border-zinc-200 dark:border-[#2a2a2a] rounded-xl overflow-hidden focus-within:border-zinc-400 dark:focus-within:border-[#444] transition-colors"
        whileFocus={{
          boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)',
          borderColor: '#444',
        }}
        transition={{ duration: 0.3 }}
      >
        <span className="pl-5 text-slate-400 dark:text-zinc-500 text-lg font-mono select-none">@</span>
        <input
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="Enter GitHub username"
          className="flex-1 bg-transparent text-[15px] text-slate-900 dark:text-zinc-200 placeholder-slate-400 dark:placeholder-zinc-600 font-mono px-3 py-4 outline-none"
          autoFocus autoComplete="off" spellCheck={false}
        />
        <motion.button
          type="submit"
          disabled={loading || !value.trim()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-slate-900 dark:bg-white text-white dark:text-black text-sm font-medium px-5 py-2 m-2 rounded-lg hover:opacity-85 transition-opacity disabled:opacity-40 cursor-pointer"
        >
          {loading ? (
            <span className="flex items-center gap-1.5">
              <motion.span
                className="w-1 h-1 bg-white dark:bg-black rounded-full"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 0.6, repeat: Infinity }}
              />
              <motion.span
                className="w-1 h-1 bg-white dark:bg-black rounded-full"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
              />
              <motion.span
                className="w-1 h-1 bg-white dark:bg-black rounded-full"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
              />
            </span>
          ) : 'Analyze →'}
        </motion.button>
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="text-center text-xs text-slate-500 dark:text-zinc-600 mt-3 font-mono"
      >
        Press <kbd className="text-slate-500 dark:text-zinc-500 border border-zinc-300 dark:border-[#333] rounded px-1 py-0.5">Enter</kbd> to search
      </motion.p>
    </motion.form>
  )
}
