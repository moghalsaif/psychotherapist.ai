import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Button } from "../src/components/ui/button"
import { Textarea } from "../src/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../src/components/ui/card"
import { LogOut } from 'lucide-react'
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

interface Therapist {
  id: string;
  name: string;
  photo_url: string;
  location: string;
  specialties: string[];
  insurance_accepted: string[];
  availability: string;
  contact_info: string;
  session_formats: string[];
  languages: string[];
  rating?: number;
}

interface MatchedTherapist extends Therapist {
  reason: string;
}

if (!process.env.NEXT_PUBLIC_GROQ_API_KEY) {
  throw new Error('Missing Groq API key - Please add NEXT_PUBLIC_GROQ_API_KEY to your .env.local file')
}

export default function TherapistMatcher({ userProfile }: { userProfile: UserProfile }) {
  console.log('TherapistMatcher received userProfile:', userProfile)
  
  // Validate required fields
  useEffect(() => {
    const requiredFields = ['name', 'age', 'gender_identity', 'location'] as const
    const missingFields = requiredFields.filter(field => !userProfile[field])
    
    if (missingFields.length > 0) {
      console.error('Missing required fields in userProfile:', missingFields)
      setError(`Please complete your profile. ${missingFields.join(', ')} ${missingFields.length === 1 ? 'is' : 'are'} required.`)
    }
  }, [userProfile])
  
  const [prompt, setPrompt] = useState('')
  const [matchedTherapists, setMatchedTherapists] = useState<MatchedTherapist[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkTherapists = async () => {
      try {
        const { data: therapists, error } = await supabase
          .from('therapists')
          .select('*')
        
        if (error) {
          console.error('Error fetching therapists:', error)
          return
        }
        
        console.log('Available therapists in database:', therapists)
      } catch (err) {
        console.error('Error in checkTherapists:', err)
      }
    }
    
    checkTherapists()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMatchedTherapists([]) // Reset matches on new submission
    
    try {
      // Validate userProfile
      if (!userProfile) {
        throw new Error('User profile is missing')
      }

      // Log current state for debugging
      console.log('Current state:', {
        userProfile,
        prompt,
        loading,
        error,
        matchedTherapists
      })

      // Validate required fields
      const requiredFields = ['name', 'age', 'gender_identity', 'location'] as const
      for (const field of requiredFields) {
        if (!userProfile[field]) {
          throw new Error(`Please complete your profile. ${field.replace('_', ' ')} is required.`)
        }
      }

      // Validate prompt
      if (!prompt.trim()) {
        throw new Error('Please enter your specific needs for therapy')
      }

      // Fetch therapists
      const { data: therapists, error: supabaseError } = await supabase
        .from('therapists')
        .select('*')
      
      if (supabaseError) {
        console.error('Supabase error:', supabaseError)
        throw new Error(`Database error: ${supabaseError.message}`)
      }

      if (!therapists || therapists.length === 0) {
        throw new Error('No therapists found in the database')
      }

      console.log('Fetched therapists:', therapists)

      // Prepare GROQ request
      const groqRequest = {
        model: 'mixtral-8x7b-32768',
        messages: [{ 
          role: 'user', 
          content: `
            User Profile:
            Name: ${userProfile.name}
            Age: ${userProfile.age}
            Gender Identity: ${userProfile.gender_identity}
            Location: ${userProfile.location}
            Cultural Background: ${userProfile.cultural_background || 'Not specified'}
            Preferred Language: ${userProfile.preferred_language || 'Not specified'}
            LGBTQ+ Identity: ${userProfile.lgbtq_identity ? 'Yes' : 'No'}
            Relationship Status: ${userProfile.relationship_status || 'Not specified'}
            Has Children: ${userProfile.has_children ? 'Yes' : 'No'}
            Occupation: ${userProfile.occupation || 'Not specified'}
            Mental Health Conditions: ${userProfile.mental_health_conditions?.length ? userProfile.mental_health_conditions.join(', ') : 'None specified'}
            Medications: ${userProfile.medications?.length ? userProfile.medications.join(', ') : 'None specified'}
            Communication Style: ${userProfile.communication_style || 'Not specified'}
            Religious Beliefs: ${userProfile.religious_beliefs || 'Not specified'}
            Session Format: ${userProfile.session_format || 'Not specified'}
            Insurance: ${userProfile.insurance || 'Not specified'}
            Budget: ${userProfile.budget || 'Not specified'}

            User's specific needs:
            ${prompt}

            Available Therapists:
            ${therapists.map(t => `
              ID: ${t.id}
              Name: ${t.name}
              Specialties: ${t.specialties?.join(', ') || 'Not specified'}
              Location: ${t.location || 'Not specified'}
              Languages: ${t.languages?.join(', ') || 'Not specified'}
              Session Formats: ${t.session_formats?.join(', ') || 'Not specified'}
              Insurance Accepted: ${t.insurance_accepted?.join(', ') || 'Not specified'}
              Availability: ${t.availability || 'Not specified'}
              Rating: ${t.rating || 'Not rated'}
            `).join('\n')}

            Based on the user's profile, specific needs, and the available therapist profiles, 
            select the top 3 most suitable therapists. For each therapist, provide a detailed 
            explanation of why they would be a good match considering factors like location, 
            specialties, language, session format, insurance, and budget compatibility.
            
            IMPORTANT: Use the exact therapist IDs from the list above in your response.
            
            Return the result as a JSON array with this structure:
            [{ 
              "id": "exact_therapist_id_from_list",
              "name": "therapist_name",
              "reason": "detailed matching explanation"
            }]
          `
        }],
        temperature: 0.7,
        max_tokens: 1000
      }

      console.log('Making GROQ API request...')

      // Make GROQ API request
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(groqRequest)
      })

      console.log('GROQ API response status:', response.status)

      // Handle non-OK response
      if (!response.ok) {
        const errorText = await response.text()
        console.error('GROQ API error response:', errorText)
        throw new Error(`GROQ API error: ${response.status} ${response.statusText}`)
      }

      // Parse response
      const groqData = await response.json()
      console.log('GROQ API response data:', groqData)

      if (!groqData?.choices?.[0]?.message?.content) {
        throw new Error('Invalid response format from GROQ API: Missing content')
      }

      // Parse matches
      const content = groqData.choices[0].message.content
      console.log('Parsing content:', content)

      let parsedMatches: MatchedTherapist[]
      try {
        parsedMatches = JSON.parse(content)
      } catch (parseError: any) {
        console.error('Parse error:', parseError)
        throw new Error(`Failed to parse therapist matches: ${parseError.message}`)
      }

      if (!Array.isArray(parsedMatches)) {
        throw new Error('GROQ response is not an array')
      }

      if (parsedMatches.length === 0) {
        throw new Error('No therapist matches found')
      }

      console.log('Parsed matches:', parsedMatches)

      // Validate matches
      parsedMatches.forEach((match, index) => {
        if (!match.id || !match.name || !match.reason) {
          throw new Error(`Invalid match at index ${index}: Missing required fields`)
        }
      })

      // Get matched therapist details
      const matchedTherapistIds = parsedMatches.map(t => t.id)
      console.log('Fetching details for therapists:', matchedTherapistIds)

      const { data: matchedTherapistsData, error: matchError } = await supabase
        .from('therapists')
        .select('*')
        .in('id', matchedTherapistIds)

      if (matchError) {
        console.error('Match error:', matchError)
        throw new Error(`Failed to fetch therapist details: ${matchError.message}`)
      }

      if (!matchedTherapistsData || matchedTherapistsData.length === 0) {
        throw new Error('Failed to fetch matched therapists details')
      }

      console.log('Fetched therapist details:', matchedTherapistsData)

      // Combine matches with details
      const fullMatchedTherapists = matchedTherapistsData.map(therapist => ({
        ...therapist,
        reason: parsedMatches.find(m => m.id === therapist.id)?.reason || 'No specific reason provided'
      }))

      console.log('Setting matched therapists:', fullMatchedTherapists)
      setMatchedTherapists(fullMatchedTherapists)

    } catch (error: any) {
      console.error('Error in handleSubmit:', error)
      const errorMessage = error.message || JSON.stringify(error) || 'An unexpected error occurred'
      console.error('Setting error:', errorMessage)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <div className="relative min-h-screen bg-[#FAFAFA]">
      {/* Top Navigation */}
      <div className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Image src="/panda-logo.png" alt="Logo" width={32} height={32} className="w-8 h-8" />
            <h1 className="text-xl font-bold text-gray-800">
              psychotherapist.ai
            </h1>
          </div>
          <Button 
            onClick={handleSignOut}
            variant="ghost"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 pb-32 px-4">
        {/* Hero Section with Sliding Profiles */}
        {!matchedTherapists.length && (
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-800">
              Your Free Personal AI Therapist
            </h2>
            <p className="text-gray-600 text-lg mb-12">
              Matching you with the perfect therapist based on your unique needs and preferences
            </p>
            
            {/* Sliding Therapist Profiles */}
            <div className="relative h-64 mb-12 overflow-hidden">
              <div className="absolute inset-0 flex animate-slide">
                {Array(6).fill(null).map((_, i) => {
                  const therapist = matchedTherapists[i % matchedTherapists.length];
                  return (
                    <div key={i} className="flex-none w-64 mx-4">
                      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden">
                          {therapist?.photo_url ? (
                            <img 
                              src={therapist.photo_url} 
                              alt={therapist.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center">
                              <span className="text-3xl">👩‍⚕️</span>
                            </div>
                          )}
                        </div>
                        <h3 className="font-semibold text-gray-800">{therapist?.name || "Dr. Sarah Johnson"}</h3>
                        <p className="text-sm text-gray-600">Clinical Psychologist</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Chat-like Interface */}
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="What specific challenges or goals would you like to address in therapy?"
                className="min-h-[120px] rounded-[24px] border-gray-200 focus:border-blue-500 focus:ring-blue-500 resize-none shadow-sm pl-6 pr-24 py-4 text-lg bg-white"
                required
              />
              <Button 
                type="submit" 
                disabled={loading}
                className="absolute bottom-4 right-4 rounded-full px-6 bg-[#FF4D4D] hover:bg-[#FF3333] text-white shadow-sm"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    <span>Matching...</span>
                  </div>
                ) : (
                  'Find Matches'
                )}
              </Button>
            </div>
          </form>

          {error && (
            <div className="mt-4 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-600">
              {error}
            </div>
          )}

          {/* Matched Therapists */}
          {matchedTherapists.length > 0 && (
            <div className="mt-12 space-y-8">
              <h3 className="text-2xl font-bold text-center mb-8 text-gray-800">
                Your Perfect Matches
              </h3>
              {matchedTherapists.map((therapist, index) => (
                <div 
                  key={therapist.id}
                  className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
                >
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      {therapist.photo_url ? (
                        <img 
                          src={therapist.photo_url} 
                          alt={therapist.name}
                          className="w-24 h-24 rounded-2xl object-cover"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center">
                          <span className="text-4xl">👩‍⚕️</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-2xl font-bold text-gray-800">{therapist.name}</h4>
                          {therapist.rating && (
                            <div className="flex items-center mt-1">
                              {Array(5).fill(null).map((_, i) => (
                                <span key={i} className={`text-lg ${i < therapist.rating! ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                              ))}
                              <span className="ml-2 text-sm text-gray-600">{therapist.rating} / 5</span>
                            </div>
                          )}
                        </div>
                        <Button
                          variant="outline"
                          className="rounded-full px-6 border-[#FF4D4D] hover:border-[#FF3333] text-[#FF4D4D] hover:text-[#FF3333]"
                          onClick={() => window.open('https://calendly.com', '_blank')}
                        >
                          Contact
                        </Button>
                      </div>
                      <p className="text-gray-600 mb-6 italic">{therapist.reason}</p>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <h5 className="font-semibold text-gray-800 mb-2">Specialties</h5>
                          <div className="flex flex-wrap gap-2">
                            {therapist.specialties?.map((specialty, i) => (
                              <span key={i} className="px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-sm">
                                {specialty}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-800 mb-2">Location</h5>
                          <p className="text-gray-600">{therapist.location}</p>
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-800 mb-2">Languages</h5>
                          <div className="flex flex-wrap gap-2">
                            {therapist.languages?.map((language, i) => (
                              <span key={i} className="px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-sm">
                                {language}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-800 mb-2">Session Formats</h5>
                          <div className="flex flex-wrap gap-2">
                            {therapist.session_formats?.map((format, i) => (
                              <span key={i} className="px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-sm">
                                {format}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="mt-6 pt-6 border-t border-gray-100">
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <h5 className="font-semibold text-gray-800 mb-2">Insurance Accepted</h5>
                            <div className="flex flex-wrap gap-2">
                              {therapist.insurance_accepted?.map((insurance, i) => (
                                <span key={i} className="px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-sm">
                                  {insurance}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h5 className="font-semibold text-gray-800 mb-2">Availability</h5>
                            <p className="text-gray-600">{therapist.availability}</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-6 pt-6 border-t border-gray-100">
                        <h5 className="font-semibold text-gray-800 mb-2">Contact Information</h5>
                        <p className="text-gray-600">{therapist.contact_info}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

