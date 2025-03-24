import React from "react"
import { Button } from "@/components/ui/button"  // Adjust the path based on your project structure

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-100">
      <h1 className="text-4xl font-bold">Welcome to BudgetBuddy</h1>
      <Button variant="outline" size="lg">
        Get Started
      </Button>
    </div>
  )
}
