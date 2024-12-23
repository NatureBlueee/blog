import { cookies } from 'next/headers'
import * as jose from 'jose'
import { compare, hash } from 'bcryptjs'

const encoder = new TextEncoder()
const JWT_SECRET = encoder.encode(process.env.JWT_SECRET || 'dev-secret-key-1234')

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return compare(password, hashedPassword)
}

export function validatePassword(password: string): boolean {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  return passwordRegex.test(password)
}

export function validateUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9_]{4,20}$/
  return usernameRegex.test(username)
}

export async function getAuthUser() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('auth_token')

    if (!token) return null

    const { payload } = await jose.jwtVerify(token.value, JWT_SECRET)

    if (!payload.username) return null

    return {
      id: payload.username,
      username: payload.username,
    }
  } catch (error) {
    console.error('验证用户失败:', error)
    return null
  }
}
