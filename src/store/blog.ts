import { create } from 'zustand'
import type { Post, PostMetadata } from '@/types/blog'

interface BlogState {
  posts: Post[]
  currentPost: Post | null
  isLoading: boolean
  error: string | null
  setPosts: (posts: Post[]) => void
  setCurrentPost: (post: Post | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  updatePost: (slug: string, data: Partial<Post>) => void
  deletePost: (slug: string) => void
}

export const useBlogStore = create<BlogState>((set) => ({
  posts: [],
  currentPost: null,
  isLoading: false,
  error: null,
  setPosts: (posts) => set({ posts }),
  setCurrentPost: (post) => set({ currentPost: post }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  updatePost: (slug, data) => 
    set((state) => ({
      posts: state.posts.map((post) => 
        post.slug === slug ? { ...post, ...data } : post
      ),
      currentPost: state.currentPost?.slug === slug 
        ? { ...state.currentPost, ...data }
        : state.currentPost
    })),
  deletePost: (slug) =>
    set((state) => ({
      posts: state.posts.filter((post) => post.slug !== slug),
      currentPost: state.currentPost?.slug === slug ? null : state.currentPost
    }))
})) 