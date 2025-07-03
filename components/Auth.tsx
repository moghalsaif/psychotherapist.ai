import { useState } from 'react'
import { Card, CardContent } from "./ui/card"
import { Input } from "./ui/input"
import { Button } from "./ui/button"

export default function Auth() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    
    try {
      // Demo mode simulation
      console.log('Demo mode: Simulating login success')
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Create a demo session
      const demoUser = {
        id: 'demo-user-123',
        email: email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        app_metadata: {},
        user_metadata: { email },
        aud: 'authenticated',
        role: 'authenticated'
      }
      
      // Save demo session
      localStorage.setItem('demo-session', JSON.stringify({
        user: demoUser,
        access_token: 'demo-token',
        expires_at: Date.now() + 3600000 // 1 hour from now
      }))
      
      setMessage({
        type: 'success',
        text: 'Demo mode: Login successful! Redirecting...'
      })
      
      // Reload the page to trigger auth state check
      setTimeout(() => window.location.reload(), 2000)
      
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
        <div className="mb-4 p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-sm">
          <strong>Demo Mode:</strong> Enter any email to try the app with demo data
        </div>
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
                <span>Logging in...</span>
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

