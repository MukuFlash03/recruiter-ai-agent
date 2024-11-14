'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { saveAudio } from "@/lib/utils/api_calls"
import { createClient } from "@/lib/utils/supabase/client"
import { Mic, Pause, Play, Square, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { redirect, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

const questions = [
  "Tell me a bit about yourself",
  "What are you looking for in your next role?",
  "Pick a project you are proud of and tell us why",
  "What's your biggest professional achievement?",
  "How do you handle challenging situations at work?"
]

export default function CandidateInterviewPage({ candidate_id }: { candidate_id: string }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [recordings, setRecordings] = useState(Array(questions.length).fill(null))
  const [isPlaying, setIsPlaying] = useState(false)
  const [timer, setTimer] = useState(0)
  const [playbackTime, setPlaybackTime] = useState(0)
  const [user, setUser] = useState<any>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { toast } = useToast()

  const router = useRouter()

  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return redirect('/login');
      }

      console.log(user);
      setUser(user);
    };

    fetchUser();

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

  const startRecording = () => {
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

        /* 
        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
          const audioUrl = URL.createObjectURL(audioBlob)
          const newRecording = { url: audioUrl, duration: timer }

          setRecordings(prev => {
            const newRecordings = [...prev]
            newRecordings[currentQuestion] = newRecording
            console.log(`New recordings during question ${currentQuestion}`);
            console.log(newRecordings);
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
        */

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
          const audioUrl = URL.createObjectURL(audioBlob)

          const reader = new FileReader()
          reader.onloadend = () => {
            const base64AudioMessage = reader.result?.toString() || ''

            /*
            setRecordings(prev => {
              const newRecordings = [...prev]
              newRecordings[currentQuestion] = {
                url: audioUrl,
                duration: timer,
                base64: base64AudioMessage
              }
              return newRecordings
            })
            */

            saveAudio(base64AudioMessage, currentQuestion)
              .then(response => {
                console.log(`File for question ${currentQuestion} saved successfully:`, response)
                setRecordings(prev => {
                  const newRecordings = [...prev]
                  newRecordings[currentQuestion] = {
                    url: audioUrl,
                    duration: timer,
                    fileName: response.fileName
                  }
                  return newRecordings
                })
              })
              .catch(error => {
                console.error(`Error saving audio for question ${currentQuestion}:`, error)
              })
          }
          reader.readAsDataURL(audioBlob)
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

  const formatTime = (seconds: number) => {
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

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    // router.push(`/candidate/${candidate_id}/`);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return
    setIsSubmitting(true)

    // const audioTexts = recordings.map(recording => recording?.base64 || null);
    const audioFileNames = recordings.map(recording => recording?.fileName || null);

    try {
      const response = await fetch("/api/update-audio-text", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        // body: JSON.stringify({ audioTexts }),
        body: JSON.stringify({ audioFileNames }),
      })

      if (response.ok) {
        console.log("Profile saved successfully with interview QnA")
        toast({
          title: "Interview Submitted",
          description: "Thank you for completing the interview!",
        })
        setShowConfirmation(true);
        setTimeout(() => {
          setShowConfirmation(false);
          // router.push(`/candidate/${candidate_id}/`);
        }, 3000);
      } else {
        throw new Error("Failed to save profile with interview QnA")
      }
    } catch (error) {
      console.error("Error saving profile with interview QnA:", error)
      // alert("Failed to save profile with interview QnA. Please try again.")
      toast({
        title: "Error",
        description: "Failed to save profile with interview QnA. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  };

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
        {currentQuestion === questions.length - 1 ? (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        ) : (
          <Button onClick={nextQuestion}>Next Question</Button>
        )}
      </CardFooter>
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 shadow-xl transform transition-all max-w-md w-full">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">Success!</h3>
              <p className="text-sm text-gray-500 mb-4">Thank you for completing the interview!</p>
              <button
                onClick={handleCloseConfirmation}
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}