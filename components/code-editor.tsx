"use client"

import { useRef } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"

interface CodeEditorProps {
  code: string
  currentLine: number
  onCodeChange: (code: string) => void
  language: string
  onRunCode?: () => void
  onSetExample?: (example: string) => void
  currentOperation?: string
}

export function CodeEditor({ code, currentLine, onCodeChange, language, onRunCode, onSetExample, currentOperation }: CodeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)

  const lines = code.split("\n")

  return (
    <div className="h-full flex flex-col bg-slate-900">
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Code Editor</h2>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-slate-700 text-slate-300">
              {language.toUpperCase()}
            </Badge>
            {onRunCode && (
              <Button 
                onClick={onRunCode} 
                size="sm" 
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Play className="h-4 w-4 mr-1" />
                Run Code
              </Button>
            )}
            {onSetExample && (
              <Button 
                onClick={() => onSetExample("// Try this example:\nupdate element\n// Click Run Code to see the animation!")} 
                size="sm" 
                variant="outline"
                className="border-slate-500 text-slate-300 hover:bg-slate-600"
              >
                Example
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="h-full bg-slate-900 font-mono text-sm">
          <div className="flex h-full">
            {/* Line Numbers */}
            <div className="bg-slate-800 px-3 py-4 border-r border-slate-700 select-none">
              {lines.map((_, index) => (
                <div
                  key={index}
                  className={`h-6 flex items-center justify-end text-xs ${
                    index + 1 === currentLine ? "bg-yellow-600 text-white px-2 -mx-2 rounded" : "text-slate-400"
                  }`}
                  style={{ lineHeight: '1.5rem' }}
                >
                  {index + 1}
                </div>
              ))}
            </div>

            {/* Code Content */}
            <div className="flex-1 p-4 overflow-auto relative">
              {/* Editable Code Area */}
              <textarea
                value={code}
                onChange={(e) => onCodeChange(e.target.value)}
                className="w-full h-full bg-transparent text-slate-200 font-mono text-sm resize-none outline-none border-none"
                placeholder="Enter your C++ code here..."
                style={{ lineHeight: '1.5rem' }}
              />
              
              {/* Line Highlight Overlay */}
              {currentLine > 0 && (
                <div 
                  className="absolute left-4 top-4 w-full pointer-events-none"
                  style={{ 
                    height: `${(currentLine - 1) * 1.5}rem`,
                    background: 'transparent'
                  }}
                />
              )}
              {currentLine > 0 && (
                <div 
                  className="absolute left-4 w-full h-6 bg-yellow-600/20 rounded pointer-events-none"
                  style={{ 
                    top: `${(currentLine - 1) * 1.5}rem`
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Console Output */}
      <div className="h-32 border-t border-slate-700 bg-slate-800">
        <div className="p-3">
          <h3 className="text-sm font-medium text-slate-300 mb-2">Console Output</h3>
          <div className="bg-slate-900 rounded p-2 h-20 overflow-y-auto font-mono text-xs text-green-400">
            <div>Array visualization ready...</div>
            <div>Current operation: {currentOperation || "None"}</div>
            <div>Code lines: {lines.length}</div>
            <div>💡 Try writing: "bubble sort", "create array", or "display" and click Run Code!</div>
            <div>📝 Check browser console (F12) for debug info when running code</div>
          </div>
        </div>
      </div>
    </div>
  )
}
