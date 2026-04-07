import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import RepoFilter from '@/components/RepoFilter'
import ShareProfileMenu from '@/components/ShareProfileMenu'
import LanguageTimelineChart from '@/components/LanguageTimelineChart'
import { getUser, getUserRepos } from '@/lib/github'
import {
  computeArchetype, computeActivityLevel, computeOSImpact,
  topLanguages, fmtNum, langColor
} from '@/lib/utils'

interface Props { params: { username: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const user = await getUser(params.username)
    return {
      title: `${user.name || user.login} — GitGet`,
      description: `GitHub profile analysis for ${user.login}. ${user.public_repos} repos, ${user.followers} followers.`,
      openGraph: {
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
      },
    }
  } catch {
    return { title: 'User not found — GitGet' }
  }
}

export default async function UserPage({ params }: Props) {
  let user, repos
  try {
    ;[user, repos] = await Promise.all([
      getUser(params.username),
      getUserRepos(params.username),
    ])
  } catch (e: any) {
    if (e.message?.includes('Not found')) notFound()
    throw e
  }

  const archetype = computeArchetype(repos)
  const activity = computeActivityLevel(repos)
  const impact = computeOSImpact(repos)
  const langs = topLanguages(repos)
  const sourceRepos = repos.filter(r => !r.fork)
  const forkedRepos = repos.filter(r => r.fork)
  const joinYear = new Date(user.created_at).getFullYear()
  const yearsOnGH = new Date().getFullYear() - joinYear

  return (
    <>
      <Navbar username={params.username} />
      <main className="max-w-5xl mx-auto px-5 pt-24 pb-20">

        {/* ─── USER HERO ─────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row items-start gap-8 mb-12">
            <Image
              src={user.avatar_url}
              alt={user.login}
              width={96} height={96}
              unoptimized
              priority
              className="rounded-2xl border border-zinc-200 dark:border-[#222] shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h1 className="text-2xl font-medium tracking-tight text-slate-900 dark:text-white">{user.name || user.login}</h1>
              <span
                className="text-xs font-mono px-2.5 py-1 rounded-full border"
                style={{ color: archetype.color, background: `${archetype.color}18`, borderColor: `${archetype.color}30` }}
              >
                {archetype.label}
              </span>
              <span
                className="text-xs font-mono px-2.5 py-1 rounded-full border"
                style={{ color: activity.color, background: `${activity.color}18`, borderColor: `${activity.color}30` }}
              >
                {activity.label}
              </span>
            </div>
              <div className="font-mono text-sm text-zinc-500 mb-3">@{user.login}</div>
              {user.bio && <p className="text-[14px] text-slate-700 dark:text-zinc-400 mb-4 max-w-lg leading-relaxed">{user.bio}</p>}
              <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600 dark:text-zinc-500">
              {user.location && <span>📍 {user.location}</span>}
              {user.company && <span>🏢 {user.company.replace('@', '')}</span>}
              {user.blog && (
                <a href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`} target="_blank" rel="noopener" className="hover:text-zinc-300 transition-colors">
                  🔗 {user.blog.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                </a>
              )}
              {user.twitter_username && (
                <a href={`https://twitter.com/${user.twitter_username}`} target="_blank" rel="noopener" className="hover:text-zinc-300 transition-colors">
                  𝕏 @{user.twitter_username}
                </a>
              )}
              <span>⚡ GitHub since {joinYear}</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 shrink-0">
              <a
                href={user.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-slate-600 dark:text-zinc-500 border border-zinc-300 dark:border-[#2a2a2a] px-4 py-2 rounded-lg hover:text-slate-900 dark:hover:text-white hover:border-slate-400 dark:hover:border-[#444] transition-all text-center"
              >
              View on GitHub ↗
            </a>
            <ShareProfileMenu 
              user={{ ...user, followers: user.followers }} 
              archetype={archetype} 
              totalStars={impact.totalStars}
              totalForks={impact.totalForks} 
            />
          </div>
        </div>

        {/* ─── STATS ROW ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-10">
          {[
            { label: 'Repositories', value: fmtNum(user.public_repos) },
            { label: 'Followers', value: fmtNum(user.followers) },
            { label: 'Following', value: fmtNum(user.following) },
            { label: 'Total Stars', value: fmtNum(impact.totalStars) },
            { label: 'Total Forks', value: fmtNum(impact.totalForks) },
          ].map(s => (
            <div key={s.label} className="bg-white dark:bg-[#111] border border-zinc-200 dark:border-[#1e1e1e] rounded-xl p-4 text-center">
              <div className="text-xl font-light text-slate-900 dark:text-white mb-1">{s.value}</div>
              <div className="text-[11px] font-mono text-zinc-500 dark:text-zinc-600 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ─── INSIGHTS GRID ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">

          {/* Archetype Card */}
          <div className="bg-white dark:bg-[#111] border border-zinc-200 dark:border-[#1e1e1e] rounded-xl p-5 col-span-1">
            <div className="text-[11px] font-mono text-zinc-500 dark:text-zinc-600 uppercase tracking-wider mb-4">Developer Archetype</div>
            <div className="text-lg font-medium mb-1" style={{ color: archetype.color }}>{archetype.label}</div>
            <div className="text-xs text-slate-600 dark:text-zinc-500 mb-4">{archetype.desc}</div>
            <div className="flex flex-wrap gap-1.5">
              {langs.slice(0, 4).map(l => (
                <span key={l.lang} className="flex items-center gap-1.5 text-[11px] font-mono text-slate-600 dark:text-zinc-500 bg-zinc-100 dark:bg-[#1a1a1a] border border-zinc-200 dark:border-[#222] rounded-full px-2.5 py-1">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: l.color }} />
                  {l.lang}
                </span>
              ))}
            </div>
          </div>

          {/* Language Breakdown */}
          <div className="bg-white dark:bg-[#111] border border-zinc-200 dark:border-[#1e1e1e] rounded-xl p-5">
            <div className="text-[11px] font-mono text-zinc-500 dark:text-zinc-600 uppercase tracking-wider mb-4">Top Languages</div>
            <div className="space-y-2.5">
              {langs.map(l => (
                <div key={l.lang}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="flex items-center gap-2 text-xs font-mono text-slate-700 dark:text-zinc-400">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: l.color }} />
                      {l.lang}
                    </span>
                    <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-600">{l.count} repos</span>
                  </div>
                  <div className="w-full h-1 bg-zinc-100 dark:bg-[#1a1a1a] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${(l.count / (langs[0]?.count || 1)) * 100}%`, background: l.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Open Source Impact */}
          <div className="bg-white dark:bg-[#111] border border-zinc-200 dark:border-[#1e1e1e] rounded-xl p-5">
            <div className="text-[11px] font-mono text-zinc-500 dark:text-zinc-600 uppercase tracking-wider mb-4">Open Source Impact</div>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span className="text-xs text-slate-600 dark:text-zinc-500">Stars earned</span>
                <span className="text-xs font-mono text-amber-500 dark:text-amber-400">{fmtNum(impact.totalStars)} ★</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-slate-600 dark:text-zinc-500">Times forked</span>
                <span className="text-xs font-mono text-blue-500 dark:text-blue-400">{fmtNum(impact.totalForks)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-slate-600 dark:text-zinc-500">Source repos</span>
                <span className="text-xs font-mono text-slate-700 dark:text-zinc-400">{sourceRepos.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-slate-600 dark:text-zinc-500">Years on GitHub</span>
                <span className="text-xs font-mono text-slate-700 dark:text-zinc-400">{yearsOnGH}y</span>
              </div>
            </div>
            {impact.topRepos[0] && (
              <div className="pt-3 border-t border-zinc-200 dark:border-[#1a1a1a]">
                <div className="text-[10px] font-mono text-zinc-500 dark:text-zinc-700 uppercase tracking-wider mb-2">Top repo</div>
                <Link
                  href={`/${params.username}/${impact.topRepos[0].name}`}
                  className="text-xs font-mono text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: langColor(impact.topRepos[0].language ?? '') }} />
                  {impact.topRepos[0].name}
                  <span className="text-amber-500 ml-auto">★ {fmtNum(impact.topRepos[0].stargazers_count)}</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* ─── LANGUAGE TIMELINE ─────────────────────────────────────────────── */}
        <LanguageTimelineChart repos={repos} />

        {/* ─── REPOS ─────────────────────────────────────────────────── */}
        <RepoFilter repos={repos} username={params.username} />
      </main>
    </>
  )
}
