import React, { useState } from 'react'

interface BudgetFormProps {
  onAdd: (data: { name: string; limit: number }) => void
}

export default function BudgetForm({ onAdd }: BudgetFormProps) {
  const [name, setName] = useState('')
  const [limit, setLimit] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !limit) return
    onAdd({ name, limit: parseFloat(limit) })
    setName('')
    setLimit('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mb-4">
      <input
        type="text"
        placeholder="Budget name"
        value={name}
        onChange={e => setName(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="number"
        placeholder="Limit"
        value={limit}
        onChange={e => setLimit(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">
        Add Budget
      </button>
    </form>
  )
}
