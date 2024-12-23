interface CacheOptions {
  maxAge?: number // 缓存过期时间（毫秒）
  staleWhileRevalidate?: boolean // 是否允许返回过期数据
}

interface CacheItem<T> {
  data: T
  timestamp: number
}

export class Cache {
  private store = new Map<string, CacheItem<any>>()
  
  set<T>(key: string, data: T, options: CacheOptions = {}) {
    this.store.set(key, {
      data,
      timestamp: Date.now()
    })
  }
  
  get<T>(key: string, options: CacheOptions = {}): T | null {
    const item = this.store.get(key)
    if (!item) return null
    
    const age = Date.now() - item.timestamp
    if (options.maxAge && age > options.maxAge) {
      if (!options.staleWhileRevalidate) {
        this.store.delete(key)
        return null
      }
    }
    
    return item.data
  }
  
  clear() {
    this.store.clear()
  }
}

export const pageCache = new Cache()
export const postCache = new Cache() 