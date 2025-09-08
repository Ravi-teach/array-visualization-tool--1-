"use client"

import { useState, useCallback } from "react"
import type { ExecutionState } from "@/lib/types"
import { getCodeTemplate } from "@/lib/algorithms"

export function useCodeExecution() {
  const [state, setState] = useState<ExecutionState>({
    mode: "visual",
    isPlaying: false,
    speed: 1,
    currentOperation: "",
    code: getCodeTemplate("create"),
    currentLine: 0,
  })

  const setMode = useCallback((mode: "visual" | "step-by-step") => {
    setState((prev) => ({ ...prev, mode }))
  }, [])

  const setIsPlaying = useCallback((isPlaying: boolean) => {
    setState((prev) => ({ ...prev, isPlaying }))
  }, [])

  const togglePlayPause = useCallback(() => {
    setState((prev) => ({ ...prev, isPlaying: !prev.isPlaying }))
  }, [])

  const setSpeed = useCallback((speed: number) => {
    setState((prev) => ({ ...prev, speed }))
  }, [])

  const setCurrentOperation = useCallback((operation: string) => {
    setState((prev) => ({ ...prev, currentOperation: operation }))
  }, [])

  const setCode = useCallback((code: string) => {
    setState((prev) => ({ ...prev, code }))
  }, [])

  const setCurrentLine = useCallback((line: number) => {
    setState((prev) => ({ ...prev, currentLine: line }))
  }, [])

  const loadTemplate = useCallback((templateId: string) => {
    const template = getCodeTemplate(templateId)
    setState((prev) => ({
      ...prev,
      code: template,
      currentLine: 0,
      currentOperation: templateId,
    }))
  }, [])

  const reset = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isPlaying: false,
      currentLine: 0,
    }))
  }, [])

  return {
    ...state,
    setMode,
    setIsPlaying,
    togglePlayPause,
    setSpeed,
    setCurrentOperation,
    setCode,
    setCurrentLine,
    loadTemplate,
    reset,
  }
}
