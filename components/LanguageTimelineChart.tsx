'use client'
import { useMemo } from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import type { GHRepo } from '@/lib/github'
import { langColor } from '@/lib/utils'

export default function LanguageTimelineChart({ repos }: { repos: GHRepo[] }) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme !== 'light'

  const { data, topLangs } = useMemo(() => {
    const years = new Map<number, Record<string, number>>()
    const langTotals = new Map<string, number>()

    repos.forEach(r => {
      if (!r.language || !r.created_at) return
      const year = new Date(r.created_at).getFullYear()
      if (!years.has(year)) years.set(year, {})
      
      const counts = years.get(year)!
      counts[r.language] = (counts[r.language] || 0) + 1
      langTotals.set(r.language, (langTotals.get(r.language) || 0) + 1)
    })

    const allYears = Array.from(years.keys()).sort((a, b) => a - b)
    if (allYears.length === 0) return { data: [], topLangs: [] }

    // Start with min year, end with max year, fill gaps
    const minYear = allYears[0]
    const maxYear = allYears[allYears.length - 1]
    
    // Top 5 languages to show in stacked area to avoid clutter
    const topLangs = Array.from(langTotals.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(entry => entry[0])

    const data = []
    for (let y = minYear; y <= maxYear; y++) {
      const yearData: any = { year: y }
      topLangs.forEach(lang => {
        yearData[lang] = years.get(y)?.[lang] || 0
      })
      data.push(yearData)
    }

    return { data, topLangs }
  }, [repos])

  if (data.length < 2) return null // Need at least 2 years to show a timeline

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="bg-white dark:bg-[#111] border border-zinc-200 dark:border-[#1e1e1e] rounded-xl p-5 mb-10 overflow-hidden"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xs font-mono text-slate-500 dark:text-zinc-500 uppercase tracking-wider mb-1">Language Evolution</h3>
          <p className="text-sm text-slate-600 dark:text-zinc-400">Stack shifts year over year (by repository creation)</p>
        </div>
        <div className="flex gap-3">
          {topLangs.map(lang => (
            <div key={lang} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ background: langColor(lang) }} />
              <span className="text-[10px] font-mono text-zinc-500 uppercase">{lang}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <XAxis 
              dataKey="year" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#52525b', fontSize: 12, fontFamily: 'monospace' }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#52525b', fontSize: 12, fontFamily: 'monospace' }}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: isDark ? '#111' : '#fff', borderColor: isDark ? '#2a2a2a' : '#e4e4e7', borderRadius: '8px', color: isDark ? '#fff' : '#111' }}
              itemStyle={{ fontSize: '13px', fontFamily: 'monospace' }}
              labelStyle={{ color: isDark ? '#a1a1aa' : '#71717a', marginBottom: '8px', fontFamily: 'monospace' }}
            />
            {topLangs.map((lang, index) => (
              <Area
                key={lang}
                type="monotone"
                dataKey={lang}
                stackId="1"
                stroke={langColor(lang)}
                fill={langColor(lang)}
                strokeWidth={2}
                fillOpacity={0.8}
                animationDuration={1500}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}
