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
  const [budgetId, setBudgetId] = useState('')

  useEffect(() => {
    fetch('/api/budgets', { credentials: 'include' })
      .then(res => res.json())
      .then(data => Array.isArray(data.budgets) && setBudgets(data.budgets))
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

    setDate('')
    setDescription('')
    setAmount('')
    setType('income')
    setBudgetId('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="
        space-y-4 p-6 
        bg-white dark:bg-gray-800 
        rounded shadow 
        text-gray-900 dark:text-gray-100
      "
    >
      <div>
        <label htmlFor="date" className="block text-sm font-medium">
          Date
        </label>
        <input
          id="date"
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="
            mt-1 block w-full p-2 
            bg-gray-50 dark:bg-gray-700 
            border border-gray-300 dark:border-gray-600 
            rounded 
            text-gray-900 dark:text-gray-100
            placeholder-gray-500 dark:placeholder-gray-400
          "
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium">
          Description
        </label>
        <input
          id="description"
          type="text"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="e.g. Grocery shopping"
          className="
            mt-1 block w-full p-2 
            bg-gray-50 dark:bg-gray-700 
            border border-gray-300 dark:border-gray-600 
            rounded 
            text-gray-900 dark:text-gray-100
            placeholder-gray-500 dark:placeholder-gray-400
          "
        />
      </div>

      <div>
        <label htmlFor="amount" className="block text-sm font-medium">
          Amount
        </label>
        <input
          id="amount"
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder="e.g. 100"
          className="
            mt-1 block w-full p-2 
            bg-gray-50 dark:bg-gray-700 
            border border-gray-300 dark:border-gray-600 
            rounded 
            text-gray-900 dark:text-gray-100
            placeholder-gray-500 dark:placeholder-gray-400
          "
        />
      </div>

      <div>
        <label htmlFor="type" className="block text-sm font-medium">
          Type
        </label>
        <select
          id="type"
          value={type}
          onChange={e => setType(e.target.value as any)}
          className="
            mt-1 block w-full p-2 
            bg-gray-50 dark:bg-gray-700 
            border border-gray-300 dark:border-gray-600 
            rounded 
            text-gray-900 dark:text-gray-100
          "
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      {type === 'expense' && budgets.length > 0 && (
        <div>
          <label htmlFor="budgetId" className="block text-sm font-medium">
            Budget Category
          </label>
          <select
            id="budgetId"
            value={budgetId}
            onChange={e => setBudgetId(e.target.value)}
            className="
              mt-1 block w-full p-2 
              bg-gray-50 dark:bg-gray-700 
              border border-gray-300 dark:border-gray-600 
              rounded 
              text-gray-900 dark:text-gray-100
            "
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
        className="
          w-full py-3 
          bg-blue-600 dark:bg-blue-500 
          text-white font-semibold 
          rounded hover:bg-blue-700 dark:hover:bg-blue-600
        "
      >
        Add Transaction
      </button>
    </form>
  )
}
