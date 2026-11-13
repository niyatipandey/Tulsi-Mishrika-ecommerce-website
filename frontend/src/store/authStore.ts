import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '../lib/supabase'
import type { User, Session } from '@supabase/supabase-js'
import type { Profile } from '../lib/supabase'

interface AuthState {
  user: User | null
  session: Session | null
  profile: Profile | null
  loading: boolean
  error: string | null
  
  // Actions
  initialize: () => Promise<void>
  signUpWithPassword: (
    email: string,
    password: string
  ) => Promise<{ error: any }>

  signInWithPassword: (
    email: string,
    password: string
  ) => Promise<{ error: any }>
  verifyOtp: (email: string, token: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  clearError: () => void
  fetchProfile: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      profile: null,
      loading: true,
      error: null,

      // Fetch user profile
      fetchProfile: async () => {
        const { user } = get()
        if (!user) return

        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

          if (error) throw error

          set({ profile: data })
        } catch (error: any) {
          console.error('Fetch profile error:', error)
        }
      },

      // Initialize auth state and set up listener
      initialize: async () => {
        try {
          // Get current session
          const { data: { session }, error } = await supabase.auth.getSession()
          
          if (error) throw error

          set({
            session,
            user: session?.user ?? null,
            loading: false,
          })

          // Fetch profile if user exists
          if (session?.user) {
            await get().fetchProfile()
          }

          // Listen for auth changes
          supabase.auth.onAuthStateChange(
            async (event, session) => {
              console.log('Auth state changed:', event)
              
              set({
                session,
                user: session?.user ?? null,
                loading: false,
              })

              // Create profile on signup
              if (event === 'SIGNED_IN' && session?.user) {
                // Check if profile exists
                const { data: profile } = await supabase
                  .from('profiles')
                  .select('id')
                  .eq('id', session.user.id)
                  .single()

                // Create profile if it doesn't exist
                if (!profile) {
                  await supabase.from('profiles').insert({
                    id: session.user.id,
                    name: session.user.email?.split('@')[0] || 'User',
                  })
                }

                // Fetch profile
                await get().fetchProfile()
              }

              // Clear profile on sign out
              if (event === 'SIGNED_OUT') {
                set({ profile: null })
              }
            }
          )
        } catch (error: any) {
          console.error('Auth initialization error:', error)
          set({ loading: false, error: error.message })
        }
      },

      // Request OTP via email
            // Register a new customer
      signUpWithPassword: async (email: string, password: string) => {
        set({ loading: true, error: null })

        try {
          const { error } = await supabase.auth.signUp({
            email: email.trim(),
            password,
          })

          if (error) throw error

          set({ loading: false })
          return { error: null }
        } catch (error: any) {
          set({ loading: false, error: error.message })
          return { error }
        }
      },

      // Log in an existing customer
      signInWithPassword: async (email: string, password: string) => {
        set({ loading: true, error: null })

        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
          })

          if (error) throw error

          set({
            session: data.session,
            user: data.user,
            loading: false,
          })

          return { error: null }
        } catch (error: any) {
          set({ loading: false, error: error.message })
          return { error }
        }
      },

      // Verify OTP code
      verifyOtp: async (email: string, token: string) => {
        set({ loading: true, error: null })

        try {
          const { data, error } = await supabase.auth.verifyOtp({
            email,
            token,
            type: 'email',
          })

          if (error) throw error

          set({
            session: data.session,
            user: data.user,
          })

          await get().fetchProfile()

          set({ loading: false })

          return { error: null }
        } catch (error: any) {
          console.error('Verify OTP error:', error)
          set({ loading: false, error: error.message })
          return { error }
        }
      },

      // Sign out
      signOut: async () => {
        set({ loading: true, error: null })

        try {
          const { error } = await supabase.auth.signOut()
          if (error) throw error

          set({
            user: null,
            session: null,
            profile: null,
            loading: false,
          })
        } catch (error: any) {
          console.error('Sign out error:', error)
          set({ loading: false, error: error.message })
        }
      },

      // Clear error message
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        session: state.session,
        user: state.user,
        profile: state.profile,
      }),
    }
  )
)
