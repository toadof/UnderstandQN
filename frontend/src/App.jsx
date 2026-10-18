import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CodePanel from './components/CodePanel'
import ArrayPanel from './components/ArrayPanel'
import HashmapPanel from './components/HashmapPanel'
import ScalarPanel from './components/ScalarPanel'
import Controls from './components/Controls'
import TaggingModal from './components/TaggingModal'
import InputPanel from './components/InputPanel'
import StepNarrative from './components/StepNarrative'
import CallStackPanel from './components/CallStackPanel'
import LandingPage from './components/LandingPage'
import ProblemList from './components/ProblemList'
import { useTracer } from './hooks/useTracer'

const POINTER_COLORS = ['#f59e0b', '#ec4899', '#10b981', '#06b6d4', '#a78bfa', '#f97316']

export default function App() {
  const {
    code, setCode,
    inputs, setInputs,
    tags, setTags,
    steps, currentStep, currentIndex,
    isPlaying, speed, setSpeed,
    loading, error,
    trace, play, pause, nextStep, prevStep, reset, goToStep,
    totalSteps,
  } = useTracer()

  const [tagModalOpen, setTagModalOpen] = useState(false)
  const [view, setView] = useState('home')

  const handleProblemSelect = ({ code: newCode, inputs: newInputs, tags: newTags }) => {
    setCode(newCode)
    setInputs(newInputs)
    setTags(newTags)
    reset()
  }

  const prevStep_ = currentIndex > 0 ? steps[currentIndex - 1] : null

  // On terminal steps (return / error) the panels keep showing the last real state
  const { vizStep, vizIndex } = useMemo(() => {
    if (!currentStep) return { vizStep: null, vizIndex: -1 }
    const isTerminal = currentStep.isResult || currentStep.isError
    if (!isTerminal) return { vizStep: currentStep, vizIndex: currentIndex }
    for (let i = currentIndex - 1; i >= 0; i--) {
      const s = steps[i]
      if (s?.vars && Object.keys(s.vars).some((k) => !k.startsWith('__'))) {
        return { vizStep: s, vizIndex: i }
      }
    }
    return { vizStep: currentStep, vizIndex: currentIndex }
  }, [currentStep, steps, currentIndex])

  const vizPrevStep = vizIndex > 0 ? steps[vizIndex - 1] : null

  const variables = useMemo(() => {
    if (!vizStep) return []
    return Object.keys(vizStep.vars).filter((k) => !k.startsWith('__'))
  }, [vizStep])

  // Classify variables by tag
  const { arrayVars, hashmapVars, scalarVars } = useMemo(() => {
    const arrays = []
    const hashmaps = []
    const scalars = []

    if (!vizStep || !vizStep.vars) return { arrayVars: [], hashmapVars: [], scalarVars: [] }

    const prevVars = vizPrevStep?.vars || {}
    const addedSet = new Set(vizStep.added || [])
    const changedSet = new Set(vizStep.changed || [])

    for (const [name, value] of Object.entries(vizStep.vars)) {
      if (name.startsWith('__')) continue
      const type = tags[name] || 'scalar'

      if (type === 'array' && Array.isArray(value)) {
        // Find which indices changed
        const prevArr = prevVars[name]
        const changedIndices = []
        if (Array.isArray(prevArr)) {
          for (let i = 0; i < value.length; i++) {
            if (i >= prevArr.length || prevArr[i] !== value[i]) {
              changedIndices.push(i)
            }
          }
        }
        arrays.push({ name, value, changedIndices })
      } else if (type === 'hashmap' && typeof value === 'object' && value !== null && !Array.isArray(value)) {
        const prevHm = prevVars[name] || {}
        const addedKeys = []
        const changedKeys = []
        for (const k of Object.keys(value)) {
          if (!(k in prevHm)) addedKeys.push(k)
          else if (prevHm[k] !== value[k]) changedKeys.push(k)
        }
        hashmaps.push({ name, value, addedKeys, changedKeys })
      } else {
        scalars.push({
          name,
          value,
          isNew: addedSet.has(name),
          isChanged: changedSet.has(name),
        })
      }
    }

    return { arrayVars: arrays, hashmapVars: hashmaps, scalarVars: scalars }
  }, [vizStep, vizPrevStep, tags])

  // All pointer-tagged variables with their current index and a distinct color
  const pointers = useMemo(() => {
    if (!vizStep || !vizStep.vars) return []
    let colorIdx = 0
    return Object.entries(tags)
      .filter(([name, type]) => type === 'pointer' && typeof vizStep.vars[name] === 'number')
      .map(([name]) => ({
        name,
        index: vizStep.vars[name],
        color: POINTER_COLORS[colorIdx++ % POINTER_COLORS.length],
      }))
  }, [vizStep, tags])

  // Lines that have been executed so far
  const executedLines = useMemo(() => {
    const lines = new Set()
    for (let i = 0; i <= currentIndex; i++) {
      const s = steps[i]
      if (s && s.line > 0) lines.add(s.line)
    }
    return Array.from(lines)
  }, [steps, currentIndex])

  if (view === 'home') {
    return <LandingPage onStart={() => setView('app')} />
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Subtle background effects */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative z-30 border-b border-slate-800/60 bg-slate-900/80 backdrop-blur-xl sticky top-0">
        <div className="max-w-[1400px] mx-auto px-5 py-3 flex items-center justify-between">
          <button
            onClick={() => setView('home')}
            className="flex items-center gap-3 group"
            title="Back to home"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-b from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25 transition-transform group-hover:scale-105 border border-blue-400/30">
              <span className="text-white font-black text-lg">U</span>
            </div>
            <div className="text-left">
              <h1 className="text-lg font-bold text-white leading-tight group-hover:text-blue-300 transition-colors">
                UnderstoodQN
              </h1>
              <p className="text-[10px] text-slate-500 tracking-wider uppercase font-semibold">
                Algorithm Visualizer
              </p>
            </div>
          </button>

          <div className="flex items-center gap-2.5">
            <ProblemList onSelect={handleProblemSelect} />
            <motion.button
              onClick={() => setTagModalOpen(true)}
              className="px-3.5 py-2 text-[12px] rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white transition-all border border-slate-700/50 hover:border-slate-600/50 font-medium flex items-center gap-1.5"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Tag Variables
            </motion.button>
            <motion.button
              onClick={trace}
              disabled={loading}
              className="px-4.5 py-2 text-[12px] rounded-lg bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 disabled:opacity-40 text-white font-semibold transition-all shadow-lg shadow-blue-500/25 border border-blue-400/30 flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Tracing...
                </span>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Trace Execution
                </>
              )}
            </motion.button>
          </div>
        </div>
      </header>

      {/* Error banner */}
      <AnimatePresence>
        {error && (
          <motion.div
            className="bg-red-900/20 border-b border-red-800/40 text-red-300 px-5 py-2.5 text-sm flex items-center gap-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <svg className="w-4 h-4 flex-shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span><strong className="text-red-200">Error:</strong> {error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative z-10 max-w-[1400px] mx-auto px-5 py-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Left Column — Code + Inputs */}
          <div className="space-y-4">
            <div className="h-[420px]">
              <CodePanel
                code={code}
                onChange={setCode}
                currentLine={currentStep?.line}
                executedLines={executedLines}
              />
            </div>
            <InputPanel inputs={inputs} onChange={setInputs} />
          </div>

          {/* Right Column — Visualization */}
          <div className="space-y-3">
            <Controls
              isPlaying={isPlaying}
              onPlay={play}
              onPause={pause}
              onNext={nextStep}
              onPrev={prevStep}
              onReset={reset}
              onGoToStep={goToStep}
              currentIndex={currentIndex}
              totalSteps={totalSteps}
              speed={speed}
              onSpeedChange={setSpeed}
            />

            {steps.length === 0 ? (
              <motion.div
                className="rounded-xl border border-slate-700/50 bg-gradient-to-b from-slate-800/80 to-slate-900/80 backdrop-blur-sm p-10 text-center"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-slate-800/60 border border-slate-700/40 flex items-center justify-center">
                    <svg className="w-7 h-7 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">
                      Click <strong className="text-white">Trace Execution</strong> to start
                    </p>
                    <p className="text-[11px] text-slate-600 mt-1.5">
                      Then use <kbd className="text-[10px] font-mono bg-slate-800/60 border border-slate-700/40 rounded px-1.5 py-0.5 text-slate-500">Space</kbd> and <kbd className="text-[10px] font-mono bg-slate-800/60 border border-slate-700/40 rounded px-1.5 py-0.5 text-slate-500">← →</kbd> to navigate steps
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-3">
                {/* Narrative */}
                <StepNarrative step={currentStep} prevStep={prevStep_} steps={steps} currentIndex={currentIndex} />

                {/* Call stack */}
                <CallStackPanel callStack={vizStep?.callStack} />

                {/* Array panels */}
                {arrayVars.map((v) => (
                  <ArrayPanel
                    key={v.name}
                    data={v.value}
                    pointers={pointers}
                    tagName={v.name}
                    changedIndices={v.changedIndices}
                  />
                ))}

                {/* Hashmap panels */}
                {hashmapVars.map((v) => (
                  <HashmapPanel
                    key={v.name}
                    data={v.value}
                    tagName={v.name}
                    addedKeys={v.addedKeys}
                    changedKeys={v.changedKeys}
                  />
                ))}

                {/* Scalar panels */}
                {scalarVars.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-slate-500" />
                      <span className="text-[10px] uppercase tracking-widest font-bold text-slate-600">
                        Variables
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {scalarVars.map((v) => (
                        <ScalarPanel
                          key={v.name}
                          data={v.value}
                          tagName={v.name}
                          isNew={v.isNew}
                          isChanged={v.isChanged}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <TaggingModal
        isOpen={tagModalOpen}
        onClose={() => setTagModalOpen(false)}
        variables={variables}
        tags={tags}
        onTagChange={setTags}
      />
    </div>
  )
}
