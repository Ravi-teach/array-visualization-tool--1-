import { Code, Settings, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Code className="h-8 w-8 text-blue-400" />
          <h1 className="text-xl font-bold text-white">Interactive Array Visualization Tool</h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
          <HelpCircle className="h-4 w-4 mr-2" />
          Help
        </Button>
        <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </div>
    </header>
  )
}
