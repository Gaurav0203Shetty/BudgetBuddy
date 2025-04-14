// components/Navbar.tsx
'use client'

import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import { LogOut, Home, List, DollarSign, User, FileText } from 'lucide-react'

export default function Navbar() {
  const { data: session } = useSession()

  if (!session) return null

  return (
    <header className="bg-white shadow p-4">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
       <Link href="/" className="text-2xl font-extrabold hover:text-blue-600">
         BudgetBuddy
        </Link>
        <nav className="flex items-center space-x-6">
          <Link href="/dashboard" className="flex items-center gap-1 hover:text-blue-600">
            <Home size={18} /> Dashboard
          </Link>
          <Link href="/transactions" className="flex items-center gap-1 hover:text-blue-600">
            <List size={18} /> Transactions
          </Link>
          <Link href="/budgets" className="flex items-center gap-1 hover:text-blue-600">
            <DollarSign size={18} /> Budgets
          </Link>
          <Link href="/profile" className="flex items-center gap-1 hover:text-blue-600">
            <User size={18} /> Profile
          </Link>
          <Link href="/docs" className="flex items-center gap-1 hover:text-blue-600">
            <FileText size={18} /> API Docs
          </Link>
          <button
            onClick={() => signOut()}
            className="flex items-center gap-1 text-red-600 hover:text-red-800"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </nav>
      </div>
    </header>
  )
}
