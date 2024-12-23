import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import * as jose from 'jose'

// 创建一个 TextEncoder
const encoder = new TextEncoder()
const JWT_SECRET = encoder.encode(process.env.JWT_SECRET || 'your-secret-key')

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  console.log(`[Middleware] Processing request for: ${path}`)

  if (path === '/login') {
    const token = request.cookies.get('auth_token')
    if (token) {
      try {
        await jose.jwtVerify(token.value, JWT_SECRET)
        console.log('[Middleware] User already logged in, redirecting to admin')
        return NextResponse.redirect(new URL('/admin', request.url))
      } catch (error) {
        console.log('[Middleware] Invalid token on login page')
      }
    }
    return NextResponse.next()
  }

  if (path.startsWith('/admin')) {
    const token = request.cookies.get('auth_token')
    console.log('[Middleware] Checking admin access, token:', token?.value ? 'present' : 'missing')

    if (!token) {
      console.log('[Middleware] No token, redirecting to login')
      return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
      await jose.jwtVerify(token.value, JWT_SECRET)
      console.log('[Middleware] Token verified, allowing admin access')
      return NextResponse.next()
    } catch (error) {
      console.log('[Middleware] Token verification failed:', error)
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/login']
} 