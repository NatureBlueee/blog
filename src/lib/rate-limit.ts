interface RateLimitConfig {
  interval: number
  uniqueTokens: number
}

interface RateLimitState {
  tokens: Set<string>
  lastReset: number
}

export function rateLimit(config: RateLimitConfig) {
  const state: RateLimitState = {
    tokens: new Set(),
    lastReset: Date.now(),
  }

  return {
    async check(token: string) {
      const now = Date.now()
      
      // 重置计数器
      if (now - state.lastReset > config.interval) {
        state.tokens.clear()
        state.lastReset = now
      }

      // 检查是否超出限制
      if (state.tokens.size >= config.uniqueTokens) {
        return { success: false }
      }

      // 添加新的令牌
      state.tokens.add(token)
      return { success: true }
    }
  }
} 