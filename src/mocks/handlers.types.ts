import type { RequestHandler } from 'msw'
import type { BlogPost, PostMetadata } from '@/types'

export interface HandlerResponse<T> {
  data: T
  error?: string
}

export type PostsResponse = HandlerResponse<BlogPost[]>
export type PostResponse = HandlerResponse<BlogPost>
export type MetadataResponse = HandlerResponse<PostMetadata>

export type ApiHandler = RequestHandler