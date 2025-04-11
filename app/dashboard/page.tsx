'use client'

import React, { useEffect, useState } from 'react'
import DashboardCard from '@/components/DashboardCard'
import ExpenseChart from '@/components/ExpenseChart'
import ExpenseBreakdownChart from '@/components/ExpenseBreakdownChart'
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react'

export default function Dashboard() {
  const [budgets, setBudgets] = useState<{ name: string; spent: number }[]>([])
  const [summary, setSummary] = useState({ income: 0, expenses: 0 })

  useEffect(() => {
    // Fetch transactions summary
    fetch('/api/transactions', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        const inc = data.transactions
          .filter((t: any) => t.type === 'income')
          .reduce((sum: number, t: any) => sum + t.amount, 0)
        const exp = data.transactions
          .filter((t: any) => t.type === 'expense')
          .reduce((sum: number, t: any) => sum + t.amount, 0)
        setSummary({ income: inc, expenses: exp })
      })

    // Fetch budgets with spent
    fetch('/api/budgets', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        // Only include budgets with non-zero spent
        setBudgets(data.budgets.map((b: any) => ({
          name: b.name,
          spent: b.spent,
        })))
      })
  }, [])

  const savings = summary.income - summary.expenses

  return (
    <div className="space-y-8">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <DashboardCard
          title="Total Income"
          value={`$${summary.income.toFixed(2)}`}
          icon={<TrendingUp />}
        />
        <DashboardCard
          title="Total Expenses"
          value={`$${summary.expenses.toFixed(2)}`}
          icon={<TrendingDown />}
        />
        <DashboardCard
          title="Savings"
          value={`$${savings.toFixed(2)}`}
          icon={<DollarSign />}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-4 shadow rounded">
          <ExpenseChart
            labels={['Week 1', 'Week 2', 'Week 3', 'Week 4']}
            data={[800, 750, 900, 750]}
          />
        </div>
        <div className="bg-white p-4 shadow rounded">
          {budgets.length > 0 ? (
            <ExpenseBreakdownChart budgets={budgets} />
          ) : (
            <p className="text-center text-gray-500">No budget data to display.</p>
          )}
        </div>
      </div>
    </div>
  )
}
