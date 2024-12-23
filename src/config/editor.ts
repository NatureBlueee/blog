export const EDITOR_CONFIG = {
  // StackEdit 配置
  stackedit: {
    url: 'https://stackedit.io/app',
    options: {
      // 编辑器选项
      customTheme: true,
      customButtons: true,
      contentBackup: true,
      forceSyncContent: true,
      handlebars: false,
      mathJax: true,
      mermaid: true,
      properties: {
        customProperties: true
      }
    }
  },
  
  // 自动保存配置
  autoSave: {
    enabled: true,
    interval: 30000, // 30秒
    minInterval: 5000, // 5秒
    maxVersions: 10
  },
  
  // 图片上传配置
  upload: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    path: '/uploads/images'
  },
  
  // 工具栏配置
  toolbar: {
    items: [
      { type: 'heading', label: '标题' },
      { type: 'bold', label: '粗体' },
      { type: 'italic', label: '斜体' },
      { type: 'link', label: '链接' },
      { type: 'image', label: '图片' },
      { type: 'code', label: '代码' },
      { type: 'quote', label: '引用' }
    ]
  }
} 