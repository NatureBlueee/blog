import { create } from 'zustand'
import { persist, PersistOptions } from 'zustand/middleware'
import type { BlogPost } from '@/types/blog'

type FontSize = 'small' | 'medium' | 'large'

interface PerformanceMetrics {
  firstContentfulPaint: number
  domLoad: number
  totalLoad: number
  frameRate: number
  lastTransitionDuration: number
}

interface UserPreferences {
  fontSize: FontSize
  reduceMotion: boolean
  prefersImages: boolean
}

interface AppState {
  // Theme
  isDarkMode: boolean
  setDarkMode: (isDark: boolean) => void

  // Performance metrics
  performanceMetrics: PerformanceMetrics
  updatePerformanceMetrics: (metrics: Partial<PerformanceMetrics>) => void

  // Blog related
  recentPosts: BlogPost[]
  setRecentPosts: (posts: BlogPost[]) => void
  cachedPosts: Record<string, BlogPost>
  cachePost: (post: BlogPost) => void

  // User preferences
  preferences: UserPreferences
  updatePreferences: (prefs: Partial<UserPreferences>) => void

  // Application state
  isLoading: boolean
  setLoading: (loading: boolean) => void
  error: Error | null
  setError: (error: Error | null) => void
}

type AppPersist = Pick<AppState, 'isDarkMode' | 'preferences'>

const persistOptions: PersistOptions<AppState, AppPersist> = {
  name: 'app-storage',
  partialize: (state) => ({
    isDarkMode: state.isDarkMode,
    preferences: state.preferences,
  }),
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // Theme
      isDarkMode: false,
      setDarkMode: (isDark: boolean) => set({ isDarkMode: isDark }),

      // Performance metrics
      performanceMetrics: {
        firstContentfulPaint: 0,
        domLoad: 0,
        totalLoad: 0,
        frameRate: 60,
        lastTransitionDuration: 0,
      },
      updatePerformanceMetrics: (metrics: Partial<PerformanceMetrics>) =>
        set((state) => ({
          performanceMetrics: { ...state.performanceMetrics, ...metrics },
        })),

      // Blog related
      recentPosts: [],
      setRecentPosts: (posts: BlogPost[]) => set({ recentPosts: posts }),
      cachedPosts: {},
      cachePost: (post: BlogPost) =>
        set((state) => ({
          cachedPosts: { ...state.cachedPosts, [post.slug]: post },
        })),

      // User preferences
      preferences: {
        fontSize: 'medium',
        reduceMotion: false,
        prefersImages: true,
      },
      updatePreferences: (prefs: Partial<UserPreferences>) =>
        set((state) => ({
          preferences: { ...state.preferences, ...prefs },
        })),

      // Application state
      isLoading: false,
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      error: null,
      setError: (error: Error | null) => set({ error }),
    }),
    persistOptions
  )
) 