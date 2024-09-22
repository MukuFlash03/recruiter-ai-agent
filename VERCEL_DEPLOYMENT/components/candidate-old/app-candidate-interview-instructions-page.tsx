'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle, Video } from 'lucide-react'

export function Page() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Video Interview Instructions</h1>
      <Card className="p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Before You Begin</h2>
        <ul className="space-y-2 mb-6">
          <li className="flex items-start">
            <CheckCircle className="mr-2 mt-1 text-green-500" />
            <span>Ensure you are in a quiet, well-lit environment</span>
          </li>
          <li className="flex items-start">
            <CheckCircle className="mr-2 mt-1 text-green-500" />
            <span>Test your camera and microphone</span>
          </li>
          <li className="flex items-start">
            <CheckCircle className="mr-2 mt-1 text-green-500" />
            <span>Prepare to speak for 2-3 minutes</span>
          </li>
          <li className="flex items-start">
            <CheckCircle className="mr-2 mt-1 text-green-500" />
            <span>Have a copy of your resume nearby for reference</span>
          </li>
        </ul>
        <h2 className="text-xl font-semibold mb-4">During the Interview</h2>
        <ul className="space-y-2 mb-6">
          <li className="flex items-start">
            <CheckCircle className="mr-2 mt-1 text-green-500" />
            <span>Introduce yourself briefly</span>
          </li>
          <li className="flex items-start">
            <CheckCircle className="mr-2 mt-1 text-green-500" />
            <span>Discuss your relevant experience and skills</span>
          </li>
          {/* <li className="flex items-start">
            <CheckCircle className="mr-2 mt-1 text-green-500" />
            <span>Explain why you're interested in this position</span>
          </li> */}
          <li className="flex items-start">
            <CheckCircle className="mr-2 mt-1 text-green-500" />
            <span>Share what makes you a unique candidate</span>
          </li>
        </ul>
        <p className="text-sm text-gray-500 mb-4">
          Remember, you can pause and resume the recording if needed. Take your time and speak clearly.
        </p>
      </Card>
      <div className="flex justify-between">
        <Link href="/candidate">
          <Button variant="outline">Back to Profile</Button>
        </Link>
        <Link href="/candidate/interview/start">
          <Button>
            <Video className="mr-2" />
            Start Video Interview
          </Button>
        </Link>
      </div>
    </div>
  )
}