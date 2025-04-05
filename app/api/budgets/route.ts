import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/authOptions'

// GET /api/budgets
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const budgets = await prisma.budget.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json({ budgets })
}

// POST /api/budgets
export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { name, limit } = await request.json()
  const budget = await prisma.budget.create({
    data: { name, limit, user: { connect: { id: session.user.id } } },
  })
  return NextResponse.json({ budget }, { status: 201 })
}
