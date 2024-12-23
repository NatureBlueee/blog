'use client'

export async function getAuthUser() {
  try {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('auth_token='))
      ?.split('=')[1]

    if (!token) return null

    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const payload = JSON.parse(window.atob(base64))

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
