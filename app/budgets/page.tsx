'use client'
import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import BudgetItem from '@/components/BudgetItem'
import BudgetForm from '@/components/BudgetForm'
import BudgetChart from '@/components/BudgetChart'

export default function Budgets() {
  const { data: session } = useSession()
  const [budgets, setBudgets] = useState<any[]>([])

  useEffect(() => {
    if (!session) return
    fetch('/api/budgets', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setBudgets(data.budgets))
  }, [session])

  const addBudget = async (b: any) => {
    const res = await fetch('/api/budgets', {
      method: 'POST',
      credentials: 'include',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(b),
    })
    if (res.ok) {
      const { budget } = await res.json()
      setBudgets([budget, ...budgets])
    }
  }

  const updateBudget = async (id: string, data: { name: string; limit: number }) => {
    const res = await fetch(`/api/budgets/${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (res.ok) {
      setBudgets(budgets.map(b => (b.id === id ? { ...b, ...data } : b)))
    }
  }

  const deleteBudget = async (id: string) => {
    const res = await fetch(`/api/budgets/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    if (res.ok) {
      setBudgets(budgets.filter(b => b.id !== id))
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6 bg-white dark:bg-gray-800 rounded shadow text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold">Budgets</h1>
      <BudgetForm onAdd={addBudget} />
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