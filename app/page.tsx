'use client'

import { useState, useEffect } from 'react'
import { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabaseClient'
import Auth from '../components/Auth'
import Questionnaire from '../components/Questionnaire'
import TherapistMatcher from '../components/TherapistMatcher'
import Image from 'next/image'

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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session?.user) {
        fetchUserProfile(session.user.id)
      }
    })

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session?.user) {
        fetchUserProfile(session.user.id)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId)
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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white to-blue-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-8">
              <Image src="/panda-logo.png" alt="Logo" width={40} height={40} className="w-10 h-10" />
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

            {/* Auth Section - Moved to top */}
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
                  Use Groq's AI to analyze your input and suggest the best therapists for you
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

            {/* Reviews Section */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold mb-8 text-gray-800">
                What our <span className="text-[#4CAF50]">users</span> are saying
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="bg-gray-50 p-6 rounded-2xl">
                  <div className="flex items-center gap-2 mb-2 text-yellow-400">★★★★★</div>
                  <p className="text-gray-600 text-sm">
                    "Makes my therapy journey so much easier. Love the daily check-ins and progress tracking!"
                  </p>
                  <p className="text-gray-400 text-xs mt-2">- Sarah M.</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl">
                  <div className="flex items-center gap-2 mb-2 text-yellow-400">★★★★★</div>
                  <p className="text-gray-600 text-sm">
                    "The AI matching really works! Found a therapist who gets me after just one try."
                  </p>
                  <p className="text-gray-400 text-xs mt-2">- Michael R.</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl">
                  <div className="flex items-center gap-2 mb-2 text-yellow-400">★★★★★</div>
                  <p className="text-gray-600 text-sm">
                    "Great for tracking my moods and progress. The interface is so intuitive!"
                  </p>
                  <p className="text-gray-400 text-xs mt-2">- Emma L.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!userProfile) {
    console.log('Rendering questionnaire - no user profile')
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <Questionnaire 
            session={session} 
            onProfileComplete={(profile) => {
              console.log('Profile completed:', profile)
              setUserProfile(profile)
            }} 
          />
        </div>
      </div>
    )
  }

  console.log('Rendering TherapistMatcher with profile:', userProfile)
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <TherapistMatcher userProfile={userProfile} />
      </div>
    </div>
  )
}

