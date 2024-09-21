'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { PlusCircle, Trash2 } from "lucide-react"

export default function JobPostingForm() {
  const [questions, setQuestions] = useState<string[]>([''])

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
    console.log('Form submitted')
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Post a Job Opportunity</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
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
          <Label htmlFor="desiredCharacteristics">Desired Characteristics</Label>
          <Textarea id="desiredCharacteristics" placeholder="Describe the ideal candidate characteristics" />
        </div>

        <div className="flex items-center space-x-2">
          <Switch id="visaSponsorship" />
          <Label htmlFor="visaSponsorship">Visa Sponsorship Available</Label>
        </div>

        <div>
          <Label htmlFor="salaryRange">Salary Range</Label>
          <div className="flex space-x-2">
            <Input id="salaryMin" type="number" placeholder="Min" required />
            <Input id="salaryMax" type="number" placeholder="Max" required />
          </div>
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
                <Trash2 className="h-4 w-4" />
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
    </div>
  )
}