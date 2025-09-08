export interface ArrayState {
  elements: number[]
  currentIndex: number
  comparingIndices: number[]
  sortedIndices: number[]
  searchTarget?: number
  isAnimating: boolean
  currentStep: number
  totalSteps: number
  lastUpdated?: number
}

export interface ExecutionState {
  mode: "visual" | "step-by-step"
  isPlaying: boolean
  speed: number
  currentOperation: string
  code: string
  currentLine: number
}

export interface AnimationStep {
  type: "compare" | "swap" | "highlight" | "search" | "sort"
  indices: number[]
  description: string
  line: number
  currentIndex?: number
  comparingIndices?: number[]
  sortedIndices?: number[]
  searchTarget?: number
  elements?: number[]
}
