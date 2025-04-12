import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import TransactionForm from '@/components/TransactionForm'

describe('TransactionForm', () => {
  it('renders inputs and calls onAdd with correct data', () => {
    const mockAdd = jest.fn()
    render(<TransactionForm onAdd={mockAdd} />)

    // Fill out form
    fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: '2025-04-12' } })
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'Test' } })
    fireEvent.change(screen.getByLabelText(/Amount/i), { target: { value: '100' } })
    fireEvent.change(screen.getByLabelText(/Type/i), { target: { value: 'income' } })

    fireEvent.click(screen.getByRole('button', { name: /Add Transaction/i }))

    expect(mockAdd).toHaveBeenCalledWith({
      date: '2025-04-12',
      description: 'Test',
      amount: 100,
      type: 'income',
      budgetId: undefined,
    })
  })
})
