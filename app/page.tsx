// app/page.tsx
import Link from 'next/link'

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Card wrapper */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-gray-900 dark:text-gray-100">
        <h2 className="text-5xl font-extrabold mb-4">
          Welcome to BudgetBuddy
        </h2>
        <p className="text-lg mb-6">
          Your personal budgeting dashboard. Track your expenses, set budgets, and visualize your spending—all in one place.
        </p>
        <Link href="/dashboard" className="inline-block px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700">
            Go to Dashboard
        </Link>
      </div>
    </div>
  )
}
