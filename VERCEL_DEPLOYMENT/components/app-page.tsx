'use client'

import { Button } from "@/components/ui/button"
import { ArrowRight, Briefcase, Sparkles, Users, Clock } from 'lucide-react'
import Link from 'next/link'

export function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center space-y-8 max-w-4xl mb-16">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
          Find Your <span className="bg-gradient-to-r from-pink-500 to-violet-500 text-transparent bg-clip-text">Dream Match</span> with RecruitAI
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Our AI-powered platform connects awesome talent with cool companies. Say goodbye to endless interviews and hello to perfect matches!
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <Button asChild size="lg" variant="outline" className="w-full sm:w-auto group">
            <Link href="/candidate/123/profile" className="flex items-center justify-center">
              <Briefcase className="mr-2 h-5 w-5" />
              I&apos;m a Candidate
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button asChild size="lg" className="w-full sm:w-auto group">
            <Link href="/recruiter" className="flex items-center justify-center">
              <Users className="mr-2 h-5 w-5" />
              I&apos;m a Recruiter
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl">
        {features.map((feature, index) => (
          <div key={index} className="flex flex-col items-center text-center space-y-4 p-6 bg-background/60 backdrop-blur-sm rounded-lg shadow-lg">
            <div className="p-3 bg-primary/10 rounded-full">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

const features = [
  {
    icon: <Sparkles className="h-8 w-8 text-pink-500" />,
    title: "AI-Powered Matching",
    description: "Our smart AI finds the perfect fit for your vibe and skills. Get matched with opportunities that truly resonate with you."
  },
  {
    icon: <Clock className="h-8 w-8 text-indigo-500" />,
    title: "Save time",
    description: "Eliminate repetitive interviews and streamline the hiring process for both candidates and recruiters."
  },
  {
    icon: <Users className="h-8 w-8 text-violet-500" />,
    title: "Interview Avatars",
    description: "Show off your personality with short intros. No more boring CVs! Let your true self shine through."
  }
]