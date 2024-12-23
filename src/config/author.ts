interface Author {
  name: string
  avatar: string
  bio: string
  social: {
    github?: string
    twitter?: string
    linkedin?: string
    email?: string
  }
}

export const author: Author = {
  name: '张三',
  avatar: '/images/avatar.jpg',
  bio: '全栈开发工程师，热衷于分享 Web 开发技术和经验',
  social: {
    github: 'https://github.com/yourusername',
    twitter: 'https://twitter.com/yourusername',
    linkedin: 'https://linkedin.com/in/yourusername',
    email: 'your.email@example.com'
  }
}

export default author 