'use client'

import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const { t } = useTranslation()

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">{t('error.something_went_wrong')}</h2>
        <button
          onClick={reset}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          {t('error.try_again')}
        </button>
      </div>
    </div>
  )
} 