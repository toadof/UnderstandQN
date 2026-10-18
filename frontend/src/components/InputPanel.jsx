import { useState, useEffect, useRef } from 'react'

export default function InputPanel({ inputs, onChange }) {
  const [rawJson, setRawJson] = useState(JSON.stringify(inputs, null, 2))
  const [parseError, setParseError] = useState(null)
  const prevInputsRef = useRef(inputs)

  // Sync textarea when inputs change externally (e.g. problem list selection)
  useEffect(() => {
    const newJson = JSON.stringify(inputs, null, 2)
    const prevJson = JSON.stringify(prevInputsRef.current, null, 2)
    if (newJson !== prevJson) {
      setRawJson(newJson)
      setParseError(null)
    }
    prevInputsRef.current = inputs
  }, [inputs])

  const handleBlur = () => {
    try {
      const parsed = JSON.parse(rawJson)
      setParseError(null)
      onChange(parsed)
    } catch (e) {
      setParseError('Invalid JSON')
    }
  }

  const handleChange = (value) => {
    setRawJson(value)
    try {
      const parsed = JSON.parse(value)
      setParseError(null)
      onChange(parsed)
    } catch {
      setParseError('Invalid JSON')
    }
  }

  return (
    <div className="rounded-xl border border-slate-700/50 bg-gradient-to-b from-slate-800/80 to-slate-900/80 backdrop-blur-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-700/40">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-teal-500 shadow-lg shadow-teal-500/40" />
          <span className="text-sm font-semibold text-slate-200">Test Inputs</span>
        </div>
        <div className="flex items-center gap-2">
          {parseError ? (
            <span className="text-[10px] text-red-400 bg-red-500/10 border border-red-500/20 rounded px-2 py-0.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              {parseError}
            </span>
          ) : (
            <span className="text-[10px] text-green-500/60 font-mono">Valid JSON</span>
          )}
        </div>
      </div>
      <div className="p-4">
        <textarea
          value={rawJson}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={handleBlur}
          className="w-full h-28 bg-slate-900/60 border border-slate-700/40 rounded-lg p-3 text-sm font-mono text-slate-200 resize-none
            focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 transition-all
            placeholder-slate-600"
          spellCheck={false}
          placeholder='{"nums": [2, 7, 11, 15], "target": 9}'
        />
        <p className="text-[11px] text-slate-600 mt-2 flex items-center gap-1.5">
          <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Enter function arguments as JSON key-value pairs
        </p>
      </div>
    </div>
  )
}
