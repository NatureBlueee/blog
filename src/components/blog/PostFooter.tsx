import { BlogPost } from '@/types'
import Link from 'next/link'

interface PostFooterProps {
  post: BlogPost
}

export function PostFooter({ post }: PostFooterProps) {
  return (
    <footer className="mt-16 space-y-8 border-t pt-8">
      {/* 标签 */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex gap-2">
          {post.tags.map((tag) => (
            <Link
              key={tag}
              href={`/blog/tags/${tag}`}
              className="px-3 py-1 bg-muted rounded-full text-sm hover:bg-muted/80 transition-colors"
            >
              {tag}
            </Link>
          ))}
        </div>
      )}
      
      {/* 分享按钮 */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">分享文章：</span>
        <button
          onClick={() => {
            navigator.clipboard.writeText(window.location.href)
            // 这里可以添加一个toast提示
          }}
          className="p-2 hover:bg-muted rounded-full transition-colors"
          aria-label="复制链接"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
            />
          </svg>
        </button>
      </div>
    </footer>
  )
} 