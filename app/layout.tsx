// app/layout.tsx
import './globals.css'
import { ReactNode } from 'react'
import Navbar from '@/components/Navbar'
import Providers from '@/components/Providers'

export const metadata = {
  title: 'BudgetBuddy',
  description: 'Your personal budgeting dashboard',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen text-gray-900 dark:text-gray-100">
        <Providers>
          <Navbar />
          <main className="flex-1 bg-gray-50 dark:bg-gray-900 p-4 text-gray-900 dark:text-gray-100">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}
