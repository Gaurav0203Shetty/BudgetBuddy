'use client'
import React, { useState } from 'react'
import { Edit3, Trash2, Check, X } from 'lucide-react'

interface BudgetItemProps {
  id: string
  name: string
  limit: number
  spent: number
  onDelete: (id: string) => void
  onUpdate: (id: string, data: { name: string; limit: number }) => void
}

export default function BudgetItem({
  id, name, limit, spent, onDelete, onUpdate
}: BudgetItemProps) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name, limit })

  const save = () => {
    onUpdate(id, form)
    setEditing(false)
  }

  const pct = Math.min(100, Math.round((spent / limit) * 100))

  return (
    <div className="p-4 border rounded mb-2">
      {editing ? (
        <>
          <input
            className="w-full p-1 border mb-2"
            value={form.name}
            onChange={e => setForm({...form, name: e.target.value})}
          />
          <input
            type="number"
            className="w-full p-1 border mb-2"
            value={form.limit}
            onChange={e => setForm({...form, limit: +e.target.value})}
          />
        </>
      ) : (
        <div className="flex justify-between items-center">
          <h3 className="font-medium">{name}</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm">{pct}%</span>
            <button onClick={() => setEditing(true)}><Edit3 size={16}/></button>
            <button onClick={() => onDelete(id)}><Trash2 size={16}/></button>
          </div>
        </div>
      )}

      {editing ? (
        <div className="mt-2 flex gap-2">
          <button onClick={save} className="text-green-600"><Check size={16}/></button>
          <button onClick={() => setEditing(false)} className="text-gray-600"><X size={16}/></button>
        </div>
      ) : (
        <>
          <div className="w-full h-2 bg-gray-200 rounded mt-2">
            <div className="h-full bg-blue-500 rounded" style={{ width: `${pct}%` }} />
          </div>
          <p className="text-sm mt-1">${spent.toFixed(2)} / ${limit.toFixed(2)}</p>
        </>
      )}
    </div>
  )
}
