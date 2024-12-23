import { NextResponse } from 'next/server'
import { AppError } from './errors'

export function createApiHandler(handler: Function) {
  return async (...args: any[]) => {
    try {
      const result = await handler(...args)
      return NextResponse.json(result)
    } catch (error) {
      console.error(error)

      if (error instanceof AppError) {
        return NextResponse.json({ error: error.message }, { status: error.statusCode })
      }

      return NextResponse.json({ error: '服务器内部错误' }, { status: 500 })
    }
  }
}
