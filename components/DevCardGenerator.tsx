'use client'
import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import html2canvas from 'html2canvas'
import { Download, Share2, X } from 'lucide-react'

interface DevCardProps {
  user: { login: string; name?: string | null; avatar_url: string }
  archetype: { label: string; color: string }
  totalStars: number
  yearsOnGH: number
  langs: { lang: string; color: string; count: number }[]
}

export default function DevCardGenerator({ user, archetype, totalStars, yearsOnGH, langs }: DevCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [generating, setGenerating] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleDownload = async () => {
    if (!cardRef.current) return
    setGenerating(true)
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#0a0a0a',
        logging: false
      })
      const url = canvas.toDataURL('image/png')
      const a = document.createElement('a')
      a.href = url
      a.download = `${user.login}-devcard.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } finally {
      setGenerating(false)
    }
  }

  const handleShareTwitter = () => {
    const text = `Check out my GitHub Developer Card generated on RepoLens! 🚀\nI'm a "${archetype.label}" developer.\n\n`
    const url = `https://github.com/${user.login}`
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank')
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-xs font-mono text-zinc-500 border border-[#2a2a2a] px-4 py-2 rounded-lg hover:text-white hover:border-[#444] hover:bg-[#1a1a1a] transition-all text-center flex items-center justify-center gap-2"
      >
        <Share2 size={14} />
        Generate DevCard
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
              className="relative z-10 w-full max-w-lg bg-[#111] border border-[#2a2a2a] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="flex justify-between items-center p-4 border-b border-[#1e1e1e]">
                <h3 className="font-medium text-sm">Your DevCard</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-zinc-500 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 bg-[#0a0a0a] flex items-center justify-center overflow-auto">
                <div 
                  ref={cardRef} 
                  className="w-[450px] aspect-[1.91/1] rounded-2xl relative overflow-hidden flex items-center shadow-lg border border-[rgba(255,255,255,0.05)]"
                  style={{
                    background: `linear-gradient(135deg, #111 0%, #050505 100%)`
                  }}
                >
                  {/* Subtle noise and decorative lights */}
                  <div className="absolute inset-0 opacity-[0.03] url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E') mix-blend-overlay"></div>
                  <div className="absolute -top-32 -left-32 w-64 h-64 rounded-full blur-[100px]" style={{ background: archetype.color, opacity: 0.15 }} />
                  <div className="absolute -bottom-32 -right-32 w-64 h-64 rounded-full blur-[100px]" style={{ background: archetype.color, opacity: 0.1 }} />
                  
                  {/* Content */}
                  <div className="relative z-10 w-full h-full p-8 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4">
                        <img 
                          src={user.avatar_url} 
                          alt={user.login}
                          crossOrigin="anonymous"
                          className="w-16 h-16 rounded-xl border-2 border-[rgba(255,255,255,0.1)] object-cover shadow-md"
                        />
                        <div>
                          <h1 className="text-xl font-semibold text-white leading-tight">{user.name || user.login}</h1>
                          <p className="text-sm font-mono text-zinc-400">@{user.login}</p>
                        </div>
                      </div>
                      <div 
                        className="px-3 py-1 rounded-full text-xs font-mono font-medium border"
                        style={{ color: archetype.color, backgroundColor: `${archetype.color}15`, borderColor: `${archetype.color}30` }}
                      >
                        {archetype.label}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-end mt-8">
                      <div className="space-y-4 flex-1">
                        <div className="grid grid-cols-2 gap-4 max-w-[240px]">
                          <div>
                            <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono mb-1">Total Stars</p>
                            <p className="text-xl font-light text-white">{totalStars.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono mb-1">Years on GH</p>
                            <p className="text-xl font-light text-white">{yearsOnGH}</p>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono mb-2">Top Languages</p>
                          <div className="flex gap-2">
                            {langs.slice(0, 3).map(l => (
                              <div key={l.lang} className="flex items-center gap-1.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-md px-2 py-1">
                                <span className="w-2 h-2 rounded-full" style={{ background: l.color }} />
                                <span className="text-xs font-mono text-zinc-300">{l.lang}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="shrink-0 text-right">
                        <div className="text-[10px] text-zinc-600 font-mono mb-1">Generated by</div>
                        <div className="text-sm font-medium tracking-tight text-zinc-300">RepoLens</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-[#1e1e1e] bg-[#111] flex justify-end gap-3">
                <button
                  onClick={handleShareTwitter}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#1da1f2] hover:bg-[#1a91da] rounded-lg transition-colors flex justify-center items-center gap-2"
                >
                  <Share2 size={16} /> Twitter
                </button>
                <button
                  onClick={handleDownload}
                  disabled={generating}
                  className="px-4 py-2 text-sm font-medium text-background bg-white hover:bg-zinc-200 rounded-lg transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
                >
                  {generating ? 'Generating...' : <><Download size={16} /> Download</>}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
