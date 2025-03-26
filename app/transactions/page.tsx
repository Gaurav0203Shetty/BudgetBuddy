'use client'

import React, { useState, useEffect } from 'react'
import TransactionItem from '@/components/TransactionItem'
import TransactionForm from '@/components/TransactionForm'

export default function Transactions() {
  const [transactions, setTransactions] = useState<any[]>([])

  // Fetch transactions from our API endpoint on component mount
  useEffect(() => {
    async function fetchTransactions() {
      const res = await fetch('/api/transactions')
      const data = await res.json()
      setTransactions(data.transactions)
    }
    fetchTransactions()
  }, [])

  // Function to add a new transaction
  const addTransaction = (newTx: { date: string; description: string; amount: number; type: 'income' | 'expense' }) => {
    const newTransaction = { id: Date.now(), ...newTx }
    setTransactions([newTransaction, ...transactions])
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
