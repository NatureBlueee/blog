import type { BlogPost } from '@/types'

export const samplePosts: BlogPost[] = [
  {
    title: "构建现代化 Web 应用",
    slug: "building-modern-web-apps",
    excerpt: "探索最新的前端技术栈和设计趋势...",
    content: "...",
    date: new Date().toISOString(),
    readTime: "5 min",
    author: {
      name: "张三",
      avatar: "/images/avatars/default.png",
      bio: "前端开发工程师"
    },
    category: "Web Development",
    tags: ["React", "Next.js", "Design"],
    status: 'published'
  },
  // 更多示例...
] 