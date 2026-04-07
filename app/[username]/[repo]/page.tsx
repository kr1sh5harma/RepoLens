import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import RepoTabs from '@/components/RepoTabs'
import { getRepo, getCommits, getPRs, getLanguages, getContributors } from '@/lib/github'
import { repoActivityStatus, fmtNum, timeAgo, formatDate, langColor } from '@/lib/utils'

interface Props { params: { username: string; repo: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const repo = await getRepo(params.username, params.repo)
    return {
      title: `${repo.full_name} — `,
      description: repo.description ?? `GitHub repo analysis for ${repo.full_name}`,
    }
  } catch {
    return { title: 'Repo not found — GitGet' }
  }
}

export default async function RepoPage({ params }: Props) {
  let repo, commits, prs, languages, contributors
  try {
    ;[repo, commits, prs, languages, contributors] = await Promise.all([
      getRepo(params.username, params.repo),
      getCommits(params.username, params.repo, 30),
      getPRs(params.username, params.repo),
      getLanguages(params.username, params.repo),
      getContributors(params.username, params.repo),
    ])
  } catch (e: any) {
    if (e.message?.includes('Not found')) notFound()
    throw e
  }

  const status = repoActivityStatus(repo)
  const primaryLang = repo.language

  return (
    <>
      <Navbar username={params.username} repo={params.repo} />
      <main className="max-w-5xl mx-auto px-5 pt-24 pb-20">

        {/* ─── REPO HERO ────────────────────────────────────────────── */}
        <div className="mb-10">
          {/* Archived banner */}
          {repo.archived && (
            <div className="mb-5 px-4 py-3 bg-amber-950/40 border border-amber-900/40 rounded-xl text-amber-500 text-sm font-mono">
              ⚠ This repository has been archived by its owner.
            </div>
          )}

          {/* Title row */}
          <div className="flex flex-wrap items-start gap-4 mb-4">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Link
                  href={`/${params.username}`}
                  className="text-slate-500 hover:text-slate-900 dark:text-zinc-500 dark:hover:text-zinc-300 text-sm font-mono transition-colors"
                >
                  {params.username}
                </Link>
                <span className="text-slate-400 dark:text-zinc-700">/</span>
                <h1 className="text-lg font-medium font-mono text-slate-800 dark:text-white">{repo.name}</h1>
                {repo.fork && (
                  <span className="text-[10px] font-mono text-slate-500 dark:text-zinc-600 border border-zinc-200 dark:border-[#2a2a2a] rounded px-1.5 py-0.5">fork</span>
                )}
                <span
                  className="text-[10px] font-mono px-2 py-0.5 rounded-full border"
                  style={{ color: status.color, background: `${status.color}15`, borderColor: `${status.color}30` }}
                >
                  {status.label}
                </span>
              </div>
              {repo.description && (
                <p className="text-[14px] text-slate-600 dark:text-zinc-400 leading-relaxed max-w-2xl">{repo.description}</p>
              )}
            </div>
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-slate-600 dark:text-zinc-500 border border-zinc-300 dark:border-[#2a2a2a] px-4 py-2 rounded-lg hover:text-slate-900 dark:hover:text-white hover:border-slate-400 dark:hover:border-[#444] transition-all shrink-0 flex items-center gap-2"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
              </svg>
              View on GitHub ↗
            </a>
          </div>

          {/* Quick info strip */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-mono text-slate-500 dark:text-zinc-600 mb-6">
            {primaryLang && (
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ background: langColor(primaryLang) }} />
                {primaryLang}
              </span>
            )}
            {repo.license && <span>⚖ {repo.license.name}</span>}
            <span>🌿 {repo.default_branch}</span>
            <span>Updated {timeAgo(repo.pushed_at)}</span>
            <span>Created {formatDate(repo.created_at)}</span>
            {repo.homepage && (
              <a href={repo.homepage} target="_blank" rel="noopener" className="text-blue-500 hover:text-blue-400 transition-colors">
                🔗 {repo.homepage.replace(/^https?:\/\//, '').replace(/\/$/, '')}
              </a>
            )}
          </div>

          {/* Stats strip */}
          <div className="flex gap-3 flex-wrap">
            {[
              { icon: '★', label: 'Stars', value: fmtNum(repo.stargazers_count), color: '#fbbf24' },
              { icon: '⑂', label: 'Forks', value: fmtNum(repo.forks_count), color: '#60a5fa' },
              { icon: '◉', label: 'Watchers', value: fmtNum(repo.watchers_count), color: '#a78bfa' },
              { icon: '!', label: 'Issues', value: String(repo.open_issues_count), color: '#f87171' },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-2 bg-white dark:bg-[#111] border border-zinc-200 dark:border-[#1e1e1e] rounded-lg px-3 py-2">
                <span style={{ color: s.color }} className="text-xs">{s.icon}</span>
                <span className="text-sm font-light" style={{ color: s.color }}>{s.value}</span>
                <span className="text-xs text-slate-500 dark:text-zinc-600">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ─── TABS ─────────────────────────────────────────────────── */}
        <RepoTabs
          repo={repo}
          commits={commits}
          prs={prs}
          contributors={contributors}
          languages={languages}
        />
      </main>
    </>
  )
}
