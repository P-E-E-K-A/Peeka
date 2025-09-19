import React, { createContext, useContext, useEffect, useState } from 'react'
import type { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      // Validate inputs
      if (!email || !password) {
        throw new Error('Email and password are required')
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters')
      }

      if (fullName && fullName.trim().length < 2) {
        throw new Error('Full name must be at least 2 characters')
      }

      // Sign up with Supabase Auth
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: fullName ? { full_name: fullName.trim() } : {}
        }
      })

      if (authError) throw authError

      // If signup successful and we have a user and fullName, create profile
      if (data.user && fullName) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: email.toLowerCase().trim(),
            full_name: fullName.trim(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single()

        if (profileError) {
          console.error('Profile creation error:', profileError)
          // Don't throw here - auth succeeded, profile issue can be handled separately
        } else {
          console.log('Profile created successfully for user:', data.user.id)
        }

        // Also create default user settings
        const { error: settingsError } = await supabase
          .from('user_settings')
          .insert({
            user_id: data.user.id,
            font_size: 14,
            theme: 'light',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })

        if (settingsError) {
          console.error('User settings creation error:', settingsError)
          // Don't throw here - settings can be created later
        } else {
          console.log('User settings created for user:', data.user.id)
        }
      }

      return { error: null }
    } catch (error: unknown) {
      console.error('Sign up error:', error)
      return { error: error instanceof Error ? error : new Error('An unknown error occurred') }
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Sign out error:', error)
      throw error
    }
  }

  // Check if profile exists and fetch additional user data
  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('full_name, avatar_url')
          .eq('id', user.id)
          .single()

        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
          console.error('Profile fetch error:', error)
        }

        // Update user metadata if profile exists
        if (profile) {
          await supabase.auth.updateUser({
            data: {
              full_name: profile.full_name,
              avatar_url: profile.avatar_url
            }
          })
        }
      }

      fetchProfile()
    }
  }, [user])

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signIn,
      signUp,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}