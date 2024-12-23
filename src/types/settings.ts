export interface SiteSettings {
  name: string
  description: string
  author: {
    name: string
    email: string
    social: {
      github: string
      twitter: string
      linkedin: string
    }
  }
} 