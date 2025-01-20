import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

// 添加 RLS 检查函数
async function checkRLSStatus(logs: any[]) {
  try {
    logs.push({
      level: 'info',
      message: '开始检查 RLS 状态',
      timestamp: new Date().toISOString(),
    })

    // 检查核心表的 RLS 状态
    const tables = [
      'posts',
      'tags',
      'post_tags',
      'post_versions',
      'comments',
      'post_views',
      'post_likes',
      'post_shares',
      'post_bookmarks',
    ]
    const rlsStatus: Record<string, boolean> = {}

    for (const table of tables) {
      const { data, error } = await supabase.from(table).select('*').limit(1)
      rlsStatus[table] = !error || error.code !== 'PGRST116'
    }

    logs.push({
      level: 'info',
      message: 'RLS 状态检查完成',
      timestamp: new Date().toISOString(),
      details: rlsStatus,
    })

    return rlsStatus
  } catch (error) {
    logs.push({
      level: 'error',
      message: 'RLS 状态检查失败',
      timestamp: new Date().toISOString(),
      details: error,
    })
    throw error
  }
}

// 添加权限检查函数
async function checkPermissions(logs: any[]) {
  try {
    logs.push({
      level: 'info',
      message: '开始检查数据库权限',
      timestamp: new Date().toISOString(),
    })

    const permissionTests = [
      // 测试读取权限
      {
        name: '读取文章',
        action: () => supabase.from('posts').select('*').limit(1),
      },
      // 测试写入权限
      {
        name: '创建文章',
        action: () =>
          supabase
            .from('posts')
            .insert([
              {
                title: 'Test Post',
                slug: `test-${Date.now()}`,
                content: 'Test content',
                status: 'draft',
              },
            ])
            .select(),
      },
      // 测试更新权限
      {
        name: '更新文章',
        action: async () => {
          const { data: post } = await supabase.from('posts').select('*').limit(1).single()

          if (post) {
            return supabase
              .from('posts')
              .update({ title: 'Updated Title' })
              .eq('id', post.id)
              .select()
          }
          return { data: null, error: null }
        },
      },
      // 测试软删除
      {
        name: '软删除文章',
        action: async () => {
          const { data: post } = await supabase
            .from('posts')
            .select('*')
            .is('deleted_at', null)
            .limit(1)
            .single()

          if (post) {
            return supabase
              .from('posts')
              .update({ deleted_at: new Date().toISOString() })
              .eq('id', post.id)
              .select()
          }
          return { data: null, error: null }
        },
      },
      // 测试关联表权限
      {
        name: '创建标签',
        action: () =>
          supabase
            .from('tags')
            .insert([
              {
                name: 'Test Tag',
                slug: `test-tag-${Date.now()}`,
              },
            ])
            .select(),
      },
      {
        name: '关联标签',
        action: async () => {
          const { data: post } = await supabase.from('posts').select('*').limit(1).single()

          const { data: tag } = await supabase.from('tags').select('*').limit(1).single()

          if (post && tag) {
            return supabase
              .from('post_tags')
              .insert([
                {
                  post_id: post.id,
                  tag_id: tag.id,
                },
              ])
              .select()
          }
          return { data: null, error: null }
        },
      },
    ]

    const results: Record<string, boolean> = {}

    for (const test of permissionTests) {
      const { error } = await test.action()
      results[test.name] = !error

      logs.push({
        level: error ? 'error' : 'info',
        message: `${test.name}: ${error ? '失败' : '成功'}`,
        timestamp: new Date().toISOString(),
        details: error || '权限正常',
      })
    }

    return results
  } catch (error) {
    logs.push({
      level: 'error',
      message: '权限检查过程出错',
      timestamp: new Date().toISOString(),
      details: error,
    })
    throw error
  }
}

// 获取数据库统计信息
async function getTableStats() {
  const stats = []

  // 核心表统计
  const tables = [
    'posts',
    'tags',
    'categories',
    'comments',
    'users',
    'post_versions',
    'post_views',
    'post_likes',
  ]

  for (const table of tables) {
    try {
      // 获取表记录数
      const { count } = await supabase.from(table).select('count', { count: 'exact' })

      // 获取24小时增长率
      const { count: prevCount } = await supabase
        .from(table)
        .select('count', { count: 'exact' })
        .lt('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000))

      const growth = prevCount ? ((count - prevCount) / prevCount) * 100 : 0

      stats.push({
        name: table,
        count: count || 0,
        status: 'ok',
        growth: Math.round(growth * 100) / 100,
        lastUpdated: new Date().toISOString(),
      })
    } catch (error) {
      stats.push({
        name: table,
        count: 0,
        status: 'error',
        error: error instanceof Error ? error.message : '未知错误',
      })
    }
  }

  return stats
}

// GET 请求处理数据库状态检查
export async function GET() {
  const startTime = Date.now()
  const logs: Array<{
    level: 'info' | 'error' | 'warn'
    message: string
    timestamp: string
    details?: any
  }> = []

  try {
    // 检查环境变量
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      throw new Error('缺少必要的环境变量配置')
    }

    // 执行所有检查
    const [rlsStatus, permissions, tableStats] = await Promise.all([
      checkRLSStatus(logs),
      checkPermissions(logs),
      getTableStats(),
    ])

    const { data: connectionTest, error: connectionError } = await supabase
      .from('posts')
      .select('id')
      .limit(1)

    if (connectionError) {
      logs.push({
        level: 'error',
        message: '数据库连接失败',
        timestamp: new Date().toISOString(),
        details: {
          message: connectionError.message,
          code: connectionError.code,
          details: connectionError.details,
          hint: connectionError.hint,
        },
      })

      return NextResponse.json(
        {
          error: connectionError.message,
          code: connectionError.code,
          details: connectionError.details,
          hint: '数据库连接失败，请检查环境变量配置',
          logs,
        },
        { status: 500 }
      )
    }

    // 测试权限
    logs.push({
      level: 'info',
      message: '测试数据库权限',
      timestamp: new Date().toISOString(),
    })

    const { count, error: countError } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .is('deleted_at', null)

    if (countError) {
      logs.push({
        level: 'error',
        message: '权限检查失败',
        timestamp: new Date().toISOString(),
        details: {
          message: countError.message,
          code: countError.code,
          details: countError.details,
          hint: countError.hint,
        },
      })

      return NextResponse.json(
        {
          error: countError.message,
          code: countError.code,
          details: countError.details,
          hint: '权限检查失败，请确认数据库权限设置',
          logs,
        },
        { status: 500 }
      )
    }

    // 添加 RLS 状态检查
    const rlsStatus = await checkRLSStatus(logs)

    // 添加权限检查
    const permissionStatus = await checkPermissions(logs)

    // 记录测试完成
    const duration = Date.now() - startTime
    logs.push({
      level: 'info',
      message: `数据库测试完成，耗时 ${duration}ms`,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      connection: 'OK',
      count,
      rlsStatus,
      permissionStatus,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasAnon: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      duration,
      logs,
    })
  } catch (error) {
    logs.push({
      level: 'error',
      message: '测试过程发生未知错误',
      timestamp: new Date().toISOString(),
      details: {
        error: error instanceof Error ? error.message : '未知错误',
        stack: error instanceof Error ? error.stack : undefined,
      },
    })

    console.error('Test failed:', {
      error,
      logs,
    })

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : '未知错误',
        hint: '请检查环境变量配置是否正确',
        details: error instanceof Error ? error.stack : undefined,
        logs,
      },
      { status: 500 }
    )
  }
}

// POST 请求处理测试数据生成
export async function POST() {
  const startTime = Date.now()
  const logs: Array<{
    level: 'info' | 'error' | 'warn'
    message: string
    timestamp: string
    details?: any
  }> = []

  try {
    // 检查环境变量
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      throw new Error('缺少必要的环境变量配置')
    }

    // 生成测试数据
    const { success, summary, logs: generatorLogs } = await generateTestData()
    logs.push(...generatorLogs)

    // 执行所有检查
    const [rlsStatus, permissions, tableStats] = await Promise.all([
      checkRLSStatus(logs),
      checkPermissions(logs),
      getTableStats(),
    ])

    // 记录测试完成
    const duration = Date.now() - startTime
    logs.push({
      level: 'info',
      message: `数据库测试完成，耗时 ${duration}ms`,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      connection: 'OK',
      rlsStatus,
      permissionStatus: permissions,
      tableStats,
      testDataSummary: summary,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasAnon: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      duration,
      logs,
    })
  } catch (error) {
    logs.push({
      level: 'error',
      message: '测试过程发生未知错误',
      timestamp: new Date().toISOString(),
      details: {
        error: error instanceof Error ? error.message : '未知错误',
        stack: error instanceof Error ? error.stack : undefined,
      },
    })

    console.error('Test failed:', {
      error,
      logs,
    })

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : '未知错误',
        hint: '请检查环境变量配置是否正确',
        details: error instanceof Error ? error.stack : undefined,
        logs,
      },
      { status: 500 }
    )
  }
}
