"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { CodeEditor } from "@/components/code-editor"
import { ArrayVisualization } from "@/components/array-visualization"
import { ControlPanel } from "@/components/control-panel"
import { useArrayVisualization } from "@/hooks/use-array-visualization"
import { useCodeExecution } from "@/hooks/use-code-execution"

export default function ArrayVisualizationTool() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const arrayState = useArrayVisualization()
  const codeState = useCodeExecution()

  // Function to set example code
  const setExampleCode = (example: string) => {
    codeState.setCode(example)
  }

  // Function to execute the code and show changes
  const handleRunCode = () => {
    const code = codeState.code.toLowerCase()
    console.log("Running code:", code) // Debug logging
    
    // Debug: Check what patterns we're looking for
    console.log("Checking array creation pattern:", /int arr\[\d+\]\s*=\s*\{[^}]+\}/.test(code))
    console.log("Code contains 'int arr[':", code.includes('int arr['))
    console.log("Code contains 'update element':", code.includes('update element'))
    
    // Parse the code to detect operations (order matters - more specific first)
    // Check for array creation first (before update) to handle code that has both
    // Look for array declaration pattern: int arr[size] = {values};
    if (code.includes('array creation') || 
        (code.includes('create') && code.includes('int arr[')) ||
        /int arr\[\d+\]\s*=\s*\{[^}]+\}/.test(code)) {
      console.log("Detected: Array Creation")
      codeState.setCurrentOperation("create")
      // Don't load template - use the current code in editor
      
      // Extract array values from the code
      const arrayMatch = code.match(/int arr\[\d+\] = \{([^}]+)\}/)
      if (arrayMatch) {
        const values = arrayMatch[1].split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v))
        if (values.length > 0) {
          console.log("Creating array with values:", values)
          console.log("Current array before creation:", arrayState.elements)
          arrayState.setElements(values)
          console.log("Array creation completed")
          
          // Check if there's also an update operation in the same code
          const posMatch = code.match(/int pos = (\d+)/)
          const valueMatch = code.match(/int newvalue = (\d+)/i)
          if (posMatch && valueMatch) {
            const position = parseInt(posMatch[1])
            const newValue = parseInt(valueMatch[1])
            console.log(`Also updating position ${position} with value ${newValue}`)
            
            // Update the newly created array
            const updatedArray = [...values]
            if (position >= 0 && position < updatedArray.length) {
              updatedArray[position] = newValue
              console.log(`Updated array:`, updatedArray)
              arrayState.setElements(updatedArray)
              
              // Trigger visual animation
              arrayState.executeBasicOperation(`Created array and updated position ${position} to ${newValue}`)
            }
          }
        } else {
          console.log("No valid values found in array declaration")
          arrayState.executeBasicOperation("Array Creation")
        }
      } else {
        console.log("Could not parse array declaration from code")
        arrayState.executeBasicOperation("Array Creation")
      }
    } else if (code.includes('update element') || (code.includes('newvalue') && code.includes('arr['))) {
      console.log("Detected: Update Element")
      codeState.setCurrentOperation("update")
      // Don't load template - use the current code in editor
      
      // Extract update operation from code
      const posMatch = code.match(/int pos = (\d+)/)
      const valueMatch = code.match(/int newvalue = (\d+)/i)
      if (posMatch && valueMatch) {
        const position = parseInt(posMatch[1])
        const newValue = parseInt(valueMatch[1])
        console.log(`Updating position ${position} with value ${newValue}`)
        console.log(`Current array before update:`, arrayState.elements)
        
        // Create a copy of current array and update the specified position
        const newArray = [...arrayState.elements]
        if (position >= 0 && position < newArray.length) {
          newArray[position] = newValue
          console.log(`New array after update:`, newArray)
          
          // Use a more explicit state update approach
          arrayState.setElements(newArray)
          
          // Trigger a visual highlight animation to show the change
          arrayState.executeBasicOperation(`Updated position ${position} to ${newValue}`)
          
          // Force a re-render by updating the operation
          codeState.setCurrentOperation(`update-${Date.now()}`)
          
          // Force a small delay to ensure state update is processed
          setTimeout(() => {
            console.log("Array state after update:", arrayState.elements)
          }, 100)
        } else {
          console.log(`Invalid position ${position}, array length: ${newArray.length}`)
          arrayState.executeBasicOperation("Update Element")
        }
      } else {
        console.log("Could not parse position or value from code")
        arrayState.executeBasicOperation("Update Element")
      }
    } else if (code.includes('delete element') || (code.includes('delete') && code.includes('arr['))) {
      console.log("Detected: Delete Element")
      codeState.setCurrentOperation("delete")
      // Don't load template - use the current code in editor
      
      // Extract delete operation from code
      const posMatch = code.match(/int pos = (\d+)/)
      if (posMatch) {
        const position = parseInt(posMatch[1])
        console.log(`Deleting element at position ${position}`)
        
        // Create a new array without the element at the specified position
        const newArray = arrayState.elements.filter((_, index) => index !== position)
        if (newArray.length !== arrayState.elements.length) {
          arrayState.setElements(newArray)
        } else {
          arrayState.executeBasicOperation("Delete Element")
        }
      } else {
        arrayState.executeBasicOperation("Delete Element")
      }
    } else if (code.includes('insert element') || (code.includes('insert') && code.includes('arr['))) {
      console.log("Detected: Insert Element")
      codeState.setCurrentOperation("insert")
      // Don't load template - use the current code in editor
      
      // Extract insert operation from code
      const posMatch = code.match(/int pos = (\d+)/)
      const valueMatch = code.match(/int value = (\d+)/)
      if (posMatch && valueMatch) {
        const position = parseInt(posMatch[1])
        const newValue = parseInt(valueMatch[1])
        console.log(`Inserting value ${newValue} at position ${position}`)
        
        // Create a new array with the element inserted at the specified position
        const newArray = [...arrayState.elements]
        newArray.splice(position, 0, newValue)
        arrayState.setElements(newArray)
      } else {
        arrayState.executeBasicOperation("Insert Element")
      }
    } else if (code.includes('display array') || (code.includes('display') && code.includes('arr['))) {
      console.log("Detected: Display Array")
      codeState.setCurrentOperation("display")
      // Don't load template - use the current code in editor
      arrayState.executeBasicOperation("Display Array")
    } else if (code.includes('bubble') || code.includes('swap')) {
      console.log("Detected: Bubble Sort")
      codeState.setCurrentOperation("bubble-sort")
      codeState.loadTemplate("bubble-sort")
      arrayState.executeBubbleSort()
    } else if (code.includes('selection') || code.includes('minimum')) {
      console.log("Detected: Selection Sort")
      codeState.setCurrentOperation("selection-sort")
      codeState.loadTemplate("selection-sort")
      arrayState.executeSelectionSort()
    } else if (code.includes('insertion') || code.includes('insert')) {
      console.log("Detected: Insertion Sort")
      codeState.setCurrentOperation("insertion-sort")
      codeState.loadTemplate("insertion-sort")
      arrayState.executeInsertionSort()
    } else if (code.includes('linear') || (code.includes('search') && !code.includes('binary'))) {
      // Extract target from code if possible
      const targetMatch = code.match(/target\s*=\s*(\d+)/)
      const target = targetMatch ? parseInt(targetMatch[1]) : Math.floor(Math.random() * 100) + 1
      console.log("Detected: Linear Search, target:", target)
      
      codeState.setCurrentOperation("linear-search")
      codeState.loadTemplate("linear-search")
      arrayState.executeLinearSearch(target)
    } else if (code.includes('binary')) {
      // Extract target from code if possible
      const targetMatch = code.match(/target\s*=\s*(\d+)/)
      const target = targetMatch ? parseInt(targetMatch[1]) : Math.floor(Math.random() * 100) + 1
      console.log("Detected: Binary Search, target:", target)
      
      codeState.setCurrentOperation("binary-search")
      codeState.loadTemplate("binary-search")
      arrayState.executeBinarySearch(target)
    } else {
      // Default: try to run a simple animation to show something is happening
      console.log("No specific operation detected, running demo animation")
      codeState.setCurrentOperation("demo")
      // Run a quick bubble sort demo
      arrayState.executeBubbleSort()
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Header />

      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          arrayState={arrayState}
          codeState={codeState}
        />

        <main className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? "ml-80" : "ml-16"}`}>
          <div className="flex-1 flex">
            {/* Code Editor Panel */}
            <div className="w-1/2 border-r border-slate-700">
              <CodeEditor
                code={codeState.code}
                currentLine={codeState.currentLine}
                onCodeChange={codeState.setCode}
                language="cpp"
                onRunCode={handleRunCode}
                onSetExample={setExampleCode}
                currentOperation={codeState.currentOperation}
              />
            </div>

            {/* Visualization Panel */}
            <div className="w-1/2">
              <ArrayVisualization
                elements={arrayState.elements}
                currentIndex={arrayState.currentIndex}
                comparingIndices={arrayState.comparingIndices}
                sortedIndices={arrayState.sortedIndices}
                searchTarget={arrayState.searchTarget}
                isAnimating={arrayState.isAnimating}
                onLinearSearch={(target) => {
                  arrayState.executeLinearSearch(target)
                  codeState.setCurrentOperation("linear-search")
                  codeState.loadTemplate("linear-search")
                }}
                onBinarySearch={(target) => {
                  arrayState.executeBinarySearch(target)
                  codeState.setCurrentOperation("binary-search")
                  codeState.loadTemplate("binary-search")
                }}
              />
            </div>
          </div>

          {/* Control Panel */}
          <ControlPanel arrayState={arrayState} codeState={codeState} />
        </main>
      </div>
    </div>
  )
}
