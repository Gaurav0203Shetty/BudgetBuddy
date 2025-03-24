// app/dashboard/page.tsx
import React from 'react'
import DashboardCard from '@/components/DashboardCard'
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react'

export default function Dashboard() {
  // Dummy financial data
  const totalIncome = 5000
  const totalExpenses = 3200
  const savings = totalIncome - totalExpenses

  return (
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
  )
}
