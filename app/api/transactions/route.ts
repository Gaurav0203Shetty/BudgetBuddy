import { NextResponse } from 'next/server'

export async function GET() {
  // Dummy transaction data – in a real app, this would come from database
  const transactions = [
    { id: 1, date: '2025-03-20', description: 'Salary', amount: 5000, type: 'income' },
    { id: 2, date: '2025-03-21', description: 'Groceries', amount: 200, type: 'expense' },
    { id: 3, date: '2025-03-22', description: 'Electricity Bill', amount: 150, type: 'expense' },
  ]
  return NextResponse.json({ transactions })
}
