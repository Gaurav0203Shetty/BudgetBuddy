'use client'

import React, { useState } from 'react'
import { Trash2, Edit3, Check, X } from 'lucide-react'

interface Props {
  id: string
  date: string
  description: string
  amount: number
  type: 'income' | 'expense'
  onDelete: (id: string) => void
  onEdit: (tx: any) => void
}

export default function TransactionItem({
  id,
  date,
  description,
  amount,
  type,
  onDelete,
  onEdit,
}: Props) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ date, description, amount, type })

  const save = () => {
    onEdit({ id, ...form })
    setEditing(false)
  }

  return (
    <div className="flex items-center justify-between p-4 border-b">
      {editing ? (
        <div className="flex-1 space-y-2">
          <input
            type="date"
            value={form.date}
            onChange={e => setForm({ ...form, date: e.target.value })}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-gray-100"
          />
          <input
            type="text"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-gray-100"
          />
          <input
            type="number"
            value={form.amount}
            onChange={e =>
              setForm({ ...form, amount: parseFloat(e.target.value) })
            }
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-gray-100"
          />
          <select
            value={form.type}
            onChange={e =>
              setForm({ ...form, type: e.target.value as 'income' | 'expense' })
            }
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-gray-100"
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
      ) : (
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{date}</p>
          <p className="font-medium text-gray-900 dark:text-gray-100">
            {description}
          </p>
        </div>
      )}
      <div className="flex items-center gap-2">
        {!editing && (
          <span
            className={`font-bold ${
              type === 'income'
                ? 'text-green-500 dark:text-green-400'
                : 'text-red-500 dark:text-red-400'
            }`}
          >
            {type === 'income' ? '+' : '-'}₹{amount.toFixed(2)}
          </span>
        )}
        {editing ? (
          <>
            <button onClick={save}>
              <Check size={16} />
            </button>
            <button onClick={() => setEditing(false)}>
              <X size={16} />
            </button>
          </>
        ) : (
          <>
            <button onClick={() => setEditing(true)}>
              <Edit3 size={16} />
            </button>
            <button onClick={() => onDelete(id)}>
              <Trash2 size={16} />
            </button>
          </>
        )}
      </div>
    </div>
  )
}
