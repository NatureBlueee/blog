import { NextRequest, NextResponse } from 'next/server'
import * as jose from 'jose'

const encoder = new TextEncoder()
const JWT_SECRET = encoder.encode(process.env.JWT_SECRET || 'dev-secret-key-1234')

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // 简单的密码验证
    if (
      username === process.env.ADMIN_USERNAME && 
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = await new jose.SignJWT({ username })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('24h')
        .sign(JWT_SECRET)
      
      const response = NextResponse.json({ 
        success: true,
        message: '登录成功'
      })

      response.cookies.set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 86400 // 1 day
      })

      return response
    }

    return NextResponse.json(
      { success: false, error: '用户名或密码错误' },
      { status: 401 }
    )
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, error: '登录失败，请稍后重试' },
      { status: 500 }
    )
  }
} 