'use client'

import React, { useState, useEffect } from 'react'
import TransactionItem from '@/components/TransactionItem'
import TransactionForm from '@/components/TransactionForm'

export default function Transactions() {
  const [transactions, setTransactions] = useState<any[]>([])

  // Fetch transactions from the API when the component mounts
  useEffect(() => {
    async function fetchTransactions() {
      const res = await fetch('/api/transactions')
      const data = await res.json()
      setTransactions(data.transactions)
    }
    fetchTransactions()
  }, [])

  // Function to add a new transaction using the POST endpoint
  const addTransaction = async (newTx: {
    date: string
    description: string
    amount: number
    type: 'income' | 'expense'
  }) => {
    const res = await fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // For now, we're using a dummy user ID; later, replace with the authenticated user's ID.
      body: JSON.stringify({ ...newTx, userId: 'dummy-user-id' }),
    })

    if (res.ok) {
      const data = await res.json()
      setTransactions([data.transaction, ...transactions])
    } else {
      console.error('Failed to add transaction')
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white shadow rounded space-y-4">
      <h1 className="text-3xl font-bold mb-4">Transactions</h1>
      <TransactionForm onAdd={addTransaction} />
      <div className="divide-y divide-gray-200">
        {transactions.map((tx) => (
          <TransactionItem key={tx.id} {...tx} />
        ))}
      </div>
    </div>
  )
}
