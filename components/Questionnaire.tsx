import { useState } from 'react'
import { supabase, isDemoMode } from '../lib/supabaseClient'
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Checkbox } from "./ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Textarea } from "./ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import type { Session } from '@supabase/supabase-js'

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

interface FormData {
  name: string;
  age: string;
  gender_identity: string;
  location: string;
  cultural_background: string;
  preferred_language: string;
  lgbtq_identity: boolean;
  relationship_status: string;
  has_children: boolean;
  occupation: string;
  mental_health_conditions: string;
  medications: string;
  communication_style: string;
  religious_beliefs: string;
  session_format: string;
  insurance: string;
  budget: string;
}

interface QuestionnaireProps {
  session: Session;
  onProfileComplete: (profile: UserProfile) => void;
}

export default function Questionnaire({ session, onProfileComplete }: QuestionnaireProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    age: '',
    gender_identity: '',
    location: '',
    cultural_background: '',
    preferred_language: '',
    lgbtq_identity: false,
    relationship_status: '',
    has_children: false,
    occupation: '',
    mental_health_conditions: '',
    medications: '',
    communication_style: '',
    religious_beliefs: '',
    session_format: '',
    insurance: '',
    budget: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSelectChange = (name: string, value: string | boolean) => {
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Validate required fields
      const requiredFields = ['name', 'age', 'gender_identity', 'location'] as const
      for (const field of requiredFields) {
        if (!formData[field]) {
          throw new Error(`${field.replace('_', ' ')} is required`)
        }
      }

      // Transform the data
      const transformedData: UserProfile = {
        id: session.user.id,
        name: formData.name.trim(),
        age: parseInt(formData.age) || 0,
        gender_identity: formData.gender_identity,
        location: formData.location.trim(),
        cultural_background: formData.cultural_background.trim(),
        preferred_language: formData.preferred_language.trim(),
        lgbtq_identity: Boolean(formData.lgbtq_identity),
        relationship_status: formData.relationship_status,
        has_children: Boolean(formData.has_children),
        occupation: formData.occupation.trim(),
        mental_health_conditions: formData.mental_health_conditions
          .split(',')
          .map(condition => condition.trim())
          .filter(Boolean),
        medications: formData.medications
          .split(',')
          .map(med => med.trim())
          .filter(Boolean),
        communication_style: formData.communication_style.trim(),
        religious_beliefs: formData.religious_beliefs.trim(),
        session_format: formData.session_format,
        insurance: formData.insurance.trim(),
        budget: parseFloat(formData.budget) || 0
      }

      // Additional validation
      if (transformedData.age <= 0) {
        throw new Error('Please enter a valid age')
      }

      if (transformedData.budget < 0) {
        throw new Error('Please enter a valid budget')
      }

      console.log('Submitting profile data:', transformedData)

      if (isDemoMode) {
        // In demo mode, save to localStorage instead of Supabase
        console.log('Demo mode: Saving profile to localStorage')
        localStorage.setItem('demo-profile', JSON.stringify(transformedData))
        onProfileComplete(transformedData)
        return
      }

      // Real Supabase flow
      const { error: upsertError } = await supabase
        .from('profiles')
        .upsert(transformedData)

      if (upsertError) {
        console.error('Error upserting profile:', upsertError)
        throw upsertError
      }

      console.log('Profile saved successfully')
      onProfileComplete(transformedData)
    } catch (error: any) {
      console.error('Error saving profile:', error)
      alert(error.message || 'An error occurred while saving your profile')
    }
  }

  return (
    <Card className="w-full max-w-[600px] bg-white shadow-sm border border-gray-100 rounded-3xl">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-bold text-center text-gray-800">
          Tell Us About Yourself
        </CardTitle>
        <CardDescription className="text-center text-gray-600">
          Help us understand your needs to find the perfect therapist match
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                required
                className="rounded-2xl border-gray-200 focus:border-[#FF4D4D] focus:ring-[#FF4D4D] px-4 py-3"
              />
              <Input
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                placeholder="Age"
                required
                className="rounded-2xl border-gray-200 focus:border-[#FF4D4D] focus:ring-[#FF4D4D] px-4 py-3"
              />
            </div>

            <Select
              name="gender_identity"
              value={formData.gender_identity}
              onValueChange={(value) => handleSelectChange("gender_identity", value)}
              required
            >
              <SelectTrigger className="w-full rounded-2xl border-gray-200 focus:border-[#FF4D4D] focus:ring-[#FF4D4D] px-4 py-3">
                <SelectValue placeholder="Gender Identity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="non-binary">Non-binary</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>

            <Input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Location"
              required
              className="rounded-2xl border-gray-200 focus:border-[#FF4D4D] focus:ring-[#FF4D4D] px-4 py-3"
            />

            <Input
              name="cultural_background"
              value={formData.cultural_background}
              onChange={handleChange}
              placeholder="Cultural Background"
              className="rounded-2xl border-gray-200 focus:border-[#FF4D4D] focus:ring-[#FF4D4D] px-4 py-3"
            />

            <Select
              name="preferred_language"
              value={formData.preferred_language}
              onValueChange={(value) => handleSelectChange("preferred_language", value)}
              required
            >
              <SelectTrigger className="w-full rounded-2xl border-gray-200 focus:border-[#FF4D4D] focus:ring-[#FF4D4D] px-4 py-3">
                <SelectValue placeholder="Preferred Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="spanish">Spanish</SelectItem>
                <SelectItem value="mandarin">Mandarin</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-2 bg-gray-50 p-4 rounded-2xl">
              <Checkbox
                id="lgbtq_identity"
                name="lgbtq_identity"
                checked={formData.lgbtq_identity}
                onCheckedChange={(checked) => handleSelectChange("lgbtq_identity", checked)}
                className="rounded data-[state=checked]:bg-[#FF4D4D] data-[state=checked]:border-[#FF4D4D]"
              />
              <label htmlFor="lgbtq_identity" className="text-sm text-gray-600">
                LGBTQ+ Identity
              </label>
            </div>

            <Select
              name="relationship_status"
              value={formData.relationship_status}
              onValueChange={(value) => handleSelectChange("relationship_status", value)}
            >
              <SelectTrigger className="w-full rounded-2xl border-gray-200 focus:border-[#FF4D4D] focus:ring-[#FF4D4D] px-4 py-3">
                <SelectValue placeholder="Relationship Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="married">Married</SelectItem>
                <SelectItem value="divorced">Divorced</SelectItem>
                <SelectItem value="widowed">Widowed</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-2 bg-gray-50 p-4 rounded-2xl">
              <Checkbox
                id="has_children"
                name="has_children"
                checked={formData.has_children}
                onCheckedChange={(checked) => handleSelectChange("has_children", checked)}
                className="rounded data-[state=checked]:bg-[#FF4D4D] data-[state=checked]:border-[#FF4D4D]"
              />
              <label htmlFor="has_children" className="text-sm text-gray-600">
                Have Children
              </label>
            </div>

            <Input
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
              placeholder="Occupation"
              required
              className="rounded-2xl border-gray-200 focus:border-[#FF4D4D] focus:ring-[#FF4D4D] px-4 py-3"
            />

            <Textarea
              name="mental_health_conditions"
              value={formData.mental_health_conditions}
              onChange={handleChange}
              placeholder="Mental Health Conditions (comma-separated)"
              className="rounded-2xl border-gray-200 focus:border-[#FF4D4D] focus:ring-[#FF4D4D] px-4 py-3 min-h-[100px]"
            />

            <Textarea
              name="medications"
              value={formData.medications}
              onChange={handleChange}
              placeholder="Current Medications (comma-separated)"
              className="rounded-2xl border-gray-200 focus:border-[#FF4D4D] focus:ring-[#FF4D4D] px-4 py-3 min-h-[100px]"
            />

            <Select
              name="communication_style"
              value={formData.communication_style}
              onValueChange={(value) => handleSelectChange("communication_style", value)}
            >
              <SelectTrigger className="w-full rounded-2xl border-gray-200 focus:border-[#FF4D4D] focus:ring-[#FF4D4D] px-4 py-3">
                <SelectValue placeholder="Preferred Communication Style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="direct">Direct</SelectItem>
                <SelectItem value="gentle">Gentle</SelectItem>
                <SelectItem value="collaborative">Collaborative</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>

            <Input
              name="religious_beliefs"
              value={formData.religious_beliefs}
              onChange={handleChange}
              placeholder="Religious/Spiritual Beliefs"
              className="rounded-2xl border-gray-200 focus:border-[#FF4D4D] focus:ring-[#FF4D4D] px-4 py-3"
            />

            <Select
              name="session_format"
              value={formData.session_format}
              onValueChange={(value) => handleSelectChange("session_format", value)}
              required
            >
              <SelectTrigger className="w-full rounded-2xl border-gray-200 focus:border-[#FF4D4D] focus:ring-[#FF4D4D] px-4 py-3">
                <SelectValue placeholder="Preferred Session Format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in-person">In-person</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="phone">Phone</SelectItem>
                <SelectItem value="flexible">Flexible</SelectItem>
              </SelectContent>
            </Select>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                name="insurance"
                value={formData.insurance}
                onChange={handleChange}
                placeholder="Insurance Provider"
                required
                className="rounded-2xl border-gray-200 focus:border-[#FF4D4D] focus:ring-[#FF4D4D] px-4 py-3"
              />
              <Input
                name="budget"
                type="number"
                value={formData.budget}
                onChange={handleChange}
                placeholder="Budget per Session"
                required
                className="rounded-2xl border-gray-200 focus:border-[#FF4D4D] focus:ring-[#FF4D4D] px-4 py-3"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#FF4D4D] hover:bg-[#FF3333] text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-200 text-sm"
          >
            Complete Profile
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

