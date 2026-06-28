import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Sparkles, Zap, Github } from 'lucide-react'

interface ApiResponse {
  message: string
  timestamp: string
}

function App() {
  const [apiData, setApiData] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchFromApi = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/hello')
      const data = await response.json()
      setApiData(data)
    } catch (error) {
      console.error('Error fetching from API:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFromApi()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
            Bun + React + TypeScript + Vite
          </h1>
          <p className="text-xl text-slate-600 mb-2">
            + ShadCN + Tailwind v4 + Elysia
          </p>
          <p className="text-sm text-slate-500">
            A modern fullstack template for blazing-fast development
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                Lightning Fast
              </CardTitle>
              <CardDescription>
                Built on Bun runtime for incredible speed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">
                Experience sub-millisecond startup times and blazing-fast hot
                module replacement with Vite and Bun.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                Modern Stack
              </CardTitle>
              <CardDescription>
                Latest technologies, best practices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">
                React 18, TypeScript, Tailwind v4, ShadCN UI, and Elysia
                framework all working together seamlessly.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Github className="w-5 h-5" />
                Type Safe
              </CardTitle>
              <CardDescription>End-to-end type safety</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">
                TypeScript configured for both frontend and backend, ensuring
                type safety across your entire stack.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>API Connection Test</CardTitle>
            <CardDescription>
              Testing the connection between React frontend and Elysia backend
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : apiData ? (
              <div className="space-y-2">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm font-medium text-green-900">
                    ✓ Connected to backend successfully!
                  </p>
                  <p className="text-sm text-green-700 mt-2">
                    <strong>Message:</strong> {apiData.message}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    <strong>Timestamp:</strong> {apiData.timestamp}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-900">
                  Failed to connect to backend. Make sure the server is running.
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={fetchFromApi} disabled={loading} className="w-full">
              {loading ? 'Loading...' : 'Refresh API Data'}
            </Button>
          </CardFooter>
        </Card>

        <div className="text-center mt-12 text-sm text-slate-500">
          <p>
            Edit <code className="bg-slate-200 px-2 py-1 rounded">src/App.tsx</code> to get started
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
