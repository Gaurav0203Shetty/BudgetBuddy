import { render, screen, fireEvent } from '@testing-library/react'
import BudgetForm from '@/components/BudgetForm'

describe('BudgetForm', () => {
  it('renders inputs and button', () => {
    const onAdd = jest.fn()
    render(<BudgetForm onAdd={onAdd} />)

    expect(screen.getByLabelText(/Budget Name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Limit/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /add budget/i })).toBeEnabled()
  })

  it('shows validation errors on empty submit', () => {
    const onAdd = jest.fn()
    render(<BudgetForm onAdd={onAdd} />)

    fireEvent.click(screen.getByRole('button', { name: /add budget/i }))
    expect(screen.getByText(/Name is required/i)).toBeInTheDocument()
    expect(screen.getByText(/Limit is required/i)).toBeInTheDocument()
    expect(onAdd).not.toHaveBeenCalled()
  })

  it('calls onAdd with valid data and resets form', () => {
    const onAdd = jest.fn().mockResolvedValue(undefined)
    render(<BudgetForm onAdd={onAdd} />)

    fireEvent.change(screen.getByLabelText(/Budget Name/i), { target: { value: 'Test' } })
    fireEvent.change(screen.getByLabelText(/Limit/i), { target: { value: '100' } })
    fireEvent.click(screen.getByRole('button', { name: /add budget/i }))

    expect(onAdd).toHaveBeenCalledWith({ name: 'Test', limit: 100 })
    // form should reset
    expect((screen.getByLabelText(/Budget Name/i) as HTMLInputElement).value).toBe('')
    expect((screen.getByLabelText(/Limit/i) as HTMLInputElement).value).toBe('')
  })

  it('disables button when disabled prop is true', () => {
    const onAdd = jest.fn()
    render(<BudgetForm onAdd={onAdd} disabled />)
    expect(screen.getByRole('button', { name: /add budget/i })).toBeDisabled()
  })
})
