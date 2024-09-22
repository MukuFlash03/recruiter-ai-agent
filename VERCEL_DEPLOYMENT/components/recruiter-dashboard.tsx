'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { SelectedJobsResponse } from "@/lib/types/jobs"
import { fetchJobPostings } from '@/lib/utils/api_calls'
import { PlusCircle, X } from "lucide-react"
import Link from 'next/link'
import { useEffect, useState } from 'react'

// Placeholder data
const jobPostings = [
  { id: 1, title: "Senior React Developer", company: "TechCorp", applicants: 15 },
  { id: 2, title: "UX Designer", company: "DesignHub", applicants: 8 },
  { id: 3, title: "Product Manager", company: "InnovateCo", applicants: 12 },
]

const topCandidates = [
  { id: 1, name: "Alice Johnson", jobTitle: "Senior React Developer", matchPercentage: 95 },
  { id: 2, name: "Bob Smith", jobTitle: "UX Designer", matchPercentage: 92 },
  { id: 3, name: "Charlie Brown", jobTitle: "Product Manager", matchPercentage: 88 },
]

export function RecruiterDashboardComponent() {
  const [activeTab, setActiveTab] = useState("overview")
  const [questions, setQuestions] = useState<string[]>([''])
  const [isNewJobModalOpen, setIsNewJobModalOpen] = useState(false)
  const [jobPostingsData, setJobPostingsData] = useState<SelectedJobsResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchJobPostings();
        setJobPostingsData(data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch jon postings data');
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const addQuestion = () => {
    setQuestions([...questions, ''])
  }

  const removeQuestion = (index: number) => {
    const newQuestions = questions.filter((_, i) => i !== index)
    setQuestions(newQuestions)
  }

  const handleQuestionChange = (index: number, value: string) => {
    const newQuestions = [...questions]
    newQuestions[index] = value
    setQuestions(newQuestions)
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    // Here you would typically send the form data to your backend
    console.log('New job posting submitted')
    setIsNewJobModalOpen(false)
    setQuestions(['']) // Reset questions after submission
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Recruiter Dashboard</h1>
        <Dialog open={isNewJobModalOpen} onOpenChange={setIsNewJobModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Job
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Job Posting</DialogTitle>
              <DialogDescription>Fill in the details for a new job opportunity</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input id="jobTitle" placeholder="e.g. Senior React Developer" required />
              </div>
              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input id="companyName" placeholder="Your Company Name" required />
              </div>
              <div>
                <Label htmlFor="jobDescription">Job Description</Label>
                <Textarea id="jobDescription" placeholder="Describe the job role and responsibilities" required />
              </div>
              <div>
                <Label htmlFor="requiredSkills">Required Skills</Label>
                <Textarea id="requiredSkills" placeholder="List the required skills and qualifications" required />
              </div>
              <div>
                <Label>Custom Questions for Candidates</Label>
                {questions.map((question, index) => (
                  <div key={index} className="flex items-center space-x-2 mt-2">
                    <Input
                      value={question}
                      onChange={(e) => handleQuestionChange(index, e.target.value)}
                      placeholder={`Question ${index + 1}`}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeQuestion(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addQuestion} className="mt-2">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Question
                </Button>
              </div>
              <Button type="submit" className="w-full">Post Job</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {/* <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="candidates">Top Candidates</TabsTrigger>
        </TabsList>
        <TabsContent value="overview"> */}
          <Card>
            <CardHeader>
              <CardTitle>Your Job Postings</CardTitle>
              <CardDescription>View and manage your current job postings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* {jobPostings.map((job) => ( */}
                {jobPostingsData.map((job) => (
                  <Card key={job.job_id}>
                    <CardHeader>
                      <CardTitle>{job.job_title}</CardTitle>
                      <CardDescription>{job.company_name}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {/* TODO: Replace with actual selected top candidates from True count from interviews table in database */}
                      {/* <p>{job.applicants} applicants</p> */}
                      <p>5 top candidates</p>
                      <div className="flex justify-end mt-2">
                        <Link href={`/recruiter/jobs/${job.job_id}/results`}>
                          <Button variant="outline" size="sm">View Details</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        {/* </TabsContent> */}
        {/* <TabsContent value="candidates">
          <Card>
            <CardHeader>
              <CardTitle>Top Candidates</CardTitle>
              <CardDescription>View the best matches for your job postings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topCandidates.map((candidate) => (
                  <Card key={candidate.id}>
                    <CardHeader>
                      <CardTitle>{candidate.name}</CardTitle>
                      <CardDescription>{candidate.jobTitle}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>Match: {candidate.matchPercentage}%</p>
                      <div className="flex justify-end mt-2">
                        <Button variant="outline" size="sm">View Profile</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs> */}
    </div>
  )
}