'use client'
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { GHRepo } from '@/lib/github'
import AnimatedRepoCard from '@/components/AnimatedRepoCard'

type Sort = 'updated' | 'stars' | 'forks' | 'name'

interface Props {
  repos: GHRepo[]
  username: string
}

export default function RepoFilter({ repos, username }: Props) {
  const [query, setQuery] = useState('')
  const [lang, setLang] = useState('all')
  const [sort, setSort] = useState<Sort>('updated')
  const [showForks, setShowForks] = useState(true)

  // Derive unique languages from all repos
  const languages = useMemo(() => {
    const set = new Set<string>()
    for (const r of repos) if (r.language) set.add(r.language)
    return Array.from(set).sort()
  }, [repos])

  const filtered = useMemo(() => {
    let list = [...repos]
    if (!showForks) list = list.filter(r => !r.fork)
    if (lang !== 'all') list = list.filter(r => r.language === lang)
    if (query.trim()) {
      const q = query.trim().toLowerCase()
      list = list.filter(r =>
        r.name.toLowerCase().includes(q) ||
        (r.description ?? '').toLowerCase().includes(q)
      )
    }
    switch (sort) {
      case 'stars': list.sort((a, b) => b.stargazers_count - a.stargazers_count); break
      case 'forks': list.sort((a, b) => b.forks_count - a.forks_count); break
      case 'name': list.sort((a, b) => a.name.localeCompare(b.name)); break
      case 'updated': list.sort((a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime()); break
    }
    return list
  }, [repos, query, lang, sort, showForks])

  const sourceCount = repos.filter(r => !r.fork).length
  const forkedCount = repos.filter(r => r.fork).length

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5"
      >
        <div>
          <h2 className="text-sm font-medium">Repositories</h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-xs text-slate-600 dark:text-zinc-600 font-mono mt-0.5"
          >
            {repos.length} total · {sourceCount} source · {forkedCount} forked
            {filtered.length !== repos.length && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="ml-2 text-emerald-600"
              >
                · {filtered.length} shown
              </motion.span>
            )}
          </motion.p>
        </div>
      </motion.div>

      {/* Filter Controls */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="flex flex-wrap items-center gap-2 mb-6"
      >
        {/* Search */}
        <motion.div
          className="flex items-center bg-white dark:bg-[#111] border border-zinc-200 dark:border-[#2a2a2a] rounded-lg overflow-hidden focus-within:border-zinc-400 dark:focus-within:border-[#444] transition-colors flex-1 min-w-[180px]"
          whileFocus={{ borderColor: '#444', boxShadow: '0 0 15px rgba(255, 255, 255, 0.05)' }}
          transition={{ duration: 0.2 }}
        >
          <svg className="w-3.5 h-3.5 ml-3 text-slate-400 dark:text-zinc-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search repos..."
            className="bg-transparent text-sm text-slate-900 dark:text-zinc-200 placeholder-slate-400 dark:placeholder-zinc-600 font-mono px-2.5 py-2 outline-none w-full"
          />
          <AnimatePresence>
            {query && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setQuery('')}
                className="pr-3 text-zinc-500 hover:text-zinc-300 transition-colors text-xs"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                ✕
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Language filter */}
        <motion.select
          value={lang}
          onChange={e => setLang(e.target.value)}
          className="bg-white dark:bg-[#111] border border-zinc-200 dark:border-[#2a2a2a] text-sm text-slate-800 dark:text-zinc-300 font-mono px-3 py-2 rounded-lg outline-none hover:border-zinc-400 dark:hover:border-[#444] transition-colors cursor-pointer"
          whileHover={{ borderColor: '#444' }}
          whileTap={{ scale: 0.98 }}
        >
          <option value="all">All languages</option>
          {languages.map(l => <option key={l} value={l}>{l}</option>)}
        </motion.select>

        {/* Sort */}
        <motion.select
          value={sort}
          onChange={e => setSort(e.target.value as Sort)}
          className="bg-white dark:bg-[#111] border border-zinc-200 dark:border-[#2a2a2a] text-sm text-slate-800 dark:text-zinc-300 font-mono px-3 py-2 rounded-lg outline-none hover:border-zinc-400 dark:hover:border-[#444] transition-colors cursor-pointer"
          whileHover={{ borderColor: '#444' }}
          whileTap={{ scale: 0.98 }}
        >
          <option value="updated">Recently updated</option>
          <option value="stars">Most stars</option>
          <option value="forks">Most forks</option>
          <option value="name">Alphabetical</option>
        </motion.select>

        {/* Forks toggle */}
        <motion.button
          onClick={() => setShowForks(v => !v)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`text-xs font-mono px-3 py-2 rounded-lg border transition-all ${
            showForks
              ? 'bg-white dark:bg-[#111] border-zinc-200 dark:border-[#2a2a2a] text-slate-500 dark:text-zinc-500 hover:border-zinc-400 dark:hover:border-[#444]'
              : 'bg-zinc-100 dark:bg-[#1a1a1a] border-zinc-300 dark:border-[#333] text-slate-800 dark:text-zinc-300'
          }`}
        >
          {showForks ? 'Hide forks' : 'Show forks'}
        </motion.button>
      </motion.div>

      {/* Repo Grid */}
      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-4xl mb-4"
            >
              🔍
            </motion.div>
            <p className="text-zinc-500 font-mono text-sm mb-1">No repositories match your filters</p>
            <motion.button
              onClick={() => { setQuery(''); setLang('all'); setShowForks(true) }}
              whileHover={{ scale: 1.05, textDecoration: 'underline' }}
              whileTap={{ scale: 0.95 }}
              className="text-xs text-zinc-600 hover:text-zinc-300 underline underline-offset-2 transition-colors mt-2 font-mono"
            >
              Clear filters
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {filtered.map((repo, i) => (
              <AnimatedRepoCard key={repo.id} repo={repo} index={i} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
