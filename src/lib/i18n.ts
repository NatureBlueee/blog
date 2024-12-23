import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

i18n.use(initReactI18next).init({
  resources: {
    zh: {
      translation: {
        error: {
          title: '出错了',
          retry: '重试',
          unknown: '发生未知错误',
        },
      },
    },
  },
  lng: 'zh',
  fallbackLng: 'zh',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
