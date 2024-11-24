import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { HomeIcon } from "lucide-react"

interface AuthFormProps {
  type: 'login' | 'signup'
}

export function Login({ type }: AuthFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', { email, password, confirmPassword })
  }

  return (
    <div className="bg-black min-h-screen">
      <div className="absolute top-8 left-8"> {/* Increased spacing from edges */}
        <Link to="/">
          <Button variant="ghost" className="text-white hover:text-white/80 p-8">
          <HomeIcon style={{ width: '25px', height: '25px' }} />
          </Button>
        </Link>
      </div>

      <div className='flex h-screen place-items-center justify-center'>
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>{type === 'login' ? 'Login' : 'Sign Up'}</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {type === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full">
                {type === 'login' ? 'Login' : 'Sign Up'}
              </Button>
              <p className="text-sm text-center text-gray-600">
                {type === 'login' ? "Don't have an account? " : "Already have an account? "}
                <Link
                  to={type === 'login' ? "/signup" : "/login"}
                  className="text-primary hover:underline"
                >
                  {type === 'login' ? 'Sign up' : 'Login'}
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}