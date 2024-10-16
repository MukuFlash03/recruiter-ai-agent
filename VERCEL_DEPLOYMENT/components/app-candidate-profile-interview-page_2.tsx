'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { saveAudio } from "@/lib/utils/api_calls"
import { Mic, Pause, Play, Square, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

const questions = [
  "Tell me a bit about yourself",
  "What are you looking for in your next role?",
  "Pick a project you are proud of and tell us why",
  "What's your biggest professional achievement?",
  "How do you handle challenging situations at work?"
]

// export async function CandidateInterviewPage({ candidate_id }: { candidate_id: string }) {
export default function CandidateInterviewPage({ candidate_id }: { candidate_id: string }) {
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

  const router = useRouter()

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

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const mediaRecorder = new MediaRecorder(stream)
        mediaRecorderRef.current = mediaRecorder
        audioChunksRef.current = []

        mediaRecorder.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data)
        }

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
          const audioUrl = URL.createObjectURL(audioBlob)
          const newRecording = { url: audioUrl, duration: timer }

          setRecordings(prev => {
            const newRecordings = [...prev]
            newRecordings[currentQuestion] = newRecording
            return newRecordings
          })

          // Save only the first recording to the server
          if (currentQuestion === 0) {
            const reader = new FileReader()
            reader.onloadend = () => {
              const base64AudioMessage = reader.result
              saveAudio(base64AudioMessage?.toString() || '')
                .then(response => {
                  console.log('File saved successfully:', response)
                })
                .catch(error => {
                  console.error('Error saving audio:', error)
                })
            }
            reader.readAsDataURL(audioBlob)
          }

          setTimer(0)
        }

        mediaRecorder.start()
        setIsRecording(true)
        timerIntervalRef.current = setInterval(() => {
          setTimer(prevTimer => prevTimer + 1)
        }, 1000)
      })
      .catch(error => {
        console.error('Error accessing microphone:', error)
        toast({
          title: "Error",
          description: "Unable to access microphone. Please check your permissions.",
          variant: "destructive",
        })
      })
  }

  /*
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
  const mediaRecorder = new MediaRecorder(stream)
  mediaRecorderRef.current = mediaRecorder
  audioChunksRef.current = []

  mediaRecorder.ondataavailable = (event) => {
    audioChunksRef.current.push(event.data)
  }

  mediaRecorder.onstop = async () => {
    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
    const audioUrl = URL.createObjectURL(audioBlob)
    const newRecording = { url: audioUrl, duration: timer }

    setRecordings(prev => {
      const newRecordings = [...prev]
      newRecordings[currentQuestion] = newRecording
      return newRecordings
    })

    // Save only the first recording to the server
    if (currentQuestion === 0) {
      const reader = new FileReader()
      reader.onloadend = async () => {
        const base64AudioMessage = reader.result
        try {

          const response = await saveAudio(base64AudioMessage?.toString() || '')
          console.log('File saved successfully:', response)
          // router.push(`/candidate/${candidate_id}`)
        } catch (error) {
          console.error('Error saving audio:', error)
        }
      }
      reader.readAsDataURL(audioBlob)
    }

    setTimer(0)
  }

  mediaRecorder.start()
  setIsRecording(true)
  timerIntervalRef.current = setInterval(() => {
    setTimer(prevTimer => prevTimer + 1)
  }, 1000)
}
*/

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
      clearInterval(timerIntervalRef.current ?? undefined)
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

  /*
  const handleSubmit = async () => {
    // Here you would typically send the recordings to your server
    try {
      const response = await fetch("/api/update-audio-text", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log("Profile saved successfully");

      } else {
        throw new Error("Failed to save profile");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile. Please try again.");
    }

    // For this example, we'll just show a success message
    toast({
      title: "Interview Submitted",
      description: "Thank you for completing the interview!",
    })
  }
  */

  const handleSubmit = () => {
    fetch("/api/update-audio-text", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (response.ok) {
          console.log("Profile saved successfully")
          toast({
            title: "Interview Submitted",
            description: "Thank you for completing the interview!",
          })
        } else {
          throw new Error("Failed to save profile")
        }
      })
      .catch(error => {
        console.error("Error saving profile:", error)
        toast({
          title: "Error",
          description: "Failed to save profile. Please try again.",
          variant: "destructive",
        })
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
        {currentQuestion === 0 ? (
          <Link href={`/candidate/${candidate_id}/profile`}>
            <Button>Back to Profile</Button>
          </Link>
        ) : (
          <Button onClick={prevQuestion}>Previous Question</Button>
        )}
        {/* <Button onClick={prevQuestion} disabled={currentQuestion === 0}>Previous Question</Button> */}
        {currentQuestion === questions.length - 1 ? (
          <Link href={`/candidate/${candidate_id}`}>
            <Button onClick={handleSubmit}>Submit</Button>
          </Link>
        ) : (
          <Button onClick={nextQuestion}>Next Question</Button>
        )}
      </CardFooter>
    </Card>
  )
}