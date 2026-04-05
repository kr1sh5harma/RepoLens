'use client'
import { useMemo } from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import type { GHCommit, GHRepo } from '@/lib/github'

export default function RepoLifecycleChart({ repo, commits }: { repo: GHRepo; commits: GHCommit[] }) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme !== 'light'

  const data = useMemo(() => {
    if (!commits || commits.length === 0) return []

    // Group commits by month 'YYYY-MM'
    const months = new Map<string, number>()
    
    // Sort array of commits to run from oldest to newest
    const sortedCommits = [...commits].sort((a, b) => 
      new Date(a.commit.author.date).getTime() - new Date(b.commit.author.date).getTime()
    )

    // Using first commit down to the last commit
    const firstDate = new Date(sortedCommits[0].commit.author.date)
    const lastDate = new Date(sortedCommits[sortedCommits.length - 1].commit.author.date)
    
    // Fill in every month from first to last to show maintenance/abandon phases
    const startYear = firstDate.getFullYear()
    const startMonth = firstDate.getMonth()
    const endYear = lastDate.getFullYear()
    const endMonth = lastDate.getMonth()

    for (let y = startYear; y <= endYear; y++) {
      const mStart = (y === startYear) ? startMonth : 0
      const mEnd = (y === endYear) ? endMonth : 11
      for (let m = mStart; m <= mEnd; m++) {
        const key = `${y}-${String(m + 1).padStart(2, '0')}`
        months.set(key, 0)
      }
    }

    sortedCommits.forEach(c => {
      const d = new Date(c.commit.author.date)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      if (months.has(key)) {
        months.set(key, months.get(key)! + 1)
      }
    })

    return Array.from(months.entries()).map(([month, count]) => {
      // Month format is YYYY-MM. We'll show short month names and year
      const [y, m] = month.split('-')
      const date = new Date(parseInt(y), parseInt(m) - 1)
      const label = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
      return { month: label, fullDate: month, commits: count }
    })
  }, [commits])

  if (data.length < 2) return null // Need at least two data points a line

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="bg-white dark:bg-[#111] border border-zinc-200 dark:border-[#1e1e1e] rounded-xl p-5"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xs font-mono text-slate-500 dark:text-zinc-500 uppercase tracking-wider mb-1">Repository Lifecycle</h3>
          <p className="text-sm text-slate-600 dark:text-zinc-400">Commit volume over time</p>
        </div>
      </div>
      
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCommits" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#4ade80" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#52525b', fontSize: 12, fontFamily: 'monospace' }}
              minTickGap={30}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#52525b', fontSize: 12, fontFamily: 'monospace' }}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: isDark ? '#111' : '#fff', border: isDark ? '1px solid #2a2a2a' : '1px solid #e4e4e7', borderRadius: '8px' }}
              itemStyle={{ color: isDark ? '#fff' : '#111', fontSize: '13px', fontFamily: 'monospace' }}
              labelStyle={{ color: isDark ? '#888' : '#52525b', marginBottom: '5px', fontSize: '12px', fontFamily: 'monospace' }}
              cursor={{ stroke: isDark ? '#2a2a2a' : '#e4e4e7', strokeWidth: 1, strokeDasharray: '4 4' }}
            />
            <Area
              type="monotone"
              dataKey="commits"
              name="Commits"
              stroke="#4ade80"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorCommits)"
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}
