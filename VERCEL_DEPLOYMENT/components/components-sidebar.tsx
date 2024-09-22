'use client'

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Briefcase, Home, MessageSquare, Settings, Users } from 'lucide-react'
import Link from 'next/link'

export function Sidebar() {
  return (
    <div className="hidden border-r bg-background/60 backdrop-blur-sm md:block w-64 overflow-y-auto">
      <ScrollArea className="h-full py-6 px-4">
        <nav className="space-y-2">
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Home
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/candidate/123/profile">
              <Users className="mr-2 h-4 w-4" />
              For Candidates
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/recruiter">
              <Briefcase className="mr-2 h-4 w-4" />
              For Recruiters
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/messages">
              <MessageSquare className="mr-2 h-4 w-4" />
              Messages
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </Button>
        </nav>
      </ScrollArea>
    </div>
  )
}