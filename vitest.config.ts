/**
 * Vitest 测试框架配置文件
 *
 * 用途：
 * - 配置测试环境
 * - 设置测试文件匹配规则
 * - 配置测试工具和插件
 * - 设置路径别名
 *
 * 主要配置：
 * - plugins: 测试相关插件
 * - test: 测试运行配置
 * - resolve: 路径解析配置
 */

/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
