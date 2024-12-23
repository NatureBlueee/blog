import { compare, hash } from 'bcryptjs'
import { cookies } from 'next/headers'
import * as jose from 'jose'

const encoder = new TextEncoder()
const JWT_SECRET = encoder.encode(process.env.JWT_SECRET || 'dev-secret-key-1234')

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return compare(password, hashedPassword)
}

export function validatePassword(password: string): boolean {
  // 密码规则：至少8个字符，包含大小写字母、数字和特殊字符
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  return passwordRegex.test(password)
}

export function validateUsername(username: string): boolean {
  // 用户名规则：4-20个字符，只能包含字母、数字和下划线
  const usernameRegex = /^[a-zA-Z0-9_]{4,20}$/
  return usernameRegex.test(username)
}

// 服务器端验证
export async function getAuthUserServer() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('auth_token')

    if (!token) {
      return null
    }

    const { payload } = await jose.jwtVerify(token.value, JWT_SECRET)

    if (!payload.username) {
      return null
    }

    return {
      id: payload.username,
      username: payload.username,
    }
  } catch (error) {
    console.error('验证用户失败:', error)
    return null
  }
}

// 客户端验证
export async function getAuthUserClient() {
  try {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('auth_token='))
      ?.split('=')[1]

    if (!token) {
      return null
    }

    // 这里我们只做简单验证，完整验证在服务器端进行
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const payload = JSON.parse(window.atob(base64))

    if (!payload.username) {
      return null
    }

    return {
      id: payload.username,
      username: payload.username,
    }
  } catch (error) {
    console.error('验证用户失败:', error)
    return null
  }
}

// 导出一个统一的接口
export const getAuthUser = typeof window === 'undefined' ? getAuthUserServer : getAuthUserClient
