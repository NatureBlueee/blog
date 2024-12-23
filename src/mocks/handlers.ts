import { http } from 'msw'
export const handlers = [
  http.get('/api/posts', ({ request, params }) => {
    return new Response(JSON.stringify([]))
  }),
  // Add other mock handlers
]