import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const VARIABLE_TYPES = [
  { value: 'array', label: 'Array', icon: '[]', color: 'blue' },
  { value: 'hashmap', label: 'Hashmap', icon: '{}', color: 'amber' },
  { value: 'pointer', label: 'Pointer', icon: '→', color: 'pink' },
  { value: 'scalar', label: 'Scalar', icon: '#', color: 'slate' },
]

const TYPE_STYLES = {
  array: {
    active: 'bg-blue-500/20 border-blue-500/50 text-blue-300 shadow-md shadow-blue-500/10',
    dot: 'bg-blue-400',
  },
  hashmap: {
    active: 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-md shadow-amber-500/10',
    dot: 'bg-amber-400',
  },
  pointer: {
    active: 'bg-pink-500/20 border-pink-500/50 text-pink-300 shadow-md shadow-pink-500/10',
    dot: 'bg-pink-400',
  },
  scalar: {
    active: 'bg-slate-600/30 border-slate-500/50 text-slate-300 shadow-md shadow-slate-500/10',
    dot: 'bg-slate-400',
  },
}

export default function TaggingModal({ isOpen, onClose, variables, tags, onTagChange }) {
  const [localTags, setLocalTags] = useState(tags)

  useEffect(() => {
    setLocalTags(tags)
  }, [tags])

  const handleTag = (varName, type) => {
    setLocalTags((prev) => ({ ...prev, [varName]: type }))
  }

  const handleSave = () => {
    onTagChange(localTags)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg rounded-2xl border border-slate-700/50 bg-gradient-to-b from-slate-800 to-slate-900 shadow-2xl shadow-black/50 overflow-hidden"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-700/40">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-b from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Tag Variables</h2>
                    <p className="text-[12px] text-slate-500 mt-0.5">
                      Choose how each variable should be visualized
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/40 flex items-center justify-center text-slate-400 hover:text-white transition-all"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-4">
              {variables.length === 0 ? (
                <div className="text-center py-10">
                  <div className="w-12 h-12 rounded-full bg-slate-800/60 border border-slate-700/40 flex items-center justify-center mx-auto mb-3">
                    <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <p className="text-sm text-slate-500">No variables detected</p>
                  <p className="text-[11px] text-slate-600 mt-1">Run a trace first to detect variables</p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1 custom-scrollbar">
                  {variables.map((varName) => {
                    const currentType = localTags[varName] || 'scalar'
                    return (
                      <div
                        key={varName}
                        className="flex items-center gap-4 bg-slate-800/40 rounded-xl p-3 border border-slate-700/30"
                      >
                        <div className="flex items-center gap-2 min-w-[90px]">
                          <span className={`w-2 h-2 rounded-full ${TYPE_STYLES[currentType]?.dot || 'bg-slate-500'}`} />
                          <span className="font-mono text-sm font-semibold text-white">
                            {varName}
                          </span>
                        </div>

                        <div className="flex gap-1.5 flex-wrap flex-1">
                          {VARIABLE_TYPES.map((type) => {
                            const isActive = localTags[varName] === type.value
                            const styles = TYPE_STYLES[type.value]
                            return (
                              <motion.button
                                key={type.value}
                                onClick={() => handleTag(varName, type.value)}
                                className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition-all ${
                                  isActive
                                    ? styles.active
                                    : 'bg-slate-900/50 border-slate-700/30 text-slate-500 hover:text-slate-300 hover:border-slate-600/50'
                                }`}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.96 }}
                              >
                                <span className="mr-1 opacity-70">{type.icon}</span>
                                {type.label}
                              </motion.button>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 px-6 py-3 border-t border-slate-700/40 bg-slate-900/30">
              <motion.button
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-white border border-slate-700/30 hover:border-slate-600/50 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={handleSave}
                className="px-5 py-2 rounded-lg text-sm bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-semibold shadow-lg shadow-blue-500/25 border border-blue-400/30 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                Save Tags
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
