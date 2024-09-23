'use client'

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ArrowRight, CheckCircle, UserCircle, X } from "lucide-react"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

// Mock API call
const fetchJobs = async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  return [
    {
      id: 1,
      title: 'Full-Stack Engineer',
      company: 'Fetch.ai',
      link: 'https://wellfound.com/jobs/3086730-full-stack-engineer-node-typescript-react',
      summary: 'Develop, deploy, and orchestrate multi-agent systems in an open AI Agents marketplace.',
      tags: ['React', 'Node.js', 'TypeScript'],
      status: 'New'
    },
    {
      id: 2,
      title: 'Software Engineer, Developer Experience',
      company: 'Groq',
      link: 'https://groq.com/careers/?gh_jid=5993550003',
      summary: 'Ship code daily to improve the suite of APIs that >200k developers use to build fast AI applications.',
      tags: ['System Optimization', 'Software Development'],
      status: 'New'
    },
    {
      id: 3,
      title: 'Software Engineer',
      company: 'Vectara',
      link: 'https://job-boards.greenhouse.io/vectara/jobs/4040538008',
      summary: 'Apply machine learning to solve complex business problems.',
      tags: ['Java', 'Linux', 'Docker', 'Kubernetes'],
      status: 'New'
    },
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
  const [activeJobs, setActiveJobs] = useState<Array<any>>([])
  const [withdrawnJobs, setWithdrawnJobs] = useState<Array<any>>([])
  const [loading, setLoading] = useState(true)
  const [selectedJob, setSelectedJob] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const initializeDashboard = async () => {
      const isProfileComplete = await checkProfileComplete()
      setProfileComplete(isProfileComplete)

      if (isProfileComplete) {
        const jobListings = await fetchJobs()
        setActiveJobs(jobListings)
      }
      setLoading(false)
    }

    initializeDashboard()
  }, [])

  const handleRefreshJobs = async () => {
    setLoading(true)
    const jobListings = await fetchJobs()
    setActiveJobs(jobListings)
    setLoading(false)
  }

  const handleMoveForward = (job: any) => {
    setSelectedJob(job)
  }

  const confirmMoveForward = () => {
    if (selectedJob) {
      setActiveJobs(activeJobs.map(job =>
        job.id === selectedJob.id ? { ...job, status: 'Next Step: Technical Screen' } : job
      ))
      setSelectedJob(null)
    }
  }

  const handleWithdraw = (jobId: number) => {
    const job = activeJobs.find(job => job.id === jobId)
    if (job) {
      setWithdrawnJobs([...withdrawnJobs, { ...job, status: 'Withdrawn' }])
      setActiveJobs(activeJobs.filter(job => job.id !== jobId))
    }
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
      <h1 className="text-2xl font-bold mb-4">Welcome Sanya</h1>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>
            {profileComplete
              ? "Your profile is complete. Your interview avatar will be automatically entered for top Job Opportunities"
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
        <>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Matched Job Opportunities</CardTitle>
              <CardDescription>Your avatar has passed the recruiter screen for these positions</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {activeJobs.map((job) => (
                  <li key={job.id} className="p-4 bg-muted rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">
                          <Link href={job.link} className="hover:underline">
                            {job.title}
                          </Link>
                        </h3>
                        <p className="text-primary font-medium">{job.company}</p>
                        <p className="text-sm text-muted-foreground mt-1">{job.summary}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {job.tags.map((tag: string, index: number) => (
                            <Badge key={index} variant="secondary" className="bg-secondary text-secondary-foreground">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Badge variant={job.status === 'Next Step: Technical Screen' ? 'default' : 'secondary'} className={job.status === 'Next Step: Technical Screen' ? 'bg-primary text-primary-foreground' : ''}>
                        {job.status}
                      </Badge>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      {job.status !== 'Next Step: Technical Screen' && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button onClick={() => handleMoveForward(job)} size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                              <ArrowRight className="h-4 w-4 mr-2" />
                              Move Forward
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Next Steps for {job.title} at {job.company}</DialogTitle>
                              <DialogDescription>
                                You&apos;re about to move forward with this opportunity. Here&apos;s what happens next:
                              </DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                              <ol className="list-decimal list-inside space-y-2">
                                <li>Your interest will be communicated to the employer</li>
                                <li>The employer will review your profile</li>
                                <li>If there&apos;s a match, we&apos;ll schedule an initial interview</li>
                                <li>You&apos;ll receive preparation materials for the interview</li>
                                <li>After the interview, both parties will provide feedback</li>
                              </ol>
                            </div>
                            <DialogFooter>
                              <Button onClick={confirmMoveForward} className="bg-primary text-primary-foreground hover:bg-primary/90">
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Confirm and Proceed
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}
                      <Button
                        onClick={() => handleWithdraw(job.id)}
                        variant={job.status === 'Next Step: Technical Screen' ? 'outline' : 'secondary'}
                        size="sm"
                        className={job.status === 'Next Step: Technical Screen' ? 'text-muted-foreground' : ''}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Withdraw Application
                      </Button>
                    </div>
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
          {withdrawnJobs.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Withdrawn Applications</CardTitle>
                <CardDescription>Jobs you&apos;ve withdrawn your application from</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {withdrawnJobs.map((job) => (
                    <li key={job.id} className="p-4 bg-muted rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">
                            <Link href={`/job/${job.id}`} className="hover:underline">
                              {job.title}
                            </Link>
                          </h3>
                          <p className="text-primary font-medium">{job.company}</p>
                          <p className="text-sm text-muted-foreground mt-1">{job.summary}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {job.tags.map((tag: string, index: number) => (
                              <Badge key={index} variant="secondary" className="bg-secondary text-secondary-foreground">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Badge variant="outline">{job.status}</Badge>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}