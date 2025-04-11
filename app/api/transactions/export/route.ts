// app/api/transactions/export/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/authOptions'

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Parse the same filters as in GET /api/transactions
  const { searchParams } = new URL(request.url)
  const start = searchParams.get('start')
  const end = searchParams.get('end')
  const type = searchParams.get('type')
  const budgetId = searchParams.get('budgetId')

  const where: any = { userId: session.user.id }
  if (type) where.type = type
  if (budgetId) where.budgetId = budgetId
  if (start || end) {
    where.date = {}
    if (start) where.date.gte = new Date(start)
    if (end)   where.date.lte = new Date(end)
  }

  // Fetch filtered transactions
  const txs = await prisma.transaction.findMany({
    where,
    orderBy: { date: 'desc' },
    include: { budget: { select: { name: true } } },
  })

  // Build CSV content
  const header = ['Date','Description','Amount','Type','Budget']
  const rows = txs.map(tx => [
    tx.date.toISOString().split('T')[0],
    `"${tx.description.replace(/"/g, '""')}"`,
    tx.amount.toString(),
    tx.type,
    tx.budget?.name ?? '',
  ])
  const csv = [header, ...rows]
    .map(cols => cols.join(','))
    .join('\r\n')

  return new Response(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="transactions.csv"',
    },
  })
}
