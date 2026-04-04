'use client'
import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import type { GHCommit, GHPR, GHContributor, GHLanguages, GHRepo } from '@/lib/github'
import {
  computeLangBreakdown, computeCommitRhythm, computeCollabScore,
  computeRepoHealth, analyzeCommitStyle, buildCommitHeatmap,
  timeAgo, formatDate, fmtNum
} from '@/lib/utils'

interface Props {
  repo: GHRepo
  commits: GHCommit[]
  prs: GHPR[]
  contributors: GHContributor[]
  languages: GHLanguages
}

const TABS = ['Overview', 'Commits', 'Pull Requests', 'Contributors'] as const
type Tab = typeof TABS[number]

export default function RepoTabs({ repo, commits, prs, contributors, languages }: Props) {
  const [tab, setTab] = useState<Tab>('Overview')

  return (
    <div>
      {/* Tab Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex border-b border-[#1e1e1e] mb-8 overflow-x-auto"
      >
        {TABS.map((t, i) => (
          <motion.button
            key={t}
            onClick={() => setTab(t)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            className={`px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
              tab === t
                ? 'text-white border-white'
                : 'text-zinc-500 border-transparent hover:text-zinc-300'
            }`}
          >
            {t}
            {t === 'Commits' && <span className="ml-2 text-xs font-mono text-zinc-700">{commits.length}+</span>}
            {t === 'Pull Requests' && <span className="ml-2 text-xs font-mono text-zinc-700">{prs.length}</span>}
            {t === 'Contributors' && <span className="ml-2 text-xs font-mono text-zinc-700">{contributors.length}</span>}
          </motion.button>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        {tab === 'Overview' && <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
          <OverviewPanel repo={repo} commits={commits} prs={prs} contributors={contributors} languages={languages} />
        </motion.div>}
        {tab === 'Commits' && <motion.div key="commits" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
          <CommitsPanel commits={commits} />
        </motion.div>}
        {tab === 'Pull Requests' && <motion.div key="prs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
          <PRPanel prs={prs} />
        </motion.div>}
        {tab === 'Contributors' && <motion.div key="contributors" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
          <ContributorsPanel contributors={contributors} />
        </motion.div>}
      </AnimatePresence>
    </div>
  )
}

// ─── OVERVIEW ──────────────────────────────────────────────────────────────────
function OverviewPanel({ repo, commits, prs, contributors, languages }: Props) {
  const langBreakdown = computeLangBreakdown(languages)
  const rhythm = computeCommitRhythm(commits)
  const commitStyle = analyzeCommitStyle(commits)
  const health = computeRepoHealth(repo, commits)
  const collabScore = computeCollabScore(repo, prs, contributors.length)
  const heatmap = buildCommitHeatmap(commits)
  const openPRs = prs.filter(p => !p.merged_at && p.state === 'open').length
  const mergedPRs = prs.filter(p => p.merged_at).length
  const maxHeat = Math.max(...heatmap, 1)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3"
      >
        {[
          { label: 'Stars', value: fmtNum(repo.stargazers_count), color: '#fbbf24' },
          { label: 'Forks', value: fmtNum(repo.forks_count), color: '#60a5fa' },
          { label: 'Watchers', value: fmtNum(repo.watchers_count), color: '#a78bfa' },
          { label: 'Open Issues', value: String(repo.open_issues_count), color: '#f87171' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08, duration: 0.3 }}
            whileHover={{ scale: 1.05, y: -4 }}
            className="bg-[#111] border border-[#1e1e1e] rounded-xl p-4 transition-all duration-300 cursor-default"
          >
            <div className="text-[11px] text-zinc-600 font-mono uppercase tracking-wider mb-2">{s.label}</div>
            <div className="text-3xl font-light tracking-tight" style={{ color: s.color }}>{s.value}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Insight Cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-3"
      >
        <InsightCard
          icon="⚡"
          title="Commit Rhythm"
          label={rhythm.label}
          desc={rhythm.desc}
          color={rhythm.color}
          delay={0}
        />
        <InsightCard
          icon="✍️"
          title="Commit Style"
          label={commitStyle.label}
          desc={commitStyle.desc}
          color="#a78bfa"
          delay={0.1}
        />
        <InsightCard
          icon="🤝"
          title="Collaboration"
          label={`${collabScore}/100`}
          desc={collabScore > 70 ? 'Highly collaborative' : collabScore > 40 ? 'Moderate collaboration' : 'Solo project'}
          color={collabScore > 70 ? '#4ade80' : collabScore > 40 ? '#fbbf24' : '#888'}
          delay={0.2}
        />
      </motion.div>

      {/* Health & PR Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <motion.div
          whileHover={{ y: -4 }}
          className="bg-[#111] border border-[#1e1e1e] rounded-xl p-5"
        >
          <h3 className="text-xs font-mono text-zinc-500 uppercase tracking-wider mb-4">Repository Health</h3>
          <div className="flex items-end gap-3 mb-4">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="text-5xl font-light"
              style={{ color: health > 75 ? '#4ade80' : health > 50 ? '#fbbf24' : '#f87171' }}
            >
              {health}
            </motion.span>
            <span className="text-zinc-600 text-sm mb-2">/ 100</span>
          </div>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="w-full bg-[#1a1a1a] rounded-full h-1.5 origin-left"
          >
            <div
              className="h-1.5 rounded-full"
              style={{
                width: `${health}%`,
                background: health > 75 ? '#4ade80' : health > 50 ? '#fbbf24' : '#f87171'
              }}
            />
          </motion.div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="bg-[#111] border border-[#1e1e1e] rounded-xl p-5"
        >
          <h3 className="text-xs font-mono text-zinc-500 uppercase tracking-wider mb-4">PR Overview</h3>
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { label: 'Open', value: openPRs, color: '#4ade80' },
              { label: 'Merged', value: mergedPRs, color: '#a78bfa' },
              { label: 'Closed', value: prs.filter(p => !p.merged_at && p.state === 'closed').length, color: '#f87171' },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                className="text-center"
              >
                <div className="text-2xl font-light" style={{ color: s.color }}>{s.value}</div>
                <div className="text-[10px] font-mono text-zinc-600 uppercase">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Language Breakdown */}
      {langBreakdown.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="bg-[#111] border border-[#1e1e1e] rounded-xl p-5"
        >
          <h3 className="text-xs font-mono text-zinc-500 uppercase tracking-wider mb-5">Language Breakdown</h3>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex h-2 rounded-full overflow-hidden mb-5 gap-px origin-left"
          >
            {langBreakdown.map(l => (
              <div key={l.name} style={{ width: `${l.pct}%`, background: l.color }} />
            ))}
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {langBreakdown.map((l, i) => (
              <motion.div
                key={l.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 + i * 0.05 }}
                className="flex items-center gap-3"
              >
                <div className="w-2 h-2 rounded-full" style={{ background: l.color }} />
                <div>
                  <div className="text-xs text-zinc-300 font-mono">{l.name}</div>
                  <div className="text-xs text-zinc-600 font-mono">{l.pct}%</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

function CommitsPanel({ commits }: { commits: GHCommit[] }) {
  if (!commits.length) return <Empty msg="No commits found" />
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-px"
    >
      {commits.map((c, i) => (
        <motion.a
          key={c.sha}
          href={c.html_url}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.02 }}
          whileHover={{ x: 8 }}
          className="flex items-start gap-4 p-4 rounded-xl hover:bg-[#111] border border-transparent hover:border-[#1e1e1e] transition-all group"
        >
          {c.author?.avatar_url && (
            <Image
              src={c.author.avatar_url}
              alt={c.author.login}
              width={32} height={32}
              unoptimized
              className="rounded-full shrink-0 mt-0.5 opacity-80 group-hover:opacity-100 transition-opacity"
            />
          )}
          <div className="flex-1">
            <p className="text-sm text-zinc-200 group-hover:text-white transition-colors line-clamp-2 mb-1.5">
              {c.commit.message.split('\n')[0]}
            </p>
            <div className="flex gap-3 text-xs font-mono text-zinc-600">
              <span>{c.commit.author.name}</span>
              <span>·</span>
              <span>{timeAgo(c.commit.author.date)}</span>
            </div>
          </div>
          <span className="text-[11px] font-mono text-zinc-700 bg-[#1a1a1a] border border-[#222] rounded px-2 py-0.5 shrink-0">
            {c.sha.slice(0, 7)}
          </span>
        </motion.a>
      ))}
    </motion.div>
  )
}

function PRPanel({ prs }: { prs: GHPR[] }) {
  if (!prs.length) return <Empty msg="No PRs found" />
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-2"
    >
      {prs.map((pr, i) => {
        const state = pr.merged_at ? 'merged' : pr.state
        const colors = {
          open: { color: '#4ade80', bg: '#0d2b0d' },
          merged: { color: '#a78bfa', bg: '#1a0d2b' },
          closed: { color: '#f87171', bg: '#2b0d0d' },
        }[state] || { color: '#888', bg: '#1a1a1a' }

        return (
          <motion.a
            key={pr.number}
            href={pr.html_url}
            target="_blank"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.02 }}
            whileHover={{ x: 8 }}
            className="flex items-start gap-4 p-4 bg-[#111] border border-[#1e1e1e] rounded-xl hover:border-[#2a2a2a] transition-all group"
          >
            <span style={{ color: colors.color }} className="text-lg mt-0.5">
              {state === 'open' ? '●' : state === 'merged' ? '✓' : '✕'}
            </span>
            <div className="flex-1">
              <p className="text-sm text-zinc-200 group-hover:text-white transition-colors mb-1">
                #{pr.number} · {pr.title}
              </p>
              <div className="flex gap-3 text-xs font-mono text-zinc-600">
                <span>{pr.user?.login}</span>
                <span>·</span>
                <span>{timeAgo(pr.created_at)}</span>
              </div>
            </div>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.02 + 0.1 }}
              style={{ color: colors.color, backgroundColor: colors.bg }}
              className="text-[10px] font-mono px-2 py-0.5 rounded shrink-0 border border-current"
            >
              {state}
            </motion.span>
          </motion.a>
        )
      })}
    </motion.div>
  )
}

function ContributorsPanel({ contributors }: { contributors: GHContributor[] }) {
  if (!contributors.length) return <Empty msg="No contributors found" />
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
    >
      {contributors.map((c, i) => (
        <motion.a
          key={c.login}
          href={`https://github.com/${c.login}`}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.03 }}
          whileHover={{ scale: 1.1 }}
          className="flex flex-col items-center gap-2 group"
        >
          <Image
            src={c.avatar_url}
            alt={c.login}
            width={48}
            height={48}
            unoptimized
            className="w-12 h-12 rounded-full border border-[#1e1e1e] group-hover:border-[#2a2a2a] transition-all"
          />
          <p className="text-xs font-mono text-zinc-300 group-hover:text-white transition-colors">{c.login}</p>
          <p className="text-[10px] text-zinc-600 font-mono">{fmtNum(c.contributions)} commits</p>
        </motion.a>
      ))}
    </motion.div>
  )
}

function InsightCard({ icon, title, label, desc, color, delay = 0 }: {
  icon: string; title: string; label: string; desc: string; color: string; delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -4 }}
      className="bg-[#111] border border-[#1e1e1e] rounded-xl p-5 transition-all duration-300 cursor-default"
    >
      <div className="text-2xl mb-3">{icon}</div>
      <h4 className="text-xs font-mono text-zinc-600 uppercase tracking-wider mb-1">{title}</h4>
      <div className="text-xl font-light mb-1" style={{ color }}>{label}</div>
      <p className="text-xs text-zinc-500">{desc}</p>
    </motion.div>
  )
}

function Empty({ msg }: { msg: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="text-4xl mb-4">📭</div>
      <p className="text-zinc-500 font-mono text-sm">{msg}</p>
    </motion.div>
  )
}
