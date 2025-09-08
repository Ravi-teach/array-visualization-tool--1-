"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { useState } from "react"

interface ArrayVisualizationProps {
  elements: number[]
  currentIndex: number
  comparingIndices: number[]
  sortedIndices: number[]
  searchTarget?: number
  isAnimating: boolean
  onLinearSearch?: (target: number) => void
  onBinarySearch?: (target: number) => void
}

export function ArrayVisualization({
  elements,
  currentIndex,
  comparingIndices,
  sortedIndices,
  searchTarget,
  isAnimating,
  onLinearSearch,
  onBinarySearch,
}: ArrayVisualizationProps) {
  const [searchValue, setSearchValue] = useState("")

  const handleSearch = () => {
    const target = Number.parseInt(searchValue)
    if (!isNaN(target) && onLinearSearch) {
      onLinearSearch(target)
    }
  }

  const getElementColor = (index: number, value: number) => {
    if (sortedIndices.includes(index)) return "bg-green-500 border-green-400"
    if (comparingIndices.includes(index)) return "bg-yellow-500 border-yellow-400"
    if (currentIndex === index) return "bg-red-500 border-red-400"
    if (searchTarget === value) return "bg-purple-500 border-purple-400"
    return "bg-blue-500 border-blue-400"
  }

  const getElementTextColor = (index: number) => {
    if (sortedIndices.includes(index) || comparingIndices.includes(index) || currentIndex === index) {
      return "text-white"
    }
    return "text-white"
  }

  return (
    <div className="h-full flex flex-col bg-slate-900">
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Array Visualization</h2>
          <div className="flex gap-2">
            {isAnimating && <Badge className="bg-blue-600 text-white animate-pulse">Animating</Badge>}
            <Badge variant="secondary" className="bg-slate-700 text-slate-300">
              Size: {elements.length}
            </Badge>
          </div>
        </div>

        {/* Search Input */}
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Enter number to search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="bg-slate-800 border-slate-600 text-white"
          />
          <Button onClick={handleSearch} size="sm" className="bg-purple-600 hover:bg-purple-700">
            <Search className="h-4 w-4" />
          </Button>
          <Button 
            onClick={() => {
              const target = Number.parseInt(searchValue)
              if (!isNaN(target) && onBinarySearch) {
                onBinarySearch(target)
              }
            }} 
            size="sm" 
            className="bg-green-600 hover:bg-green-700"
            disabled={!onBinarySearch}
          >
            Binary Search
          </Button>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-auto">
        <div className="flex flex-col items-center justify-center h-full">
          {/* Array Elements */}
          <div className="flex flex-wrap gap-4 justify-center mb-8">
            <AnimatePresence>
              {elements.map((element, index) => (
                <motion.div
                  key={`${index}-${element}`}
                  initial={{ opacity: 0, scale: 0.8, y: -20 }}
                  animate={{
                    opacity: 1,
                    scale: comparingIndices.includes(index) ? 1.1 : 1,
                    y: 0,
                    rotateY: comparingIndices.includes(index) ? 180 : 0,
                  }}
                  exit={{ opacity: 0, scale: 0.8, y: 20 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.05,
                    type: "spring",
                    stiffness: 300,
                    damping: 25,
                  }}
                  whileHover={{ scale: 1.05 }}
                  className="flex flex-col items-center"
                >
                  {/* Array Element */}
                  <motion.div
                    animate={{
                      scale: comparingIndices.includes(index) ? 1.2 : 1,
                      boxShadow:
                        currentIndex === index
                          ? "0 0 0 10px rgba(239, 68, 68, 0.7)"
                          : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  transition={{
                    duration: 0.6,
                    repeat: comparingIndices.includes(index) || currentIndex === index ? Infinity : 0,
                    repeatType: "reverse",
                    type: "tween",
                  }}
                    className={`
                      w-16 h-16 flex items-center justify-center
                      border-2 rounded-lg font-bold text-lg
                      transition-all duration-300 cursor-pointer
                      ${getElementColor(index, element)}
                      text-white shadow-lg hover:shadow-xl
                    `}
                  >
                    {element}
                  </motion.div>

                  {/* Index Label */}
                  <div className="mt-2 text-xs text-slate-400 font-medium">[{index}]</div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Current Operation Display */}
          {(currentIndex >= 0 || comparingIndices.length > 0) && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-4">
              {currentIndex >= 0 && (
                <div className="text-red-400 font-medium mb-2">
                  Current Position: {currentIndex} (Value: {elements[currentIndex]})
                </div>
              )}
              {comparingIndices.length > 0 && (
                <div className="text-yellow-400 font-medium">
                  Comparing: {comparingIndices.map((i) => `${elements[i]} (${i})`).join(" vs ")}
                </div>
              )}
              {searchTarget !== undefined && (
                <div className="text-purple-400 font-medium">Searching for: {searchTarget}</div>
              )}
            </motion.div>
          )}

          {/* Legend */}
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded border border-blue-400"></div>
              <span className="text-xs text-slate-300">Normal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded border border-red-400"></div>
              <span className="text-xs text-slate-300">Current</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded border border-yellow-400"></div>
              <span className="text-xs text-slate-300">Comparing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded border border-green-400"></div>
              <span className="text-xs text-slate-300">Sorted</span>
            </div>
            {searchTarget !== undefined && (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-500 rounded border border-purple-400"></div>
                <span className="text-xs text-slate-300">Target ({searchTarget})</span>
              </div>
            )}
          </div>

          {/* Empty State */}
          {elements.length === 0 && (
            <div className="text-center text-slate-400">
              <div className="text-6xl mb-4">📊</div>
              <div className="text-lg font-medium mb-2">No Array Data</div>
              <div className="text-sm">Create an array or select an operation to get started</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
