/**
 * Tailwind CSS 配置文件
 *
 * 用途：
 * - 定义项目的样式主题
 * - 配置深色模式
 * - 设置容器样式
 * - 扩展颜色系统
 *
 * 主要配置：
 * - darkMode: 深色模式配置
 * - content: 需要处理的文件路径
 * - theme: 主题相关配置
 * - plugins: Tailwind 插件配置
 */

import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: '#0ea5e9',
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography'), require('tailwindcss-animate')],
}

export default config
