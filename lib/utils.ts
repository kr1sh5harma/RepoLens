import type { GHCommit, GHRepo, GHPR, GHLanguages } from './github'

// ─── TIME ────────────────────────────────────────────────────────────────────
export function timeAgo(date: string): string {
  const s = (Date.now() - new Date(date).getTime()) / 1000
  if (s < 60) return 'just now'
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  if (s < 2592000) return `${Math.floor(s / 86400)}d ago`
  if (s < 31536000) return `${Math.floor(s / 2592000)}mo ago`
  return `${Math.floor(s / 31536000)}y ago`
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

// ─── NUMBERS ─────────────────────────────────────────────────────────────────
export function fmtNum(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

// ─── LANGUAGE COLORS ─────────────────────────────────────────────────────────
const LANG_COLORS: Record<string, string> = {
  JavaScript: '#f7df1e', TypeScript: '#3178c6', Python: '#3572A5', Rust: '#dea584',
  Go: '#00ADD8', Java: '#b07219', 'C++': '#f34b7d', C: '#555555', Ruby: '#701516',
  PHP: '#4F5D95', Swift: '#F05138', Kotlin: '#A97BFF', Dart: '#00B4AB',
  HTML: '#e34c26', CSS: '#563d7c', Shell: '#89e051', Vue: '#41b883', Svelte: '#ff3e00',
  Scala: '#c22d40', Elixir: '#6e4a7e', Haskell: '#5e5086', Lua: '#000080',
  'Jupyter Notebook': '#DA5B0B', R: '#198CE7', Nix: '#7e7eff', 'C#': '#239120',
  MATLAB: '#e16737', Perl: '#0298c3', Clojure: '#db5855', Erlang: '#B83998',
  'F#': '#b845fc', OCaml: '#3be133', Nim: '#ffc200', Zig: '#ec915c',
  Solidity: '#AA6746', Dockerfile: '#384d54', YAML: '#cb171e',
}
export function langColor(lang: string): string {
  return LANG_COLORS[lang] ?? '#666'
}

// ─── LANGUAGE BREAKDOWN ───────────────────────────────────────────────────────
export function computeLangBreakdown(langs: GHLanguages) {
  const total = Object.values(langs).reduce((a, b) => a + b, 0)
  return Object.entries(langs)
    .sort(([, a], [, b]) => b - a)
    .map(([name, bytes]) => ({
      name,
      bytes,
      pct: total > 0 ? +((bytes / total) * 100).toFixed(1) : 0,
      color: langColor(name),
    }))
}

// ─── DEVELOPER ARCHETYPE ─────────────────────────────────────────────────────
const FRONTEND_LANGS = new Set(['JavaScript', 'TypeScript', 'HTML', 'CSS', 'Vue', 'Svelte', 'Sass', 'SCSS'])
const BACKEND_LANGS = new Set(['Python', 'Go', 'Ruby', 'PHP', 'Java', 'Elixir', 'Erlang', 'Scala', 'Clojure'])
const SYSTEMS_LANGS = new Set(['C', 'C++', 'Rust', 'Zig', 'Nim', 'Assembly'])
const DATA_LANGS = new Set(['Python', 'R', 'Julia', 'MATLAB', 'Jupyter Notebook'])
const MOBILE_LANGS = new Set(['Swift', 'Kotlin', 'Dart', 'Objective-C'])

type Archetype = { label: string; desc: string; color: string }

export function computeArchetype(repos: GHRepo[]): Archetype {
  const langCounts: Record<string, number> = {}
  for (const r of repos) {
    if (r.language) langCounts[r.language] = (langCounts[r.language] ?? 0) + 1
  }
  const total = Object.values(langCounts).reduce((a, b) => a + b, 0)
  if (total === 0) return { label: 'Explorer', desc: 'No dominant language yet', color: '#888' }

  let fe = 0, be = 0, sys = 0, data = 0, mobile = 0
  for (const [lang, cnt] of Object.entries(langCounts)) {
    const share = cnt / total
    if (FRONTEND_LANGS.has(lang)) fe += share
    if (BACKEND_LANGS.has(lang)) be += share
    if (SYSTEMS_LANGS.has(lang)) sys += share
    if (DATA_LANGS.has(lang)) data += share
    if (MOBILE_LANGS.has(lang)) mobile += share
  }

  const max = Math.max(fe, be, sys, data, mobile)
  if (max < 0.25) return { label: 'Polyglot', desc: 'Comfortable across many ecosystems', color: '#a78bfa' }
  if (max === sys) return { label: 'Systems Engineer', desc: 'Writes close-to-the-metal code', color: '#f87171' }
  if (max === data) return { label: 'Data Scientist', desc: 'Turns numbers into insights', color: '#34d399' }
  if (max === mobile) return { label: 'Mobile Developer', desc: 'Builds native mobile experiences', color: '#60a5fa' }
  if (fe > 0.5) return { label: 'Frontend Craftsman', desc: 'Lives in the UI layer', color: '#fbbf24' }
  if (be > 0.5) return { label: 'Backend Engineer', desc: 'Masters of servers and APIs', color: '#818cf8' }
  return { label: 'Full-Stack Developer', desc: 'Bridges frontend and backend', color: '#2dd4bf' }
}

// ─── ACTIVITY LEVEL ───────────────────────────────────────────────────────────
type ActivityLevel = { label: string; color: string; intensity: number }
export function computeActivityLevel(repos: GHRepo[]): ActivityLevel {
  const now = Date.now()
  const dayMs = 86400000
  const recent7 = repos.filter(r => now - new Date(r.pushed_at).getTime() < 7 * dayMs).length
  const recent30 = repos.filter(r => now - new Date(r.pushed_at).getTime() < 30 * dayMs).length
  const recent90 = repos.filter(r => now - new Date(r.pushed_at).getTime() < 90 * dayMs).length

  if (recent7 >= 3) return { label: 'Hyper Active', color: '#4ade80', intensity: 100 }
  if (recent7 >= 1) return { label: 'Very Active', color: '#86efac', intensity: 85 }
  if (recent30 >= 3) return { label: 'Active', color: '#a3e635', intensity: 70 }
  if (recent30 >= 1) return { label: 'Moderate', color: '#fbbf24', intensity: 50 }
  if (recent90 >= 1) return { label: 'Occasional', color: '#fb923c', intensity: 30 }
  return { label: 'Dormant', color: '#f87171', intensity: 10 }
}

// ─── OPEN SOURCE IMPACT ───────────────────────────────────────────────────────
export function computeOSImpact(repos: GHRepo[]) {
  const totalStars = repos.reduce((a, r) => a + r.stargazers_count, 0)
  const totalForks = repos.reduce((a, r) => a + r.forks_count, 0)
  const topRepos = [...repos].sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 3)
  const sourceRepos = repos.filter(r => !r.fork).length
  return { totalStars, totalForks, topRepos, sourceRepos }
}

// ─── COMMIT RHYTHM ────────────────────────────────────────────────────────────
type CommitRhythm = { label: string; desc: string; color: string }
export function computeCommitRhythm(commits: GHCommit[]): CommitRhythm {
  if (commits.length === 0) return { label: 'No data', desc: 'No commits found', color: '#555' }
  if (commits.length < 3) return { label: 'Starter', desc: 'Just getting started', color: '#888' }

  const dates = commits.map(c => new Date(c.commit.author.date).getTime()).sort((a, b) => b - a)
  const dayMs = 86400000
  const spans: number[] = []
  for (let i = 0; i < dates.length - 1; i++) spans.push(dates[i] - dates[i + 1])
  const avgSpanDays = spans.reduce((a, b) => a + b, 0) / spans.length / dayMs

  if (avgSpanDays < 1) return { label: 'Daily Driver', desc: 'Multiple commits every day', color: '#4ade80' }
  if (avgSpanDays < 3) return { label: 'Consistent Builder', desc: 'Regular commits every few days', color: '#86efac' }
  if (avgSpanDays < 7) return { label: 'Weekly Shipper', desc: 'Steady weekly cadence', color: '#a3e635' }
  if (avgSpanDays < 21) return { label: 'Sprint-Based', desc: 'Focused bursts of activity', color: '#fbbf24' }
  return { label: 'Feature Dropper', desc: 'Infrequent but meaningful commits', color: '#fb923c' }
}

// ─── COLLABORATION SCORE ─────────────────────────────────────────────────────
export function computeCollabScore(repo: GHRepo, prs: GHPR[], contributorCount: number) {
  let score = 0
  if (repo.forks_count > 0) score += Math.min(30, repo.forks_count * 2)
  if (prs.length > 0) score += Math.min(30, prs.length * 3)
  if (contributorCount > 1) score += Math.min(25, contributorCount * 5)
  if (repo.stargazers_count > 0) score += Math.min(15, Math.log10(repo.stargazers_count) * 8)
  return Math.min(100, Math.round(score))
}

// ─── REPO HEALTH SCORE ────────────────────────────────────────────────────────
export function computeRepoHealth(repo: GHRepo, commits: GHCommit[]) {
  let score = 50
  const daysSinceLastPush = (Date.now() - new Date(repo.pushed_at).getTime()) / 86400000
  if (daysSinceLastPush < 7) score += 20
  else if (daysSinceLastPush < 30) score += 10
  else if (daysSinceLastPush > 365) score -= 20

  if (repo.stargazers_count > 100) score += 15
  else if (repo.stargazers_count > 10) score += 8
  if (repo.description) score += 5
  if (repo.topics?.length > 0) score += 5
  if (repo.homepage) score += 3
  if (repo.license) score += 5
  if (repo.open_issues_count > 20) score -= 10
  if (repo.archived) score = 20

  return Math.max(0, Math.min(100, score))
}

// ─── ACTIVITY STATUS ─────────────────────────────────────────────────────────
export function repoActivityStatus(repo: GHRepo): { label: string; color: string } {
  if (repo.archived) return { label: 'Archived', color: '#888' }
  const days = (Date.now() - new Date(repo.pushed_at).getTime()) / 86400000
  if (days < 14) return { label: 'Actively Developed', color: '#4ade80' }
  if (days < 90) return { label: 'Maintained', color: '#86efac' }
  if (days < 365) return { label: 'Stable', color: '#fbbf24' }
  return { label: 'Stale', color: '#f87171' }
}

// ─── TOP LANGUAGES FROM REPOS ─────────────────────────────────────────────────
export function topLanguages(repos: GHRepo[]): { lang: string; count: number; color: string }[] {
  const map: Record<string, number> = {}
  for (const r of repos) if (r.language) map[r.language] = (map[r.language] ?? 0) + 1
  return Object.entries(map)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6)
    .map(([lang, count]) => ({ lang, count, color: langColor(lang) }))
}

// ─── COMMIT HEATMAP DATA ─────────────────────────────────────────────────────
export function buildCommitHeatmap(commits: GHCommit[]): number[] {
  const weeks = Array(12).fill(0)
  const now = Date.now()
  for (const c of commits) {
    const weeksAgo = Math.floor((now - new Date(c.commit.author.date).getTime()) / (7 * 86400000))
    if (weeksAgo < 12) weeks[11 - weeksAgo]++
  }
  return weeks
}

// ─── COMMIT MESSAGE STYLE ─────────────────────────────────────────────────────
export function analyzeCommitStyle(commits: GHCommit[]): { label: string; desc: string } {
  if (commits.length === 0) return { label: 'Unknown', desc: 'No commits to analyze' }
  const msgs = commits.map(c => c.commit.message.split('\n')[0])
  const conventional = msgs.filter(m => /^(feat|fix|docs|style|refactor|test|chore|perf|ci|build)(\(.+\))?:/.test(m)).length
  const hasEmoji = msgs.filter(m => /\p{Emoji}/u.test(m)).length
  const avgLen = msgs.reduce((a, m) => a + m.length, 0) / msgs.length

  if (conventional / msgs.length > 0.5) return { label: 'Conventional Commits', desc: 'Structured, tooling-friendly commit style' }
  if (hasEmoji / msgs.length > 0.3) return { label: 'Emoji-Driven', desc: 'Expressive commits with visual context' }
  if (avgLen > 60) return { label: 'Descriptive Writer', desc: 'Thorough, detailed commit messages' }
  if (avgLen < 20) return { label: 'Quick Tagger', desc: 'Short and direct commit messages' }
  return { label: 'Standard Style', desc: 'Clear and straightforward messages' }
}