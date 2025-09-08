"use client"

import { useState, useCallback, useRef } from "react"
import type { ArrayState, AnimationStep } from "@/lib/types"

export function useArrayVisualization() {
  const [state, setState] = useState<ArrayState>({
    elements: [64, 34, 25, 12, 22, 11, 90, 5, 77, 30],
    currentIndex: -1,
    comparingIndices: [],
    sortedIndices: [],
    searchTarget: undefined,
    isAnimating: false,
    currentStep: 0,
    totalSteps: 0,
  })

  const animationSteps = useRef<AnimationStep[]>([])
  const animationTimeoutRef = useRef<NodeJS.Timeout>()

  const setElements = useCallback((elements: number[]) => {
    console.log("setElements called with:", elements)
    setState((prev) => {
      console.log("Previous state:", prev.elements)
      const newState = {
        ...prev,
        elements: [...elements],
        currentIndex: -1,
        comparingIndices: [],
        sortedIndices: [],
        searchTarget: undefined,
        currentStep: 0,
        totalSteps: 0,
        // Force re-render by adding a timestamp
        lastUpdated: Date.now(),
      }
      console.log("New state:", newState.elements)
      return newState
    })
    animationSteps.current = []
  }, [])

  const generateRandomArray = useCallback(() => {
    const size = Math.floor(Math.random() * 8) + 5 // 5-12 elements
    const elements = Array.from({ length: size }, () => Math.floor(Math.random() * 99) + 1)
    setElements(elements)
  }, [setElements])

  const setArraySize = useCallback(
    (size: number) => {
      const elements = Array.from({ length: size }, () => Math.floor(Math.random() * 99) + 1)
      setElements(elements)
    },
    [setElements],
  )

  // Animation execution functions
  const executeLinearSearch = useCallback(
    (target: number, speed = 1) => {
      const steps: AnimationStep[] = []
      const elements = state.elements

      for (let i = 0; i < elements.length; i++) {
        steps.push({
          type: "search",
          indices: [i],
          description: `Checking element at index ${i}: ${elements[i]}`,
          line: i + 5,
          currentIndex: i,
          comparingIndices: [i],
          searchTarget: target,
        })

        if (elements[i] === target) {
          steps.push({
            type: "search",
            indices: [i],
            description: `Found target ${target} at index ${i}!`,
            line: i + 6,
            currentIndex: i,
            comparingIndices: [],
            searchTarget: target,
          })
          break
        }
      }

      if (!elements.includes(target)) {
        steps.push({
          type: "search",
          indices: [],
          description: `Target ${target} not found in array`,
          line: elements.length + 7,
          currentIndex: -1,
          comparingIndices: [],
          searchTarget: target,
        })
      }

      animationSteps.current = steps
      setState((prev) => ({ ...prev, totalSteps: steps.length, searchTarget: target }))
      return steps
    },
    [state.elements],
  )

  const executeBubbleSort = useCallback(
    (speed = 1) => {
      const steps: AnimationStep[] = []
      const arr = [...state.elements]
      const n = arr.length

      for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
          // Compare step
          steps.push({
            type: "compare",
            indices: [j, j + 1],
            description: `Comparing ${arr[j]} and ${arr[j + 1]}`,
            line: 8 + j,
            currentIndex: -1,
            comparingIndices: [j, j + 1],
            elements: [...arr],
          })

          if (arr[j] > arr[j + 1]) {
            // Swap step
            steps.push({
              type: "swap",
              indices: [j, j + 1],
              description: `Swapping ${arr[j]} and ${arr[j + 1]}`,
              line: 12 + j,
              currentIndex: -1,
              comparingIndices: [j, j + 1],
              elements: [...arr],
            })

            // Perform swap
            ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]

            // Show result after swap
            steps.push({
              type: "swap",
              indices: [j, j + 1],
              description: `Swapped! New positions: ${arr[j]} and ${arr[j + 1]}`,
              line: 13 + j,
              currentIndex: -1,
              comparingIndices: [],
              elements: [...arr],
            })
          }
        }

        // Mark last element as sorted
        steps.push({
          type: "sort",
          indices: [n - 1 - i],
          description: `Element at position ${n - 1 - i} is now in correct position`,
          line: 15,
          currentIndex: -1,
          comparingIndices: [],
          sortedIndices: Array.from({ length: i + 1 }, (_, k) => n - 1 - k),
          elements: [...arr],
        })
      }

      // Mark all as sorted
      steps.push({
        type: "sort",
        indices: Array.from({ length: n }, (_, i) => i),
        description: "Bubble sort completed! Array is fully sorted.",
        line: 20,
        currentIndex: -1,
        comparingIndices: [],
        sortedIndices: Array.from({ length: n }, (_, i) => i),
        elements: [...arr],
      })

      animationSteps.current = steps
      setState((prev) => ({ ...prev, totalSteps: steps.length }))
      return steps
    },
    [state.elements],
  )

  const executeSelectionSort = useCallback(
    (speed = 1) => {
      const steps: AnimationStep[] = []
      const arr = [...state.elements]
      const n = arr.length

      for (let i = 0; i < n - 1; i++) {
        let minIndex = i

        steps.push({
          type: "highlight",
          indices: [i],
          description: `Finding minimum element from position ${i}`,
          line: 5,
          currentIndex: i,
          comparingIndices: [],
          elements: [...arr],
        })

        for (let j = i + 1; j < n; j++) {
          steps.push({
            type: "compare",
            indices: [j, minIndex],
            description: `Comparing ${arr[j]} with current minimum ${arr[minIndex]}`,
            line: 8,
            currentIndex: i,
            comparingIndices: [j, minIndex],
            elements: [...arr],
          })

          if (arr[j] < arr[minIndex]) {
            minIndex = j
            steps.push({
              type: "highlight",
              indices: [minIndex],
              description: `New minimum found: ${arr[minIndex]} at position ${minIndex}`,
              line: 10,
              currentIndex: i,
              comparingIndices: [minIndex],
              elements: [...arr],
            })
          }
        }

        if (minIndex !== i) {
          steps.push({
            type: "swap",
            indices: [i, minIndex],
            description: `Swapping ${arr[i]} with ${arr[minIndex]}`,
            line: 15,
            currentIndex: i,
            comparingIndices: [i, minIndex],
            elements: [...arr],
          })

          // Perform swap
          ;[arr[i], arr[minIndex]] = [arr[minIndex], arr[i]]
        }

        steps.push({
          type: "sort",
          indices: [i],
          description: `Position ${i} is now sorted with value ${arr[i]}`,
          line: 18,
          currentIndex: -1,
          comparingIndices: [],
          sortedIndices: Array.from({ length: i + 1 }, (_, k) => k),
          elements: [...arr],
        })
      }

      steps.push({
        type: "sort",
        indices: Array.from({ length: n }, (_, i) => i),
        description: "Selection sort completed!",
        line: 20,
        currentIndex: -1,
        comparingIndices: [],
        sortedIndices: Array.from({ length: n }, (_, i) => i),
        elements: [...arr],
      })

      animationSteps.current = steps
      setState((prev) => ({ ...prev, totalSteps: steps.length }))
      return steps
    },
    [state.elements],
  )

  const executeInsertionSort = useCallback(
    (speed = 1) => {
      const steps: AnimationStep[] = []
      const arr = [...state.elements]
      const n = arr.length

      for (let i = 1; i < n; i++) {
        const key = arr[i]
        let j = i - 1

        steps.push({
          type: "highlight",
          indices: [i],
          description: `Inserting ${key} into sorted portion`,
          line: 5,
          currentIndex: i,
          comparingIndices: [],
          elements: [...arr],
        })

        while (j >= 0 && arr[j] > key) {
          steps.push({
            type: "compare",
            indices: [j, j + 1],
            description: `Moving ${arr[j]} one position right`,
            line: 8,
            currentIndex: i,
            comparingIndices: [j, j + 1],
            elements: [...arr],
          })

          arr[j + 1] = arr[j]
          j = j - 1

          steps.push({
            type: "swap",
            indices: [j + 1, j + 2],
            description: `Moved ${arr[j + 2]} to position ${j + 2}`,
            line: 9,
            currentIndex: i,
            comparingIndices: [],
            elements: [...arr],
          })
        }

        arr[j + 1] = key

        steps.push({
          type: "sort",
          indices: [j + 1],
          description: `Inserted ${key} at position ${j + 1}`,
          line: 12,
          currentIndex: -1,
          comparingIndices: [],
          sortedIndices: Array.from({ length: i + 1 }, (_, k) => k),
          elements: [...arr],
        })
      }

      steps.push({
        type: "sort",
        indices: Array.from({ length: n }, (_, i) => i),
        description: "Insertion sort completed!",
        line: 15,
        currentIndex: -1,
        comparingIndices: [],
        sortedIndices: Array.from({ length: n }, (_, i) => i),
        elements: [...arr],
      })

      animationSteps.current = steps
      setState((prev) => ({ ...prev, totalSteps: steps.length }))
      return steps
    },
    [state.elements],
  )

  const executeBinarySearch = useCallback(
    (target: number, speed = 1) => {
      const steps: AnimationStep[] = []
      const arr = [...state.elements].sort((a, b) => a - b) // Sort for binary search
      const n = arr.length
      let left = 0
      let right = n - 1

      steps.push({
        type: "highlight",
        indices: [],
        description: `Starting binary search for ${target} in sorted array`,
        line: 5,
        currentIndex: -1,
        comparingIndices: [],
        searchTarget: target,
        elements: [...arr],
      })

      while (left <= right) {
        const mid = Math.floor((left + right) / 2)

        steps.push({
          type: "compare",
          indices: [mid],
          description: `Checking middle element at index ${mid}: ${arr[mid]}`,
          line: 8,
          currentIndex: mid,
          comparingIndices: [mid],
          searchTarget: target,
          elements: [...arr],
        })

        if (arr[mid] === target) {
          steps.push({
            type: "search",
            indices: [mid],
            description: `Found target ${target} at index ${mid}!`,
            line: 12,
            currentIndex: mid,
            comparingIndices: [],
            searchTarget: target,
            elements: [...arr],
          })
          break
        }

        if (arr[mid] < target) {
          steps.push({
            type: "highlight",
            indices: Array.from({ length: right - mid }, (_, i) => mid + 1 + i),
            description: `Target is greater, searching right half`,
            line: 15,
            currentIndex: mid,
            comparingIndices: [],
            searchTarget: target,
            elements: [...arr],
          })
          left = mid + 1
        } else {
          steps.push({
            type: "highlight",
            indices: Array.from({ length: mid - left }, (_, i) => left + i),
            description: `Target is smaller, searching left half`,
            line: 17,
            currentIndex: mid,
            comparingIndices: [],
            searchTarget: target,
            elements: [...arr],
          })
          right = mid - 1
        }
      }

      if (left > right) {
        steps.push({
          type: "search",
          indices: [],
          description: `Target ${target} not found in array`,
          line: 20,
          currentIndex: -1,
          comparingIndices: [],
          searchTarget: target,
          elements: [...arr],
        })
      }

      animationSteps.current = steps
      setState((prev) => ({ ...prev, totalSteps: steps.length, searchTarget: target, elements: arr }))
      return steps
    },
    [state.elements],
  )

  const playAnimation = useCallback((speed = 1) => {
    if (animationSteps.current.length === 0) return

    setState((prev) => ({ ...prev, isAnimating: true, currentStep: 0 }))

    const playStep = (stepIndex: number) => {
      if (stepIndex >= animationSteps.current.length) {
        setState((prev) => ({ ...prev, isAnimating: false }))
        return
      }

      const step = animationSteps.current[stepIndex]

      setState((prev) => ({
        ...prev,
        currentStep: stepIndex + 1,
        currentIndex: step.currentIndex ?? prev.currentIndex,
        comparingIndices: step.comparingIndices ?? [],
        sortedIndices: step.sortedIndices ?? prev.sortedIndices,
        elements: step.elements ?? prev.elements,
        searchTarget: step.searchTarget ?? prev.searchTarget,
      }))

      const delay = 1000 / speed // Base delay of 1 second divided by speed
      animationTimeoutRef.current = setTimeout(() => playStep(stepIndex + 1), delay)
    }

    playStep(0)
  }, [])

  const stopAnimation = useCallback(() => {
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current)
    }
    setState((prev) => ({ ...prev, isAnimating: false }))
  }, [])

  const stepForward = useCallback(() => {
    if (state.currentStep < animationSteps.current.length) {
      const step = animationSteps.current[state.currentStep]
      setState((prev) => ({
        ...prev,
        currentStep: prev.currentStep + 1,
        currentIndex: step.currentIndex ?? prev.currentIndex,
        comparingIndices: step.comparingIndices ?? [],
        sortedIndices: step.sortedIndices ?? prev.sortedIndices,
        elements: step.elements ?? prev.elements,
        searchTarget: step.searchTarget ?? prev.searchTarget,
      }))
    }
  }, [state.currentStep])

  const stepBackward = useCallback(() => {
    if (state.currentStep > 0) {
      const step = animationSteps.current[state.currentStep - 2] || animationSteps.current[0]
      setState((prev) => ({
        ...prev,
        currentStep: prev.currentStep - 1,
        currentIndex: step.currentIndex ?? -1,
        comparingIndices: step.comparingIndices ?? [],
        sortedIndices: step.sortedIndices ?? [],
        elements: step.elements ?? prev.elements,
        searchTarget: step.searchTarget,
      }))
    }
  }, [state.currentStep])

  const reset = useCallback(() => {
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current)
    }
    setState((prev) => ({
      ...prev,
      currentIndex: -1,
      comparingIndices: [],
      sortedIndices: [],
      searchTarget: undefined,
      isAnimating: false,
      currentStep: 0,
    }))
    animationSteps.current = []
  }, [])

  const executeBasicOperation = useCallback((operation: string) => {
    const steps: AnimationStep[] = []
    
    // Create a simple animation step for basic operations
    steps.push({
      type: "highlight",
      indices: Array.from({ length: state.elements.length }, (_, i) => i),
      description: `Executing ${operation} operation`,
      line: 1,
      currentIndex: -1,
      comparingIndices: [],
      elements: [...state.elements],
    })

    animationSteps.current = steps
    setState((prev) => ({ ...prev, totalSteps: steps.length }))
    return steps
  }, [state.elements])

  return {
    ...state,
    setElements,
    generateRandomArray,
    setArraySize,
    executeLinearSearch,
    executeBinarySearch,
    executeBubbleSort,
    executeSelectionSort,
    executeInsertionSort,
    executeBasicOperation,
    playAnimation,
    stopAnimation,
    stepForward,
    stepBackward,
    reset,
  }
}
