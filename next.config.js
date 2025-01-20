/**
 * Next.js 配置文件
 *
 * 用途：
 * - 配置 Next.js 项目行为
 * - 设置页面扩展名
 * - 配置图片域名白名单
 * - 集成 MDX 支持
 *
 * 主要配置：
 * - reactStrictMode: React 严格模式
 * - experimental: 实验性功能
 * - pageExtensions: 页面文件扩展名
 * - images: 图片相关配置
 */

const withMDX = require('@next/mdx')()

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    missingSuspenseWithCSRError: false,
    serverActions: {
      timeout: 120, // 设置为120秒
    },
  },
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  images: {
    domains: ['localhost'],
  },
}

module.exports = withMDX(nextConfig)
