import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface BudgetChartProps {
  budgets: { name: string; spent: number; limit: number }[]
}

export default function BudgetChart({ budgets }: BudgetChartProps) {
  const labels = budgets.map(b => b.name)
  const spentData = budgets.map(b => b.spent)
  const limitData = budgets.map(b => b.limit)

  const data = {
    labels,
    datasets: [
      {
        label: 'Spent',
        data: spentData,
        backgroundColor: 'rgba(220, 38, 38, 0.7)',
      },
      {
        label: 'Limit',
        data: limitData,
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Budget Usage' },
    },
  }

  return <Bar data={data} options={options} />
}
