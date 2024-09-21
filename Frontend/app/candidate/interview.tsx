'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Video, Pause, StopCircle } from 'lucide-react'
import Link from 'next/link'

export default function VideoInterview() {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [timer, setTimer] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1)
      }, 1000)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isRecording, isPaused])

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = time % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setIsRecording(true)
      setIsPaused(false)
    } catch (err) {
      console.error("Error accessing media devices:", err)
    }
  }

  const pauseRecording = () => {
    setIsPaused(!isPaused)
  }

  const stopRecording = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
    }
    setIsRecording(false)
    setIsPaused(false)
    setTimer(0)
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Link href="/candidate/interview-instructions" className="flex items-center text-blue-500 hover:text-blue-700 mb-6">
        <ArrowLeft className="mr-2" /> Back to Instructions
      </Link>
      <h1 className="text-3xl font-bold mb-6">Video Interview</h1>
      <Card className="p-6">
        <div className="aspect-video bg-gray-200 mb-4 rounded-lg overflow-hidden">
          {isRecording ? (
            <video ref={videoRef} autoPlay muted className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Video size={48} className="text-gray-400" />
            </div>
          )}
        </div>
        <div className="flex justify-between items-center mb-4">
          <div className="text-2xl font-mono">{formatTime(timer)}</div>
          <div className="space-x-4">
            {!isRecording ? (
              <Button onClick={startRecording}>Start Recording</Button>
            ) : (
              <>
                <Button onClick={pauseRecording} variant="outline">
                  {isPaused ? <Video className="mr-2" /> : <Pause className="mr-2" />}
                  {isPaused ? 'Resume' : 'Pause'}
                </Button>
                <Button onClick={stopRecording} variant="destructive">
                  <StopCircle className="mr-2" /> Stop Recording
                </Button>
              </>
            )}
          </div>
        </div>
        <p className="text-sm text-gray-500">
          Remember to introduce yourself, discuss your experience, and explain why you're interested in this position. Aim for 2-3 minutes.
        </p>
      </Card>
    </div>
  )
}