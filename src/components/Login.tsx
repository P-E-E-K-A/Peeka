import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { 
  LogIn, 
  Mail, 
  Lock, 
  UserPlus, 
  User, 
  Eye, 
  EyeOff, 
  Loader2, 
  CheckCircle, 
  AlertCircle 
} from 'lucide-react'

export const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null)

  const { signIn, signUp } = useAuth()

  const validateForm = () => {
    if (!formData.email || !formData.password) return 'Please fill in all fields'
    if (!/\S+@\S+\.\S+/.test(formData.email)) return 'Please enter a valid email address'
    if (formData.password.length < 6) return 'Password must be at least 6 characters'
    if (isSignUp) {
      if (!formData.fullName.trim()) return 'Full name is required'
      if (formData.password !== formData.confirmPassword) return 'Passwords do not match'
    }
    return null
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    // Clear message when user starts typing
    if (message) {
      setMessage('')
      setMessageType(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setMessageType(null)

    const validationError = validateForm()
    if (validationError) {
      setMessage(validationError)
      setMessageType('error')
      setLoading(false)
      return
    }

    try {
      const { error } = isSignUp
        ? await signUp(formData.email, formData.password, formData.fullName.trim())
        : await signIn(formData.email, formData.password)

      if (error) {
        setMessage(error.message)
        setMessageType('error')
      } else if (isSignUp) {
        setMessage('Check your email for the confirmation link!')
        setMessageType('success')
        // Reset form after successful signup
        setFormData({ fullName: '', email: '', password: '', confirmPassword: '' })
        setShowPassword(false)
      } else {
        // Sign in success - let AuthContext handle redirect
        setMessage('Welcome back! Redirecting...')
        setMessageType('success')
      }
    } catch (error) {
      console.error('Auth error:', error)
      setMessage('An unexpected error occurred. Please try again.')
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  const toggleMode = () => {
    setIsSignUp(!isSignUp)
    setFormData({ fullName: '', email: '', password: '', confirmPassword: '' })
    setMessage('')
    setMessageType(null)
    setShowPassword(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-800 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-white">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className={`mx-auto h-12 w-12 flex items-center justify-center rounded-full shadow-lg transition-all duration-300 ${
            isSignUp 
              ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
              : 'bg-gradient-to-r from-purple-500 to-pink-500'
          }`}>
            {isSignUp ? (
              <UserPlus className="h-6 w-6 text-white" />
            ) : (
              <LogIn className="h-6 w-6 text-white" />
            )}
          </div>
          <p className='text-center text-4xl font-bold text-white'>Peeka.</p>
          <h2 className="text-2xl font-extrabold text-white">
            {isSignUp ? 'Create your account' : 'Sign in to your account'}
          </h2>
          <p className="text-gray-400 text-sm">
            {isSignUp ? 'Join us to boost your productivity' : 'Access your dashboard'}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Full Name Field - Only show on signup */}
            {isSignUp && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  required
                  className="relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                  placeholder="Full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={loading}
                  minLength={2}
                />
              </div>
            )}

            {/* Email Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                required
                className="relative block w-full pl-10 pr-12 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                placeholder={isSignUp ? 'Create a strong password (6+ chars)' : 'Password'}
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                minLength={6}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 disabled:opacity-50"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Confirm Password Field - Only show on signup */}
            {isSignUp && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  className="relative block w-full pl-10 pr-12 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            )}
          </div>

          {/* Message */}
          {message && (
            <div className={`flex items-center space-x-2 p-3 rounded-md text-sm transition-all ${
              messageType === 'success' 
                ? 'bg-green-100 border border-green-300 text-green-800' 
                : 'bg-red-100 border border-red-300 text-red-800'
            }`}>
              {messageType === 'success' ? (
                <CheckCircle className="h-4 w-4 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
              )}
              <span>{message}</span>
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading || !formData.email || !formData.password}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200"
              style={{
                background: isSignUp 
                  ? 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
                  : 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)'
              }}
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                {isSignUp ? (
                  <UserPlus className="h-5 w-5 text-white group-hover:scale-110 transition-transform" />
                ) : (
                  <LogIn className="h-5 w-5 text-white group-hover:scale-110 transition-transform" />
                )}
              </span>
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
              )}
            </button>
          </div>

          {/* Toggle Mode */}
          <div className="text-center">
            <button
              type="button"
              className="text-blue-600 hover:text-blue-500 text-sm font-medium transition-colors disabled:opacity-50"
              onClick={toggleMode}
              disabled={loading}
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>

          {/* Footer - Only show on signup */}
          {isSignUp && (
            <div className="pt-4 border-t border-gray-700 text-center">
              <p className="text-xs text-gray-400">
                By signing up, you agree to our{' '}
                <a href="#" className="text-blue-400 hover:text-blue-300 underline">Terms of Service</a>{' '}
                and{' '}
                <a href="#" className="text-blue-400 hover:text-blue-300 underline">Privacy Policy</a>
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}