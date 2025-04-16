import { render, screen, fireEvent } from '@testing-library/react'
import TransactionForm from '@/components/TransactionForm'

describe('TransactionForm', () => {
  it('renders inputs and calls onAdd with correct data', () => {
    const onAdd = jest.fn()
    render(<TransactionForm onAdd={onAdd} />)

    // Fill form
    fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: '2025-04-16' } })
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'Test' } })
    fireEvent.change(screen.getByLabelText(/Amount/i), { target: { value: '100' } })
    fireEvent.change(screen.getByLabelText(/Type/i), { target: { value: 'income' } })

    fireEvent.click(screen.getByRole('button', { name: /add transaction/i }))
    expect(onAdd).toHaveBeenCalledTimes(1)
    expect(onAdd).toHaveBeenCalledWith({
      date: '2025-04-16',
      description: 'Test',
      amount: 100,
      type: 'income',
      budgetId: undefined,
    })
  })
})
