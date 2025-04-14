'use client'

import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import { Home, List, DollarSign, User, FileText, Sun, Moon, LogOut } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const { data: session } = useSession()
  const { theme, setTheme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Only show the toggle after hydration to avoid SSR mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!session) return null

  const currentTheme = theme === 'system' ? systemTheme : theme

  return (
    <header className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="text-5xl font-extrabold hover:text-blue-600 dark:hover:text-blue-400"
        >
          BudgetBuddy
        </Link>

        <nav className="flex items-center space-x-4">
          {/* Dark Mode Toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(currentTheme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label="Toggle Dark Mode"
            >
              {currentTheme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          )}

          <Link
            href="/dashboard"
            className="flex items-center gap-1 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
          >
            <Home size={18} /> Dashboard
          </Link>
          <Link
            href="/transactions"
            className="flex items-center gap-1 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
          >
            <List size={18} /> Transactions
          </Link>
          <Link
            href="/budgets"
            className="flex items-center gap-1 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
          >
            <DollarSign size={18} /> Budgets
          </Link>
          <Link
            href="/profile"
            className="flex items-center gap-1 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
          >
            <User size={18} /> Profile
          </Link>
          <Link
            href="/docs"
            className="flex items-center gap-1 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
          >
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
