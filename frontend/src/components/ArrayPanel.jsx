import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const POINTER_COLORS = {
  0: { bg: 'from-amber-500/30 to-amber-600/10', border: 'border-amber-500/60', text: 'text-amber-400', glow: 'shadow-amber-500/30', dot: 'bg-amber-400' },
  1: { bg: 'from-pink-500/30 to-pink-600/10', border: 'border-pink-500/60', text: 'text-pink-400', glow: 'shadow-pink-500/30', dot: 'bg-pink-400' },
  2: { bg: 'from-emerald-500/30 to-emerald-600/10', border: 'border-emerald-500/60', text: 'text-emerald-400', glow: 'shadow-emerald-500/30', dot: 'bg-emerald-400' },
  3: { bg: 'from-cyan-500/30 to-cyan-600/10', border: 'border-cyan-500/60', text: 'text-cyan-400', glow: 'shadow-cyan-500/30', dot: 'bg-cyan-400' },
  4: { bg: 'from-violet-500/30 to-violet-600/10', border: 'border-violet-500/60', text: 'text-violet-400', glow: 'shadow-violet-500/30', dot: 'bg-violet-400' },
  5: { bg: 'from-orange-500/30 to-orange-600/10', border: 'border-orange-500/60', text: 'text-orange-400', glow: 'shadow-orange-500/30', dot: 'bg-orange-400' },
}

export default function ArrayPanel({ data, pointers = [], tagName, changedIndices = [] }) {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return null
  }

  const changedSet = useMemo(() => new Set(changedIndices || []), [changedIndices])

  // Map pointer index -> array of pointers at that index
  const pointerMap = useMemo(() => {
    const map = new Map()
    pointers.forEach((p, colorIdx) => {
      if (typeof p.index !== 'number' || p.index < 0 || p.index >= data.length) return
      if (!map.has(p.index)) map.set(p.index, [])
      map.get(p.index).push({ ...p, colorIdx: colorIdx % 6 })
    })
    return map
  }, [pointers, data.length])

  // Compute bar heights for numeric arrays
  const allNumeric = data.every((d) => typeof d === 'number' && Number.isFinite(d))
  const maxVal = allNumeric ? Math.max(...data.map(Math.abs), 1) : 1

  return (
    <motion.div
      className="rounded-xl border border-slate-700/50 bg-gradient-to-b from-slate-800/80 to-slate-900/80 backdrop-blur-sm overflow-hidden"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-700/40">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-lg shadow-blue-500/40" />
            <span className="text-sm font-semibold text-slate-200 font-mono">{tagName}</span>
          </div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-blue-400/80 bg-blue-500/10 border border-blue-500/20 rounded-md px-2 py-0.5">
            Array
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-slate-500 font-mono">len={data.length}</span>
          {changedSet.size > 0 && (
            <span className="text-[10px] text-purple-400 bg-purple-500/10 border border-purple-500/20 rounded px-1.5 py-0.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              {changedSet.size} changed
            </span>
          )}
        </div>
      </div>

      {/* Array cells */}
      <div className="px-4 py-4">
        <div className="flex gap-2 overflow-x-auto pb-2 items-end" style={{ minHeight: allNumeric ? '140px' : '80px' }}>
          <AnimatePresence mode="popLayout">
            {data.map((val, i) => {
              const pointed = pointerMap.get(i)
              const isChanged = changedSet.has(i)
              const barH = allNumeric ? Math.max((Math.abs(val) / maxVal) * 80, 8) : 48

              return (
                <motion.div
                  key={i}
                  className="flex flex-col items-center gap-0 flex-shrink-0"
                  initial={{ opacity: 0, scale: 0.7, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 28, delay: i * 0.02 }}
                  layout
                >
                  {/* Pointer labels above */}
                  <div className="flex flex-col items-center gap-0.5 mb-1" style={{ minHeight: '24px' }}>
                    {pointed && pointed.map((p, pi) => {
                      const colors = POINTER_COLORS[p.colorIdx]
                      return (
                        <motion.div
                          key={p.name}
                          className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-bold font-mono border bg-gradient-to-r ${colors.bg} ${colors.border} ${colors.text}`}
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                          layout
                        >
                          {p.name}
                          {pi === 0 && <span className="text-[8px] opacity-60">▼</span>}
                        </motion.div>
                      )
                    })}
                  </div>

                  {/* The cell / bar */}
                  <motion.div
                    className={`relative flex items-center justify-center font-mono text-sm font-bold rounded-lg border transition-all duration-200
                      ${isChanged
                        ? 'border-purple-500/70 bg-gradient-to-b from-purple-500/20 to-purple-900/20 shadow-lg shadow-purple-500/20'
                        : pointed
                          ? `border-opacity-70 bg-gradient-to-b ${POINTER_COLORS[pointed[0].colorIdx].bg} ${POINTER_COLORS[pointed[0].colorIdx].border} shadow-lg ${POINTER_COLORS[pointed[0].colorIdx].glow}`
                          : 'border-slate-600/40 bg-gradient-to-b from-slate-700/50 to-slate-800/50'
                      }
                    `}
                    style={{
                      width: `${Math.max(44, String(formatCell(val)).length * 10 + 16)}px`,
                      height: allNumeric ? `${barH}px` : '48px',
                    }}
                    animate={{
                      scale: isChanged ? [1, 1.08, 1] : 1,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Glow effect for changed cells */}
                    {isChanged && (
                      <motion.div
                        className="absolute inset-0 rounded-lg bg-purple-500/10"
                        animate={{ opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    )}
                    <span className={`relative z-10 ${
                      isChanged ? 'text-purple-300' : pointed ? POINTER_COLORS[pointed[0].colorIdx].text : 'text-slate-200'
                    }`}>
                      {formatCell(val)}
                    </span>
                  </motion.div>

                  {/* Index label */}
                  <motion.span
                    className={`text-[10px] font-mono mt-1.5 ${
                      pointed ? POINTER_COLORS[pointed[0].colorIdx].text : 'text-slate-500'
                    }`}
                    animate={{ scale: isChanged ? [1, 1.1, 1] : 1 }}
                  >
                    {i}
                  </motion.span>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Pointer legend */}
      {pointers.length > 0 && (
        <div className="px-4 pb-3 flex flex-wrap items-center gap-3 border-t border-slate-700/30 pt-2.5">
          {pointers.filter(p => typeof p.index === 'number' && p.index >= 0 && p.index < data.length).map((p, idx) => {
            const colors = POINTER_COLORS[idx % 6]
            return (
              <div key={p.name} className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
                <span className={`text-[11px] font-mono font-semibold ${colors.text}`}>{p.name}</span>
                <span className="text-[10px] text-slate-600">=</span>
                <span className="text-[11px] font-mono text-slate-400">{p.index}</span>
              </div>
            )
          })}
          {changedSet.size > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              <span className="text-[11px] text-purple-400">changed</span>
            </div>
          )}
        </div>
      )}
    </motion.div>
  )
}

function formatCell(d) {
  if (d === null || d === undefined) return '–'
  if (typeof d === 'string') return d.length > 5 ? d.slice(0, 4) + '…' : d
  if (typeof d === 'boolean') return d ? 'T' : 'F'
  return String(d)
}
