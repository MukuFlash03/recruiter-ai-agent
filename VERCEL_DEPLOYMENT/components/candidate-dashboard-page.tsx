'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { UserCircle } from "lucide-react"

// Mock API call
const fetchJobs = async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  return [
    { id: 1, title: 'Software Engineer', company: 'Tech Co' },
    { id: 2, title: 'Product Manager', company: 'Startup Inc' },
    { id: 3, title: 'Data Scientist', company: 'Big Data Corp' },
  ]
}

// Mock profile check
const checkProfileComplete = async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500))
  return true // Change this to true to simulate a completed profile
}

export function Page() {
  const [profileComplete, setProfileComplete] = useState<boolean | null>(null)
  const [jobs, setJobs] = useState<Array<{ id: number; title: string; company: string }>>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const initializeDashboard = async () => {
      const isProfileComplete = await checkProfileComplete()
      setProfileComplete(isProfileComplete)

      if (isProfileComplete) {
        const jobListings = await fetchJobs()
        setJobs(jobListings)
      }
      setLoading(false)
    }

    initializeDashboard()
  }, [])

  const handleRefreshJobs = async () => {
    setLoading(true)
    const jobListings = await fetchJobs()
    setJobs(jobListings)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome Mukul</h1>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>
            {profileComplete
              ? "Your profile is complete. You're ready to explore job opportunities!"
              : "Complete your profile to unlock exciting job opportunities."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {profileComplete ? (
            <Button asChild>
              <Link href="/view-profile">View Profile</Link>
            </Button>
          ) : (
            <Alert variant="default" className="bg-blue-50 border-blue-200">
              <UserCircle className="h-4 w-4 text-blue-500" />
              <AlertTitle className="text-blue-700">Start Your Journey</AlertTitle>
              <AlertDescription className="text-blue-600">
                Take the first step towards your dream job.{' '}
                <Link href="/candidate/123/profile" className="font-medium underline underline-offset-4">
                  Start your profile now
                </Link>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
      {profileComplete && (
        <Card>
          <CardHeader>
            <CardTitle>Job Listings</CardTitle>
            <CardDescription>Here are some jobs that match your profile</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {jobs.map((job) => (
                <li key={job.id} className="p-2 bg-muted rounded">
                  <h3 className="font-semibold">{job.title}</h3>
                  <p className="text-sm text-muted-foreground">{job.company}</p>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button onClick={handleRefreshJobs} disabled={loading}>
              {loading ? 'Refreshing...' : 'Refresh Jobs'}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}