'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import SearchBar from './SearchBar'
import { ThemeToggle } from './ThemeToggle'

interface NavbarProps {
  username?: string
  repo?: string
}

export default function Navbar({ username, repo }: NavbarProps) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed top-0 inset-x-0 z-50 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-b border-zinc-200 dark:border-[#1a1a1a] transition-colors"
    >
      <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between gap-6">

        {/* Logo + Breadcrumb */}
        <div className="flex items-center gap-2 text-sm min-w-0">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Link href="/" className="flex items-center gap-2 shrink-0 group">
              <motion.span
                className="w-2 h-2 rounded-full bg-slate-900 dark:bg-white group-hover:opacity-70 transition-opacity"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="font-medium text-slate-900 dark:text-white tracking-tight hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors duration-300">RepoLens</span>
            </Link>
          </motion.div>

          {username && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center"
            >
              <span className="text-zinc-700 shrink-0">/</span>
              <motion.div
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  href={`/${username}`}
                  className="text-zinc-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition-colors font-mono truncate max-w-[120px] duration-300 ml-2"
                >
                  {username}
                </Link>
              </motion.div>
            </motion.div>
          )}

          {repo && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center"
            >
              <span className="text-zinc-700 shrink-0">/</span>
              <span className="text-slate-700 dark:text-zinc-200 font-mono truncate max-w-[160px] ml-2">{repo}</span>
            </motion.div>
          )}
        </div>

        {/* Compact search (only visible on inner pages) */}
        {username && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
          >
            <SearchBar compact />
          </motion.div>
        )}

        <div className="flex items-center gap-3">
          {/* Right badge */}
          {!username && (
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="text-[11px] font-mono text-zinc-500 dark:text-zinc-600 border border-zinc-200 dark:border-[#222] rounded px-2 py-1 shrink-0 hover:border-zinc-300 dark:hover:border-[#444] hover:text-zinc-700 dark:hover:text-zinc-400 transition-colors duration-300 cursor-pointer hidden sm:flex"
            >
              GitHub Analyzer
            </motion.span>
          )}
          <ThemeToggle />
        </div>
      </div>
    </motion.nav>
  )
}
