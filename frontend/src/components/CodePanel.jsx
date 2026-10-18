import { useRef, useEffect } from 'react'
import Editor from '@monaco-editor/react'

export default function CodePanel({ code, onChange, currentLine, executedLines }) {
  const editorRef = useRef(null)
  const decorationsRef = useRef([])

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor
  }

  useEffect(() => {
    const editor = editorRef.current
    if (!editor) return
    const model = editor.getModel()
    if (!model) return

    try {
      if (decorationsRef.current.length > 0) {
        editor.deltaDecorations(decorationsRef.current, [])
        decorationsRef.current = []
      }

      const newDecorations = []

      // Highlight current line
      if (currentLine && currentLine > 0 && currentLine <= model.getLineCount()) {
        newDecorations.push({
          range: {
            startLineNumber: currentLine,
            startColumn: 1,
            endLineNumber: currentLine,
            endColumn: model.getLineMaxColumn(currentLine),
          },
          options: {
            isWholeLine: true,
            className: 'current-line-highlight',
            glyphMarginClassName: 'current-line-glyph',
            overviewRuler: {
              color: '#3b82f6',
              position: 1,
            },
          },
        })
      }

      // Mark previously executed lines
      if (executedLines) {
        const execSet = new Set(executedLines)
        for (let i = 1; i <= model.getLineCount(); i++) {
          if (execSet.has(i) && i !== currentLine) {
            newDecorations.push({
              range: {
                startLineNumber: i,
                startColumn: 1,
                endLineNumber: i,
                endColumn: 1,
              },
              options: {
                isWholeLine: false,
                glyphMarginClassName: 'executed-dot',
                stickiness: 1,
              },
            })
          }
        }
      }

      if (newDecorations.length > 0) {
        decorationsRef.current = editor.deltaDecorations([], newDecorations)
      }

      if (currentLine && currentLine > 0 && currentLine <= model.getLineCount()) {
        editor.revealLineInCenterIfOutsideViewport(currentLine)
      }
    } catch (e) {
      console.warn('Monaco decoration error:', e)
    }
  }, [currentLine, executedLines])

  return (
    <div className="flex flex-col h-full rounded-xl border border-slate-700/50 bg-gradient-to-b from-slate-800/80 to-slate-900/80 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-700/40">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/40" />
            <span className="text-sm font-semibold text-slate-200">Python Code</span>
          </div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-emerald-400/60 bg-emerald-500/10 border border-emerald-500/15 rounded-md px-2 py-0.5">
            Editable
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-500/60" />
          <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
          <div className="w-2 h-2 rounded-full bg-green-500/60" />
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 monaco-container overflow-hidden">
        <Editor
          height="100%"
          language="python"
          theme="vs-dark"
          value={code}
          onChange={onChange}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            fontFamily: "'Fira Code', 'JetBrains Mono', 'Cascadia Code', monospace",
            fontLigatures: true,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            padding: { top: 12, bottom: 12 },
            readOnly: false,
            glyphMargin: true,
            folding: false,
            lineDecorationsWidth: 8,
            renderLineHighlight: 'none',
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
          }}
        />
      </div>

      <style>{`
        .current-line-highlight {
          background: linear-gradient(90deg, rgba(59, 130, 246, 0.18) 0%, rgba(59, 130, 246, 0.06) 100%) !important;
          border-left: 3px solid #3b82f6 !important;
        }
        .current-line-glyph {
          background-color: #3b82f6 !important;
          width: 4px !important;
          margin-left: 2px;
          border-radius: 2px;
        }
        .executed-dot {
          background-color: rgba(100, 116, 139, 0.35) !important;
          width: 5px !important;
          height: 5px !important;
          border-radius: 50%;
          margin-left: 3px;
          margin-top: 7px;
        }
      `}</style>
    </div>
  )
}
