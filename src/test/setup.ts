import '@testing-library/jest-dom'
import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// 每个测试后进行清理
afterEach(() => {
  cleanup()
})
