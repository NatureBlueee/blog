export interface ValidationRule<T> {
  validate: (value: T) => boolean
  message: string
}

export interface ValidationSchema<T> {
  [key: string]: ValidationRule<T>[]
}

export function createValidator<T extends Record<string, any>>(schema: ValidationSchema<any>) {
  return (data: T) => {
    const errors: Record<string, string> = {}
    
    Object.keys(schema).forEach(field => {
      const rules = schema[field]
      const value = data[field]
      
      for (const rule of rules) {
        if (!rule.validate(value)) {
          errors[field] = rule.message
          break
        }
      }
    })
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }
}

// 博客文章验证规则
export const postValidationSchema = {
  title: [
    {
      validate: (value: string) => value.length >= 2,
      message: '标题至少需要2个字符'
    },
    {
      validate: (value: string) => value.length <= 100,
      message: '标题不能超过100个字符'
    }
  ],
  content: [
    {
      validate: (value: string) => value.length >= 10,
      message: '内容至少需要10个字符'
    }
  ],
  excerpt: [
    {
      validate: (value: string) => value.length <= 200,
      message: '摘要不能超过200个字符'
    }
  ]
} 