import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readFile } from 'fs/promises'
import path from 'path'

// 简化的设置类型
interface Settings {
  title: string
  description: string
  author: {
    name: string
    bio: string
  }
}

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'config', 'settings.json')
    const data = await readFile(filePath, 'utf-8')
    return NextResponse.json(JSON.parse(data))
  } catch (error) {
    console.error('读取设置失败:', error)
    return NextResponse.json(
      { error: '读取设置失败' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const settings: Settings = await request.json()
    const filePath = path.join(process.cwd(), 'config', 'settings.json')
    await writeFile(filePath, JSON.stringify(settings, null, 2))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('保存设置失败:', error)
    return NextResponse.json(
      { error: '保存设置失败' },
      { status: 500 }
    )
  }
} 