import ProfileForm from '@/components/ProfileForm'

export default function Profile() {
  return (
    <div className="max-w-4xl mx-auto p-4 bg-white shadow rounded">
      <h1 className="text-3xl font-bold mb-4">Profile</h1>
      <ProfileForm />
    </div>
  )
}
