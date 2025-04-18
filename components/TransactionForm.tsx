'use client'

import React, { useState, useEffect } from 'react'

interface Budget {
  id: string
  name: string
}

interface TransactionFormProps {
  onAdd: (tx: {
    date: string
    description: string
    amount: number
    type: 'income' | 'expense'
    budgetId?: string
  }) => void
  disabled?: boolean
}

export default function TransactionForm({ onAdd, disabled = false }: TransactionFormProps) {
  const [date, setDate] = useState('')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState<'income' | 'expense'>('income')
  const [budgetId, setBudgetId] = useState('')
  const [budgets, setBudgets] = useState<Budget[]>([])

  const [errors, setErrors] = useState<{ date?: string; description?: string; amount?: string; general?: string }>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch('/api/budgets', { credentials: 'include' })
      .then(r => r.json())
      .then(data => Array.isArray(data.budgets) && setBudgets(data.budgets))
      .catch(console.error)
  }, [])

  const validate = () => {
    const errs: typeof errors = {}
    if (!date) errs.date = 'Date is required'
    if (!description.trim()) errs.description = 'Description is required'
    const amt = parseFloat(amount)
    if (!amount || isNaN(amt)) errs.amount = 'Amount is required'
    else if (amt <= 0) errs.amount = 'Amount must be greater than zero'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // IMMEDIATELY guard against double submit
    if (loading || disabled) return

    if (!validate()) return

    setLoading(true)
    setErrors({})

    try {
      await onAdd({
        date,
        description,
        amount: parseFloat(amount),
        type,
        budgetId: type === 'expense' && budgetId ? budgetId : undefined,
      })

      // reset form after parent has processed
      setDate('')
      setDescription('')
      setAmount('')
      setType('income')
      setBudgetId('')
    } catch (err: any) {
      setErrors({ general: err.message || 'Unknown error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white dark:bg-gray-800 rounded shadow text-gray-900 dark:text-gray-100">
      {errors.general && <div className="text-red-600 dark:text-red-400">{errors.general}</div>}

      <div>
        <label htmlFor="date" className="block text-sm font-medium">Date</label>
        <input
          id="date" type="date" value={date} onChange={e => setDate(e.target.value)}
          disabled={loading || disabled}
          className="mt-1 block w-full p-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100"
        />
        {errors.date && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.date}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium">Description</label>
        <input
          id="description" type="text" value={description} onChange={e => setDescription(e.target.value)}
          disabled={loading || disabled}
          placeholder="e.g. Grocery shopping"
          className="mt-1 block w-full p-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
        />
        {errors.description && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>}
      </div>

      <div>
        <label htmlFor="amount" className="block text-sm font-medium">Amount</label>
        <input
          id="amount" type="number" value={amount} onChange={e => setAmount(e.target.value)}
          disabled={loading || disabled}
          placeholder="e.g. 100"
          className="mt-1 block w-full p-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
        />
        {errors.amount && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.amount}</p>}
      </div>

      <div>
        <label htmlFor="type" className="block text-sm font-medium">Type</label>
        <select
          id="type" value={type} onChange={e => setType(e.target.value as any)}
          disabled={loading || disabled}
          className="mt-1 block w-full p-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100"
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      {type === 'expense' && budgets.length > 0 && (
        <div>
          <label htmlFor="budgetId" className="block text-sm font-medium">Budget Category</label>
          <select
            id="budgetId" value={budgetId} onChange={e => setBudgetId(e.target.value)}
            disabled={loading || disabled}
            className="mt-1 block w-full p-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100"
          >
            <option value="">— None —</option>
            {budgets.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>
      )}

      <button
        type="submit"
        disabled={loading || disabled}
        className={`w-full py-3 text-white font-semibold rounded ${
          loading || disabled
            ? 'bg-gray-400 dark:bg-gray-600'
            : 'bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600'
        }`}
      >
        {loading ? 'Saving…' : 'Add Transaction'}
      </button>
    </form>
  )
}
