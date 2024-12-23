if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
  throw new Error('Missing ADMIN_USERNAME or ADMIN_PASSWORD environment variables')
}

export const AUTH_CONFIG = {
  username: process.env.ADMIN_USERNAME,
  // 这里存储的是哈希后的密码
  passwordHash: process.env.ADMIN_PASSWORD,
  // 用于加密的密钥
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key'
} 