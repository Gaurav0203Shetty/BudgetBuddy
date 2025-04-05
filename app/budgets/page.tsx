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
      .catch(console.error)
  }, [session])

  const addBudget = async ({ name, limit }: { name: string; limit: number }) => {
    const res = await fetch('/api/budgets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name, limit }),
    })
    if (res.ok) {
      const { budget } = await res.json()
      setBudgets([budget, ...budgets])
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white shadow rounded">
      <h1 className="text-3xl font-bold mb-4">Budgets</h1>
      <BudgetForm onAdd={addBudget} />
      {budgets.map(b => (
        <BudgetItem key={b.id} {...b} />
      ))}
    </div>
  )
}
