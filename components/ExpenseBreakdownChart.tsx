import React from 'react'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { Pie } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

interface ExpenseBreakdownChartProps {
  budgets: { name: string; spent: number }[]
}

export default function ExpenseBreakdownChart({ budgets }: ExpenseBreakdownChartProps) {
  const labels = budgets.map(b => b.name)
  const dataValues = budgets.map(b => b.spent)

  const data = {
    labels,
    datasets: [
      {
        label: 'Spent',
        data: dataValues,
        // Chart.js will auto-assign colors, or you can customize here
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'right' as const },
      title: {
        display: true,
        text: 'Expense Breakdown by Budget',
      },
    },
  }

  return <Pie data={data} options={options} />
}
