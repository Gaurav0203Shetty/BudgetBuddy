import { GET } from '@/app/api/transactions/route'
import { createMocks } from 'node-mocks-http'
import { NextRequest } from 'next/server'

describe('GET /api/transactions', () => {
  it('returns 401 when not authenticated', async () => {
    const { req, res } = createMocks({ method: 'GET' })

    // Convert mocked request to NextRequest format
    const nextReq = new NextRequest('http://localhost/api/transactions')

    const response = await GET(nextReq)
    expect(response.status).toBe(401)
  })
})
