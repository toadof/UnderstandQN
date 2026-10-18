import { useEffect } from 'react'
import { motion } from 'framer-motion'

export default function Controls({
  isPlaying,
  onPlay,
  onPause,
  onNext,
  onPrev,
  onReset,
  currentIndex,
  totalSteps,
  speed,
  onSpeedChange,
  onGoToStep,
}) {
  const progress = totalSteps > 0 ? ((currentIndex + 1) / totalSteps) * 100 : 0

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return
      if (e.code === 'Space') { e.preventDefault(); isPlaying ? onPause() : onPlay() }
      if (e.code === 'ArrowRight') { e.preventDefault(); onNext() }
      if (e.code === 'ArrowLeft') { e.preventDefault(); onPrev() }
      if (e.code === 'Home') { e.preventDefault(); onGoToStep(0) }
      if (e.code === 'End') { e.preventDefault(); onGoToStep(totalSteps - 1) }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isPlaying, onPlay, onPause, onNext, onPrev, onGoToStep, totalSteps])

  return (
    <div className="rounded-xl border border-slate-700/50 bg-gradient-to-b from-slate-800/80 to-slate-900/80 backdrop-blur-sm overflow-hidden">
      {/* Progress section */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center justify-between text-xs mb-2">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Step</span>
            <span className="font-mono font-bold text-white text-sm">{currentIndex + 1}</span>
            <span className="text-slate-600">/</span>
            <span className="font-mono text-slate-400">{totalSteps}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-16 rounded-full bg-slate-700/50 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            </div>
            <span className="text-[11px] font-mono text-slate-500 w-8 text-right">{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Step slider */}
        <input
          type="range"
          min={0}
          max={Math.max(totalSteps - 1, 0)}
          value={currentIndex}
          onChange={(e) => onGoToStep(Number(e.target.value))}
          className="w-full h-1.5 bg-slate-700/50 rounded-full appearance-none cursor-pointer accent-blue-500
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:shadow-lg
            [&::-webkit-slider-thumb]:shadow-blue-500/40 [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-400
            [&::-webkit-slider-thumb]:hover:bg-blue-400 [&::-webkit-slider-thumb]:transition-colors"
        />
      </div>

      {/* Transport controls */}
      <div className="flex items-center justify-center gap-2 px-4 pb-3">
        <TransportBtn onClick={onReset} disabled={totalSteps === 0} title="Reset (Home)">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </TransportBtn>

        <TransportBtn onClick={onPrev} disabled={currentIndex === 0} title="Previous (←)">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </TransportBtn>

        <motion.button
          onClick={isPlaying ? onPause : onPlay}
          disabled={totalSteps === 0}
          className="w-14 h-14 rounded-full bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500
            disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center
            shadow-xl shadow-blue-500/30 border border-blue-400/30 transition-all duration-200"
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          title="Play/Pause (Space)"
        >
          {isPlaying ? (
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </motion.button>

        <TransportBtn onClick={onNext} disabled={currentIndex >= totalSteps - 1} title="Next (→)">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </TransportBtn>

        <TransportBtn onClick={() => onGoToStep(totalSteps - 1)} disabled={totalSteps === 0} title="End (End)">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </TransportBtn>
      </div>

      {/* Speed + keyboard hints */}
      <div className="px-4 pb-3 pt-1 border-t border-slate-700/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-[10px] uppercase tracking-wider text-slate-600 font-semibold">Speed</span>
            <input
              type="range"
              min={50}
              max={2000}
              step={50}
              value={2050 - speed}
              onChange={(e) => onSpeedChange(2050 - Number(e.target.value))}
              className="w-20 h-1 appearance-none bg-slate-700/50 rounded-full accent-blue-500 cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:cursor-pointer"
            />
            <span className="text-[11px] font-mono text-slate-500">{(speed / 1000).toFixed(1)}s</span>
          </div>
          <div className="flex items-center gap-2">
            <Kbd>Space</Kbd>
            <Kbd>← →</Kbd>
            <Kbd>Home/End</Kbd>
          </div>
        </div>
      </div>
    </div>
  )
}

function TransportBtn({ onClick, disabled, title, children }) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="w-10 h-10 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 hover:border-slate-600/50
        disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center
        transition-all text-slate-400 hover:text-white"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.92 }}
    >
      {children}
    </motion.button>
  )
}

function Kbd({ children }) {
  return (
    <span className="text-[9px] font-mono text-slate-600 bg-slate-800/60 border border-slate-700/40 rounded px-1.5 py-0.5">
      {children}
    </span>
  )
}
