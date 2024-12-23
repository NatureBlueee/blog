import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // 只测试基本连接和权限
    const { data, error } = await supabase
      .from('posts')
      .select('count(*)', { count: 'exact', head: true })
      .is('deleted_at', null)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        {
          error: error.message,
          hint: '请检查数据库权限设置',
          code: error.code,
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      connection: 'OK',
      count: data,
    })
  } catch (error) {
    console.error('Test failed:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : '连接测试失败',
        hint: '请确保环境变量配置正确',
      },
      { status: 500 }
    )
  }
}
