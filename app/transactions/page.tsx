'use client'

import React, { useState } from 'react'
import TransactionItem from '@/components/TransactionItem'
import TransactionForm from '@/components/TransactionForm'

export default function Transactions() {
  // Dummy transaction data
  const [transactions, setTransactions] = useState([
    { id: 1, date: '2025-03-20', description: 'Salary', amount: 5000, type: 'income' as const },
    { id: 2, date: '2025-03-21', description: 'Groceries', amount: 200, type: 'expense' as const },
    { id: 3, date: '2025-03-22', description: 'Electricity Bill', amount: 150, type: 'expense' as const },
  ])

  // Function to add a new transaction
  const addTransaction = (newTx: { date: string; description: string; amount: number; type: 'income' | 'expense' }) => {
    const newTransaction = {
      id: Date.now(), // Simple unique id
      ...newTx,
    }
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
