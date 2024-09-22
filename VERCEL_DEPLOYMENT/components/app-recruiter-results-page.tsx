'use client'

import { Button } from "@/components/ui/button"

// This would be fetched from your API
const mockResults = [
  { id: 1, name: "John Doe", score: 85, match: "90%" },
  { id: 2, name: "Jane Smith", score: 78, match: "85%" },
  { id: 3, name: "Bob Johnson", score: 72, match: "80%" },
]

export function Page() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Interview Results</h1>
      <div className="space-y-4">
        {mockResults.map((candidate) => (
          <div key={candidate.id} className="border p-4 rounded-lg">
            <h2 className="text-xl font-semibold">{candidate.name}</h2>
            <p>Score: {candidate.score}</p>
            <p>Match: {candidate.match}</p>
            <Button className="mt-2">View Full Analysis</Button>
          </div>
        ))}
      </div>
    </div>
  )
}