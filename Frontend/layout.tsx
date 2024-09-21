import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { ThemeProvider } from "@/components/theme-provider"
import { Sidebar } from "@/components/sidebar"
import { Menu } from 'lucide-react'
import "./globals.css"

const poppins = Poppins({ 
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'RecruitAI',
  description: 'Next-gen AI-powered recruiting platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={poppins.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex h-screen overflow-hidden bg-gradient-to-b from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
            <Sidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
              <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center">
                  <Button variant="ghost" className="mr-4 md:hidden">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle sidebar</span>
                  </Button>
                  <Link href="/" className="flex items-center space-x-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6"
                    >
                      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
                      <path d="M9 18h6" />
                      <path d="M10 22h4" />
                    </svg>
                    <span className="inline-block font-bold bg-gradient-to-r from-pink-500 to-violet-500 text-transparent bg-clip-text text-2xl">RecruitAI</span>
                  </Link>
                  <div className="flex flex-1 items-center justify-end space-x-4">
                    <nav className="flex items-center space-x-2">
                      <Button variant="ghost" asChild>
                        <Link href="/candidate">For Candidates</Link>
                      </Button>
                      <Button variant="ghost" asChild>
                        <Link href="/recruiter">For Recruiters</Link>
                      </Button>
                    </nav>
                  </div>
                </div>
              </header>
              <main className="flex-1 overflow-y-auto">
                {children}
              </main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}