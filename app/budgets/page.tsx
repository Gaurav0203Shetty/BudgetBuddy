'use client'
import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import BudgetItem from '@/components/BudgetItem'
import BudgetForm from '@/components/BudgetForm'

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

  const deleteBudget = async (id: string) => {
    const res = await fetch(`/api/budgets/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    if (res.ok) {
      setBudgets(budgets.filter(b => b.id !== id))
    }
  }

  const updateBudget = async (id: string, data: any) => {
    const res = await fetch(`/api/budgets/${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(data),
    })
    if (res.ok) {
      setBudgets(budgets.map(b => b.id === id ? {...b, ...data} : b))
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white shadow rounded">
      <h1 className="text-3xl font-bold mb-4">Budgets</h1>
      <BudgetForm onAdd={addBudget} />
      {budgets.map(b => (
        <BudgetItem
          key={b.id}
          {...b}
          onDelete={deleteBudget}
          onUpdate={updateBudget}
        />
      ))}
    </div>
  )
}
