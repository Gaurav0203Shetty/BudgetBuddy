/**
 * @jest-environment node
 */
import 'next-test-api-route-handler'
import { testApiHandler } from 'next-test-api-route-handler'
import * as txRoute from '@/app/api/transactions/route'

// Mock NextAuth so getServerSession always returns a valid user
jest.mock('next-auth/next', () => ({
  getServerSession: jest.fn().mockResolvedValue({ user: { id: 'u1' } }),
}))

describe('Transactions API (App Router)', () => {
  let createdId: string

  it('GET /api/transactions → 401 when no session', async () => {
    await testApiHandler({
      appHandler: txRoute,
      test: async ({ fetch }) => {
        const res = await fetch({ method: 'GET' })
        expect(res.status).toBe(401)
        expect(await res.json()).toEqual({ error: 'Unauthorized' })
      },
    })
  })

  it('POST /api/transactions → 201 & created transaction', async () => {
    await testApiHandler({
      appHandler: txRoute,
      test: async ({ fetch }) => {
        const res = await fetch({
          method: 'POST',
          headers: {
            cookie: 'next-auth.session-token=valid',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            date: '2025-04-16',
            description: 'Salary',
            amount: 1000,
            type: 'income',
          }),
        })
        expect(res.status).toBe(201)
        const json = await res.json()
        expect(json.transaction).toMatchObject({
          description: 'Salary',
          amount: 1000,
          type: 'income',
        })
        createdId = json.transaction.id
      },
    })
  })

  it('GET /api/transactions → includes created transaction', async () => {
    await testApiHandler({
      appHandler: txRoute,
      test: async ({ fetch }) => {
        const res = await fetch({
          method: 'GET',
          headers: { cookie: 'next-auth.session-token=valid' },
        })
        expect(res.status).toBe(200)
        const { transactions } = await res.json()
        expect(transactions.some((t: any) => t.id === createdId)).toBe(true)
      },
    })
  })

  it('PUT /api/transactions/[id] → 200 & updated transaction', async () => {
    await testApiHandler({
      appHandler: txRoute,
      params: { id: createdId },
      test: async ({ fetch }) => {
        const res = await fetch({
          method: 'PUT',
          headers: {
            cookie: 'next-auth.session-token=valid',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            date: '2025-04-16',
            description: 'Updated Salary',
            amount: 1200,
            type: 'income',
          }),
        })
        expect(res.status).toBe(200)
        const json = await res.json()
        expect(json.transaction).toMatchObject({
          id: createdId,
          description: 'Updated Salary',
          amount: 1200,
        })
      },
    })
  })

  it('DELETE /api/transactions/[id] → 200 & success=true', async () => {
    await testApiHandler({
      appHandler: txRoute,
      params: { id: createdId },
      test: async ({ fetch }) => {
        const res = await fetch({
          method: 'DELETE',
          headers: { cookie: 'next-auth.session-token=valid' },
        })
        expect(res.status).toBe(200)
        expect(await res.json()).toEqual({ success: true })
      },
    })
  })

  it('DELETE non‑existent id → 404', async () => {
    await testApiHandler({
      appHandler: txRoute,
      params: { id: 'does-not-exist' },
      test: async ({ fetch }) => {
        const res = await fetch({
          method: 'DELETE',
          headers: { cookie: 'next-auth.session-token=valid' },
        })
        expect(res.status).toBe(404)
        expect(await res.json()).toEqual({ error: 'Not found' })
      },
    })
  })
})
