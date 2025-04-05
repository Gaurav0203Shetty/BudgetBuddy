import React from 'react'

interface BudgetItemProps {
  id: string
  name: string
  limit: number
  spent: number
}

export default function BudgetItem({ name, limit, spent }: BudgetItemProps) {
  const pct = Math.min(100, Math.round((spent / limit) * 100))
  return (
    <div className="p-4 border rounded mb-2">
      <div className="flex justify-between">
        <h3 className="font-medium">{name}</h3>
        <span className="text-sm">{pct}% used</span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded mt-2">
        <div className="h-full bg-blue-500 rounded" style={{ width: `${pct}%` }} />
      </div>
      <p className="text-sm mt-1">
        ${spent.toFixed(2)} / ${limit.toFixed(2)}
      </p>
    </div>
  )
}
