'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import TransactionItem from '@/components/TransactionItem'
import TransactionForm from '@/components/TransactionForm'

export default function Transactions() {
  const { data: session } = useSession()
  const [transactions, setTransactions] = useState<any[]>([])

  useEffect(() => {
    if (!session) return
    fetch('/api/transactions', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setTransactions(data.transactions))
      .catch(console.error)
  }, [session])

  const addTransaction = async (newTx: any) => {
    const res = await fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(newTx),
    })
    if (res.ok) {
      const { transaction } = await res.json()
      setTransactions([transaction, ...transactions])
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

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white shadow rounded space-y-4">
      <h1 className="text-3xl font-bold mb-4">Transactions</h1>
      <TransactionForm onAdd={addTransaction} />
      <div className="divide-y divide-gray-200">
        {transactions.map(tx => (
          <TransactionItem key={tx.id} {...tx} onDelete={deleteTransaction} />
        ))}
      </div>
    </div>
  )
}
