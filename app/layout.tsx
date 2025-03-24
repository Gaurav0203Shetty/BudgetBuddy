import './globals.css'
import Link from 'next/link'
import { Button } from '@/components/ui/button'  // Adjust path if needed

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>BudgetBuddy</title>
      </head>
      <body className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/">
              <span className="text-2xl font-bold">BudgetBuddy</span>
            </Link>
            <div className="flex gap-4">
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Link href="/transactions">
                <Button variant="ghost">Transactions</Button>
              </Link>
              <Link href="/budgets">
                <Button variant="ghost">Budgets</Button>
              </Link>
              <Link href="/profile">
                <Button variant="ghost">Profile</Button>
              </Link>
            </div>
          </nav>
        </header>
        <main className="max-w-7xl mx-auto p-4">{children}</main>
      </body>
    </html>
  )
}
