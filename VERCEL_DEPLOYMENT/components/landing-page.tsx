'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, CheckCircle, Clock, FileText, Linkedin, List, Upload, UserCheck } from "lucide-react"

export function LandingPageComponent() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="#">
          <MountainIcon className="h-6 w-6" />
          <span className="sr-only">LevelHire.ai</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Features
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Pricing
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            About
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Contact
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Revolutionize Your Recruiting Process
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Save time and find the perfect match with our AI-powered recruiting platform. Streamline interviews for both candidates and recruiters.
                </p>
              </div>
              <div className="space-x-4">
                <Button>Get Started for Free</Button>
                <Button variant="outline">Learn More</Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">How It Works</h2>
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>For Candidates</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    <li className="flex items-center space-x-2">
                      <Upload className="h-5 w-5 text-primary" />
                      <span>Upload your resume</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Linkedin className="h-5 w-5 text-primary" />
                      <span>Connect your LinkedIn profile</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <span>Share your portfolio</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <UserCheck className="h-5 w-5 text-primary" />
                      <span>Record your AI-powered interview</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>For Recruiters</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    <li className="flex items-center space-x-2">
                      <Briefcase className="h-5 w-5 text-primary" />
                      <span>Upload job descriptions</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <List className="h-5 w-5 text-primary" />
                      <span>Specify interview questions</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span>Define required skills and characteristics</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <UserCheck className="h-5 w-5 text-primary" />
                      <span>Receive a curated list of top candidates</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">Benefits</h2>
            <div className="grid gap-6 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <Clock className="h-8 w-8 mb-2 text-primary" />
                  <CardTitle>Save Time</CardTitle>
                </CardHeader>
                <CardContent>
                  Eliminate repetitive interviews and streamline the hiring process for both candidates and recruiters.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <UserCheck className="h-8 w-8 mb-2 text-primary" />
                  <CardTitle>Better Matches</CardTitle>
                </CardHeader>
                <CardContent>
                  Our AI-powered platform ensures a more accurate match between candidates and job requirements.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CheckCircle className="h-8 w-8 mb-2 text-primary" />
                  <CardTitle>Consistency</CardTitle>
                </CardHeader>
                <CardContent>
                  Ensure all candidates are evaluated consistently based on the same criteria and questions.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Transform Your Recruiting Process?
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Join thousands of companies and candidates who are already benefiting from our AI-powered platform.
                </p>
              </div>
              <div className="space-x-4">
                <Button size="lg">Sign Up Now</Button>
                <Button size="lg" variant="outline">Request a Demo</Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2023 RecruitAI. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}

function MountainIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  )
}

function Link({ href, children, ...props }) {
  return (
    <a href={href} {...props}>
      {children}
    </a>
  )
}