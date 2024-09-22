'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Mic, Square, Play, Pause, Trash2 } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

const questions = [
  "Tell me a bit about yourself",
  "What are you looking for in your next role?",
  "Pick a project you are proud of and tell us why",
  "What's your biggest professional achievement?",
  "How do you handle challenging situations at work?"
]

export function Page() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [recordings, setRecordings] = useState(Array(questions.length).fill(null))
  const [isPlaying, setIsPlaying] = useState(false)
  const [timer, setTimer] = useState(0)
  const [playbackTime, setPlaybackTime] = useState(0)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current !== null) {
        clearInterval(timerIntervalRef.current as unknown as number)
      }
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  const startRecording = async () => {
    if (recordings[currentQuestion]) {
      deleteRecording()
    }
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
      setRecordings(prev => {
        const newRecordings = [...prev]
        newRecordings[currentQuestion] = { url: audioUrl, duration: timer }
        return newRecordings
      })
      setTimer(0)
    }

    mediaRecorder.start()
    setIsRecording(true)
    timerIntervalRef.current = setInterval(() => {
      setTimer(prevTimer => prevTimer + 1)
    }, 1000)
  }

  const stopRecording = () => {
    mediaRecorderRef.current?.stop()
    setIsRecording(false)
    clearInterval(timerIntervalRef.current as unknown as number)
  }

  const playRecording = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    const audio = new Audio(recordings[currentQuestion].url)
    audioRef.current = audio
    audio.play()
    setIsPlaying(true)
    setPlaybackTime(0)
    timerIntervalRef.current = setInterval(() => {
      setPlaybackTime(prevTime => prevTime + 1)
    }, 1000)
    audio.onended = () => {
      setIsPlaying(false)
      clearInterval(timerIntervalRef.current as unknown as number)
      setPlaybackTime(0)
    }
  }

  const pausePlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
      clearInterval(timerIntervalRef.current)
    }
  }

  const deleteRecording = () => {
    setRecordings(prev => {
      const newRecordings = [...prev]
      newRecordings[currentQuestion] = null
      return newRecordings
    })
    setPlaybackTime(0)
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    setIsPlaying(false)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setPlaybackTime(0)
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      setIsPlaying(false)
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setPlaybackTime(0)
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      setIsPlaying(false)
    }
  }

  const handleSubmit = () => {
    // Here you would typically send the recordings to your server
    // For this example, we'll just show a success message
    toast({
      title: "Interview Submitted",
      description: "Thank you for completing the interview!",
    })
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Candidate Interview</CardTitle>
        <CardDescription>Please answer the following questions by recording your responses.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-lg font-semibold">
          Question {currentQuestion + 1} of {questions.length}:
        </div>
        <div className="text-xl">{questions[currentQuestion]}</div>
        <div className="flex items-center space-x-2">
          {!isRecording ? (
            <Button onClick={startRecording}>
              <Mic className="mr-2 h-4 w-4" /> Start Recording
            </Button>
          ) : (
            <Button variant="destructive" onClick={stopRecording}>
              <Square className="mr-2 h-4 w-4" /> Stop Recording
            </Button>
          )}
          {recordings[currentQuestion] && (
            <Button variant="outline" onClick={isPlaying ? pausePlayback : playRecording}>
              {isPlaying ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
              {isPlaying ? 'Pause' : 'Play Recording'}
            </Button>
          )}
        </div>
        <div className="flex items-center justify-between text-sm font-medium">
          <div>
            {isRecording && `Recording: ${formatTime(timer)}`}
            {!isRecording && recordings[currentQuestion] && (
              <>
                {isPlaying ? `Playing: ${formatTime(playbackTime)}` : `Duration: ${formatTime(recordings[currentQuestion].duration)}`}
              </>
            )}
          </div>
          {recordings[currentQuestion] && (
            <Button variant="ghost" size="sm" onClick={deleteRecording}>
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {currentQuestion === 0? (
          <Link href="/candidate/123/profile">
            <Button>Back to Profile</Button>
          </Link>
        ) : (
          <Button onClick={prevQuestion}>Previous Question</Button>
        )}
        {/* <Button onClick={prevQuestion} disabled={currentQuestion === 0}>Previous Question</Button> */}
        {currentQuestion === questions.length - 1 ? (
          <Link href="/candidate/123">
            <Button onClick={handleSubmit}>Submit</Button>
          </Link>
        ) : (
          <Button onClick={nextQuestion}>Next Question</Button>
        )}
      </CardFooter>
    </Card>
  )
}