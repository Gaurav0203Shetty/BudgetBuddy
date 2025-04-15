'use client'

import React, { useState } from 'react'

interface BudgetFormProps {
  onAdd: (budget: { name: string; limit: number }) => Promise<void>
  disabled?: boolean
}

export default function BudgetForm({ onAdd, disabled = false }: BudgetFormProps) {
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
    if (loading || disabled) return
    if (!validate()) return

    setLoading(true)
    setErrors({})
    try {
      await onAdd({ name, limit: parseFloat(limit) })
      setName('')
      setLimit('')
    } catch (err: any) {
      setErrors({ general: err.message || 'Failed to add budget' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-6 bg-white dark:bg-gray-800 rounded shadow text-gray-900 dark:text-gray-100"
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
          disabled={loading || disabled}
          placeholder="e.g. Groceries"
          className="mt-1 block w-full p-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
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
          disabled={loading || disabled}
          placeholder="e.g. 500"
          className="mt-1 block w-full p-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
        />
        {errors.limit && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.limit}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading || disabled}
        className={`w-full py-3 text-white font-semibold rounded ${
          loading || disabled
            ? 'bg-gray-400 dark:bg-gray-600'
            : 'bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600'
        }`}
      >
        {loading ? 'Saving…' : 'Add Budget'}
      </button>
    </form>
  )
}
