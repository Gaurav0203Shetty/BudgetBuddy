'use client'

import React, { useState } from 'react'

interface Budget {
  id: string
  name: string
  limit: number
  spent: number
  onUpdate: (id: string, data: { name: string; limit: number }) => void
  onDelete: (id: string) => void
}

export default function BudgetItem({ id, name, limit, spent, onUpdate, onDelete }: Budget) {
  const [editing, setEditing] = useState(false)
  const [newName, setNewName] = useState(name)
  const [newLimit, setNewLimit] = useState(limit)

  const save = () => {
    onUpdate(id, { name: newName, limit: newLimit })
    setEditing(false)
  }

  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded shadow">
      {editing ? (
        <div className="flex-1 space-x-2">
          <input
            value={newName}
            onChange={e => setNewName(e.target.value)}
            className="p-1 border rounded text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700"
          />
          <input
            type="number"
            value={newLimit}
            onChange={e => setNewLimit(Number(e.target.value))}
            className="p-1 border rounded text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700"
          />
        </div>
      ) : (
        <div className="flex-1">
          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">{name}</h4>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Spent: ₹{spent.toFixed(2)} / Limit: ₹{limit.toFixed(2)}
          </p>
        </div>
      )}

      <div className="flex space-x-2">
        {editing ? (
          <>
            <button onClick={save} className="px-2 py-1 bg-green-600 text-white rounded">
              Save
            </button>
            <button onClick={() => setEditing(false)} className="px-2 py-1 bg-gray-400 text-white rounded">
              Cancel
            </button>
          </>
        ) : (
          <>
            <button onClick={() => setEditing(true)} className="px-2 py-1 bg-blue-600 text-white rounded">
              Edit
            </button>
            <button onClick={() => onDelete(id)} className="px-2 py-1 bg-red-600 text-white rounded">
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  )
}
