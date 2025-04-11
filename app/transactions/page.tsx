'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import TransactionItem from '@/components/TransactionItem'
import TransactionForm from '@/components/TransactionForm'

export default function Transactions() {
  const { data: session } = useSession()
  const [transactions, setTransactions] = useState<any[]>([])
  const [filters, setFilters] = useState({
    start: '',
    end: '',
    type: '',
    budgetId: '',
  })
  const [budgets, setBudgets] = useState<any[]>([])

  // Load budgets for filter dropdown and TransactionForm
  useEffect(() => {
    if (!session) return
    fetch('/api/budgets', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setBudgets(data.budgets))
      .catch(console.error)
  }, [session])

  // Fetch transactions when session or filters change
  useEffect(() => {
    if (!session) return
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, val]) => {
      if (val) params.set(key, val)
    })
    fetch(`/api/transactions?${params.toString()}`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => setTransactions(data.transactions))
      .catch(console.error)
  }, [session, filters])

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
  }

  const addTransaction = async (newTx: any) => {
    const res = await fetch('/api/transactions', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTx),
    })
    if (res.ok) {
      const { transaction } = await res.json()
      setTransactions([transaction, ...transactions])
    } else {
      console.error('Failed to add transaction')
    }
  }

  const deleteTransaction = async (id: string) => {
    const res = await fetch(`/api/transactions/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    if (res.ok) {
      setTransactions(transactions.filter(tx => tx.id !== id))
    } else {
      console.error('Failed to delete transaction')
    }
  }

  const editTransaction = async (tx: {
    id: string
    date: string
    description: string
    amount: number
    type: 'income' | 'expense'
    budgetId?: string
  }) => {
    const { id, date, description, amount, type, budgetId } = tx
    const res = await fetch(`/api/transactions/${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, description, amount, type, budgetId }),
    })
    if (res.ok) {
      setTransactions(transactions.map(t =>
        t.id === id ? { ...t, date, description, amount, type, budgetId } : t
      ))
    } else {
      console.error('Failed to update transaction')
    }
  }

  const downloadCSV = async () => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([k, v]) => {
      if (v) params.set(k, v)
    })
    const res = await fetch(`/api/transactions/export?${params.toString()}`, {
      credentials: 'include',
    })
    if (!res.ok) {
      console.error('Failed to download CSV')
      return
    }
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'transactions.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white shadow rounded space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Transactions</h1>
        <button
          onClick={downloadCSV}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Export CSV
        </button>
      </div>

      {/* Filter Form */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="flex flex-col">
          <label htmlFor="start" className="text-sm font-medium">Start Date</label>
          <input
            id="start"
            type="date"
            name="start"
            value={filters.start}
            onChange={handleFilterChange}
            className="mt-1 p-2 border rounded"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="end" className="text-sm font-medium">End Date</label>
          <input
            id="end"
            type="date"
            name="end"
            value={filters.end}
            onChange={handleFilterChange}
            className="mt-1 p-2 border rounded"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="type" className="text-sm font-medium">Type</label>
          <select
            id="type"
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            className="mt-1 p-2 border rounded"
          >
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="budgetId" className="text-sm font-medium">Budget</label>
          <select
            id="budgetId"
            name="budgetId"
            value={filters.budgetId}
            onChange={handleFilterChange}
            className="mt-1 p-2 border rounded"
          >
            <option value="">All Budgets</option>
            {budgets.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Add Transaction Form */}
      <TransactionForm onAdd={addTransaction} />

      {/* Transactions List */}
      <div className="divide-y divide-gray-200">
        {transactions.map(tx => (
          <TransactionItem
            key={tx.id}
            {...tx}
            onDelete={deleteTransaction}
            onEdit={editTransaction}
          />
        ))}
      </div>
    </div>
  )
}
