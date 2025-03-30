// app/transactions/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import TransactionItem from '@/components/TransactionItem'
import TransactionForm from '@/components/TransactionForm'
import { useSession } from 'next-auth/react'

export default function Transactions() {
  const [transactions, setTransactions] = useState<any[]>([])
  const { data: session } = useSession()

  // Fetch transactions from our API endpoint on component mount
  useEffect(() => {
    async function fetchTransactions() {
      try {
        const res = await fetch('/api/transactions', { credentials: 'include' })
        if (!res.ok) {
          const errorText = await res.text()
          console.error('Failed to fetch transactions:', errorText)
          return
        }
        const data = await res.json()
        setTransactions(data.transactions)
      } catch (error) {
        console.error('Error fetching transactions:', error)
      }
    }
    if (session) {
      fetchTransactions()
    }
  }, [session])

  // Function to add a new transaction using the POST endpoint
  const addTransaction = async (newTx: {
    date: string
    description: string
    amount: number
    type: 'income' | 'expense'
  }) => {
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ...newTx }),
      })

      if (!res.ok) {
        const errorText = await res.text()
        console.error('Failed to add transaction:', errorText)
        return
      }
      const data = await res.json()
      setTransactions([data.transaction, ...transactions])
    } catch (error) {
      console.error('Error adding transaction:', error)
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
