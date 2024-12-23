import { MDXRemote } from 'next-mdx-remote'
import type { MDXRemoteProps } from 'next-mdx-remote'

export default function MDXRemoteWrapper(props: MDXRemoteProps) {
  return <MDXRemote {...props} />
} 