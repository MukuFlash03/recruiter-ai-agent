'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function Page() {
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Candidate Profile</CardTitle>
        <CardDescription>Please fill out the following information to complete your candidate profile.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="resume">Resume</Label>
            <Input id="resume" type="file" accept=".pdf,.doc,.docx" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedin">LinkedIn Profile URL</Label>
            <Input id="linkedin" type="url" placeholder="https://www.linkedin.com/in/yourprofile" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Current Location</Label>
            <Input id="location" type="text" placeholder="City, Country" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="additional-files">Additional Files</Label>
            <Input id="additional-files" type="file" multiple />
          </div>

          <div className="space-y-2">
            <Label htmlFor="work-preference">Preferred Work Environment</Label>
            <Select>
              <SelectTrigger id="work-preference">
                <SelectValue placeholder="Select your preference" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="office">In-office</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="salary-expectation">Salary Expectation (Annual)</Label>
            <Input id="salary-expectation" type="number" placeholder="Enter amount in USD" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="additional-info">Additional Information</Label>
            <Textarea id="additional-info" placeholder="Tell us more about yourself and your career goals" />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button type="submit">Save Profile</Button>
        <Link href="/candidate/interview">
          <Button variant="outline">Continue to Interview</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}