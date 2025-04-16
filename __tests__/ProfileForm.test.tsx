import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ProfileForm from '@/components/ProfileForm'

// Mock fetch
beforeEach(() => {
  global.fetch = jest.fn()
})

describe('ProfileForm', () => {
  it('loads and displays existing name', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: { name: 'Alice' } }),
    })

    render(<ProfileForm />)
    await waitFor(() => {
      expect((screen.getByLabelText(/Your Name/i) as HTMLInputElement).value).toBe('Alice')
    })
  })

  it('shows validation error on empty submit', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: { name: '' } }),
    })
    render(<ProfileForm />)
    await waitFor(() => {})
    fireEvent.change(screen.getByLabelText(/Your Name/i), { target: { value: '' } })
    fireEvent.click(screen.getByRole('button', { name: /update profile/i }))
    expect(await screen.findByText(/Name cannot be empty/i)).toBeInTheDocument()
  })

  it('submits valid name', async () => {
    (fetch as jest.Mock)
      // initial GET
      .mockResolvedValueOnce({ ok: true, json: async () => ({ user: { name: 'Bob' } }) })
      // PUT
      .mockResolvedValueOnce({ ok: true, text: async () => '' })

    render(<ProfileForm />)
    await waitFor(() => {})

    fireEvent.change(screen.getByLabelText(/Your Name/i), { target: { value: 'Robert' } })
    fireEvent.click(screen.getByRole('button', { name: /update profile/i }))
    await waitFor(() => {
      expect(fetch).toHaveBeenLastCalledWith('/api/profile', expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify({ name: 'Robert' }),
      }))
    })
  })
})
