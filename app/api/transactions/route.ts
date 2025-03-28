import { NextResponse } from 'next/server'
import prisma from '../../../lib/prisma'

export async function GET() {
  // Fetch transactions from the database
  const transactions = await prisma.transaction.findMany({
    orderBy: { date: 'desc' },
    include: { user: true },
  })
  return NextResponse.json({ transactions })
}
