"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Search, ArrowUpDown, Plus, Edit, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { ArrayState, ExecutionState } from "@/lib/types"

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
  arrayState: ArrayState & {
    setElements: (elements: number[]) => void
    generateRandomArray: () => void
    setArraySize: (size: number) => void
    executeLinearSearch: (target: number) => void
    executeBinarySearch: (target: number) => void
    executeBubbleSort: () => void
    executeSelectionSort: () => void
    executeInsertionSort: () => void
    reset: () => void
  }
  codeState: ExecutionState & {
    setCurrentOperation: (operation: string) => void
    loadTemplate: (template: string) => void
  }
}

export function Sidebar({ isOpen, onToggle, arrayState, codeState }: SidebarProps) {
  const [arraySize, setArraySize] = useState(10)
  const [customValues, setCustomValues] = useState("")

  const basicOperations = [
    { id: "create", name: "Create Array", icon: Plus, description: "Initialize array with custom size" },
    { id: "insert", name: "Insert Element", icon: Plus, description: "Add element at specific index" },
    { id: "update", name: "Update Element", icon: Edit, description: "Modify element value" },
    { id: "delete", name: "Delete Element", icon: Trash2, description: "Remove element from array" },
    { id: "display", name: "Display Array", icon: Eye, description: "Show current array state" },
  ]

  const advancedOperations = [
    {
      id: "linear-search",
      name: "Linear Search",
      icon: Search,
      description: "Sequential search with highlighting",
      complexity: "O(n)",
    },
    {
      id: "binary-search",
      name: "Binary Search",
      icon: Search,
      description: "Divide and conquer search",
      complexity: "O(log n)",
    },
    {
      id: "bubble-sort",
      name: "Bubble Sort",
      icon: ArrowUpDown,
      description: "Compare adjacent elements",
      complexity: "O(n²)",
    },
    {
      id: "selection-sort",
      name: "Selection Sort",
      icon: ArrowUpDown,
      description: "Find minimum element",
      complexity: "O(n²)",
    },
    {
      id: "insertion-sort",
      name: "Insertion Sort",
      icon: ArrowUpDown,
      description: "Insert in sorted portion",
      complexity: "O(n²)",
    },
  ]

  const handleOperationClick = (operationId: string) => {
    codeState.setCurrentOperation(operationId)
    codeState.loadTemplate(operationId)

    // Execute the operation with animation
    switch (operationId) {
      case "linear-search":
        const target = Math.floor(Math.random() * 100) + 1
        arrayState.executeLinearSearch(target)
        break
      case "binary-search":
        const binaryTarget = Math.floor(Math.random() * 100) + 1
        arrayState.executeBinarySearch(binaryTarget)
        break
      case "bubble-sort":
        arrayState.executeBubbleSort()
        break
      case "selection-sort":
        arrayState.executeSelectionSort()
        break
      case "insertion-sort":
        arrayState.executeInsertionSort()
        break
      case "create":
        // Array is already created, just reset
        arrayState.reset()
        break
      case "insert":
      case "update":
      case "delete":
      case "display":
        // Basic operations - just load template and reset
        arrayState.reset()
        break
      default:
        arrayState.reset()
    }
  }

  const handleCustomArray = () => {
    if (customValues.trim()) {
      const values = customValues
        .split(",")
        .map((v) => Number.parseInt(v.trim()))
        .filter((v) => !isNaN(v))
      if (values.length > 0) {
        arrayState.setElements(values)
      }
    }
  }

  return (
    <>
      <div
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-slate-800 border-r border-slate-700 transition-all duration-300 z-10 ${
          isOpen ? "w-80" : "w-16"
        }`}
      >
        <div className="p-4">
          <Button variant="ghost" size="sm" onClick={onToggle} className="mb-4 text-slate-300 hover:text-white">
            {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>

          {isOpen && (
            <div className="space-y-6 overflow-y-auto h-[calc(100vh-8rem)]">
              {/* Array Configuration */}
              <Card className="bg-slate-700 border-slate-600">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-slate-200">Array Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-xs text-slate-300">Array Size</Label>
                    <Input
                      type="number"
                      min="1"
                      max="20"
                      value={arraySize}
                      onChange={(e) => setArraySize(Number.parseInt(e.target.value))}
                      className="bg-slate-600 border-slate-500 text-white"
                    />
                  </div>

                  <div>
                    <Label className="text-xs text-slate-300">Custom Values (comma-separated)</Label>
                    <Input
                      placeholder="64, 34, 25, 12, 22"
                      value={customValues}
                      onChange={(e) => setCustomValues(e.target.value)}
                      className="bg-slate-600 border-slate-500 text-white"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleCustomArray} className="flex-1 bg-blue-600 hover:bg-blue-700">
                      Set Array
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={arrayState.generateRandomArray}
                      className="flex-1 border-slate-500 text-slate-300 hover:bg-slate-600 bg-transparent"
                    >
                      Random
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Basic Operations */}
              <Card className="bg-slate-700 border-slate-600">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-slate-200">Basic Operations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {basicOperations.map((operation) => (
                    <Button
                      key={operation.id}
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOperationClick(operation.id)}
                      className="w-full justify-start text-left text-slate-300 hover:text-white hover:bg-slate-600"
                    >
                      <operation.icon className="h-4 w-4 mr-2" />
                      <div>
                        <div className="font-medium">{operation.name}</div>
                        <div className="text-xs text-slate-400">{operation.description}</div>
                      </div>
                    </Button>
                  ))}
                </CardContent>
              </Card>

              {/* Advanced Operations */}
              <Card className="bg-slate-700 border-slate-600">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-slate-200">Advanced Operations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {advancedOperations.map((operation) => (
                    <Button
                      key={operation.id}
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOperationClick(operation.id)}
                      className="w-full justify-start text-left text-slate-300 hover:text-white hover:bg-slate-600"
                    >
                      <operation.icon className="h-4 w-4 mr-2" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{operation.name}</span>
                          <Badge variant="secondary" className="text-xs bg-slate-600 text-slate-300">
                            {operation.complexity}
                          </Badge>
                        </div>
                        <div className="text-xs text-slate-400">{operation.description}</div>
                      </div>
                    </Button>
                  ))}
                </CardContent>
              </Card>

              {/* Current Array Display */}
              <Card className="bg-slate-700 border-slate-600">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-slate-200">Current Array</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1">
                    {arrayState.elements.map((element, index) => (
                      <div
                        key={index}
                        className={`w-8 h-8 flex items-center justify-center text-xs font-medium rounded ${
                          arrayState.sortedIndices.includes(index)
                            ? "bg-green-600 text-white"
                            : arrayState.comparingIndices.includes(index)
                              ? "bg-yellow-600 text-white"
                              : arrayState.currentIndex === index
                                ? "bg-red-600 text-white"
                                : "bg-blue-600 text-white"
                        }`}
                      >
                        {element}
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-slate-400 mt-2">Size: {arrayState.elements.length} elements</div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
