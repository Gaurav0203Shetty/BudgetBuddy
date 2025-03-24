import React from 'react'

interface TransactionItemProps {
  id: number
  date: string
  description: string
  amount: number
  type: 'income' | 'expense'
}

const TransactionItem: React.FC<TransactionItemProps> = ({
  date,
  description,
  amount,
  type,
}) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200">
      <div>
        <p className="text-sm text-gray-600">{date}</p>
        <p className="text-base font-medium">{description}</p>
      </div>
      <div
        className={`text-lg font-bold ${
          type === 'income' ? 'text-green-500' : 'text-red-500'
        }`}
      >
        {type === 'income' ? `+$${amount}` : `-$${amount}`}
      </div>
    </div>
  )
}

export default TransactionItem
