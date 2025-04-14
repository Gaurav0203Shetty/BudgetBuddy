import ProfileForm from '@/components/ProfileForm'

export default function Profile() {
  return (
    <div className="max-w-4xl mx-auto p-4 bg-white dark:bg-gray-800 shadow rounded space-y-6 text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-4">Profile</h1>
      <ProfileForm />
    </div>
  )
}
