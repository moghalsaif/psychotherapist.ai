'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Session } from '@supabase/supabase-js'
import { supabase, isDemoMode } from '../lib/supabaseClient'
import Image from 'next/image'

// Dynamic imports to prevent SSR issues
const Auth = dynamic(() => import('../components/Auth'), { 
  ssr: false,
  loading: () => <div className="animate-pulse bg-gray-200 h-16 rounded-2xl"></div>
})

const Questionnaire = dynamic(() => import('../components/Questionnaire'), { 
  ssr: false,
  loading: () => <div className="animate-pulse bg-gray-200 h-96 rounded-2xl"></div>
})

const TherapistMatcher = dynamic(() => import('../components/TherapistMatcher'), { 
  ssr: false,
  loading: () => <div className="animate-pulse bg-gray-200 h-96 rounded-2xl"></div>
})

interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender_identity: string;
  location: string;
  cultural_background: string;
  preferred_language: string;
  lgbtq_identity: boolean;
  relationship_status: string;
  has_children: boolean;
  occupation: string;
  mental_health_conditions: string[];
  medications: string[];
  communication_style: string;
  religious_beliefs: string;
  session_format: string;
  insurance: string;
  budget: number;
}

export default function Home() {
  const [session, setSession] = useState<Session | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)

  // Always run in demo mode for simplicity
  const isDemoMode = true

  // Check for existing demo session and profile on client side
  useEffect(() => {
    // Check for existing demo session and profile
    try {
      const demoSession = localStorage.getItem('demo-session')
      if (demoSession) {
        const parsedSession = JSON.parse(demoSession)
        if (parsedSession.expires_at > Date.now()) {
          // Create a mock session object
          const mockSession: Session = {
            user: parsedSession.user,
            access_token: parsedSession.access_token,
            token_type: 'bearer',
            expires_in: Math.floor((parsedSession.expires_at - Date.now()) / 1000),
            expires_at: parsedSession.expires_at,
            refresh_token: 'demo-refresh-token'
          }
          setSession(mockSession)
          
          // Check for demo profile
          const demoProfile = localStorage.getItem('demo-profile')
          if (demoProfile) {
            setUserProfile(JSON.parse(demoProfile))
          }
        } else {
          localStorage.removeItem('demo-session')
          localStorage.removeItem('demo-profile')
        }
      }
    } catch (error) {
      console.error('Error parsing demo session:', error)
      localStorage.removeItem('demo-session')
      localStorage.removeItem('demo-profile')
    }
  }, [])

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId)
      
      if (isDemoMode) {
        // In demo mode, check localStorage for profile
        const demoProfile = localStorage.getItem('demo-profile')
        if (demoProfile) {
          setUserProfile(JSON.parse(demoProfile))
        }
        return
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        throw error
      }
      
      console.log('Fetched profile data:', data)
      if (data) {
        // Validate required fields before setting
        const requiredFields = ['name', 'age', 'gender_identity', 'location'] as const
        const missingFields = requiredFields.filter(field => !data[field])
        
        if (missingFields.length > 0) {
          console.warn('Profile missing required fields:', missingFields)
          setUserProfile(null)
          return
        }
        
        setUserProfile(data)
      } else {
        console.log('No profile found, redirecting to questionnaire')
        setUserProfile(null)
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
      setUserProfile(null)
    }
  }

  const handleProfileComplete = (profile: UserProfile) => {
    if (isDemoMode) {
      // Save demo profile to localStorage
      localStorage.setItem('demo-profile', JSON.stringify(profile))
    }
    setUserProfile(profile)
  }

  // Show main app content when we have a session and profile
  if (session && userProfile) {
    return <TherapistMatcher userProfile={userProfile} />
  }

  // Show questionnaire when we have a session but no profile
  if (session && !userProfile) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4">
        <Questionnaire 
          session={session} 
          onProfileComplete={handleProfileComplete}
        />
      </div>
    )
  }

  // Show auth/landing page when no session
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xl">🧠</span>
            </div>
            <h1 className="text-xl font-bold text-gray-800">
              psychotherapist.ai
            </h1>
          </div>
          <h2 className="text-4xl font-bold mb-4 text-gray-800">
            Your Free Personal AI Therapist
          </h2>
          <p className="text-gray-600 text-lg mb-12 max-w-2xl mx-auto">
            Matching you with the perfect therapist based on your unique needs and preferences
          </p>

          {isDemoMode && (
            <div className="max-w-md mx-auto mb-8 p-4 bg-blue-50 border border-blue-200 rounded-2xl">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Demo Mode Active</h3>
              <p className="text-blue-700 text-sm">
                API keys not configured. You can still try the app with demo responses!
              </p>
            </div>
          )}

          {/* Auth Section */}
          <div className="max-w-md mx-auto bg-[#FFF9E5] p-8 rounded-3xl mb-16">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Try psychotherapist.ai today!
            </h2>
            <Auth />
          </div>
          
          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
              <div className="w-12 h-12 mx-auto mb-6 rounded-2xl bg-[#FFE5E5] flex items-center justify-center">
                <span className="text-2xl">🧠</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">
                Personalized Matching
              </h3>
              <p className="text-gray-600 text-sm">
                Get matched with therapists based on your mental health needs, preferences, and location
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
              <div className="w-12 h-12 mx-auto mb-6 rounded-2xl bg-[#FFE5E5] flex items-center justify-center">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">
                AI-Powered Recommendations
              </h3>
              <p className="text-gray-600 text-sm">
                Use AI to analyze your input and suggest the best therapists for you
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
              <div className="w-12 h-12 mx-auto mb-6 rounded-2xl bg-[#FFE5E5] flex items-center justify-center">
                <span className="text-2xl">👤</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">
                Therapist Profiles
              </h3>
              <p className="text-gray-600 text-sm">
                View detailed profiles of recommended therapists, including specialties, availability, and ratings
              </p>
            </div>
          </div>

          {/* Main Features */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-16 max-w-3xl mx-auto">
            <div className="bg-gray-50 p-4 rounded-2xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">📝</div>
              <span className="text-sm text-gray-600">Detailed onboarding form</span>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">🌍</div>
              <span className="text-sm text-gray-600">Cultural preferences</span>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">🌈</div>
              <span className="text-sm text-gray-600">LGBTQ+ affirming therapists</span>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">⭐</div>
              <span className="text-sm text-gray-600">Reviews and ratings</span>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center">🔑</div>
              <span className="text-sm text-gray-600">Easy sign-up process</span>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">🗣️</div>
              <span className="text-sm text-gray-600">Language preferences</span>
            </div>
          </div>

          {/* Privacy Section */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">
              Your privacy is <span className="text-[#FF4D4D]">safe</span>
            </h3>
            <p className="text-gray-600 text-sm max-w-xl mx-auto">
              We take your privacy seriously. All conversations are encrypted and your data is never shared with third parties.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

