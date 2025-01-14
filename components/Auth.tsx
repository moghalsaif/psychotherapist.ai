import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Button } from "../src/components/ui/button"
import { Input } from "../src/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../src/components/ui/card"

export default function Auth() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin
        }
      })

      if (error) throw error
      
      setMessage({
        type: 'success',
        text: 'Check your email for the login link!'
      })
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'An error occurred during login'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-transparent border-0 shadow-none">
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Enter your email to get started"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-2xl border-gray-200 focus:border-[#FF4D4D] focus:ring-[#FF4D4D] bg-white text-sm"
            />
          </div>
          <Button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#FF4D4D] hover:bg-[#FF3333] text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                <span>Sending magic link...</span>
              </div>
            ) : (
              'Get Started Free'
            )}
          </Button>
          {message && (
            <div className={`p-3 rounded-xl text-sm ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message.text}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}

