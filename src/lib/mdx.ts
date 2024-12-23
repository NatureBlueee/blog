import { serialize } from 'next-mdx-remote/serialize'
import remarkGfm from 'remark-gfm'
import rehypePrism from 'rehype-prism-plus'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'

export async function compileMDX(content: string) {
  return serialize(content, {
    mdxOptions: {
      remarkPlugins: [
        remarkGfm,
        remarkMath
      ],
      rehypePlugins: [
        rehypePrism,
        rehypeKatex
      ]
    },
    parseFrontmatter: true
  })
} 