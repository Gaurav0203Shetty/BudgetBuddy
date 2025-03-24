import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'  // Utility to merge class names

interface DashboardCardProps {
  title: string
  value: string | number
  icon?: React.ReactNode
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon }) => {
  return (
    <Card className="w-full p-4">
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        {icon && <div className="text-2xl">{icon}</div>}
      </CardHeader>
      <CardContent>
        <p className="mt-2 text-3xl font-bold">{value}</p>
      </CardContent>
    </Card>
  )
}

export default DashboardCard
