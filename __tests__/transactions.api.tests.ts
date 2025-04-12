// __tests__/transactions.api.test.ts
import 'next-test-api-route-handler'       // ◄ Must be first import
import { testApiHandler } from 'next-test-api-route-handler'
import * as transactionsHandler from '@/app/api/transactions/route'
import { getServerSession } from 'next-auth/next'

// Mock getServerSession
jest.mock('next-auth/next', () => ({
  getServerSession: jest.fn(),
}))

describe('GET /api/transactions', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('returns 401 when not authenticated', async () => {
    // Simulate no session
    ;(getServerSession as jest.Mock).mockResolvedValue(null)

    await testApiHandler({
      appHandler: transactionsHandler,      // your route module with GET/POST exports
      requestPatcher: (req) => {
        // nothing to set on the request
      },
      test: async ({ fetch }) => {          // ◄ REQUIRED callback
        const res = await fetch({ method: 'GET' })
        expect(res.status).toBe(401)
        const json = await res.json()
        expect(json).toEqual({ error: 'Unauthorized' })
      },
    })
  })

  it('returns an array when authenticated', async () => {
    // Simulate a valid session
    ;(getServerSession as jest.Mock).mockResolvedValue({
      user: { id: 'user-1' },
      expires: '1d',
    })

    await testApiHandler({
      appHandler: transactionsHandler,
      test: async ({ fetch }) => {
        const res = await fetch({ method: 'GET' })
        expect(res.status).toBe(200)
        const data = await res.json()
        expect(Array.isArray(data.transactions)).toBe(true)
      },
    })
  })
})
