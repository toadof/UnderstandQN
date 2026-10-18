import { motion, AnimatePresence } from 'framer-motion'

export default function HashmapPanel({ data, tagName, addedKeys = [], changedKeys = [] }) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return null
  }

  const entries = Object.entries(data)
  const addedSet = new Set(addedKeys)
  const changedSet = new Set(changedKeys)

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
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-lg shadow-amber-500/40" />
            <span className="text-sm font-semibold text-slate-200 font-mono">{tagName}</span>
          </div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-amber-400/80 bg-amber-500/10 border border-amber-500/20 rounded-md px-2 py-0.5">
            Hashmap
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-slate-500 font-mono">size={entries.length}</span>
          {(addedKeys.length > 0 || changedKeys.length > 0) && (
            <span className="text-[10px] text-green-400 bg-green-500/10 border border-green-500/20 rounded px-1.5 py-0.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              {addedKeys.length > 0 ? `+${addedKeys.length} new` : `${changedKeys.length} updated`}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {entries.length === 0 ? (
          <div className="flex items-center gap-3 rounded-lg border border-dashed border-slate-600/40 bg-slate-800/30 px-5 py-4">
            <div className="flex items-center gap-1 text-slate-600">
              <span className="text-xl font-mono">{'{'}</span>
              <span className="text-xl font-mono">{'}'}</span>
            </div>
            <div>
              <p className="text-sm text-slate-500">Empty hashmap</p>
              <p className="text-[11px] text-slate-600 mt-0.5">No key-value pairs inserted yet</p>
            </div>
          </div>
        ) : (
          <div className="space-y-1.5">
            {/* Table header */}
            <div className="grid grid-cols-[40px_1fr_24px_1fr_32px] gap-2 px-3 py-1.5 text-[10px] uppercase tracking-wider text-slate-600 font-semibold">
              <span>#</span>
              <span>Key</span>
              <span />
              <span>Value</span>
              <span />
            </div>

            <AnimatePresence initial={false}>
              {entries.map(([key, value], index) => {
                const isNew = addedSet.has(key)
                const isChanged = changedSet.has(key)

                let rowStyle = 'border-slate-700/30 bg-slate-800/30'
                let keyColor = 'text-amber-300'
                let valColor = 'text-emerald-300'
                let dotColor = 'bg-slate-600'
                let statusBadge = null

                if (isNew) {
                  rowStyle = 'border-green-500/40 bg-green-900/15'
                  keyColor = 'text-green-300'
                  valColor = 'text-green-400'
                  dotColor = 'bg-green-400'
                  statusBadge = (
                    <span className="text-[8px] font-bold uppercase tracking-wider text-green-400 bg-green-500/15 rounded px-1 py-0.5">
                      new
                    </span>
                  )
                } else if (isChanged) {
                  rowStyle = 'border-yellow-500/40 bg-yellow-900/10'
                  valColor = 'text-yellow-400'
                  dotColor = 'bg-yellow-400'
                  statusBadge = (
                    <span className="text-[8px] font-bold uppercase tracking-wider text-yellow-400 bg-yellow-500/15 rounded px-1 py-0.5">
                      upd
                    </span>
                  )
                }

                return (
                  <motion.div
                    key={key}
                    layout
                    initial={{ opacity: 0, x: -16, height: 0 }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      height: 'auto',
                      scale: isNew || isChanged ? [0.97, 1.02, 1] : 1,
                    }}
                    exit={{ opacity: 0, x: 16, height: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    className={`grid grid-cols-[40px_1fr_24px_1fr_32px] gap-2 items-center rounded-lg border px-3 py-2.5 ${rowStyle}`}
                  >
                    {/* Index */}
                    <span className="text-[10px] text-slate-600 font-mono">{index}</span>

                    {/* Key */}
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${dotColor} flex-shrink-0`} />
                      <span className={`font-mono text-sm font-bold truncate ${keyColor}`} title={String(key)}>
                        {String(key)}
                      </span>
                    </div>

                    {/* Arrow */}
                    <span className="text-slate-600 text-center font-mono text-sm">→</span>

                    {/* Value */}
                    <span
                      className={`font-mono text-sm truncate ${valColor}`}
                      title={formatValue(value)}
                    >
                      {formatValue(value)}
                    </span>

                    {/* Status badge */}
                    <div className="flex justify-end">
                      {statusBadge}
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Footer with bucket visualization */}
      {entries.length > 0 && (
        <div className="px-4 pb-3 pt-1 border-t border-slate-700/30">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-[10px] text-slate-500">new</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-yellow-400" />
              <span className="text-[10px] text-slate-500">updated</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-600" />
              <span className="text-[10px] text-slate-500">unchanged</span>
            </div>
            <div className="flex-1" />
            <span className="text-[10px] text-slate-600 font-mono">
              {entries.length} entr{entries.length === 1 ? 'y' : 'ies'}
            </span>
          </div>
        </div>
      )}
    </motion.div>
  )
}

function formatValue(val) {
  if (val === null) return 'None'
  if (val === undefined) return 'undefined'
  if (typeof val === 'string') return val.length > 20 ? val.slice(0, 19) + '…' : val
  if (Array.isArray(val)) {
    if (val.length > 5) return `[${val.slice(0, 4).join(', ')}, …]`
    return `[${val.join(', ')}]`
  }
  if (typeof val === 'object') {
    const entries = Object.entries(val)
    if (entries.length > 3) return `{${entries.slice(0, 2).map(([k, v]) => `${k}: ${v}`).join(', ')}, …}`
    return `{${entries.map(([k, v]) => `${k}: ${v}`).join(', ')}}`
  }
  return String(val)
}
