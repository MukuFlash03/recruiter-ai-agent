'use client'

import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Mic, Square } from 'lucide-react'

export function CandidateProfileComponent() {
  const [isRecording, setIsRecording] = useState(false)
  const [audioURL, setAudioURL] = useState('')
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const mediaRecorder = new MediaRecorder(stream)
    mediaRecorderRef.current = mediaRecorder
    audioChunksRef.current = []

    mediaRecorder.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data)
    }

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
      const audioUrl = URL.createObjectURL(audioBlob)
      setAudioURL(audioUrl)
    }

    mediaRecorder.start()
    setIsRecording(true)
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    } else {
      console.error('MediaRecorder is not initialized.')
    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Handle form submission here
    console.log('Form submitted')
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Candidate Profile</CardTitle>
        <CardDescription>Please fill out the following information to complete your candidate profile.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
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
              <SelectTrigger>
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

          <div className="space-y-2">
            <Label>Record Your Interview</Label>
            <div className="flex items-center space-x-2">
              {!isRecording ? (
                <Button type="button" onClick={startRecording}>
                  <Mic className="mr-2 h-4 w-4" /> Start Recording
                </Button>
              ) : (
                <Button type="button" variant="destructive" onClick={stopRecording}>
                  <Square className="mr-2 h-4 w-4" /> Stop Recording
                </Button>
              )}
            </div>
            {audioURL && (
              <audio controls src={audioURL} className="w-full mt-2">
                Your browser does not support the audio element.
              </audio>
            )}
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" className="w-full">Submit Profile</Button>
      </CardFooter>
    </Card>
  )
}