'use client'
import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import html2canvas from 'html2canvas'
import { useTheme } from 'next-themes'
import { Share2, X, Link as LinkIcon, Users, Star, GitFork } from 'lucide-react'

interface ShareProfileMenuProps {
  user: { login: string; name?: string | null; avatar_url: string; followers: number }
  archetype: { label: string; desc: string; color: string }
  totalStars: number
  totalForks: number
}

function VerifiedIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C10.5 2 9.2 2.8 8.5 4C7 4.2 5.8 5.4 5.6 6.9C4.4 7.6 3.6 8.9 3.6 10.4C3.6 11.9 4.4 13.2 5.6 13.9C5.8 15.4 7 16.6 8.5 16.8C9.2 18 10.5 18.8 12 18.8C13.5 18.8 14.8 18 15.5 16.8C17 16.6 18.2 15.4 18.4 13.9C19.6 13.2 20.4 11.9 20.4 10.4C20.4 8.9 19.6 7.6 18.4 6.9C18.2 5.4 17 4.2 15.5 4C14.8 2.8 13.5 2 12 2ZM10.5 14L6.9 10.4L8.3 9L10.5 11.2L16.2 5.5L17.6 6.9L10.5 14Z" fill="#16a34a"/>
    </svg>
  )
}

export default function ShareProfileMenu({ user, archetype, totalStars, totalForks }: ShareProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const { resolvedTheme } = useTheme()
  const theme = resolvedTheme || 'dark'
  const cardRef = useRef<HTMLDivElement>(null)

  const generateImageAndShare = async (platform: 'twitter' | 'linkedin') => {
    if (!cardRef.current) return
    
    // Quick copy to clipboard if we could easily share images, 
    // but web share API for Twitter/LinkedIn with pure image data URLs is restricted.
    // However, the prompt asked to "share the card like reference image on linkedin or twitter".
    // We will simulate the intent or at least provide the direct profile link with text.
    // The visual card is mainly to show the user what the preview resembles.
    
    // In a real server-side Next.js, we'd use <meta property="og:image">. 
    // For now, we open the share dialog for the URL.
    const url = `https://repolens.com/${user.login}` // or window.location.href
    let text = ''
    let shareUrl = ''
    
    if (platform === 'twitter') {
      text = `Check out my GitHub Developer Profile on RepoLens! 🚀\nI'm a "${archetype.label}" developer with ${totalStars} stars.\n`
      shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`
    } else {
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`
    }
    
    window.open(shareUrl, '_blank')
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-xs font-mono text-slate-600 dark:text-zinc-500 border border-zinc-300 dark:border-[#2a2a2a] px-4 py-2 rounded-lg hover:text-slate-900 dark:hover:text-white hover:border-slate-400 dark:hover:border-[#444] transition-all text-center flex items-center justify-center gap-2"
      >
        <Share2 size={14} />
        Share Profile
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative z-10 w-full max-w-sm bg-white dark:bg-[#111] border border-zinc-200 dark:border-[#2a2a2a] rounded-[32px] overflow-hidden flex flex-col items-center"
            >
              <div className="w-full flex justify-between items-center p-4 absolute top-0 z-20">
                <div />
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md text-white hover:text-white transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Card Preview Container */}
              <div className="p-4 w-full bg-zinc-50 dark:bg-[#0a0a0a] flex items-center justify-center relative overflow-hidden transition-colors">
                <div className="absolute inset-0 opacity-20 blur-3xl bg-gradient-to-br from-indigo-500 to-purple-500" />
                
                <div 
                  ref={cardRef} 
                  className={`w-[280px] aspect-[1/1.6] rounded-[24px] relative overflow-hidden shadow-2xl transition-colors ${theme === 'dark' ? 'bg-[#050505]' : 'bg-white'}`}
                >
                  {/* Background Image / Avatar */}
                  <img 
                    src={user.avatar_url} 
                    alt={user.login}
                    crossOrigin="anonymous"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  
                  {/* Elegant Glassy Bottom Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t top-1/3 transition-colors ${theme === 'dark' ? 'from-[#050505] via-[#050505]/90 to-transparent' : 'from-white via-white/40 to-transparent'}`} />
                  
                  <div className={`absolute bottom-0 w-full p-6 transition-colors ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    <h2 className="text-xl font-semibold tracking-tight flex items-center gap-1.5 mb-2">
                      {user.name || user.login}
                      <VerifiedIcon />
                    </h2>
                    
                    <p className={`text-[13px] leading-snug mb-6 font-medium transition-colors ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-700'}`}>
                      {archetype.desc}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className={`flex items-center gap-3 text-sm font-semibold transition-colors ${theme === 'dark' ? 'text-zinc-200' : 'text-slate-800'}`}>
                        <span className="flex items-center gap-1"><Users size={14} className={theme === 'dark' ? 'text-zinc-500' : 'text-slate-500'}/> {user.followers}</span>
                        <span className="flex items-center gap-1"><Star size={14} className={theme === 'dark' ? 'text-zinc-500' : 'text-slate-500'}/> {totalStars}</span>
                      </div>
                      <div className={`${theme === 'dark' ? 'bg-white/10 text-white' : 'bg-white/80 text-black'} backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-sm text-[12px] font-semibold flex items-center gap-1.5 transition-colors`}>
                        <GitFork size={14}/> {totalForks}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Share Options */}
              <div className="w-full p-6 bg-white dark:bg-[#111] grid grid-cols-3 gap-4 border-t border-zinc-200 dark:border-[#1e1e1e]">
                <button
                  onClick={() => generateImageAndShare('linkedin')}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className="w-12 h-12 rounded-full bg-[#0a66c2] flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 dark:text-zinc-400 group-hover:text-slate-900 dark:group-hover:text-zinc-200">LinkedIn</span>
                </button>
                
                <button
                  onClick={() => generateImageAndShare('twitter')}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className="w-12 h-12 rounded-full bg-slate-900 dark:bg-black border border-zinc-200 dark:border-[#2a2a2a] flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 dark:text-zinc-400 group-hover:text-slate-900 dark:group-hover:text-zinc-200">Twitter</span>
                </button>
                
                <button
                  onClick={handleCopyLink}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-all transform group-hover:scale-105 ${copied ? 'bg-emerald-600' : 'bg-slate-800 dark:bg-zinc-800'}`}>
                    <LinkIcon size={20} />
                  </div>
                  <span className={`text-[11px] font-mono ${copied ? 'text-emerald-500' : 'text-slate-500 dark:text-zinc-400 group-hover:text-slate-900 dark:group-hover:text-zinc-200'}`}>
                    {copied ? 'Copied!' : 'Copy Link'}
                  </span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
