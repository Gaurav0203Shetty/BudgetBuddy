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
      <body className="flex flex-col min-h-screen">
        <Providers>
          <Navbar />
          <main className="flex-1 bg-gray-50 p-4">{children}</main>
        </Providers>
      </body>
    </html>
  )
}
