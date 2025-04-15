'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import TransactionForm from '@/components/TransactionForm'
import TransactionItem from '@/components/TransactionItem'

export default function TransactionsPage() {
  const { data: session } = useSession()
  const [transactions, setTransactions] = useState<any[]>([])
  const [filters, setFilters] = useState({ start: '', end: '', type: '', budgetId: '' })
  const [budgets, setBudgets] = useState<any[]>([])
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    if (!session) return
    fetch('/api/budgets', { credentials: 'include' })
      .then(r => r.json())
      .then(d => setBudgets(d.budgets))
      .catch(console.error)
  }, [session])

  const fetchTransactions = async () => {
    if (!session) return
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([k, v]) => v && params.set(k, v))
    try {
      const res = await fetch(`/api/transactions?${params}`, { credentials: 'include' })
      if (!res.ok) throw new Error('Fetch failed')
      const { transactions } = await res.json()
      // dedupe
      setTransactions(transactions.filter(
        (t: any, i: number, a: any[]) => a.findIndex(x => x.id === t.id) === i
      ))
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => { fetchTransactions() }, [session, filters])

  const addTransaction = async (tx: any) => {
    if (adding) return
    setAdding(true)
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tx),
      })
      if (!res.ok) throw new Error('Add failed')
      await fetchTransactions()
    } catch (e) {
      console.error(e)
    } finally {
      setAdding(false)
    }
  }

  const deleteTransaction = async (id: string) => {
    try {
      const res = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE', credentials: 'include',
      })
      if (!res.ok) throw new Error('Delete failed')
      await fetchTransactions()
    } catch (e) {
      console.error(e)
    }
  }

  const editTransaction = async (tx: any) => {
    try {
      const res = await fetch(`/api/transactions/${tx.id}`, {
        method: 'PUT', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tx),
      })
      if (!res.ok) throw new Error('Update failed')
      await fetchTransactions()
    } catch (e) {
      console.error(e)
    }
  }

  const exportCSV = () => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([k, v]) => v && params.set(k, v))
    window.location.href = `/api/transactions/export?${params}`
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded shadow space-y-6 text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold">Transactions</h1>

      {/* Filters omitted for brevity */}

      <TransactionForm onAdd={addTransaction} disabled={adding} />

      <button
        onClick={exportCSV}
        className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-600"
      >
        Export CSV
      </button>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
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
