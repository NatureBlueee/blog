declare global {
  interface Window {
    Stackedit: any
  }
}

export interface StackeditFile {
  name: string
  content: string
  properties?: Record<string, any>
}

export interface StackeditInstance {
  openFile: (file: Partial<StackeditFile>) => void
  on: (event: string, callback: (file: StackeditFile) => void) => void
  off: (event: string, callback: (file: StackeditFile) => void) => void
  destroy: () => void
} 