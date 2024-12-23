import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // 先测试基本连接
    const { data: connectionTest, error: connectionError } = await supabase
      .from('posts')
      .select('id')
      .limit(1)

    if (connectionError) {
      console.error('Connection error:', {
        message: connectionError.message,
        code: connectionError.code,
        details: connectionError.details,
        hint: connectionError.hint,
      })

      return NextResponse.json(
        {
          error: connectionError.message,
          code: connectionError.code,
          details: connectionError.details,
          hint: '数据库连接失败，请检查环境变量配置',
        },
        { status: 500 }
      )
    }

    // 测试权限
    const { count, error: countError } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .is('deleted_at', null)

    if (countError) {
      console.error('Permission error:', {
        message: countError.message,
        code: countError.code,
        details: countError.details,
        hint: countError.hint,
      })

      return NextResponse.json(
        {
          error: countError.message,
          code: countError.code,
          details: countError.details,
          hint: '权限检查失败，请确认数据库权限设置',
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      connection: 'OK',
      count,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasAnon: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    })
  } catch (error) {
    console.error('Test failed:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : '未知错误',
        hint: '请检查环境变量配置是否正确',
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    )
  }
}
