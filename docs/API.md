# API 文档

## 推荐系统配置 API

### 类型定义

```typescript
// 推荐配置文件
interface RecommendationProfile {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  config: RecommendationConfig;
  metrics?: RecommendationMetrics;
  createdAt: string;
  updatedAt: string;
}

// 推荐配置
interface RecommendationConfig {
  similarityWeights: {
    tagBased: number;    // Tag similarity weight
    behaviorBased: number; // Behavior similarity weight
  };
  engagementWeights: {
    views: number;        // View count weight
    likes: number;        // Like count weight 
    shares: number;       // Share count weight
    uniqueViewers: number; // Unique visitor weight
    readTime: number;     // Read time weight
    scrollDepth: number;  // Scroll depth weight
  };
  timeDecayFactor: number;      // Time decay factor
  completionBonusFactor: number; // Completion bonus factor
  interestMatchFactor: number;   // Interest match factor
}

// 性能指标
interface RecommendationMetrics {
  impressions: number;     // 展示次数
  clicks: number;         // 点击次数
  ctr: number;           // 点击率
  avgEngagementTime: number; // 平均参与时间
}
```

### 端点

#### 获取配置列表

```http
GET /api/recommendation/profiles
```

获取当前用户的所有推荐配置文件。

**响应**
```typescript
RecommendationProfile[]
```

**示例**
```typescript
const response = await fetch('/api/recommendation/profiles');
const profiles = await response.json();
```

#### 创建新配置

```http
POST /api/recommendation/profiles
```

创建新的推荐配置文件。

**请求体**
```typescript
{
  name: string;
  description?: string;
  config: RecommendationConfig;
}
```

**响应**
```typescript
RecommendationProfile
```

**示例**
```typescript
const response = await fetch('/api/recommendation/profiles', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Default Profile',
    description: 'Default recommendation settings',
    config: {
      similarityWeights: {
        tagBased: 0.7,
        behaviorBased: 0.3
      },
      engagementWeights: {
        views: 0.3,
        likes: 0.5,
        shares: 0.4,
        uniqueViewers: 0.2,
        readTime: 0.1,
        scrollDepth: 0.1
      },
      timeDecayFactor: 0.9,
      completionBonusFactor: 0.3,
      interestMatchFactor: 0.3
    }
  })
});
```

#### 获取单个配置

```http
GET /api/recommendation/profiles/{id}
```

获取特定配置文件的详细信息和性能指标。

**响应**
```typescript
RecommendationProfile & {
  metrics: {
    daily: Record<string, RecommendationMetrics>;
    total: RecommendationMetrics;
  }
}
```

**示例**
```typescript
const response = await fetch(`/api/recommendation/profiles/${profileId}`);
const profile = await response.json();
```

#### 更新配置

```http
PATCH /api/recommendation/profiles/{id}
```

更新现有配置文件。

**请求体**
```typescript
{
  name?: string;
  description?: string;
  config?: Partial<RecommendationConfig>;
}
```

**响应**
```typescript
RecommendationProfile
```

**示例**
```typescript
const response = await fetch(`/api/recommendation/profiles/${profileId}`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    config: {
      similarityWeights: {
        tagBased: 0.8,
        behaviorBased: 0.2
      }
    }
  })
});
```

#### 激活配置

```http
POST /api/recommendation/profiles/{id}/activate
```

将指定配置设置为活跃状态。

**响应**
```typescript
{
  success: boolean;
}
```

**示例**
```typescript
const response = await fetch(`/api/recommendation/profiles/${profileId}/activate`, {
  method: 'POST'
});
```

### 错误处理

所有API端点在发生错误时都会返回一个包含错误信息的JSON响应：

```typescript
{
  error: string;
  issues?: any[];  // 配置验证错误时可能包含具体问题
}
```

常见的HTTP状态码：
- 200: 成功
- 400: 请求参数错误或配置验证失败
- 401: 未授权
- 404: 资源不存在
- 500: 服务器内部错误

### 使用示例

```typescript
// 获取当前活跃配置
async function getActiveConfig() {
  const profiles = await fetch('/api/recommendation/profiles').then(r => r.json());
  return profiles.find(p => p.isActive);
}

// 更新配置并查看效果
async function updateAndMonitorConfig(profileId: string, newConfig: Partial<RecommendationConfig>) {
  // 更新配置
  await fetch(`/api/recommendation/profiles/${profileId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ config: newConfig })
  });

  // 监控效果
  const { metrics } = await fetch(`/api/recommendation/profiles/${profileId}`).then(r => r.json());
  console.log('Configuration performance:', metrics);
}
```

### 注意事项

1. 所有请求都需要用户认证
2. 配置更改会立即生效
3. 性能指标每天更新
4. 建议定期检查配置效果并适当调整
```

这个文档提供了：
1. 完整的类型定义
2. 所有API端点的详细说明
3. 请求和响应示例
4. 错误处理说明
5. 使用示例

你觉得还需要添加其他内容吗？ 

## 推荐系统 API

### 获取推荐文章

#### 1. 获取相似文章

```http
GET /api/recommendations/similar/{postId}
```

根据指定文章获取相似的文章推荐。

**参数**
```typescript
{
  postId: string;      // 目标文章ID
  viewerIp: string;    // 访问者IP
  limit?: number;      // 推荐数量，默认5
}
```

**响应**
```typescript
interface SimilarPostRecommendation {
  recommended_post_id: string;
  recommendation_type: 'similar_content';
  score: number;
  reason: {
    tag_based?: {
      type: 'tag_based';
      score: number;
      common_tags: string[];
    };
    behavior_based?: {
      type: 'behavior_based';
      score: number;
    };
  };
}
```

#### 2. 获取热门文章

```http
GET /api/recommendations/trending
```

获取当前热门文章推荐。

**参数**
```typescript
{
  viewerIp: string;           // 访问者IP
  timeWindow?: string;        // 时间窗口，默认 '7 days'
  limit?: number;            // 推荐数量，默认5
}
```

**响应**
```typescript
interface TrendingPostRecommendation {
  recommended_post_id: string;
  recommendation_type: 'trending';
  score: number;
  reason: {
    type: 'trending';
    time_window: string;
    stats: {
      views: number;
      unique_viewers: number;
      likes: number;
      shares: number;
      avg_read_time: number;
      avg_scroll_depth: number;
      completion_rate: number;
      first_view: string;
      last_view: string;
      tags: Array<{
        name: string;
        count: number;
      }>;
    };
    matching_interests?: string[];
  };
}
```

#### 3. 获取新用户推荐

```http
GET /api/recommendations/cold-start
```

为新用户提供初始推荐文章。

**参数**
```typescript
{
  limit?: number;    // 推荐数量，默认5
}
```

**响应**
```typescript
interface ColdStartRecommendation {
  post_id: string;
  title: string;
  recommendation_reason: string;
  relevance_score: number;
  category: 'Tech' | 'Business' | 'Life';
  metrics: {
    readers: number;
    avg_duration_min: number;
    scroll_depth_pct: number;
    tag_count: number;
    age_days: number;
    category_avg_duration: number;
  };
}
```

### 推荐反馈记录

```http
POST /api/recommendations/click
```

记录用户点击推荐文章的行为。

**请求体**
```typescript
{
  postId: string;              // 原文章ID
  recommendedPostId: string;   // 推荐文章ID
  viewerIp: string;           // 访问者IP
  recommendationType: string;  // 推荐类型
}
```

### 注意事项

1. **相似文章推荐**
   - 基于标签相似度（权重0.6）和行为相似度（权重0.4）
   - 排除用户已读文章
   - 考虑历史点击率进行排序

2. **热门文章推荐**
   - 综合考虑多个参与度指标（浏览、点赞、分享等）
   - 应用时间衰减因子
   - 考虑用户兴趣匹配度
   - 包含完整的统计信息

3. **新用户推荐**
   - 基于文章类别和整体表现
   - 考虑文章新鲜度
   - 优化的标签权重
   - 考虑阅读完整性
```

这部分API文档涵盖了推荐系统的三个主要功能：
1. 相似文章推荐
2. 热门文章推荐
3. 新用户冷启动推荐

要我继续补充系统监控和统计分析的API文档吗？ 

## 系统监控 API

### 数据库状态

#### 1. 获取数据库统计

```http
GET /api/monitoring/db-stats
```

获取数据库整体运行状况。

**响应**
```typescript
interface DBStats {
  database_size: string;          // 数据库大小
  total_relations: number;        // 总表数
  active_connections: number;     // 活跃连接数
  cache_hit_ratio: number;       // 缓存命中率
  uptime: string;                // 运行时间
  last_vacuum: string;           // 最后清理时间
  transaction_stats: {
    commits: number;
    rollbacks: number;
  };
}
```

#### 2. 获取查询统计

```http
GET /api/monitoring/query-stats
```

获取查询性能统计信息。

**参数**
```typescript
{
  timeWindow?: string;    // 时间窗口，默认 '1 hour'
  limit?: number;         // 返回记录数，默认 10
}
```

**响应**
```typescript
interface QueryStats {
  slow_queries: Array<{
    query_text: string;
    execution_time: number;
    calls: number;
    rows_affected: number;
    timestamp: string;
  }>;
  performance_metrics: {
    avg_query_time: number;
    max_query_time: number;
    total_queries: number;
    cached_queries_ratio: number;
  };
}
```

#### 3. 获取连接统计

```http
GET /api/monitoring/connection-stats
```

获取数据库连接统计信息。

**响应**
```typescript
interface ConnectionStats {
  current_connections: number;
  max_connections: number;
  available_connections: number;
  active_queries: number;
  idle_connections: number;
  connection_wait_time: number;
  client_distribution: Record<string, number>;
}
```

### 性能监控

#### 1. 获取性能指标

```http
GET /api/monitoring/performance
```

获取系统整体性能指标。

**参数**
```typescript
{
  timeRange: string;     // 时间范围，如 '24h', '7d', '30d'
  interval?: string;     // 统计间隔，如 '1h', '1d'
}
```

**响应**
```typescript
interface PerformanceMetrics {
  cpu_usage: Array<{
    timestamp: string;
    value: number;
  }>;
  memory_usage: Array<{
    timestamp: string;
    used: number;
    available: number;
  }>;
  disk_io: Array<{
    timestamp: string;
    reads: number;
    writes: number;
  }>;
  response_times: Array<{
    timestamp: string;
    avg: number;
    p95: number;
    p99: number;
  }>;
}
```

## 统计分析 API

### 内容统计

#### 1. 获取文章统计

```http
GET /api/analytics/posts
```

获取文章相关统计信息。

**参数**
```typescript
{
  timeRange?: string;    // 时间范围，默认 '30d'
  category?: string;     // 文章分类
  tags?: string[];       // 标签筛选
}
```

**响应**
```typescript
interface PostsStats {
  total_posts: number;
  total_views: number;
  avg_engagement: {
    read_time: number;
    scroll_depth: number;
    completion_rate: number;
  };
  popular_tags: Array<{
    name: string;
    count: number;
    engagement_rate: number;
  }>;
  trending_posts: Array<{
    id: string;
    title: string;
    views: number;
    likes: number;
    avg_read_time: number;
  }>;
  growth_metrics: {
    posts_growth: number;
    views_growth: number;
    engagement_growth: number;
  };
}
```

#### 2. 获取增长统计

```http
GET /api/analytics/growth
```

获取系统增长相关统计。

**参数**
```typescript
{
  timeRange: string;     // 时间范围
  metric: 'posts' | 'views' | 'users' | 'engagement';
}
```

**响应**
```typescript
interface GrowthStats {
  current_period: {
    value: number;
    change_percentage: number;
  };
  historical_data: Array<{
    date: string;
    value: number;
    trend: number;
  }>;
  breakdown: {
    by_category: Record<string, number>;
    by_tag: Record<string, number>;
    by_source: Record<string, number>;
  };
}
```

#### 3. 获取详细统计

```http
GET /api/analytics/detailed-stats
```

获取系统详细统计信息。

**参数**
```typescript
{
  startDate: string;
  endDate: string;
  metrics: string[];     // 需要的指标列表
}
```

**响应**
```typescript
interface DetailedStats {
  summary: {
    total_posts: number;
    total_views: number;
    total_users: number;
    avg_engagement_rate: number;
  };
  time_series: Array<{
    date: string;
    metrics: Record<string, number>;
  }>;
  distributions: {
    views_distribution: Record<string, number>;
    engagement_distribution: Record<string, number>;
    read_time_distribution: Record<string, number>;
  };
  correlations: Array<{
    metric1: string;
    metric2: string;
    correlation: number;
  }>;
}
```

### 注意事项

1. **性能考虑**
   - 所有统计API都支持缓存
   - 长时间范围的查询可能需要较长响应时间
   - 建议使用适当的时间间隔进行分页

2. **数据准确性**
   - 实时统计可能有 1-5 分钟的延迟
   - 历史数据每天凌晨进行汇总
   - 某些指标可能因采样而略有误差

3. **访问限制**
   - 需要适当的访问权限
   - 部分敏感指标可能需要额外授权
   - API 调用频率有限制
```

这部分文档涵盖了：
1. 系统监控API（数据库状态、查询统计、连接监控）
2. 性能监控API（CPU、内存、磁盘IO、响应时间）
3. 统计分析API（文章统计、增长统计、详细分析）

需要我补充其他部分吗？ 

## 系统维护 API

### 存储统计

#### 1. 获取存储统计

```http
GET /api/maintenance/storage-stats
```

获取数据库存储使用情况的详细统计。

**响应**
```typescript
interface StorageStats {
  tables: Array<{
    database_name: string;
    schema_name: string;
    table_name: string;
    total_size: number;      // 总大小（字节）
    table_size: number;      // 表大小
    index_size: number;      // 索引大小
    toast_size: number;      // TOAST大小
    row_count: number;       // 行数
    dead_tuple_count: number; // 死元组数
    last_vacuum: string;     // 最后清理时间
    last_analyze: string;    // 最后分析时间
  }>;
  summary: {
    total_size: string;      // 格式化的总大小
    total_rows: number;
    tables_count: number;
    avg_table_size: string;
  };
}
```

### 每日统计

#### 1. 获取每日统计数据

```http
GET /api/analytics/daily-stats
```

获取系统每日统计数据。

**响应**
```typescript
interface DailyStats {
  posts_stats: {
    total_posts: number;
    total_article_views: number;
    new_articles: number;
    popular_articles: Array<{
      id: string;
      title: string;
      views: number;
    }>;
  };
  engagement_stats: {
    total_comments: number;
    new_comments: number;
    active_users_24h: number;
  };
  user_stats: {
    total_users: number;
    active_users: number;
  };
}
```

### 性能分析

#### 1. 获取推荐性能分析

```http
GET /api/analytics/recommendation-performance/{profileId}
```

分析特定推荐配置的性能表现。

**参数**
```typescript
{
  startDate?: string;    // 开始日期，默认30天前
  endDate?: string;      // 结束日期，默认今天
}
```

**响应**
```typescript
interface RecommendationPerformance {
  time_analysis: {
    hourly: Record<string, {
      impressions: number;
      clicks: number;
      ctr: number;
    }>;
    daily: Record<string, {
      impressions: number;
      clicks: number;
      ctr: number;
    }>;
  };
  content_analysis: {
    by_length: {
      short: ContentMetrics;
      medium: ContentMetrics;
      long: ContentMetrics;
    };
    top_performing_tags: Array<{
      tag: string;
      impressions: number;
      clicks: number;
      ctr: number;
    }>;
  };
  engagement_analysis: {
    avg_metrics: {
      read_duration: number;
      scroll_depth: number;
    };
    engagement_buckets: {
      high: number;
      medium: number;
      low: number;
    };
  };
}

interface ContentMetrics {
  count: number;
  avg_read_time: number;
  avg_scroll_depth: number;
  ctr: number;
}
```

#### 2. 获取优化建议

```http
GET /api/recommendations/optimization/{profileId}
```

获取推荐配置的优化建议。

**响应**
```typescript
interface OptimizationSuggestions {
  suggestions: Array<{
    type: string;           // 建议类型
    current_value: number;  // 当前值
    suggestion: string;     // 建议内容
    data: Array<{          // 支持数据
      [key: string]: number | string;
    }>;
  }>;
}
```

### 注意事项

1. **存储统计**
   - 每天自动收集一次
   - 保留30天的历史数据
   - 建议在系统负载较低时查询

2. **每日统计**
   - 统计时间为UTC午夜
   - 包含24小时滚动窗口的数据
   - 部分指标可能有1-2小时的延迟

3. **性能分析**
   - 分析大量历史数据可能需要较长时间
   - 建议使用合适的时间范围
   - 可以通过缓存提高响应速度
```

这部分文档新增了：
1. 存储统计API
2. 每日统计API
3. 性能分析API
4. 优化建议API

需要我继续补充其他部分吗？ 

## 推荐系统优化 API

### 自动优化

#### 1. 自动优化推荐配置

```http
POST /api/recommendations/auto-optimize/{profileId}
```

自动分析并优化推荐配置。

**响应**
```typescript
interface AutoOptimizeResult {
  current_config: RecommendationConfig;
  optimized_config: RecommendationConfig;
  changes: Array<{
    parameter: string;
    old_value: any;
    new_value: any;
    reason: string;
  }>;
  analysis_summary: {
    time_analysis: TimeAnalysis;
    content_analysis: ContentAnalysis;
    engagement_analysis: EngagementAnalysis;
  };
}
```

### 配置比较

#### 1. 比较推荐配置

```http
POST /api/recommendations/compare
```

比较多个推荐配置的性能。

**请求体**
```typescript
{
  profileIds: string[];    // 配置ID列表
  days?: number;          // 比较天数，默认30天
}
```

**响应**
```typescript
interface ProfileComparison {
  profile_id: string;
  profile_name: string;
  total_impressions: number;
  total_clicks: number;
  avg_ctr: number;
  avg_engagement_time: number;
  performance_metrics: {
    daily_stats: Record<string, {
      impressions: number;
      clicks: number;
      metrics: any;
    }>;
    trend: {
      impressions_trend: number;
      clicks_trend: number;
    };
  };
}
```

### 配置验证

#### 1. 验证推荐配置

```http
POST /api/recommendations/validate
```

验证推荐配置的有效性。

**请求体**
```typescript
{
  config: RecommendationConfig;
}
```

**响应**
```typescript
interface ValidationResult {
  is_valid: boolean;
  issues: Array<{
    field: string;
    type: 'missing_field' | 'invalid_weights' | 'invalid_range';
    message: string;
  }>;
  suggestions: Array<{
    config: RecommendationConfig;
    avg_ctr: number;
    message: string;
  }>;
}
```

### 增长统计

#### 1. 获取增长统计

```http
GET /api/analytics/growth-stats
```

获取系统关键指标的增长统计。

**响应**
```typescript
interface GrowthStats {
  metrics: Array<{
    metric_name: string;      // 指标名称
    current_value: number;    // 当前值
    growth_rate: number;      // 增长率（百分比）
    trend: '↑' | '→' | '↓';  // 趋势指示
  }>;
}
```

### 注意事项

1. **自动优化**
   - 基于最近30天的数据分析
   - 优化过程可能需要几分钟
   - 建议在非高峰期执行

2. **配置比较**
   - 最多同时比较5个配置
   - 比较时间范围建议不超过90天
   - 数据精度可能随时间范围变化

3. **配置验证**
   - 验证前确保配置格式正确
   - 权重总和必须等于1
   - 所有参数都有合理范围限制

4. **增长统计**
   - 默认比较周环比数据
   - 增长率可能受季节性因素影响
   - 建议结合长期趋势分析
```

这部分文档新增了：
1. 推荐配置自动优化API
2. 配置比较API
3. 配置验证API
4. 增长统计API

需要我继续补充其他部分吗？ 

## 系统管理 API

### 数据库初始化

#### 1. 初始化系统

```http
POST /api/admin/system/initialize
```

初始化整个系统，包括创建必要的表和基础数据。

**请求体**
```typescript
{
  userId: string;        // 管理员用户ID
  options?: {
    clearExisting?: boolean;  // 是否清除现有数据
    initSampleData?: boolean; // 是否初始化示例数据
  };
}
```

**响应**
```typescript
interface InitializationResult {
  success: boolean;
  tables_created: string[];
  base_data_initialized: {
    tags: number;        // 创建的基础标签数
    categories: number;  // 创建的基础分类数
  };
}
```

### 数据维护

#### 1. 更新文章相似度

```http
POST /api/admin/posts/update-similarities
```

更新指定文章的相似度数据。

**请求体**
```typescript
{
  postId: string;
  options?: {
    similarityThreshold?: number;  // 相似度阈值，默认0.1
    timeWindow?: string;           // 时间窗口，默认'30 days'
  };
}
```

#### 2. 批量更新相似度

```http
POST /api/admin/posts/bulk-update-similarities
```

批量更新多篇文章的相似度数据。

**请求体**
```typescript
{
  postIds: string[];
  options?: {
    similarityThreshold?: number;
    timeWindow?: string;
    concurrency?: number;     // 并发处理数，默认5
  };
}
```

### 数据结构管理

#### 1. 获取表结构

```http
GET /api/admin/schema/tables
```

获取系统所有表的结构信息。

**响应**
```typescript
interface TableSchema {
  tables: Array<{
    name: string;
    columns: Array<{
      name: string;
      type: string;
      nullable: boolean;
      default_value?: string;
    }>;
    indexes: Array<{
      name: string;
      columns: string[];
      type: string;
    }>;
  }>;
}
```

#### 2. 获取表状态

```http
GET /api/admin/schema/table-stats
```

获取所有表的状态统计。

**响应**
```typescript
interface TableStats {
  tables: Array<{
    name: string;
    row_count: number;
    size: {
      total: string;
      table: string;
      index: string;
      toast: string;
    };
    last_vacuum: string;
    last_analyze: string;
    dead_tuples: number;
  }>;
}
```

### 系统维护任务

#### 1. 触发维护任务

```http
POST /api/admin/maintenance/trigger
```

触发系统维护任务。

**请求体**
```typescript
{
  tasks: Array<{
    type: 'vacuum' | 'analyze' | 'reindex' | 'update_similarities';
    target?: string;     // 特定表名或资源ID
    options?: {
      full?: boolean;    // 是否完整维护
      parallel?: number; // 并行度
    };
  }>;
}
```

### 注意事项

1. **权限要求**
   - 所有管理API都需要管理员权限
   - 部分操作可能需要超级管理员权限
   - 建议实施详细的操作日志记录

2. **数据安全**
   - 初始化操作会清除现有数据，需要确认
   - 建议在执行危险操作前进行数据备份
   - 维护任务应在低峰期执行

3. **性能考虑**
   - 大规模更新操作建议分批执行
   - 维护任务可能影响系统性能
   - 建议设置合理的并发限制

4. **监控和告警**
   - 重要维护任务应设置监控
   - 异常情况应及时告警
   - 保留详细的操作日志
```

这部分文档新增了：
1. 数据库初始化API
2. 数据维护API
3. 数据结构管理API
4. 系统维护任务API

我觉得我们还可以进一步扩展：
1. 添加数据备份和恢复API
2. 添加性能诊断API
3. 添加系统配置管理API
4. 添加日志管理API

你觉得这些扩展如何？需要我继续补充吗？ 

## 数据分析 API

### 博客概览

#### 1. 获取博客统计概览

```http
GET /api/analytics/overview
```

获取博客整体运营状况的概览数据。

**响应**
```typescript
interface BlogOverview {
  total_posts: number;
  total_views: number;
  monthly_active_users: number;
  views_24h: number;
  comments_24h: number;
  active_users_24h: number;
  views_growth_rate: number;
  last_updated: string;
}
```

### 内容分析

#### 1. 获取文章性能分析

```http
GET /api/analytics/posts/performance
```

分析文章的阅读量、互动率等性能指标。

**请求参数**
```typescript
{
  timeRange?: string;    // 时间范围，默认'30d'
  sortBy?: 'views' | 'engagement' | 'comments';
  limit?: number;        // 返回数量，默认20
}
```

**响应**
```typescript
interface PostPerformance {
  posts: Array<{
    id: string;
    title: string;
    total_views: number;
    unique_views: number;
    comment_count: number;
    avg_daily_views: number;
    engagement_rate: number;
    views_last_7_days: number;
    unique_views_last_7_days: number;
    performance_level: 'High' | 'Medium' | 'Low';
    engagement_level: 'High' | 'Medium' | 'Low';
  }>;
}
```

#### 2. 获取内容互动分析

```http
GET /api/analytics/content/engagement
```

分析内容各部分（文本、图片、代码等）的互动情况。

**响应**
```typescript
interface ContentEngagement {
  sections: Array<{
    post_title: string;
    section_id: string;
    content_type: string;
    view_count: number;
    avg_duration_seconds: number;
    avg_viewport_seconds: number;
    avg_scroll_depth_percent: number;
    unique_users: number;
    unique_visitors: number;
    engagement_level: 'High' | 'Medium' | 'Low';
  }>;
}
```

### 用户行为分析

#### 1. 获取用户行为分析

```http
GET /api/analytics/users/behavior
```

分析用户的阅读习惯和行为模式。

**响应**
```typescript
interface UserBehavior {
  users: Array<{
    user_identifier: string;
    total_posts_read: number;
    total_visit_days: number;
    avg_scroll_depth_percent: number;
    avg_reading_minutes: number;
    text_sections_read: number;
    images_viewed: number;
    code_sections_viewed: number;
    last_visit: string;
    active_days_last_30: number;
    worktime_reading_percent: number;
    activity_level: 'Super Active' | 'Very Active' | 'Active' | 'Occasional' | 'Inactive';
    reader_type: 'Text Reader' | 'Visual Reader' | 'Code Reader' | 'Balanced Reader';
  }>;
}
```

### 分享分析

#### 1. 获取分享统计

```http
GET /api/analytics/shares
```

分析文章在各平台的分享情况。

**响应**
```typescript
interface ShareAnalytics {
  posts: Array<{
    post_id: string;
    title: string;
    total_shares: number;
    platform_shares: {
      twitter: number;
      facebook: number;
      linkedin: number;
      // ... 其他平台
    };
    total_referrals: number;
    referral_rate: number;
    domestic_share_percent: number;
    recent_shares: number;
    share_effectiveness: 'High' | 'Medium' | 'Low';
  }>;
}
```

### 系统性能监控

#### 1. 获取慢查询分析

```http
GET /api/admin/performance/slow-queries
```

监控系统中的慢查询情况。

**响应**
```typescript
interface SlowQueries {
  queries: Array<{
    query_summary: string;
    executions: number;
    avg_time_ms: number;
    avg_rows: number;
    cache_hit_ratio: number;
    io_ratio: number;
    last_executed: string;
  }>;
  total_slow_queries: number;
}
```

### 注意事项

1. **数据时效性**
   - 大部分统计数据有1-2小时的延迟
   - 实时数据可能与统计数据有偏差
   - 建议在API响应中标注数据更新时间

2. **性能考虑**
   - 复杂分析接口建议增加缓存
   - 大量数据建议分页或限制返回数量
   - 考虑添加数据预热机制

3. **数据安全**
   - 部分分析数据可能涉及用户隐私
   - 建议实施细粒度的权限控制
   - 敏感数据需要脱敏处理
```

这部分API主要覆盖了：
1. 博客整体统计
2. 文章性能分析
3. 内容互动分析
4. 用户行为分析
5. 分享数据分析
6. 系统性能监控

接下来，我们可以详细讨论文章管理的完整生命周期，设计相关的API和数据结构。您觉得这个方向如何？ 

## 推荐系统 API

### 推荐配置

#### 1. 获取推荐效果分析

```http
GET /api/recommendations/analytics
```

分析推荐系统的效果和性能。

**响应**
```typescript
interface RecommendationAnalytics {
  posts: Array<{
    post_id: string;
    title: string;
    similarity_metrics: {
      tag_based: {
        avg_score: number;
        similar_posts: number;
      };
      behavior_based: {
        avg_score: number;
        similar_posts: number;
      };
    };
    total_recommendations: number;
    clicked_recommendations: number;
    click_through_rate: number;
    recommendation_types: {
      [key: string]: number;
    };
    recommendation_effectiveness: 'High' | 'Medium' | 'Low';
  }>;
}
```

### 存储管理

#### 1. 获取存储概览

```http
GET /api/admin/storage/overview
```

获取数据库存储使用情况的详细统计。

**响应**
```typescript
interface StorageOverview {
  tables: Array<{
    schema_name: string;
    table_name: string;
    formatted_total_size: string;
    formatted_table_size: string;
    formatted_index_size: string;
    formatted_toast_size: string;
    row_count: number;
    dead_tuple_count: number;
    dead_tuple_ratio: number;
    last_vacuum: string;
    last_analyze: string;
    hours_since_vacuum: number;
    hours_since_analyze: number;
  }>;
}
```

### 查询性能

#### 1. 获取查询性能摘要

```http
GET /api/admin/performance/query-summary
```

获取系统中的查询性能统计。

**响应**
```typescript
interface QueryPerformanceSummary {
  queries: Array<{
    query_summary: string;
    executions: number;
    avg_execution_time: string;
    avg_rows_returned: string;
    cache_hits: string;
    last_executed: string;
  }>;
}
```

### 标签分析

#### 1. 获取标签分析

```http
GET /api/analytics/tags
```

分析标签的使用情况和效果。

**响应**
```typescript
interface TagAnalytics {
  tags: Array<{
    tag_name: string;
    owner_email: string;
    parent_tag: string;
    total_posts: number;
    unique_readers: number;
    unique_visitors: number;
    avg_reading_minutes: number;
    avg_scroll_depth_percent: number;
    active_posts_30d: number;
    activity_level: 'High' | 'Medium' | 'Low';
  }>;
}
```

### 注意事项

1. **推荐系统优化**
   - 定期分析推荐效果
   - 根据点击率调整推荐策略
   - 考虑不同类型用户的偏好

2. **存储管理**
   - 定期执行VACUUM操作
   - 监控死元组比例
   - 及时清理无用数据

3. **性能监控**
   - 定期分析慢查询
   - 优化频繁执行的查询
   - 维护适当的索引
```

这些补充涵盖了：
1. 推荐系统分析
2. 存储管理
3. 查询性能监控
4. 标签分析

接下来，我们是否要开始设计文章管理的生命周期API？包括：
1. 文章的创建、编辑、发布流程
2. 版本控制
3. 草稿管理
4. 批量操作
5. 删除机制

您觉得如何？我们可以从哪个方面开始？ 

### 交互分析

#### 1. 获取文章交互统计

```http
GET /api/analytics/posts/interactions
```

分析文章的点赞、收藏等交互数据。

**响应**
```typescript
interface PostInteractions {
  posts: Array<{
    post_id: string;
    title: string;
    like_count: number;
    bookmark_count: number;
    recent_likes: number;      // 最近30天
    recent_bookmarks: number;  // 最近30天
    interaction_rate: number;
    engagement_level: 'High' | 'Medium' | 'Low';
  }>;
}
```

#### 2. 获取热门文章

```http
GET /api/analytics/posts/trending
```

获取当前热门文章列表。

**响应**
```typescript
interface TrendingPosts {
  posts: Array<{
    id: string;
    title: string;
    total_views: number;
    views_last_7_days: number;
    engagement_rate: number;
    performance_level: 'High' | 'Medium' | 'Low';
  }>;
}
```

### 综合统计

#### 1. 获取详细统计指标

```http
GET /api/analytics/stats/detailed
```

获取博客系统的详细统计指标。

**响应**
```typescript
interface DetailedStats {
  content_metrics: {
    total_posts: number;
    total_comments: number;
    total_views: number;
  };
  user_metrics: {
    monthly_active_users: number;
    active_users_24h: number;
  };
  engagement_metrics: {
    views_24h: number;
    comments_24h: number;
    new_posts_24h: number;
    new_comments_24h: number;
  };
  growth_metrics: {
    views_growth_rate: number;
    top_posts_24h: string[];
  };
  last_updated: string;
}
```

### 注意事项

1. **实时性要求**
   - 热门文章每小时更新
   - 交互数据近实时更新
   - 综合统计每天更新

2. **数据聚合**
   - 支持不同时间维度的聚合
   - 提供趋势分析
   - 关注异常波动

3. **缓存策略**
   - 热门数据需要缓存
   - 设置合理的缓存过期时间
   - 实现缓存预热机制
```

现在API文档已经完整地覆盖了所有现有的视图和分析功能。我们可以开始设计文章管理的生命周期了。

建议我们按以下步骤设计文章管理：
1. 定义文章状态流转图
2. 设计各状态间的转换API
3. 设计版本控制机制
4. 设计批量操作接口
5. 设计草稿自动保存机制

您觉得这个规划如何？我们可以从哪个方面开始？ 

# 文章管理 API

## 文章状态管理

### 1. 变更文章状态

```http
POST /api/posts/{postId}/status
```

变更文章的状态，需要指定变更原因。

**请求参数**
```typescript
interface ChangeStatusRequest {
  newStatus: string;    // 新状态
  reasonKey: string;    // 变更原因键
}
```

**响应**
```typescript
interface ChangeStatusResponse {
  success: boolean;
  post: {
    id: string;
    status: string;
    updatedAt: string;
    publishedAt?: string;
    deletedAt?: string;
  };
}
```

### 2. 获取文章状态历史

```http
GET /api/posts/{postId}/status-history
```

获取文章的状态变更历史记录。

**响应**
```typescript
interface StatusHistoryResponse {
  history: Array<{
    id: string;
    fromStatus: string;
    toStatus: string;
    reason: string;
    changedBy: string;
    changedAt: string;
  }>;
}
```

### 3. 获取可用状态配置

```http
GET /api/posts/status-config
```

获取系统中配置的所有可用状态。

**响应**
```typescript
interface StatusConfigResponse {
  statuses: Array<{
    key: string;
    name: string;
    description: string;
    color?: string;
    icon?: string;
    nextStates: string[];
  }>;
}
```

### 4. 获取状态变更原因

```http
GET /api/posts/status-change-reasons
```

获取所有可用的状态变更原因。

**响应**
```typescript
interface StatusChangeReasonsResponse {
  reasons: Array<{
    fromStatus: string;
    toStatus: string;
    reasonKey: string;
    reasonText: string;
  }>;
}
```

## 草稿管理

### 1. 创建文章草稿

```http
POST /api/posts/drafts
```

创建新的文章草稿。

**请求参数**
```typescript
interface CreateDraftRequest {
  title: string;
  content: string;
  excerpt?: string;
  metadata?: Record<string, any>;
}
```

**响应**
```typescript
interface CreateDraftResponse {
  postId: string;
  draftId: string;
  versionNumber: number;
  createdAt: string;
}
```

### 2. 保存草稿版本

```http
POST /api/posts/{postId}/drafts
```

保存文章的新草稿版本。

**请求参数**
```typescript
interface SaveDraftRequest {
  title: string;
  content: string;
  excerpt?: string;
  isAutoSave?: boolean;
}
```

**响应**
```typescript
interface SaveDraftResponse {
  draftId: string;
  versionNumber: number;
  updatedAt: string;
}
```

### 3. 获取草稿历史

```http
GET /api/posts/{postId}/drafts
```

获取文章的所有草稿版本。

**响应**
```typescript
interface DraftHistoryResponse {
  drafts: Array<{
    id: string;
    versionNumber: number;
    title: string;
    excerpt?: string;
    createdAt: string;
    createdBy: string;
    isAutoSave: boolean;
  }>;
}
```

## 注意事项

1. **状态变更**
   - 所有 API 都需要认证
   - 状态变更会记录操作历史
   - 使用视图查询可避免重复记录

2. **草稿管理**
   - 支持自动保存
   - 版本号自动递增
   - 保留所有历史版本
``` 

## 文章互动 API

### 1. 查看文章
```http
POST /api/posts/{postId}/views
```

记录文章查看记录。

**请求参数**
```typescript
interface ViewRequest {
  viewerId?: string;
  viewerIp: string;
  referrer?: string;
  userAgent?: string;
}
```

**响应**
```typescript
interface ViewResponse {
  success: boolean;
  viewCount: number;
  uniqueViewCount: number;
}
```

### 2. 点赞文章
```http
POST /api/posts/{postId}/likes
```

为文章添加点赞。

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
  likeCount: number;
}
```

### 3. 分享文章
```http
POST /api/posts/{postId}/shares
```

记录文章分享。

**请求参数**
```typescript
interface ShareRequest {
  platform: string;
  viewerIp: string;
  shareUrl?: string;
}
```

**响应**
```typescript
interface ShareResponse {
  success: boolean;
  shareCount: number;
}
```

### 4. 收藏文章
```http
POST /api/posts/{postId}/bookmarks
```

收藏文章到指定文件夹。

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
  bookmarkCount: number;
}
```

## 推荐系统 API

### 1. 获取相似文章
```http
GET /api/posts/{postId}/similar
```

获取与指定文章相似的文章列表。

**查询参数**
```typescript
interface SimilarityQuery {
  limit?: number;
  offset?: number;
  similarityType?: 'tag' | 'content' | 'behavior';
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
    similarityType: string;
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
  limit?: number;
  offset?: number;
  viewerId?: string;
  viewerIp: string;
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
    reason: string;
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
  viewerId?: string;
  viewerIp: string;
  action: 'click' | 'ignore' | 'hide';
  duration?: number;
}
```

**响应**
```typescript
interface FeedbackResponse {
  success: boolean;
  message?: string;
}
```

## 注意事项

[原有的注意事项保持不变...]

### 3. 互动限制
- IP 级别的频率限制
- 重复操作检查
- 异常行为监控

### 4. 推荐规则
- 考虑文章状态
- 时效性处理
- 个性化匹配
``` 
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