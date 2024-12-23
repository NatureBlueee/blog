interface ErrorMessageProps {
  error: string | null
  className?: string
}

export function ErrorMessage({ error, className = '' }: ErrorMessageProps) {
  if (!error) return null
  
  return (
    <div className={`p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg ${className}`}>
      {error}
    </div>
  )
} 