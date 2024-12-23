export const SITE_CONFIG = {
  name: 'My Portfolio',
  description: 'A personal portfolio and blog',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  author: {
    name: '张三',
    email: 'contact@example.com',
    social: {
      github: 'https://github.com/username',
      twitter: 'https://twitter.com/username',
      linkedin: 'https://linkedin.com/in/username',
    },
  },
} as const

export const NAVIGATION = {
  main: [
    { name: 'nav.home', href: '/' },
    { name: 'nav.blog', href: '/blog' },
    { name: 'nav.projects', href: '/projects' },
    { name: 'nav.about', href: '/about' },
  ],
  footer: [
    { name: '隐私政策', href: '/privacy' },
    { name: '使用条款', href: '/terms' },
    { name: '联系我们', href: '/contact' },
  ],
} as const

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const

export const API_ENDPOINTS = {
  posts: '/api/posts',
  projects: '/api/projects',
  contact: '/api/contact',
} as const 