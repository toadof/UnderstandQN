import { motion, AnimatePresence } from 'framer-motion'

export default function CallStackPanel({ callStack }) {
  if (!callStack || callStack.length === 0) return null

  return (
    <motion.div
      className="rounded-xl border border-slate-700/50 bg-gradient-to-b from-slate-800/80 to-slate-900/80 backdrop-blur-sm overflow-hidden"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-700/40">
        <div className="w-2 h-2 rounded-full bg-violet-500 shadow-lg shadow-violet-500/40" />
        <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500">
          Call Stack
        </span>
        <span className="text-[10px] font-mono text-slate-600">{callStack.length} frame{callStack.length > 1 ? 's' : ''}</span>
      </div>
      <div className="px-4 py-2.5 flex flex-wrap items-center gap-1.5">
        <AnimatePresence>
          {callStack.map((fn, i) => (
            <motion.div
              key={`${fn}-${i}`}
              className="flex items-center gap-1.5"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              {i > 0 && (
                <svg className="w-3 h-3 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              )}
              <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold border transition-all ${
                i === callStack.length - 1
                  ? 'bg-violet-500/15 border-violet-500/40 text-violet-300 shadow-md shadow-violet-500/10'
                  : 'bg-slate-800/50 border-slate-700/30 text-slate-500'
              }`}>
                {fn}()
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
