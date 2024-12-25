# 文章管理系统 API

[原有的状态管理和草稿管理 API 保持不变...]

## 分类和标签 API

### 1. 添加文章分类
```http
POST /api/posts/{postId}/categories
```

为文章添加分类。

**请求参数**
```typescript
interface AddCategoryRequest {
  categoryIds: string[];  // UUID[]
}
```

**响应**
```typescript
interface AddCategoryResponse {
  success: boolean;
  categories: Array<{
    id: string;
    name: string;
  }>;
}
```

### 2. 管理文章标签
```http
POST /api/posts/{postId}/tags
```

添加或移除文章标签。

**请求参数**
```typescript
interface ManageTagsRequest {
  add?: string[];     // 要添加的标签 ID
  remove?: string[];  // 要移除的标签 ID
}
```

**响应**
```typescript
interface TagsResponse {
  success: boolean;
  tags: Array<{
    id: string;
    name: string;
    createdAt: string;
  }>;
}
```

## 互动功能 API

### 1. 文章浏览
```http
POST /api/posts/{postId}/views
```

记录文章浏览。

**请求参数**
```typescript
interface ViewRequest {
  viewerId?: string;
  viewerIp: string;
  userAgent?: string;
  referer?: string;
}
```

**响应**
```typescript
interface ViewResponse {
  success: boolean;
  viewCount: number;
  uniqueViewers: number;
}
```

### 2. 文章点赞
```http
POST /api/posts/{postId}/likes
DELETE /api/posts/{postId}/likes
```

点赞或取消点赞文章。

**请求参数**
```typescript
interface LikeRequest {
  viewerIp: string;
}
```

**响应**
```typescript
interface LikeResponse {
  success: boolean;
  liked: boolean;
  likeCount: number;
}
```

### 3. 文章分享
```http
POST /api/posts/{postId}/shares
```

记录文章分享。

**请求参数**
```typescript
interface ShareRequest {
  platform: 'twitter' | 'facebook' | 'linkedin' | 'email' | 'other';
  viewerIp: string;
  shareUrl?: string;
}
```

**响应**
```typescript
interface ShareResponse {
  success: boolean;
  shareCount: number;
  platformCounts: Record<string, number>;
}
```

### 4. 文章收藏
```http
POST /api/posts/{postId}/bookmarks
DELETE /api/posts/{postId}/bookmarks
```

收藏或取消收藏文章。

**请求参数**
```typescript
interface BookmarkRequest {
  folderName: string;
  viewerIp: string;
  note?: string;
}
```

**响应**
```typescript
interface BookmarkResponse {
  success: boolean;
  bookmarked: boolean;
  bookmarkCount: number;
}
```

## 推荐系统 API

### 1. 获取相似文章
```http
GET /api/posts/{postId}/similar
```

获取与当前文章相似的文章列表。

**查询参数**
```typescript
interface SimilarityQuery {
  type?: 'tag' | 'content' | 'behavior';
  limit?: number;
  offset?: number;
}
```

**响应**
```typescript
interface SimilarityResponse {
  articles: Array<{
    id: string;
    title: string;
    excerpt: string;
    similarity: number;
    matchType: string;
    matchReason: string;
  }>;
  total: number;
}
```

### 2. 获取推荐文章
```http
GET /api/posts/recommendations
```

获取个性化推荐的文章列表。

**查询参数**
```typescript
interface RecommendationQuery {
  viewerIp: string;
  viewerId?: string;
  context?: 'home' | 'article' | 'profile';
  limit?: number;
  offset?: number;
}
```

**响应**
```typescript
interface RecommendationResponse {
  articles: Array<{
    id: string;
    title: string;
    excerpt: string;
    score: number;
    recommendReason: string;
  }>;
  total: number;
}
```

### 3. 反馈推荐结果
```http
POST /api/posts/recommendations/{recommendationId}/feedback
```

提供推荐结果的反馈。

**请求参数**
```typescript
interface FeedbackRequest {
  viewerIp: string;
  action: 'click' | 'ignore' | 'hide' | 'not_interested';
  duration?: number;  // 阅读时长（秒）
  scrollDepth?: number;  // 滚动深度（百分比）
}
```

**响应**
```typescript
interface FeedbackResponse {
  success: boolean;
  message?: string;
}
```

## 错误处理

### 1. 通用错误响应
```typescript
interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
  };
  status: number;
}
```

### 2. 错误代码
```typescript
enum ErrorCode {
  INVALID_REQUEST = 'INVALID_REQUEST',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  RATE_LIMITED = 'RATE_LIMITED',
  INTERNAL_ERROR = 'INTERNAL_ERROR'
}
```

## 频率限制

### 1. 互动限制
- 浏览：每 IP 每分钟最多 60 次
- 点赞：每 IP 每分钟最多 10 次
- 分享：每 IP 每分钟最多 5 次
- 收藏：每 IP 每分钟最多 10 次

### 2. 推荐限制
- 获取推荐：每 IP 每分钟最多 30 次
- 相似文章：每 IP 每分钟最多 30 次
```

要我继续更新生命周期文档吗？ 