// app/api/budgets/[id]/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/authOptions'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { name, limit } = await request.json()
  if (!name || typeof limit !== 'number') {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  const updated = await prisma.budget.updateMany({
    where: { id: params.id, userId: session.user.id },
    data: { name, limit },
  })
  if (updated.count === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const deleted = await prisma.budget.deleteMany({
    where: { id: params.id, userId: session.user.id },
  })
  if (deleted.count === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}
