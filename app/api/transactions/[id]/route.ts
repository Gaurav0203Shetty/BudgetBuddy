import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/authOptions'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const txId = params.id
  const { date, description, amount, type, budgetId } = await request.json()

  // 1) Fetch existing transaction
  const existing = await prisma.transaction.findUnique({
    where: { id: txId, userId: session.user.id },
    select: { amount: true, type: true, budgetId: true },
  })
  if (!existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  // 2) Run all ops in a single transaction
  const updatedTx = await prisma.$transaction(async (tx) => {
    // a) Update the transaction record
    const updated = await tx.transaction.update({
      where: { id: txId },
      data: {
        date: new Date(date),
        description,
        amount,
        type,
        budget: budgetId
          ? { connect: { id: budgetId } }
          : { disconnect: true },
      },
    })

    // b) If it was an expense tied to a budget, decrement that budget
    if (existing.type === 'expense' && existing.budgetId) {
      await tx.budget.update({
        where: { id: existing.budgetId },
        data: { spent: { decrement: existing.amount } },
      })
    }

    // c) If it’s now an expense tied to a (new) budget, increment that budget
    if (type === 'expense' && budgetId) {
      await tx.budget.update({
        where: { id: budgetId },
        data: { spent: { increment: amount } },
      })
    }

    return updated
  })

  return NextResponse.json({ transaction: updatedTx })
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const txId = params.id

  // 1) Fetch the transaction to know its budget link
  const existing = await prisma.transaction.findUnique({
    where: { id: txId, userId: session.user.id },
    select: { amount: true, type: true, budgetId: true },
  })
  if (!existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  // 2) Delete and adjust in one transaction
  await prisma.$transaction(async (tx) => {
    // a) Delete the transaction
    await tx.transaction.delete({ where: { id: txId } })

    // b) If it was an expense tied to a budget, decrement that budget
    if (existing.type === 'expense' && existing.budgetId) {
      await tx.budget.update({
        where: { id: existing.budgetId },
        data: { spent: { decrement: existing.amount } },
      })
    }
  })

  return NextResponse.json({ success: true })
}
