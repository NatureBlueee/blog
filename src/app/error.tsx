'use client'

import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import '../lib/i18n'

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
    <div className='flex flex-col items-center justify-center min-h-[400px]'>
      <h2 className='text-2xl font-bold mb-4'>{t('error.title')}</h2>
      <button
        onClick={reset}
        className='px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90'
      >
        {t('error.retry')}
      </button>
    </div>
  )
}
