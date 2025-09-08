"use client"

import { useState } from "react"
import { Play, Pause, SkipForward, SkipBack, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import type { ArrayState, ExecutionState } from "@/lib/types"

interface ControlPanelProps {
  arrayState: ArrayState & {
    reset: () => void
    stepForward: () => void
    stepBackward: () => void
    stopAnimation: () => void
    playAnimation: (speed: number) => void
  }
  codeState: ExecutionState & {
    togglePlayPause: () => void
    setSpeed: (speed: number) => void
    setMode: (mode: "visual" | "step-by-step") => void
    reset: () => void
    setIsPlaying: (isPlaying: boolean) => void
  }
}

export function ControlPanel({ arrayState, codeState }: ControlPanelProps) {
  const [speed, setSpeed] = useState([1])

  const handleSpeedChange = (value: number[]) => {
    setSpeed(value)
    codeState.setSpeed(value[0])
  }

  const handlePlayPause = () => {
    if (codeState.isPlaying) {
      arrayState.stopAnimation()
      codeState.setIsPlaying(false)
    } else {
      arrayState.playAnimation(speed[0])
      codeState.setIsPlaying(true)
    }
  }

  const progressPercentage = arrayState.totalSteps > 0 ? (arrayState.currentStep / arrayState.totalSteps) * 100 : 0

  return (
    <div className="h-20 bg-slate-800 border-t border-slate-700 px-6 flex items-center justify-between">
      {/* Left Section - Execution Controls */}
      <div className="flex items-center gap-4">
        {/* Mode Toggle */}
        <div className="flex items-center gap-2">
          <Button
            variant={codeState.mode === "visual" ? "default" : "outline"}
            size="sm"
            onClick={() => codeState.setMode("visual")}
            className="text-xs"
          >
            Visual Mode
          </Button>
          <Button
            variant={codeState.mode === "step-by-step" ? "default" : "outline"}
            size="sm"
            onClick={() => codeState.setMode("step-by-step")}
            className="text-xs"
          >
            Step Mode
          </Button>
        </div>

        <Separator orientation="vertical" className="h-8" />

        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={arrayState.stepBackward}
            disabled={arrayState.currentStep <= 0 || arrayState.totalSteps === 0}
            className="text-slate-300 hover:text-white bg-transparent"
          >
            <SkipBack className="h-4 w-4" />
          </Button>

          <Button
            variant={codeState.isPlaying ? "secondary" : "default"}
            size="sm"
            onClick={handlePlayPause}
            disabled={arrayState.totalSteps === 0}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {codeState.isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={arrayState.stepForward}
            disabled={arrayState.currentStep >= arrayState.totalSteps || arrayState.totalSteps === 0}
            className="text-slate-300 hover:text-white"
          >
            <SkipForward className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              arrayState.reset()
              codeState.reset()
            }}
            className="text-slate-300 hover:text-white"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Center Section - Progress */}
      <div className="flex-1 max-w-md mx-8">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary" className="text-xs bg-slate-700 text-slate-300">
            Step {arrayState.currentStep} of {arrayState.totalSteps}
          </Badge>
          <Badge variant="secondary" className="text-xs bg-slate-700 text-slate-300">
            {codeState.currentOperation || "No Operation"}
          </Badge>
        </div>
        <Progress value={progressPercentage} className="h-2 bg-slate-700" />
      </div>

      {/* Right Section - Speed Control */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-300 min-w-[4rem]">Speed:</span>
          <div className="w-24">
            <Slider
              value={speed}
              onValueChange={handleSpeedChange}
              max={3}
              min={0.5}
              step={0.5}
              className="cursor-pointer"
            />
          </div>
          <Badge variant="outline" className="text-xs min-w-[3rem] text-center border-slate-600 text-slate-300">
            {speed[0]}x
          </Badge>
        </div>

        <Separator orientation="vertical" className="h-8" />

        {/* Status Indicators */}
        <div className="flex items-center gap-2">
          {arrayState.isAnimating && (
            <Badge className="bg-blue-600 text-white animate-pulse">
              <div className="w-2 h-2 bg-white rounded-full mr-2 animate-ping"></div>
              Running
            </Badge>
          )}
          {codeState.isPlaying && !arrayState.isAnimating && (
            <Badge className="bg-green-600 text-white">
              <Play className="w-3 h-3 mr-1" />
              Playing
            </Badge>
          )}
          {!codeState.isPlaying && !arrayState.isAnimating && (
            <Badge variant="secondary" className="bg-slate-700 text-slate-300">
              <Pause className="w-3 h-3 mr-1" />
              Paused
            </Badge>
          )}
        </div>
      </div>
    </div>
  )
}
