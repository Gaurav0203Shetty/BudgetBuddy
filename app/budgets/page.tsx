'use client'

import React, { useState, useEffect } from 'react'
import BudgetForm from '@/components/BudgetForm'
import BudgetItem from '@/components/BudgetItem'

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<any[]>([])
  const [adding, setAdding] = useState(false)

  // Fetch budgets and dedupe
  const fetchBudgets = async () => {
    try {
      const res = await fetch('/api/budgets', { credentials: 'include' })
      if (!res.ok) throw new Error('Fetch failed')
      const { budgets: data } = await res.json()
      // dedupe by id
      const unique = data.filter(
        (b: any, i: number, a: any[]) => a.findIndex(x => x.id === b.id) === i
      )
      setBudgets(unique)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchBudgets()
  }, [])

  // Add budget
  const addBudget = async (b: { name: string; limit: number }) => {
    if (adding) return
    setAdding(true)
    try {
      const res = await fetch('/api/budgets', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(b),
      })
      if (!res.ok) throw new Error('Add failed')
      await fetchBudgets()
    } catch (err) {
      console.error(err)
    } finally {
      setAdding(false)
    }
  }

  // Update budget
  const updateBudget = async (id: string, data: { name: string; limit: number }) => {
    try {
      const res = await fetch(`/api/budgets/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Update failed')
      await fetchBudgets()
    } catch (err) {
      console.error(err)
    }
  }

  // Delete budget
  const deleteBudget = async (id: string) => {
    try {
      const res = await fetch(`/api/budgets/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Delete failed')
      await fetchBudgets()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded shadow space-y-6 text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold">Budgets</h1>

      <BudgetForm onAdd={addBudget} disabled={adding} />

      <div className="space-y-4">
        {budgets.map(b => (
          <BudgetItem
            key={b.id}
            {...b}
            onUpdate={updateBudget}
            onDelete={deleteBudget}
          />
        ))}
      </div>
    </div>
  )
}
