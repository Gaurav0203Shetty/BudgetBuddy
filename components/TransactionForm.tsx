'use client'

import React, { useState, useEffect } from 'react'

interface Budget {
  id: string
  name: string
}

interface TransactionFormProps {
  onAdd: (transaction: {
    date: string
    description: string
    amount: number
    type: 'income' | 'expense'
    budgetId?: string
  }) => void
}

export default function TransactionForm({ onAdd }: TransactionFormProps) {
  const [date, setDate] = useState('')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState<'income' | 'expense'>('income')
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [budgetId, setBudgetId] = useState<string>('')

  useEffect(() => {
    fetch('/api/budgets', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.budgets)) {
          setBudgets(data.budgets)
        }
      })
      .catch(console.error)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!date || !description || !amount) return

    onAdd({
      date,
      description,
      amount: parseFloat(amount),
      type,
      budgetId: type === 'expense' && budgetId ? budgetId : undefined,
    })

    // Reset form
    setDate('')
    setDescription('')
    setAmount('')
    setType('income')
    setBudgetId('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-gray-50 rounded shadow">
      <div>
        <label className="block text-sm font-medium">Date</label>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="mt-1 block w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Description</label>
        <input
          type="text"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="mt-1 block w-full p-2 border rounded"
          placeholder="e.g. Grocery shopping"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Amount</label>
        <input
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          className="mt-1 block w-full p-2 border rounded"
          placeholder="e.g. 100"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Type</label>
        <select
          value={type}
          onChange={e => setType(e.target.value as 'income' | 'expense')}
          className="mt-1 block w-full p-2 border rounded"
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>
      {type === 'expense' && budgets.length > 0 && (
        <div>
          <label className="block text-sm font-medium">Budget Category</label>
          <select
            value={budgetId}
            onChange={e => setBudgetId(e.target.value)}
            className="mt-1 block w-full p-2 border rounded"
          >
            <option value="">— None —</option>
            {budgets.map(b => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      )}
      <button
        type="submit"
        className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700"
      >
        Add Transaction
      </button>
    </form>
  )
}
