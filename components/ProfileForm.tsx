'use client'

import React, { useState, useEffect } from 'react'

interface Profile {
  name: string
}

export default function ProfileForm() {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ name?: string; general?: string }>({})

  // Load current profile
  useEffect(() => {
    fetch('/api/profile', { credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch profile')
        return res.json()
      })
      .then((data: { user: Profile }) => {
        setName(data.user.name || '')
      })
      .catch(err => setErrors({ general: err.message }))
  }, [])

  const validate = () => {
    const errs: typeof errors = {}
    if (!name.trim()) errs.name = 'Name cannot be empty'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    if (!validate()) return

    setLoading(true)
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || 'Failed to update profile')
      }
      // Optionally show a success message...
    } catch (err: any) {
      setErrors({ general: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="
        space-y-4 p-6
        bg-white dark:bg-gray-800
        rounded shadow
        text-gray-900 dark:text-gray-100
      "
    >
      {errors.general && (
        <div className="text-red-600 dark:text-red-400">{errors.general}</div>
      )}

      <div>
        <label htmlFor="profile-name" className="block text-sm font-medium">
          Your Name
        </label>
        <input
          id="profile-name"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          disabled={loading}
          className="
            mt-1 block w-full p-2
            bg-gray-50 dark:bg-gray-700
            border border-gray-300 dark:border-gray-600
            rounded
            text-gray-900 dark:text-gray-100
            placeholder-gray-500 dark:placeholder-gray-400
          "
          placeholder="Enter your name"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.name}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`
          w-full py-3 
          ${loading ? 'bg-gray-400 dark:bg-gray-600' : 'bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600'} 
          text-white font-semibold 
          rounded
        `}
      >
        {loading ? 'Saving…' : 'Update Profile'}
      </button>
    </form>
  )
}
