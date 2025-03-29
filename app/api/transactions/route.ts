import { NextResponse } from 'next/server'
import prisma from '../../../lib/prisma'

export async function GET() {
  const transactions = await prisma.transaction.findMany({
    orderBy: { date: 'desc' },
    include: { user: true },
  })
  return NextResponse.json({ transactions })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { date, description, amount, type, userId } = body

    // Create a new transaction record in the database
    const transaction = await prisma.transaction.create({
      data: {
        date: new Date(date),
        description,
        amount,
        type,
        // For demo purposes, we use a dummy user. Later, replace with the authenticated user.
        user: { connect: { id: userId || 'dummy-user-id' } },
      },
    })

    return NextResponse.json({ transaction }, { status: 201 })
  } catch (error) {
    console.error('Error creating transaction:', error)
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    )
  }
}
