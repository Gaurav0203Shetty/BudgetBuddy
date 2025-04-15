'use client'

import React, { useState } from 'react'

interface BudgetFormProps {
  onAdd: (budget: { name: string; limit: number }) => void
}

export default function BudgetForm({ onAdd }: BudgetFormProps) {
  const [name, setName] = useState('')
  const [limit, setLimit] = useState('')
  const [errors, setErrors] = useState<{ name?: string; limit?: string; general?: string }>({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const errs: typeof errors = {}
    if (!name.trim()) errs.name = 'Name is required'
    const lim = parseFloat(limit)
    if (!limit) errs.limit = 'Limit is required'
    else if (isNaN(lim)) errs.limit = 'Limit must be a number'
    else if (lim <= 0) errs.limit = 'Limit must be greater than zero'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    if (!validate()) return

    setLoading(true)
    try {
      const res = await fetch('/api/budgets', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, limit: parseFloat(limit) }),
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || 'Failed to add budget')
      }
      const { budget } = await res.json()
      onAdd(budget)
      setName(''); setLimit('')
    } catch (err: any) {
      setErrors({ general: err.message })
    } finally {
      setLoading(false)
    }
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
      {errors.general && (
        <div className="text-red-600 dark:text-red-400">{errors.general}</div>
      )}

      <div>
        <label htmlFor="budget-name" className="block text-sm font-medium">
          Budget Name
        </label>
        <input
          id="budget-name"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          disabled={loading}
          className="
            mt-1 block w-full p-2
            bg-gray-50 dark:bg-gray-700
            border border-gray-300 dark:border-gray-600
            rounded
            text-gray-900 dark:text-gray-100
            placeholder-gray-500 dark:placeholder-gray-400
          "
          placeholder="e.g. Groceries"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="budget-limit" className="block text-sm font-medium">
          Limit
        </label>
        <input
          id="budget-limit"
          type="number"
          value={limit}
          onChange={e => setLimit(e.target.value)}
          disabled={loading}
          className="
            mt-1 block w-full p-2
            bg-gray-50 dark:bg-gray-700
            border border-gray-300 dark:border-gray-600
            rounded
            text-gray-900 dark:text-gray-100
            placeholder-gray-500 dark:placeholder-gray-400
          "
          placeholder="e.g. 500"
        />
        {errors.limit && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.limit}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`
          w-full py-3 
          ${loading ? 'bg-gray-400 dark:bg-gray-600' : 'bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600'} 
          text-white font-semibold 
          rounded
        `}
      >
        {loading ? 'Saving…' : 'Add Budget'}
      </button>
    </form>
  )
}
