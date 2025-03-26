import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface ExpenseChartProps {
  labels: string[]
  data: number[]
}

const ExpenseChart: React.FC<ExpenseChartProps> = ({ labels, data }) => {
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Expenses',
        data,
        fill: true,
        backgroundColor: 'rgba(220, 38, 38, 0.2)', // red-600 with transparency
        borderColor: 'rgba(220, 38, 38, 1)', // red-600 solid
        tension: 0.3,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: {
        display: true,
        text: 'Expense Trends Over Time',
      },
    },
  }

  return <Line data={chartData} options={options} />
}

export default ExpenseChart
