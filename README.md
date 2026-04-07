<div align="center">
  
  <h1>GitGet 🚀</h1>
  <p><strong>A clean, highly insightful, and visually stunning GitHub profile analyzer built with Next.js 14.</strong></p>

  [![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat&logo=next.js)](https://nextjs.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
  [![Vercel](https://img.shields.io/badge/Live_Demo-Vercel-black?style=flat&logo=vercel)](https://gitget-beta.vercel.app/)

  <h3><a href="https://gitget-beta.vercel.app/">View Live Demo</a></h3>
</div>

<hr />

## 📖 Overview

**GitGet** is a modern GitHub profile insight tool that transforms raw GitHub API data into beautiful, actionable metrics and developer profiles. It uncovers a user's coding archetype, rhythm, and repository health through deep data analysis — wrapped in a premium, notion-inspired dark mode UI with interactive holographic cards and subtle animations.

## ✨ Key Features

- **🎮 Immersive UI / UX:** Animated canvas starfield background, dynamic text typing, smooth page transitions, and our signature iridescent **holographic hover cards** on repositories.
- **🧠 Developer Archetypes:** Our bespoke algorithm analyzes programming languages and commit styles to assign you an archetype (e.g., *Frontend Wizard*, *Backend Engineer*, *Fullstack Polyglot*).
- **🗂️ Advanced Profile Stats:** Deep insights into followers, public repos, and a generated **Social Share Card** perfect for Twitter or LinkedIn!
- **📊 Granular Repo Insights:** Every repository has a dedicated deep-dive page featuring:
  - Commit activity heatmaps (last 12 weeks).
  - Programming language breakdown visualizers.
  - Lifecycle and collaboration tracking charts.
  - Repository Health Scores (with a checklist).
- **🌙 True Dark Theme:** Designed natively for the dark-mode purist, featuring true `#111` blacks and elegant zinc/slate borders.
- **⚡ Blazing Fast:** Built utilizing Next.js 14 App Router, Server Components, and optimized Framer Motion animations.

## 🛠 Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router, React Server Components)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **API:** [GitHub REST API v3](https://docs.github.com/en/rest)
- **Deployment:** [Vercel](https://vercel.com/)
- **Icons:** [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

Want to run GitGet locally? It takes less than 2 minutes.

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/gitget.git
cd gitget
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables
GitGet uses the GitHub API. While you *can* run it without a token, you will hit rate limits very quickly (60 requests/hr). Adding a token gives you 5,000 requests/hr.

1. Go to your [GitHub Developer Settings](https://github.com/settings/tokens).
2. Generate a new "Personal Access Token (classic)". You **do not** need to check any scope boxes (only public data is accessed).
3. Create a `.env.local` file in the root of the project:
```bash
cp .env.example .env.local
```
4. Paste your token into `.env.local`:
```env
GITHUB_TOKEN=your_generated_token_here
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## 🌐 Live Website

You can view the live, fully functional version of GitGet here:
**[https://gitget-beta.vercel.app](https://gitget-beta.vercel.app)**

## 🗺️ Project Structure

```
GitGet/
├── app/
│   ├── page.tsx                  # Home page with starfield & search
│   ├── layout.tsx                # App layout & global CSS
│   ├── error.tsx                 # Error boundary
│   ├── not-found.tsx             # Custom 404 page
│   ├── [username]/
│   │   ├── page.tsx              # User profile & repo grid (Holographic Cards)
│   │   ├── opengraph-image.tsx   # Dynamic OpenGraph social card generator
│   │   └── [repo]/
│   │       └── page.tsx          # Deep-dive repository analytics tabs
├── components/
│   ├── AnimatedRepoCard.tsx      # Framer-motion driven repo cards
│   ├── DevCardGenerator.tsx      # Generates downloadable dev personas
│   ├── LanguageTimelineChart.tsx # Stacked bar chart for repo history
│   ├── Navbar.tsx                # Context-aware breadcrumb navigation
│   ├── RepoFilter.tsx            # Filtering & sorting logic for repos
│   ├── RepoLifecycleChart.tsx    # Lifecycle tracking chart
│   ├── RepoTabs.tsx              # Complex data viz (Commits, PRs, Heatmaps)
│   ├── SearchBar.tsx             # Interactive search input
│   ├── ShareProfileMenu.tsx      # Social sharing integrations
│   ├── StarField.tsx             # Canvas background animation
│   ├── ThemeProvider.tsx         # Next-themes provider
│   ├── ThemeToggle.tsx           # Dark/Light mode switch
│   └── TypewriterText.tsx        # Typing text effect
├── lib/
│   ├── github.ts                 # Typed GitHub API fetch wrappers
│   └── utils.ts                  # Algorithms for archetypes & health scores
```


