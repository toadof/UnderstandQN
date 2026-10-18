import { useMemo } from 'react'
import { motion } from 'framer-motion'

export default function StepNarrative({ step, prevStep, steps, currentIndex }) {
  if (!step) return null

  const vars = step.vars || {}
  const added = step.added || []
  const changed = step.changed || []

  const description = generateDescription(step, prevStep, steps, currentIndex)

  if (step.isResult) {
    return (
      <motion.div
        className="rounded-xl border border-green-500/40 bg-gradient-to-r from-green-900/25 via-green-900/15 to-emerald-900/10 backdrop-blur-sm overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <div className="px-4 py-3 flex items-center gap-3 border-b border-green-500/20">
          <motion.div
            className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 0.6, repeat: 2 }}
          >
            <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
          <div>
            <h3 className="text-sm font-bold text-green-300">Execution Complete</h3>
            <p className="text-[11px] text-green-500/80">Function returned successfully</p>
          </div>
        </div>
        <div className="px-4 py-3">
          <div className="text-[10px] uppercase tracking-widest text-green-600 font-semibold mb-1">Return Value</div>
          <div className="font-mono text-lg font-black text-green-300 bg-green-500/5 rounded-lg px-3 py-2 border border-green-500/20">
            {JSON.stringify(vars.__result)}
          </div>
        </div>
      </motion.div>
    )
  }

  if (step.isError) {
    return (
      <motion.div
        className="rounded-xl border border-red-500/40 bg-gradient-to-r from-red-900/25 via-red-900/15 to-rose-900/10 backdrop-blur-sm overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <div className="px-4 py-3 flex items-center gap-3 border-b border-red-500/20">
          <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-bold text-red-300">Error Encountered</h3>
            <p className="text-[11px] text-red-500/80">Execution halted</p>
          </div>
        </div>
        <div className="px-4 py-3">
          <div className="font-mono text-sm text-red-300 bg-red-500/5 rounded-lg px-3 py-2 border border-red-500/20">
            {vars.__error}
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="rounded-xl border border-slate-700/50 bg-gradient-to-b from-slate-800/80 to-slate-900/80 backdrop-blur-sm overflow-hidden"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-700/40">
        <div className="flex items-center gap-2">
          <motion.div
            className="w-2 h-2 rounded-full bg-blue-500"
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500">
            What's happening
          </span>
        </div>
        <div className="flex items-center gap-2">
          {step.line > 0 && (
            <span className="text-[10px] font-mono font-semibold text-blue-400/70 bg-blue-500/10 border border-blue-500/15 rounded-md px-2 py-0.5">
              Line {step.line}
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="px-4 py-3">
        <p
          className="text-sm text-slate-200 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: description }}
        />

        {/* Source code line preview */}
        {step.lineText && (
          <div className="mt-2.5 flex items-center gap-2 bg-slate-900/60 rounded-lg px-3 py-2 border border-slate-700/30 overflow-x-auto">
            <span className="text-[10px] text-slate-600 font-mono flex-shrink-0">{step.line}│</span>
            <code className="text-xs font-mono text-slate-300 whitespace-pre">{step.lineText}</code>
          </div>
        )}
      </div>

      {/* Variable changes */}
      {(added.length > 0 || changed.length > 0) && (
        <div className="px-4 pb-3 flex flex-wrap gap-1.5">
          {added.map((v) => (
            <motion.span
              key={v}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-500/10 border border-green-500/30 text-green-300 rounded-lg text-xs font-mono"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              <span className="font-semibold">{v}</span>
              <span className="text-green-500">=</span>
              <span>{formatValue(vars[v])}</span>
            </motion.span>
          ))}
          {changed.map((v) => (
            <motion.span
              key={v}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 rounded-lg text-xs font-mono"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
              <span className="font-semibold">{v}</span>
              <span className="text-yellow-500">→</span>
              <span>{formatValue(vars[v])}</span>
            </motion.span>
          ))}
        </div>
      )}
    </motion.div>
  )
}

function generateDescription(step, prevStep, steps, currentIndex) {
  const text = step.lineText || ''
  const vars = step.vars || {}
  const prevVars = prevStep?.vars || {}

  // Detect if we're in a loop and count iterations
  const loopInfo = detectLoopIteration(step, steps, currentIndex)

  // Function definition
  if (text.startsWith('def ')) {
    const funcMatch = text.match(/def\s+(\w+)/)
    const name = funcMatch?.[1] || 'function'
    const params = text.match(/\(([^)]*)\)/)?.[1] || ''
    return `Defining function <strong class="text-blue-400">${escapeHtml(name)}</strong><span class="text-slate-500">(${escapeHtml(params)})</span>`
  }

  // For loop
  if (text.startsWith('for ')) {
    const iterText = loopInfo ? ` <span class="inline-flex items-center gap-1 text-[11px] font-mono text-blue-400/60 bg-blue-500/10 rounded px-1.5 py-0.5 ml-1">iter ${loopInfo.current}/${loopInfo.total}</span>` : ''
    const varMatch = text.match(/for\s+(\w+)/)
    const iterVar = varMatch?.[1] || 'i'

    if (vars[iterVar] !== undefined) {
      const collection = text.match(/in\s+(\w+)/)?.[1] || ''
      return `Iterating: <code class="text-blue-300 font-mono text-xs bg-blue-500/10 rounded px-1.5 py-0.5">${escapeHtml(iterVar)} = ${formatValue(vars[iterVar])}</code>${iterText} over <code class="text-slate-400 font-mono text-xs">${escapeHtml(collection)}</code>`
    }
    return `Starting loop${iterText}`
  }

  // While loop
  if (text.startsWith('while ')) {
    const iterText = loopInfo ? ` <span class="inline-flex items-center gap-1 text-[11px] font-mono text-blue-400/60 bg-blue-500/10 rounded px-1.5 py-0.5 ml-1">iter ${loopInfo.current}/${loopInfo.total}</span>` : ''
    const condition = text.replace('while ', '').replace(':', '')
    return `Checking loop condition: <code class="text-blue-300 font-mono text-xs bg-blue-500/10 rounded px-1.5 py-0.5">${escapeHtml(condition)}</code>${iterText}`
  }

  // If statement
  if (text.startsWith('if ')) {
    const condition = text.replace('if ', '').replace(':', '')
    return `Checking: <code class="text-purple-300 font-mono text-xs bg-purple-500/10 rounded px-1.5 py-0.5">${escapeHtml(condition)}</code>`
  }

  // Elif
  if (text.startsWith('elif ')) {
    const condition = text.replace('elif ', '').replace(':', '')
    return `Checking elif: <code class="text-purple-300 font-mono text-xs bg-purple-500/10 rounded px-1.5 py-0.5">${escapeHtml(condition)}</code>`
  }

  // Else
  if (text === 'else:') {
    return `Entering <span class="text-purple-300 font-semibold">else</span> branch — previous condition was <span class="text-rose-400">False</span>`
  }

  // Return
  if (text.startsWith('return')) {
    const retVal = text.replace('return ', '')
    return `Returning: <code class="text-green-300 font-mono text-xs bg-green-500/10 rounded px-1.5 py-0.5 font-bold">${escapeHtml(retVal)}</code>`
  }

  // Function call
  if (text.includes('(') && text.includes(')')) {
    const callMatch = text.match(/(\w+)\s*\(/)
    const assignMatch = text.match(/(\w+)\s*=/)

    if (callMatch) {
      const funcName = callMatch[1]
      if (assignMatch && vars[assignMatch[1]] !== undefined) {
        return `Calling <code class="text-blue-300 font-mono text-xs">${escapeHtml(funcName)}()</code> → <code class="text-yellow-300 font-mono text-xs bg-yellow-500/10 rounded px-1.5 py-0.5">${escapeHtml(assignMatch[1])} = ${formatValue(vars[assignMatch[1]])}</code>`
      }
      return `Calling <code class="text-blue-300 font-mono text-xs">${escapeHtml(funcName)}()</code>`
    }
  }

  // Assignment
  if (text.includes('=') && !text.includes('==') && !text.includes('!=') && !text.includes('>=') && !text.includes('<=')) {
    const assignMatch = text.match(/(\w+)\s*=\s*(.+)/)
    if (assignMatch) {
      const varName = assignMatch[1]
      const val = vars[varName]
      if (val !== undefined) {
        return `Assigning <code class="text-yellow-300 font-mono text-xs bg-yellow-500/10 rounded px-1.5 py-0.5">${escapeHtml(varName)} = ${formatValue(val)}</code>`
      }
    }
  }

  // Comparison
  if (text.includes('==') || text.includes('!=') || text.includes('>=') || text.includes('<=') || text.includes('>') || text.includes('<')) {
    return `Evaluating: <code class="text-purple-300 font-mono text-xs bg-purple-500/10 rounded px-1.5 py-0.5">${escapeHtml(text)}</code>`
  }

  // Generic fallback
  return `Executing: <code class="text-slate-300 font-mono text-xs">${escapeHtml(text)}</code>`
}

function detectLoopIteration(step, steps, currentIndex) {
  if (!steps || currentIndex === undefined) return null

  const text = step.lineText || ''
  const isLoopLine = text.startsWith('for ') || text.startsWith('while ')
  if (!isLoopLine) return null

  const lineNum = step.line
  let count = 0
  for (let i = 0; i <= currentIndex; i++) {
    if (steps[i].line === lineNum) count++
  }

  let total = count
  for (let i = currentIndex + 1; i < steps.length; i++) {
    if (steps[i].line === lineNum) total++
  }

  return { current: count, total }
}

function formatValue(val) {
  if (val === null) return 'null'
  if (val === undefined) return 'undefined'
  if (typeof val === 'string') return `"${val.length > 18 ? val.slice(0, 17) + '…' : val}"`
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

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
