/**
 * @jest-environment node
 */
import 'next-test-api-route-handler'       // must be first
import { testApiHandler } from 'next-test-api-route-handler'
import * as budgetsRoute from '@/app/api/budgets/route'

// Mock NextAuth so getServerSession always returns a valid user
jest.mock('next-auth/next', () => ({
  getServerSession: jest.fn().mockResolvedValue({ user: { id: 'u1' } }),
}))

describe('Budgets API (App Router)', () => {
  it('GET /api/budgets → 200 & array of budgets', async () => {
    await testApiHandler({
      appHandler: budgetsRoute,
      test: async ({ fetch }) => {
        const res = await fetch({
          method: 'GET',
          headers: { cookie: 'next-auth.session-token=valid' },
        })
        expect(res.status).toBe(200)
        const json = await res.json()
        expect(Array.isArray(json.budgets)).toBe(true)
      },
    })
  })

  it('POST /api/budgets → 201 & created budget', async () => {
    await testApiHandler({
      appHandler: budgetsRoute,
      test: async ({ fetch }) => {
        const res = await fetch({
          method: 'POST',
          headers: {
            cookie: 'next-auth.session-token=valid',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: 'TestBudget', limit: 123 }),
        })
        expect(res.status).toBe(201)
        const json = await res.json()
        expect(json.budget).toMatchObject({
          name: 'TestBudget',
          limit: 123,
          spent: 0,
        })
        // store id for next tests
        const id = json.budget.id
        expect(typeof id).toBe('string')
      },
    })
  })

  it('PUT /api/budgets/[id] → 200 & success=true', async () => {
    const TEST_ID = 'b1' // ensure this exists in your test DB or seed
    await testApiHandler({
      appHandler: budgetsRoute,
      params: { id: TEST_ID },
      test: async ({ fetch }) => {
        const res = await fetch({
          method: 'PUT',
          headers: {
            cookie: 'next-auth.session-token=valid',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: 'UpdatedName', limit: 999 }),
        })
        expect(res.status).toBe(200)
        const json = await res.json()
        expect(json.success).toBe(true)
      },
    })
  })

  it('DELETE /api/budgets/[id] → 200 & success=true', async () => {
    const TEST_ID = 'b2' // ensure this exists
    await testApiHandler({
      appHandler: budgetsRoute,
      params: { id: TEST_ID },
      test: async ({ fetch }) => {
        const res = await fetch({
          method: 'DELETE',
          headers: { cookie: 'next-auth.session-token=valid' },
        })
        expect(res.status).toBe(200)
        const json = await res.json()
        expect(json.success).toBe(true)
      },
    })
  })
})
