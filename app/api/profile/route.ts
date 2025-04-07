// app/api/profile/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/authOptions'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await prisma.user.upsert({
    where: { id: session.user.id },
    update: {},
    create: {
      id: session.user.id,
      name: session.user.name ?? session.user.id,
    },
  })

  // Now fetch the user record
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true },
  })

  return NextResponse.json({ user })
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { name } = await request.json()
  if (!name) {
    return NextResponse.json({ error: 'Name required' }, { status: 400 })
  }
  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: { name },
    select: { id: true, name: true, email: true },
  })
  return NextResponse.json({ user })
}
