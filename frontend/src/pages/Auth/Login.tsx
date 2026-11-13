
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { Container, Section } from '../../components/layout'
import { Card, Input, Button } from '../../components/common'

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')

  const {
    user,
    loading,
    error,
    signUpWithPassword,
    signInWithPassword,
    clearError,
  } = useAuthStore()

  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (user) {
      const from = (location.state as { from?: { pathname?: string } })?.from?.pathname
      navigate(from || '/account', { replace: true })
    }
  }, [user, navigate, location])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    clearError()
    setMessage('')

    const cleanEmail = email.trim()

    if (isSignUp && password !== confirmPassword) {
      setMessage('Your passwords do not match.')
      return
    }

    if (password.length < 8) {
      setMessage('Please use a password with at least 8 characters.')
      return
    }

    if (isSignUp) {
      const { error } = await signUpWithPassword(cleanEmail, password)

      if (!error) {
        setMessage(
          'Your account request was submitted. If email confirmation is enabled in Supabase, check your inbox to finish registration.'
        )
      }
    } else {
      const { error } = await signInWithPassword(cleanEmail, password)

      if (!error) {
        navigate(
          (location.state as { from?: { pathname?: string } })?.from?.pathname || '/account',
          { replace: true }
        )
      }
    }
  }

  const switchMode = () => {
    setIsSignUp(!isSignUp)
    setMessage('')
    clearError()
    setPassword('')
    setConfirmPassword('')
  }

  return (
    <Section background="white">
      <Container size="sm">
        <Card>
          <div className="py-8">
            <h1 className="mb-2 text-center text-3xl font-heading font-bold">
              {isSignUp ? 'Create Your Account' : 'Welcome Back'}
            </h1>

            <p className="mb-8 text-center text-gray-600">
              {isSignUp
                ? 'Create an account to track your Tulsi Mishrika orders.'
                : 'Log in to view your account and orders.'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />

              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                required
                minLength={8}
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
              />

              {isSignUp && (
                <Input
                  label="Confirm Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Enter your password again"
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
              )}

              {error && (
                <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </p>
              )}

              {message && (
                <p role="status" className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
                  {message}
                </p>
              )}

              <Button type="submit" fullWidth isLoading={loading} className="mt-6">
                {loading
                  ? 'Please wait...'
                  : isSignUp
                    ? 'Create Account'
                    : 'Log In'}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={switchMode}
                className="cursor-pointer font-medium text-brand-brown-800 underline"
              >
                {isSignUp ? 'Log in' : 'Create one'}
              </button>
            </p>
          </div>
        </Card>

        <p className="mt-6 text-center text-sm text-gray-500">
          Your account lets you view your orders and account details.
        </p>
      </Container>
    </Section>
  )
}
