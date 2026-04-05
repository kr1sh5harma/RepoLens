'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import type { GHRepo } from '@/lib/github'
import { langColor, timeAgo, fmtNum, repoActivityStatus } from '@/lib/utils'

interface AnimatedRepoCardProps {
  repo: GHRepo
  index?: number
}

export default function AnimatedRepoCard({ repo, index = 0 }: AnimatedRepoCardProps) {
  const router = useRouter()
  const [isNavigating, setIsNavigating] = useState(false)
  const status = repoActivityStatus(repo)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsNavigating(true)
    setTimeout(() => {
      router.push(`/${repo.owner.login}/${repo.name}`)
    }, 100) // Slight delay to ensure the loader is visible and click feels registered
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: 'easeOut',
      }}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      <a
        href={`/${repo.owner.login}/${repo.name}`}
        onClick={handleClick}
        className="group block bg-white dark:bg-[#111] border border-zinc-200 dark:border-[#1e1e1e] rounded-xl p-5 hover:border-zinc-300 dark:hover:border-[#2e2e2e] hover:bg-zinc-50 dark:hover:bg-[#141414] transition-all duration-300"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-mono text-sm font-medium text-slate-900 dark:text-white truncate group-hover:text-slate-600 dark:group-hover:text-zinc-100 transition-colors duration-300">
              {repo.name}
            </span>
            {repo.fork && (
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 + 0.2 }}
                className="text-[10px] font-mono text-slate-500 dark:text-zinc-600 border border-zinc-200 dark:border-[#2a2a2a] rounded px-1.5 py-0.5 shrink-0"
              >
                fork
              </motion.span>
            )}
          </div>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.1 }}
            className="text-[10px] font-mono shrink-0 mt-0.5"
            style={{ color: status.color }}
          >
            {status.label}
          </motion.span>
        </div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.15 }}
          className="text-[13px] text-slate-600 dark:text-zinc-500 leading-relaxed mb-4 line-clamp-2 min-h-[40px]"
        >
          {repo.description || <span className="italic text-slate-400 dark:text-zinc-700">No description</span>}
        </motion.p>

        {/* Topics */}
        {repo.topics && repo.topics.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.2 }}
            className="flex flex-wrap gap-1.5 mb-4"
          >
            {repo.topics.slice(0, 3).map((t, i) => (
              <motion.span
                key={t}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: index * 0.1 + 0.2 + i * 0.05,
                  duration: 0.3,
                }}
                className="text-[10px] font-mono text-slate-600 dark:text-zinc-500 bg-zinc-100 dark:bg-[#1a1a1a] border border-zinc-200 dark:border-[#252525] rounded-full px-2 py-0.5 hover:bg-zinc-200 dark:hover:bg-[#222] transition-colors duration-200"
              >
                {t}
              </motion.span>
            ))}
            {repo.topics.length > 3 && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.35 }}
                className="text-[10px] font-mono text-slate-500 dark:text-zinc-700"
              >
                +{repo.topics.length - 3}
              </motion.span>
            )}
          </motion.div>
        )}

        {/* Meta row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.25 }}
          className="flex items-center gap-4 text-xs text-slate-500 dark:text-zinc-600 font-mono"
        >
          {repo.language && (
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: langColor(repo.language) }} />
              <span className="text-slate-700 dark:text-zinc-400">{repo.language}</span>
            </span>
          )}
          {repo.stargazers_count > 0 && (
            <span className="flex items-center gap-1 text-slate-600 dark:text-zinc-500">
              <StarIcon />
              {fmtNum(repo.stargazers_count)}
            </span>
          )}
          {repo.forks_count > 0 && (
            <span className="flex items-center gap-1 text-slate-600 dark:text-zinc-500">
              <ForkIcon />
              {fmtNum(repo.forks_count)}
            </span>
          )}
          <span className="ml-auto text-slate-400 dark:text-zinc-700">{timeAgo(repo.pushed_at)}</span>
        </motion.div>

        {/* Arrow indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.3 }}
          className="mt-4 pt-3 border-t border-zinc-200 dark:border-[#1a1a1a] flex items-center justify-end h-10"
        >
          {isNavigating ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-400 dark:text-zinc-500" />
            </motion.div>
          ) : (
            <motion.span
              className="text-[11px] font-mono text-slate-500 dark:text-zinc-700 group-hover:text-slate-800 dark:group-hover:text-zinc-400 transition-colors duration-300 flex items-center"
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
            >
              View analysis →
            </motion.span>
          )}
        </motion.div>
      </a>
    </motion.div>
  )
}

function StarIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
      <path d="M6 1L7.5 4.5H11L8.25 6.75L9.75 10.5L6 8.25L2.25 10.5L3.75 6.75L1 4.5H4.5L6 1Z" />
    </svg>
  )
}

function ForkIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
      <path d="M2.5 1.5C1.67157 1.5 1 2.17157 1 3C1 3.82843 1.67157 4.5 2.5 4.5C3.32843 4.5 4 3.82843 4 3C4 2.17157 3.32843 1.5 2.5 1.5ZM9.5 1.5C8.67157 1.5 8 2.17157 8 3C8 3.82843 8.67157 4.5 9.5 4.5C10.3284 4.5 11 3.82843 11 3C11 2.17157 10.3284 1.5 9.5 1.5ZM6 4.5C5.17157 4.5 4.5 5.17157 4.5 6V10.5H6V6C6 5.17157 6.67157 4.5 7.5 4.5C8.32843 4.5 9 5.17157 9 6V10.5H10.5V6C10.5 4.34315 9.15685 3 7.5 3C5.84315 3 4.5 4.34315 4.5 6V10.5H3V6C3 5.17157 2.32843 4.5 1.5 4.5V6C1.5 7.65685 2.84315 9 4.5 9V10.5H6Z" />
    </svg>
  )
}
