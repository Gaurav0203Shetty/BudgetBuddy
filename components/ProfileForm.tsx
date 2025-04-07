'use client'
import React, { useState, useEffect } from 'react'

interface Profile {
  id: string
  name: string
  email: string
}

export default function ProfileForm() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [name, setName] = useState('')
  const [status, setStatus] = useState('')

  useEffect(() => {
    async function loadProfile() {
      try {
        // Make sure this starts with a slash
        const res = await fetch('/api/profile', { credentials: 'include' })
        console.log('Profile fetch status:', res.status, res.statusText)
        const text = await res.text()
        if (!res.ok) {
          console.error('Failed to fetch profile:', text)
          return
        }
        // If we get here, text contains JSON
        const data = JSON.parse(text)
        if (!data.user) {
          console.error('No user data returned')
          return
        }
        setProfile(data.user)
        setName(data.user.name)
      } catch (err) {
        console.error('Error loading profile:', err)
      }
    }
    loadProfile()
  }, [])

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return
    setStatus('Saving…')
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      const text = await res.text()
      console.log('Profile update status:', res.status, res.statusText, text)
      if (!res.ok) {
        console.error('Failed to update profile:', text)
        setStatus('Failed to save')
        return
      }
      const data = JSON.parse(text)
      setProfile(data.user)
      setStatus('Saved!')
    } catch (err) {
      console.error('Error updating profile:', err)
      setStatus('Failed to save')
    }
    setTimeout(() => setStatus(''), 2000)
  }

  if (!profile) return <p>Loading…</p>

  return (
    <form onSubmit={save} className="max-w-md mx-auto space-y-4">
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          className="mt-1 w-full p-2 border rounded"
        />
      </div>
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
        Update Profile
      </button>
      {status && <p className="text-sm mt-1">{status}</p>}
    </form>
  )
}
