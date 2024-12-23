# Next.js Blog & Portfolio

基于 Next.js 13+ 构建的个人博客和作品集网站，支持 MDX、响应式设计和深色模式。

## 技术栈

- Next.js 13+
- TypeScript
- TailwindCSS
- MDX
- Framer Motion
- Radix UI

## 特性

- 📝 MDX 支持的博客系统
- 🎨 响应式设计
- 🌙 深色模式
- 🔍 文章搜索
- 📱 移动端优化
- 🔒 管理员后台

## 快速开始

```bash
# 安装依赖
npm install

# 开发环境
npm run dev

# 构建
npm run build

# 生产环境
npm start
```

## 项目结构

```
.
├── app/                # Next.js App Router
├── components/         # React 组件
├── content/           # MDX 文章
│   └── posts/
├── public/            # 静态资源
└── src/
    ├── config/       # 配置文件
    ├── styles/       # 样式文件
    ├── types/        # TypeScript 类型
    └── utils/        # 工具函数
```

## 环境变量

创建 `.env.local` 文件：

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-password
JWT_SECRET=your-secret-key
```

## 许可

MIT License
```

这个 README 基于以下文件的内容：

1. 配置文件：

```1:14:src/config/constants.ts
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
```


2. 类型定义：

```14:74:src/types/index.ts
// 基础类型
export type Status = 'draft' | 'published' | 'archived'
export type ColorTheme = 'light' | 'dark'

// 通用接口
export interface BaseResponse<T> {
  data: T
  error?: string
  status: number
}

// 博客相关类型
export interface Post {
  slug: string
  title: string
  content: string
  excerpt: string
  date: string
  author: Author
  category: string
  tags: string[]
  status: Status
  lastModified?: string
}

export interface PostMetadata {
  title: string
  excerpt: string
  date: string
  author: Author
  category: string
  tags: string[]
  status: 'draft' | 'published'
}

export interface Author {
  name: string
  avatar: string
  bio: string
  social?: SocialLinks
}

export interface SocialLinks {
  github?: string
  twitter?: string
  linkedin?: string
  email?: string
}

export interface BlogCategory {
  name: string
  slug: string
  count: number
  description?: string
}

export interface BlogTag {
  name: string
  slug: string
  count: number
}
```


3. 环境配置：

```1:11:src/config/auth.ts
if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
  throw new Error('Missing ADMIN_USERNAME or ADMIN_PASSWORD environment variables')
}

export const AUTH_CONFIG = {
  username: process.env.ADMIN_USERNAME,
  // 这里存储的是哈希后的密码
  passwordHash: process.env.ADMIN_PASSWORD,
  // 用于加密的密钥
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key'
}
```

### 已实现的功能

1. **博客系统基础架构**
- MDX 文章支持 (参考 `content/posts/published/*.mdx`)
- 文章元数据定义 (参考 `src/types/index.ts` startLine: 39, endLine: 47)
- 文章读取和创建功能 (参考 `src/lib/posts.ts` startLine: 19, endLine: 66)

2. **管理后台**
- 设置页面 (参考 `src/app/admin/settings/page.tsx` startLine: 74, endLine: 124)
- 文章管理页面 (参考 `src/app/admin/posts/page.tsx` startLine: 1, endLine: 41)
- 作者信息管理 API (参考 `src/app/api/settings/author/route.ts`)

3. **配置系统**
- 站点配置 (参考 `src/config/constants.ts`)
- 认证配置 (参考 `src/config/auth.ts`)
- 类型定义 (参考 `src/types/index.ts`)

### 待实现的功能

1. **前端展示**
- 首页布局
- 博客列表页
- 文章详情页
- 分类和标签页面
- 作品集展示页

2. **交互功能**
- 深色模式切换
- 响应式导航
- 文章搜索
- 评论系统
- 分享功能

3. **性能优化**
- 图片优化
- 代码分割
- 缓存策略
- SEO 优化

4. **开发工具**
- 测试配置
- CI/CD 配置
- 开发文档
- 代码规范配置

### 下一步建议

1. 实现前端基础页面：
```typescript
src/app/
  ├── page.tsx          // 首页
  ├── blog/
  │   ├── page.tsx      // 博客列表
  │   ├── [slug]/
  │   │   └── page.tsx  // 文章详情
  ├── projects/
  │   └── page.tsx      // 作品集
  └── about/
      └── page.tsx      // 关于页面
```

2. 添加必要的组件：
```typescript
src/components/
  ├── layout/
  │   ├── Header.tsx
  │   ├── Footer.tsx
  │   └── Navigation.tsx
  ├── blog/
  │   ├── PostCard.tsx
  │   ├── PostList.tsx
  │   └── TableOfContents.tsx
  └── shared/
      ├── ThemeToggle.tsx
      └── SearchBar.tsx
```

需要我详细说明任何部分吗？
