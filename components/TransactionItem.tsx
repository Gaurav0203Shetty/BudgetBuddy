'use client'

import React from 'react'
import { Trash2 } from 'lucide-react'

interface TransactionItemProps {
  id: string
  date: string
  description: string
  amount: number
  type: 'income' | 'expense'
  onDelete: (id: string) => void
}

export default function TransactionItem({
  id, date, description, amount, type, onDelete,
}: TransactionItemProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200">
      <div>
        <p className="text-sm text-gray-600">{date}</p>
        <p className="text-base font-medium">{description}</p>
      </div>
      <div className="flex items-center gap-4">
        <span className={`text-lg font-bold ${type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
          {type === 'income' ? `+$${amount}` : `-$${amount}`}
        </span>
        <button onClick={() => onDelete(id)} className="text-gray-500 hover:text-red-500">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  )
}
