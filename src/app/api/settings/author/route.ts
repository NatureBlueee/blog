import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // 验证数据
    if (!data.name || !data.avatar || !data.bio) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // 生成 TypeScript 配置文件内容
    const configContent = `interface Author {
  name: string
  avatar: string
  bio: string
  social: {
    github?: string
    twitter?: string
    linkedin?: string
    email?: string
  }
}

export const author: Author = ${JSON.stringify(data, null, 2)}

export default author`

    // 写入配置文件
    const configPath = path.join(process.cwd(), 'src', 'config', 'author.ts')
    fs.writeFileSync(configPath, configContent)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating author settings:', error)
    return NextResponse.json(
      { error: 'Failed to update author settings' },
      { status: 500 }
    )
  }
} 