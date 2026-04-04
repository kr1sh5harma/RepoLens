'use client'

import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import StarField from '@/components/StarField'
import SearchBar from '@/components/SearchBar'
import TypewriterText from '@/components/TypewriterText'

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  }

  return (
    <>
      <Navbar />
      <StarField />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 min-h-screen flex flex-col items-center justify-center px-5 pt-12"
      >
        {/* Centered content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center max-w-2xl"
        >

          {/* Eyebrow label */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-2 mb-8"
          >
            <motion.span
              className="w-1.5 h-1.5 rounded-full bg-emerald-400"
              animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.span className="text-[11px] font-mono text-zinc-500 uppercase tracking-[0.15em]">
              GitHub Profile Analyzer
            </motion.span>
          </motion.div>

          {/* Title */}
          <motion.div variants={itemVariants}>
            <h1 className="text-5xl md:text-7xl font-light tracking-[-0.04em] leading-none mb-5 text-white">
              Understand any<br />
              <TypewriterText text="codebase" />
            </h1>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="text-[15px] text-zinc-500 leading-relaxed mb-12 max-w-sm"
          >
            Deep insights into GitHub profiles — commits, patterns, languages, and coding personality at a glance.
          </motion.p>

          <motion.div variants={itemVariants}>
            <SearchBar />
          </motion.div>

          {/* Quick examples */}
          <motion.div
            variants={itemVariants}
            className="mt-5 flex flex-wrap items-center justify-center gap-2"
          >
            <span className="text-[11px] font-mono text-zinc-700 uppercase tracking-wider mr-1">Try:</span>
            {['torvalds', 'gaearon', 'sindresorhus', 'yyx990803'].map((u, i) => (
              <motion.a
                key={u}
                href={`/${u}`}
                variants={{
                  hidden: { opacity: 0, scale: 0.8 },
                  visible: {
                    opacity: 1,
                    scale: 1,
                    transition: {
                      delay: i * 0.1,
                      duration: 0.4,
                    },
                  },
                }}
                whileHover={{
                  scale: 1.1,
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                }}
                whileTap={{ scale: 0.95 }}
                className="text-[11px] font-mono text-zinc-600 border border-[#222] rounded-full px-3 py-1 hover:text-zinc-300 hover:border-[#444] transition-all cursor-pointer"
              >
                @{u}
              </motion.a>
            ))}
          </motion.div>
        </motion.div>


        {/* Bottom feature hints */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="absolute bottom-5 inset-x-0 flex items-center justify-center gap-8 text-[11px] font-mono text-zinc-700"
        >
          {['Commit patterns', 'Language analysis', 'PR insights', 'Repo health scores'].map((f, i) => (
            <motion.span
              key={f}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 + i * 0.1, duration: 0.5 }}
              className="hidden md:block hover:text-zinc-400 transition-colors duration-300"
            >
              {f}
            </motion.span>
          ))}
        </motion.div>
      </motion.main>
    </>
  )
}
