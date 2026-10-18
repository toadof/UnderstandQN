import { motion } from 'framer-motion'

export default function ScalarPanel({ data, tagName, isNew, isChanged }) {
  let borderStyle = 'border-slate-700/40'
  let bgStyle = 'from-slate-800/50 to-slate-800/30'
  let glowStyle = ''
  let labelBg = 'bg-slate-700/30'
  let labelText = 'text-slate-500'
  let badge = null

  if (isNew) {
    borderStyle = 'border-green-500/50'
    bgStyle = 'from-green-900/20 to-green-950/10'
    glowStyle = 'shadow-lg shadow-green-500/10'
    labelBg = 'bg-green-500/10'
    labelText = 'text-green-400'
    badge = (
      <motion.span
        className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-green-400"
        animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
        transition={{ duration: 1.2, repeat: 2 }}
      />
    )
  } else if (isChanged) {
    borderStyle = 'border-yellow-500/50'
    bgStyle = 'from-yellow-900/15 to-yellow-950/5'
    glowStyle = 'shadow-lg shadow-yellow-500/10'
    labelBg = 'bg-yellow-500/10'
    labelText = 'text-yellow-400'
    badge = (
      <motion.span
        className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-yellow-400"
        animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
        transition={{ duration: 1.2, repeat: 2 }}
      />
    )
  }

  return (
    <motion.div
      className={`relative rounded-xl border bg-gradient-to-b ${borderStyle} ${bgStyle} ${glowStyle} p-3 overflow-hidden`}
      initial={{ opacity: 0, scale: 0.9, y: 8 }}
      animate={{
        opacity: 1,
        scale: isNew || isChanged ? [0.95, 1.02, 1] : 1,
        y: 0,
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
    >
      {badge}

      {/* Variable name */}
      <div className={`inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded-md ${labelBg} mb-2`}>
        <span className="w-1.5 h-1.5 rounded-full bg-slate-500 flex-shrink-0" style={{
          backgroundColor: isNew ? '#4ade80' : isChanged ? '#facc15' : undefined,
        }} />
        <span className={`text-[11px] font-mono font-semibold ${labelText}`}>{tagName}</span>
      </div>

      {/* Value */}
      <motion.div
        className={`text-xl font-mono font-black tracking-tight ${valueColor(data, isNew, isChanged)}`}
        key={String(data)}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {formatScalar(data)}
      </motion.div>

      {/* Type label */}
      <div className="mt-1.5 text-[9px] uppercase tracking-widest text-slate-600 font-semibold">
        {isNew ? 'New variable' : isChanged ? 'Updated' : typeLabel(data)}
      </div>
    </motion.div>
  )
}

function valueColor(val, isNew, isChanged) {
  if (isNew) return 'text-green-400'
  if (isChanged) return 'text-yellow-300'
  if (val === null || val === undefined) return 'text-slate-500'
  if (typeof val === 'boolean') return val ? 'text-emerald-400' : 'text-rose-400'
  if (typeof val === 'string') return 'text-sky-300'
  return 'text-blue-300'
}

function formatScalar(val) {
  if (val === null || val === undefined) return 'None'
  if (typeof val === 'boolean') return val ? 'True' : 'False'
  if (typeof val === 'string') return val.length > 12 ? `"${val.slice(0, 11)}…"` : `"${val}"`
  return String(val)
}

function typeLabel(val) {
  if (val === null || val === undefined) return 'NoneType'
  return typeof val
}
