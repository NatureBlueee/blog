# 文章生命周期管理（可配置版）

## 核心设计

### 数据库结构

```sql
-- 1. 文章表（核心表）
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT,
    excerpt TEXT,
    slug TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    published_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::jsonb,
    latest_draft_id UUID,
    latest_draft_updated_at TIMESTAMPTZ,
    draft_count INTEGER DEFAULT 0
);

-- 2. 文章状态配置表
CREATE TABLE post_status_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    status_key VARCHAR(50) NOT NULL UNIQUE,
    status_name TEXT NOT NULL,
    description TEXT,
    color VARCHAR(20),
    icon VARCHAR(50),
    is_system BOOLEAN DEFAULT false,
    next_states TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 草稿版本表
CREATE TABLE post_draft_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES posts(id),
    version_number INTEGER NOT NULL,
    title TEXT,
    content TEXT,
    excerpt TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    is_auto_save BOOLEAN DEFAULT false,
    save_type VARCHAR(20) DEFAULT 'manual',
    UNIQUE(post_id, version_number)
);

-- 4. 文章状态历史表
CREATE TABLE post_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES posts(id),
    from_status VARCHAR(20),
    to_status VARCHAR(20) NOT NULL,
    reason TEXT,
    changed_by UUID REFERENCES auth.users(id),
    changed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. 状态变更原因配置表
CREATE TABLE post_status_change_reasons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    from_status VARCHAR(20) NOT NULL,
    to_status VARCHAR(20) NOT NULL,
    reason_key VARCHAR(50) NOT NULL,
    reason_text TEXT NOT NULL,
    is_system BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(from_status, to_status, reason_key)
);
```

### 核心函数

1. **状态管理函数**
```sql
-- 状态变更
CREATE OR REPLACE FUNCTION change_post_status(
    p_post_id UUID,
    p_new_status VARCHAR(20),
    p_reason_key VARCHAR(50)
) RETURNS BOOLEAN AS $$
-- ... 函数实现见 SQL 文档
$$ LANGUAGE plpgsql;
```

2. **草稿管理函数**
```sql
-- 创建新文章草稿
CREATE OR REPLACE FUNCTION create_post_draft(
    p_title TEXT,
    p_content TEXT,
    p_excerpt TEXT,
    p_metadata JSONB DEFAULT NULL
) RETURNS UUID AS $$
-- ... 函数实现见 SQL 文档
$$ LANGUAGE plpgsql;

-- 保存草稿版本
CREATE OR REPLACE FUNCTION save_post_draft(
    p_post_id UUID,
    p_title TEXT,
    p_content TEXT,
    p_excerpt TEXT,
    p_is_auto_save BOOLEAN DEFAULT false
) RETURNS UUID AS $$
-- ... 函数实现见 SQL 文档
$$ LANGUAGE plpgsql;
```

## 状态管理

### 预设状态
- draft（草稿）
- published（已发布）
- deleted（已删除）

### 状态流转规则
- draft -> published, deleted
- published -> draft, deleted
- deleted -> draft

### 状态变更原因
每个状态变更都需要指定原因，系统预设：
- publish: 文章发布
- need_revision: 需要修改
- delete_draft: 删除草稿
- delete_published: 删除已发布文章
- restore: 从回收站恢复

## 注意事项

1. **状态变更**
   - 所有状态变更都会被记录
   - 状态变更需要符合配置规则
   - 特定状态会触发额外操作（如更新时间戳）
   - 状态历史可能出现重复记录（设计决策）

2. **状态历史查询**
   ```sql
   -- 使用视图查询状态历史（去重）
   CREATE OR REPLACE VIEW post_status_history_view AS
   SELECT DISTINCT ON (post_id, from_status, to_status, changed_at)
       id,
       post_id,
       from_status,
       to_status,
       reason,
       changed_by,
       changed_at
   FROM post_status_history
   ORDER BY post_id, from_status, to_status, changed_at;
   ```

   > **设计说明**：状态变更历史可能出现重复记录，这是由于函数和触发器的双重记录机制导致。
   > 经过评估，这种重复：
   > - 不影响数据一致性
   > - 不影响业务逻辑
   > - 存储开销可接受
   > - 可通过视图轻松解决
   > 
   > 基于最小侵入原则，我们选择保留这种行为，通过视图来处理查询需求。

3. **草稿管理**
   - 自动维护草稿计数
   - 记录最新草稿信息
   - 支持版本回溯
   - 支持自动保存

4. **权限控制**
   - 使用 auth.uid() 跟踪操作用户
   - 所有变更都记录操作人

5. **Slug 生成**
   - 自动处理中英文混合标题
   - 确保 URL 友好
   - 处理特殊字符和长度限制
   - 保证唯一性

## 相关功能集成

### 1. 互动追踪
- 浏览记录会影响文章的热度
- 点赞和分享可能触发状态变更
- 收藏功能与草稿系统集成

### 2. 推荐关联
- 相似文章推荐
- 基于用户行为的推荐
- 状态感知的推荐过滤

### 3. 分类与标签
- 支持多分类
- 动态标签系统
- 分类和标签影响推荐

## 扩展表结构

```sql
-- 互动相关表
CREATE TABLE post_views (
    id UUID PRIMARY KEY,
    post_id UUID REFERENCES posts(id),
    -- ... 其他字段
);

CREATE TABLE post_likes (
    id UUID PRIMARY KEY,
    post_id UUID REFERENCES posts(id),
    -- ... 其他字段
);

CREATE TABLE post_shares (
    id UUID PRIMARY KEY,
    post_id UUID REFERENCES posts(id),
    -- ... 其他字段
);

CREATE TABLE post_bookmarks (
    id UUID PRIMARY KEY,
    post_id UUID REFERENCES posts(id),
    -- ... 其他字段
);

-- 推荐相关表
CREATE TABLE post_similarities (
    id UUID PRIMARY KEY,
    post_id UUID REFERENCES posts(id),
    similar_post_id UUID REFERENCES posts(id),
    -- ... 其他字段
);

CREATE TABLE post_recommendations (
    id UUID PRIMARY KEY,
    post_id UUID REFERENCES posts(id),
    recommended_post_id UUID REFERENCES posts(id),
    -- ... 其他字段
);
```

## 状态影响

### 1. 互动触发
- 高互动量可能触发"热门"状态
- 低互动量可能触发"归档"状态
- 异常互动可能触发"审核"状态

### 2. 推荐规则
- 仅推荐"已发布"状态的文章
- "草稿"状态不参与推荐
- "删除"状态自动从推荐中移除

### 3. 数据完整性
- 状态变更时同步更新相关记录
- 维护互动数据的一致性
- 确保推荐的有效性

## 互动系统集成

### 1. 互动追踪
```typescript
interface InteractionTracking {
  // 浏览追踪
  views: {
    trackPageViews: boolean;
    trackReadingTime: boolean;
    trackScrollDepth: boolean;
  };
  
  // 互动追踪
  interactions: {
    trackLikes: boolean;
    trackShares: boolean;
    trackBookmarks: boolean;
  };
}
```

### 2. 统计指标
```typescript
interface PostMetrics {
  viewCount: number;
  uniqueViewers: number;
  likeCount: number;
  shareCount: Record<string, number>;
  bookmarkCount: number;
  engagementRate: number;
}
```

### 3. 互动触发器
```typescript
interface InteractionTrigger {
  type: 'view' | 'like' | 'share' | 'bookmark';
  threshold: number;
  action: 'updateStatus' | 'notify' | 'recommend';
  config: Record<string, any>;
}
```

## 推荐系统集成

### 1. 相似度计算
- 基于标签匹配
- 基于内容分析
- 基于用户行为
- 基于时间衰减

### 2. 推荐规则
```typescript
interface RecommendationRule {
  factor: 'similarity' | 'popularity' | 'freshness' | 'userPreference';
  weight: number;
  timeDecay: boolean;
  minScore: number;
}
```

### 3. 反馈处理
- 点击率追踪
- 阅读时长分析
- 滚动深度记录
- 兴趣标签更新
```

要我继续更新 API 文档和 SQL 文档吗？
