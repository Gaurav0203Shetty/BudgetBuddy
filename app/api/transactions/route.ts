import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/authOptions'

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

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
    if (end) where.date.lte = new Date(end)
  }

  const transactions = await prisma.transaction.findMany({
    where,
    orderBy: { date: 'desc' },
  })
  return NextResponse.json({ transactions })
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { date, description, amount, type, budgetId } = await request.json()

    // Create the transaction (user relation via connect)
    const transaction = await prisma.transaction.create({
      data: {
        date: new Date(date),
        description,
        amount,
        type,
        user: { connect: { id: session.user.id } },
        ...(type === 'expense' && budgetId
          ? { budget: { connect: { id: budgetId } } }
          : {}),
      },
    })

    // If it's an expense, increment the budget's spent
    if (type === 'expense' && budgetId) {
      await prisma.budget.update({
        where: { id: budgetId },
        data: { spent: { increment: amount } },
      })
    }

    return NextResponse.json({ transaction }, { status: 201 })
  } catch (error) {
    console.error('Error creating transaction:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
