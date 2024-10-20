'use client'

import { Button } from "@/components/ui/button";
import { InterviewsCandidateResponse } from "@/lib/types/interviews";
import { fetchInterviewData } from '@/lib/utils/api_calls';
import { createClient } from "@/lib/utils/supabase/client";
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function RecruiterResultsPage() {
  const [interviewsData, setInterviewsData] = useState<InterviewsCandidateResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  const supabase = createClient();

  const params = useParams();
  // const jobId = params.job_id;
  const jobId = Array.isArray(params.job_id) ? params.job_id[0] : params.job_id;
  console.log("Job ID from params:", jobId);

  console.log("Before useEffect in RecruiterResultsPage");

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    const loadData = async () => {
      try {
        console.log("Before call to fetchInterviewData");

        const data = await fetchInterviewData({
          job_id: jobId,
          recruiter_id: user?.id,
        });

        console.log("After call to fetchInterviewData");

        setInterviewsData(data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch interviewed candidates data');
        setLoading(false);
      }
    };

    fetchUser();
    loadData();

  }, []);


  console.log("After useEffect in RecruiterResultsPage");

  console.log("Logging interviewsData in RecruiterResultsPage:");
  console.log(interviewsData);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Interview Results</h1>
      <div className="space-y-4">
        {interviewsData.map((candidate) => (
          <div key={candidate.interview_id} className="border p-4 rounded-lg">
            <h2 className="text-xl font-semibold">{candidate.candidate_profiles.name}</h2>
            <p>Match: {candidate.match_pct}</p>
            <p>Decision: {candidate.interview_decision ? 'Selected' : 'Rejected'}</p>
            <Link href={`/recruiter/${user.id}/jobs/${jobId}/results/${candidate.candidate_id}/analysis/`}>
              {/* <Link href={`/recruiter/jobs/${job.job_id}/results/`}> */}
              <Button className="mt-2">View Full Analysis</Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}