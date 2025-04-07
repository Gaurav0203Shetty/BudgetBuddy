// components/TransactionItem.tsx
'use client'
import React, { useState } from 'react'
import { Trash2, Edit3, Check, X } from 'lucide-react'

interface Props { id: string; date: string; description: string; amount: number; type: 'income'|'expense'; onDelete: (id:string)=>void; onEdit: (tx: any)=>void }

export default function TransactionItem({ id, date, description, amount, type, onDelete, onEdit }: Props) {
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
          <input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} className="w-full"/>
          <input type="text" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className="w-full"/>
          <input type="number" value={form.amount} onChange={e=>setForm({...form,amount:parseFloat(e.target.value)})} className="w-full"/>
          <select value={form.type} onChange={e=>setForm({...form,type:e.target.value as any})} className="w-full">
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
      ) : (
        <div>
          <p className="text-sm text-gray-600">{date}</p>
          <p className="font-medium">{description}</p>
        </div>
      )}
      <div className="flex items-center gap-2">
        {editing ? (
          <>
            <button onClick={save}><Check size={16}/></button>
            <button onClick={()=>setEditing(false)}><X size={16}/></button>
          </>
        ) : (
          <>
            <span className={`${type==='income'?'text-green-500':'text-red-500'} font-bold`}>{type==='income'?`+$${amount}`:`-$${amount}`}</span>
            <button onClick={()=>setEditing(true)}><Edit3 size={16}/></button>
            <button onClick={()=>onDelete(id)}><Trash2 size={16}/></button>
          </>
        )}
      </div>
    </div>
  )
}
