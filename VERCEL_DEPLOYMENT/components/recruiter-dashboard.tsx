'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { signout } from "@/lib/auth-action"
import { JobPostingData, SelectedJobsResponse } from "@/lib/types/jobs"
import { fetchJobPostings, insertJobPostings } from '@/lib/utils/api_calls'
import { createClient } from "@/lib/utils/supabase/client"
import { PlusCircle, X } from "lucide-react"
import Link from 'next/link'
import { useRouter } from "next/navigation"
import { useEffect, useState } from 'react'

export function RecruiterDashboardComponent() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isNewJobModalOpen, setIsNewJobModalOpen] = useState(false)
  const [jobPostingsData, setJobPostingsData] = useState<SelectedJobsResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyURL, setCompanyURL] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [requiredSkills, setRequiredSkills] = useState('');
  const [questions, setQuestions] = useState<string[]>(['']);
  const [characteristicValues, setCharacteristicValues] = useState('');

  const [processingJobs, setProcessingJobs] = useState<Set<string>>(new Set());

  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    // if (!user) {
    //   router.push('/login');
    // }

    console.log("Inside useEffect");
    console.log("User:", user);


    const loadData = async () => {
      try {
        const data = await fetchJobPostings();
        console.log("Data in Recruiter dash useEffect:", data);
        setJobPostingsData(data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch job postings data');
        setLoading(false);
      }
    };

    fetchUser();
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const formData: JobPostingData = {
      jobTitle,
      companyName,
      companyURL,
      jobDescription,
      requiredSkills,
      questions: questions.filter(q => q.trim() !== ''),
      characteristicValues,
    };

    console.log('Form data to be submitted:', formData);

    try {
      const data_2 = await insertJobPostings(formData);
      console.log('Response from insertJobPostings:', data_2);

      const data = await fetchJobPostings();
      setJobPostingsData(data.data);
      setLoading(false);

      console.log('New job posting submitted')

      // Reset form fields
      setJobTitle('');
      setCompanyName('');
      setCompanyURL('');
      setJobDescription('');
      setRequiredSkills('');
      setQuestions(['']);
      setCharacteristicValues('');
    } catch (err) {
      setError('Failed to insert job postings data');
      setLoading(false);
    }

    setIsNewJobModalOpen(false)
  }

  const startMatchingProcess = async (jobId: string, recruiter_id: string) => {
    console.log("Inside startMatchingProcess onClick for jobId:", jobId);

    setProcessingJobs(prev => new Set(prev).add(jobId));
    console.log("Processing jobs set:", processingJobs);

    console.log("Before fetching job postings data via API route");

    try {
      const response = await fetch('/api/start-candidate-matching', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId, recruiter_id }),
      });
      if (!response.ok) throw new Error('Failed to start matching process');
    } catch (error) {
      console.error('Error starting matching process:', error);
    } finally {
      setProcessingJobs(prev => {
        const newSet = new Set(prev);
        newSet.delete(jobId);
        return newSet;
      });
    }

    console.log("After fetching job postings data via API route");
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Recruiter Dashboard</h1>
        <Button size="lg" variant="outline" className="w-full sm:w-auto group"
          onClick={async () => {
            await signout();
            setUser(null);
          }}
        >
          Log out
        </Button>
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
                <Input
                  id="jobTitle"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Senior React Developer"
                  required
                />
                {/* <Input id="jobTitle" placeholder="e.g. Senior React Developer" required /> */}
              </div>
              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Your Company Name"
                  required
                />
                {/* <Input id="companyName" placeholder="Your Company Name" required /> */}
              </div>
              <div>
                <Label htmlFor="companyURL">Company URL</Label>
                <Input
                  id="companyURL"
                  value={companyURL}
                  onChange={(e) => setCompanyURL(e.target.value)}
                  placeholder="Your Company URL"
                  required
                />
                {/* <Input id="companyURL" placeholder="Your Company Name" required /> */}
              </div>
              <div>
                <Label htmlFor="jobDescription">Job Description</Label>
                <Textarea
                  id="jobDescription"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Describe the job role and responsibilities"
                  required
                />
                {/* <Textarea id="jobDescription" placeholder="Describe the job role and responsibilities" required /> */}
              </div>
              <div>
                <Label htmlFor="requiredSkills">Required Skills</Label>
                <Textarea
                  id="requiredSkills"
                  value={requiredSkills}
                  onChange={(e) => setRequiredSkills(e.target.value)}
                  placeholder="List the required skills and qualifications"
                  required
                />
                {/* <Textarea id="requiredSkills" placeholder="List the required skills and qualifications" required /> */}
              </div>
              <div>
                <Label htmlFor="characteristicValues">Characteristic Values</Label>
                <Textarea
                  id="characteristicValues"
                  value={characteristicValues}
                  onChange={(e) => setCharacteristicValues(e.target.value)}
                  placeholder="Describe the company's core principles and values"
                  required
                />
                {/* <Textarea id="characteristicValues" placeholder="Describe the company's core princicples and values" required /> */}
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
                  {/* <p>5 top candidates</p> */}
                  <div className="flex justify-end mt-2 space-x-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startMatchingProcess(job.job_id.toString(), user.id)}
                      disabled={processingJobs.has(job.job_id.toString())}
                    >
                      {processingJobs.has(job.job_id.toString()) ? 'Processing...' : 'Fetch Matching Candidates'}
                    </Button>
                    {job.analysis_status && user ? (
                      <Link href={`/recruiter/${user.id}/jobs/${job.job_id}/results`}>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                    ) : (
                      <Button variant="outline" size="sm" disabled>
                        View Details
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}