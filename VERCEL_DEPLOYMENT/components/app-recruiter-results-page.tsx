'use client'

import { Button } from "@/components/ui/button";
import { SelectedInterviewsResponse } from "@/lib/types/interviews";
import { fetchInterviewData } from '@/lib/utils/api_calls';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

// This would be fetched from your API
const mockResults = [
  { id: 1, name: "John Doe", score: 85, match: "90%" },
  { id: 2, name: "Jane Smith", score: 78, match: "85%" },
  { id: 3, name: "Bob Johnson", score: 72, match: "80%" },
]

export function Page() {
  const [interviewsData, setInterviewsData] = useState<SelectedInterviewsResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const params = useParams();
  // const jobId = params.job_id;
  const jobId = Array.isArray(params.job_id) ? params.job_id[0] : params.job_id;
  console.log("Job ID from params:", jobId);

  useEffect(() => {
    const loadData = async () => {
      try {
        // const data = await fetchInterviewData({
        //   job_id: jobId,
        // });
        const data = await fetchInterviewData();
        setInterviewsData(data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch jon postings data');
        setLoading(false);
      }
    };

    loadData();

  }, []);

  console.log(interviewsData);


  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Interview Results</h1>
      <div className="space-y-4">
        {interviewsData.map((candidate) => (
          <div key={candidate.interview_id} className="border p-4 rounded-lg">
            <h2 className="text-xl font-semibold">{candidate.candidate_id}</h2>
            <p>Score: {candidate.score}</p>
            <p>Match: {candidate.match_pct}</p>
            <p>Decision: {candidate.interview_decision ? 'Selected' : 'Rejected'}</p>
            <Link href={`/recruiter/jobs/1/results/analysis/`}>
              {/* <Link href={`/recruiter/jobs/${job.job_id}/results/`}> */}
              <Button className="mt-2">View Full Analysis</Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}