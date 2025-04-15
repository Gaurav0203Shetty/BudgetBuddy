// app/dashboard/page.tsx
'use client'

import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import DashboardCard from '@/components/DashboardCard'
import ExpenseChart from '@/components/ExpenseChart'
import ExpenseBreakdownChart from '@/components/ExpenseBreakdownChart'

export default function Dashboard() {
  const { data: session } = useSession()
  const [transactions, setTransactions] = useState<any[]>([])
  const [budgets, setBudgets] = useState<any[]>([])

  useEffect(() => {
    if (!session) return

    // Fetch transactions
    fetch('/api/transactions', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setTransactions(data.transactions))
      .catch(console.error)

    // Fetch budgets
    fetch('/api/budgets', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setBudgets(data.budgets))
      .catch(console.error)
  }, [session])

  // Compute totals
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
  const netSavings = totalIncome - totalExpenses

  // Prepare data for trend chart (e.g. by month)
  const monthlyTotals = React.useMemo(() => {
    const months: Record<string, number> = {}
    transactions.forEach(t => {
      const m = new Date(t.date).toLocaleString('default', { month: 'short', year: 'numeric' })
      months[m] = (months[m] || 0) + (t.type === 'expense' ? -t.amount : t.amount)
    })
    const labels = Object.keys(months).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    )
    const data = labels.map(l => months[l])
    return { labels, data }
  }, [transactions])

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard title="Total Income" value={`$${totalIncome.toFixed(2)}`} />
        <DashboardCard title="Total Expenses" value={`$${totalExpenses.toFixed(2)}`} />
        <DashboardCard title="Net Savings" value={`$${netSavings.toFixed(2)}`} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Monthly Net Flow
          </h3>
          <ExpenseChart labels={monthlyTotals.labels} data={monthlyTotals.data} />
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Expense Breakdown by Budget
          </h3>
          <ExpenseBreakdownChart budgets={budgets.map(b => ({ name: b.name, spent: b.spent }))} />
        </div>
      </div>
    </div>
  )
}
