'use client'

import React from 'react'
import DashboardCard from '@/components/DashboardCard'
import ExpenseChart from '@/components/ExpenseChart'
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react'

export default function Dashboard() {
  // Dummy financial data
  const totalIncome = 5000
  const totalExpenses = 3200
  const savings = totalIncome - totalExpenses

  // Dummy data for the chart
  const chartLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4']
  const expenseData = [800, 750, 900, 750]

  return (
    <div className="space-y-8">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <DashboardCard
          title="Total Income"
          value={`$${totalIncome}`}
          icon={<TrendingUp />}
        />
        <DashboardCard
          title="Total Expenses"
          value={`$${totalExpenses}`}
          icon={<TrendingDown />}
        />
        <DashboardCard
          title="Savings"
          value={`$${savings}`}
          icon={<DollarSign />}
        />
      </div>
      <div className="bg-white p-4 shadow rounded">
        <ExpenseChart labels={chartLabels} data={expenseData} />
      </div>
    </div>
  )
}
