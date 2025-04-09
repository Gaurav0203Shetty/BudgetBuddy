// app/api/transactions/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/authOptions'

// Handle GET /api/transactions
export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Parse query params from the URL
  const { searchParams } = new URL(request.url)
  const start = searchParams.get('start')   // e.g. '2025-04-01'
  const end   = searchParams.get('end')     // e.g. '2025-04-30'
  const type  = searchParams.get('type')    // 'income' or 'expense'
  const budgetId = searchParams.get('budgetId') // budget UUID

  // Build dynamic where clause
  const where: any = { userId: session.user.id }
  if (type) where.type = type
  if (budgetId) where.budgetId = budgetId
  if (start || end) {
    where.date = {}
    if (start) where.date.gte = new Date(start)
    if (end)   where.date.lte = new Date(end)
  }

  const transactions = await prisma.transaction.findMany({
    where,
    orderBy: { date: 'desc' },
  })

  return NextResponse.json({ transactions })
}

// Handle POST /api/transactions
export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { date, description, amount, type, budgetId } = await request.json()

    // Ensure user exists (upsert)
    await prisma.user.upsert({
      where: { id: session.user.id },
      update: {},
      create: {
        id: session.user.id,
        name: session.user.name ?? session.user.id,
        email: session.user.email ?? '',
      },
    })

    const transaction = await prisma.transaction.create({
      data: {
        date: new Date(date),
        description,
        amount,
        type,
        user: { connect: { id: session.user.id } },
        budget: budgetId ? { connect: { id: budgetId } } : undefined,
      },
    })
    if (type === 'expense' && budgetId) {
        await prisma.budget.update({
          where: { id: budgetId },
          data: { spent: { increment: amount } },
        })
       }

    return NextResponse.json({ transaction }, { status: 201 })
  } catch (error) {
    console.error('Error creating transaction:', error)
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 })
  }
}
