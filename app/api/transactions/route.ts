// app/api/transactions/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/authOptions'

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const transactions = await prisma.transaction.findMany({
    where: { userId: session.user.id },
    orderBy: { date: 'desc' },
    include: { user: true },
  })
  return NextResponse.json({ transactions })
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = await request.json()
    const { date, description, amount, type } = body

    // Ensure the user exists in the database
    await prisma.user.upsert({
      where: { id: session.user.id },
      update: {},
      create: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email || "", // Using an empty string if email is undefined
      },
    })

    const transaction = await prisma.transaction.create({
      data: {
        date: new Date(date),
        description,
        amount,
        type,
        user: { connect: { id: session.user.id } },
      },
    })

    return NextResponse.json({ transaction }, { status: 201 })
  } catch (error) {
    console.error('Error creating transaction:', error)
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 })
  }
}
