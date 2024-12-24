# 数据库文档

## 服务层架构

### BaseService
基础服务类，提供：
- 事务处理
- 错误处理
- Supabase 客户端实例

### DatabaseService
数据库管理服务，提供：
- 数据库状态检查
- 表统计信息
- 健康检查
- 初始化功能

## 数据库表结构

### posts 表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | uuid | 主键 |
| title | text | 文章标题 |
| slug | text | URL友好的标识符 |
| content | text | 文章内容 |
| status | text | 文章状态 |
| created_at | timestamp | 创建时间 |
| updated_at | timestamp | 更新时间 |
| deleted_at | timestamp | 软删除时间 |

### tags 表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | uuid | 主键 |
| name | text | 标签名称 |
| slug | text | URL友好的标识符 |
| created_at | timestamp | 创建时间 |
| updated_at | timestamp | 更新时间 |

### post_tags 表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | uuid | 主键 |
| post_id | uuid | 外键关联posts表 |
| tag_id | uuid | 外键关联tags表 |

## 常用查询示例

### 获取文章列表
sql
SELECT p.,
array_agg(t.name) as tag_names
FROM posts p
LEFT JOIN post_tags pt ON p.id = pt.post_id
LEFT JOIN tags t ON pt.tag_id = t.id
WHERE p.deleted_at IS NULL
GROUP BY p.id
ORDER BY p.created_at DESC;

### 获取带标签的文章详情
sql
SELECT p.,
json_agg(json_build_object(
'id', t.id,
'name', t.name,
'slug', t.slug
)) as tags
FROM posts p
LEFT JOIN post_tags pt ON p.id = pt.post_id
LEFT JOIN tags t ON pt.tag_id = t.id
WHERE p.slug = :slug
GROUP BY p.id;

## 最佳实践

### 1. 事务处理
所有修改操作都应该使用事务：
typescript
return this.transaction(async () => {
// 数据库操作
}, '操作说明')

### 2. 软删除
- 使用 deleted_at 字段标记删除
- 查询时过滤已删除记录
- 不直接从数据库删除数据

### 3. 错误处理
- 使用自定义 DatabaseError
- 统一错误消息格式
- 记录详细错误信息

### 4. 数据验证
- 插入前验证必填字段
- 更新前检查记录是否存在
- 验证外键关系完整性

## 变更日志

### 2024-12-24
- 添加 DatabaseService
- 统一数据库状态检查
- 添加健康检查功能
## API 接口说明

### 数据库状态检查
typescript
// 获取数据库完整状态
const status = await databaseService.getStatus()
// 获取仪表盘统计数据
const stats = await databaseService.getDashboardStats()
// 检查数据库健康状态
const health = await databaseService.checkHealth()

### 文章管理接口
typescript
// 获取文章列表
const posts = await postService.getPosts({
status: 'published',
limit: 10,
orderBy: { created_at: 'desc' }
})
// 获取文章详情
const post = await postService.getPostBySlug('article-slug')
// 创建新文章
const newPost = await postService.create({
title: '文章标题',
slug: 'article-slug',
content: '文章内容',
status: 'draft',
tags: ['frontend', 'react']
})

### 标签管理接口
typescript
// 获取所有标签
const tags = await tagService.getTags()
// 获取标签详情
const tag = await tagService.getTagBySlug('tag-slug')
// 创建标签
const newTags = await tagService.createMany([
{ name: '前端开发', slug: 'frontend' }
])

## 数据库初始化和测试

### 初始化数据库
typescript
// 清理并初始化数据库
await databaseService.initializeDatabase()
// 只清理数据
await databaseService.clearAllData()
// 验证数据库结构
const validation = await databaseService.validateSchema()

### 测试数据生成

typescript
// 创建测试数据
await testDataService.createTestData({
postsCount: 10,
tagsCount: 5
})

## 错误处理示例
typescript
try {
await databaseService.operation()
} catch (error) {
if (error instanceof DatabaseError) {
// 处理数据库错误
console.error(数据库错误: ${error.message})
console.error(状态码: ${error.statusCode})
console.error(详情: ${error.details})
} else {
// 处理其他错误
console.error(未知错误: ${error.message})
}
}

## 性能优化建议

### 1. 查询优化
- 使用适当的索引
- 避免 SELECT *
- 使用分页加载
- 合理使用 JOIN

### 2. 写入优化
- 批量插入而不是单条插入
- 使用事务包装多个操作
- 避免频繁更新

### 3. 缓存策略
- 使用 React Query 缓存
- 合理设置缓存时间
- 及时清理过期缓存

是的，我们应该更新数据库文档来反映我们学到的最佳实践。让我们在 DATABASE.md 中添加新的内容：

```markdown:docs/DATABASE.md
## React Query 最佳实践

### 1. 查询配置
- 禁用自动刷新：`refetchInterval: false`
- 禁用窗口聚焦刷新：`refetchOnWindowFocus: false`
- 合理设置缓存时间：`cacheTime: 1000 * 60 * 30` (30分钟)
- 设置数据新鲜度：`staleTime: Infinity`
- 限制重试次数：`retry: 1`

### 2. 手动刷新策略
- 仅在必要时刷新数据（如数据修改后）
- 提供手动刷新按钮
- 显示刷新状态反馈
- 统一管理相关查询的刷新

### 3. 性能优化
- 使用 `useQuery` 缓存机制
- 避免重复请求
- 合理设置查询依赖
- 统一查询键管理

### 4. 错误处理
- 实现错误重试限制
- 提供用户友好的错误提示
- 记录详细错误信息
- 实现错误恢复机制

## 变更日志

### 2024-12-24
- 优化数据库状态查询策略
- 实现手动刷新机制
- 改进错误处理
- 优化性能监控

## 监控和调试

### 1. 状态监控
typescript
// 监控数据库连接
const connection = await databaseService.checkConnection()
// 监控表状态
const tableStats = await databaseService.getTableStats()

### 2. 性能监控
typescript
// 获取查询性能统计
const performance = await databaseService.getQueryStats()
// 监控慢查询
const slowQueries = await databaseService.getSlowQueries()

## 安全最佳实践

1. 数据访问控制
- 使用 RLS（Row Level Security）
- 实施最小权限原则
- 验证用户权限

2. 输入验证
- 使用 zod 验证数据
- 转义用户输入
- 防止 SQL 注入

3. 敏感数据处理
- 加密敏感信息
- 脱敏日志记录
- 安全备份策略

## 维护计划

### 日常维护
- 定期检查数据库状态
- 监控性能指标
- 清理过期数据

### 定期优化
- 更新索引
- 分析查询性能
- 优化表结构

### 备份策略
- 自动定时备份
- 验证备份完整性
- 制定恢复计划






