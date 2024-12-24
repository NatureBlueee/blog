# 数据库服务层文档

## 概述
本项目使用统一的服务层来处理所有数据库交互。所有与数据库相关的操作都应通过相应的服务类来完成，这样可以确保：
- 数据操作的一致性
- 代码的可维护性
- 错误处理的统一性
- 类型安全
- 事务支持

## 核心服务

### PostService
文章相关的所有数据库操作。

```typescript
import { postService } from '@/lib/services/post'
```

#### 可用方法：
- `getPosts({ status?, limit?, orderBy? })`: 获取文章列表
  - status: 文章状态（published/draft）
  - limit: 限制返回数量
  - orderBy: 排序方式
- `getPostBySlug(slug)`: 获取单篇文章
- `create(postData)`: 创建文章
- `createMany(posts)`: 批量创建文章
- `deleteAll()`: 删除所有文章

#### 使用示例：
```typescript
// 获取已发布的文章列表
const posts = await postService.getPosts({ 
  status: 'published',
  limit: 10,
  orderBy: { created_at: 'desc' }
})

// 获取单篇文章
const post = await postService.getPostBySlug('article-slug')

// 创建文章
const newPost = await postService.create({
  title: '文章标题',
  content: '文章内容',
  tags: ['frontend', 'react']  // 使用标签的 slug
})

// 批量创建文章
const posts = await postService.createMany([
  { title: '文章1', content: '内容1' },
  { title: '文章2', content: '内容2' }
])
```

### TagService
标签相关的所有数据库操作。

```typescript
import { tagService } from '@/lib/services/tag'
```

#### 可用方法：
- `getTags()`: 获取所有标签
- `createMany(tags)`: 批量创建标签

#### 使用示例：
```typescript
// 获取所有标签
const tags = await tagService.getTags()

// 批量创建标签
const newTags = await tagService.createMany([
  { name: '前端开发', slug: 'frontend' },
  { name: '后端开发', slug: 'backend' }
])
```

## 最佳实践

### 1. 服务层使用方式
- **在服务端组件中**：
  ```typescript
  // 直接使用服务层
  const posts = await postService.getPosts({ status: 'published' })
  ```

- **在 API 路由中**：
  ```typescript
  export async function GET() {
    try {
      const posts = await postService.getPosts({ status: 'published' })
      return NextResponse.json({ data: posts })
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : '获取失败' },
        { status: 500 }
      )
    }
  }
  ```

- **在客户端组件中**：
  通过 API 路由间接使用服务层
  ```typescript
  const res = await fetch('/api/posts')
  const { data } = await res.json()
  ```

### 2. 错误处理
所有服务方法都使用统一的错误处理机制：
```typescript
try {
  const result = await postService.someMethod()
} catch (error) {
  // 使用统一的错误处理工具
  const handledError = handleError(error)
  // 显示错误组件
  return <ErrorComponent error={handledError} />
}
```

### 3. 类型安全
所有服务方法都有完整的 TypeScript 类型定义：
```typescript
interface CreatePostData {
  title: string
  content: string
  tags?: string[]
  status?: 'draft' | 'published'
}

async create(postData: CreatePostData): Promise<Post>
```

### 4. 事务支持
复杂操作应使用事务确保数据一致性：
```typescript
return this.transaction(async () => {
  // 事务中的操作
  const result = await someOperation()
  // 如果发生错误，所有操作都会回滚
}, '操作说明')
```

## 扩展指南

### 添加新的服务类

1. 创建新的服务文件：
```typescript
// src/lib/services/new-service.ts
import { BaseService } from './base'

class NewService extends BaseService {
  async someMethod() {
    return this.transaction(async () => {
      // 实现方法
    }, '方法说明')
  }
}

export const newService = new NewService()
```

2. 在需要的地方导入并使用：
```typescript
import { newService } from '@/lib/services/new-service'

const result = await newService.someMethod()
```

### 注意事项
1. 所有数据库操作都应通过服务层进行
2. 保持服务方法的原子性
3. 合理使用事务
4. 统一错误处理
5. 保持类型定义的完整性
6. 添加适当的日志记录
7. 考虑性能优化（如缓存策略）

## 测试
服务层的测试应该包括：
1. 单元测试
2. 集成测试
3. 边界条件测试
4. 错误处理测试

## 维护和更新
1. 定期检查和更新服务层方法
2. 保持文档的同步更新
3. 监控性能指标
4. 根据需求添加新功能
```

