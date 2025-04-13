import { withAuth } from 'next-auth/middleware'

export default withAuth(
  // `withAuth` will protect all routes by default.
  // You can pass `pages: { signIn: '/api/auth/signin' }`
  // to customize the sign-in path.
  { pages: { signIn: '/api/auth/signin' } }
)

export const config = {
  // Apply this middleware to all app routes under these paths:
  matcher: ['/dashboard', '/transactions', '/budgets', '/profile'],
}
