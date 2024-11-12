'use client'

import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { InterviewsCandidateResponse } from "@/lib/types/interviews";
import { fetchInterviewData } from '@/lib/utils/api_calls';
import { createClient } from "@/lib/utils/supabase/client";
import Link from 'next/link';
import { redirect, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function RecruiterResultsPage() {
  const [interviewsData, setInterviewsData] = useState<InterviewsCandidateResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  const supabase = createClient();

  const params = useParams();
  const jobId = Array.isArray(params.job_id) ? params.job_id[0] : params.job_id;
  console.log("Job ID from params:", jobId);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return redirect('/login');
      }

      setUser(user);
      return user;
    };

    const loadData = async (currentUser: any) => {
      if (!currentUser || !jobId) {
        console.error("User or jobId not available");
        setError('User or job information not available');
        setLoading(false);
        return;
      }

      try {
        const data = await fetchInterviewData({
          job_id: jobId,
          recruiter_id: currentUser.id,
        });

        setInterviewsData(data.data);
      } catch (err) {
        console.error("Error fetching interview data:", err);
        setError('Failed to fetch interviewed candidates data');
      } finally {
        setLoading(false);
      }
    };

    fetchUser().then(loadData);
  }, [jobId]);

  if (loading)
    return <LoadingSpinner message="Fetching matched candidates..." />;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>User not authenticated</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          Interview Results
        </h1>
        <div className="flex space-x-4 justify-end">
          <Link href={`/recruiter/${user.id}/jobs/${jobId}/results/visualize`}>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6">
              Compare Candidates
              {/* <span className="mr-2">📊</span> View Analytics */}
            </Button>
          </Link>
          <Link href={`/recruiter/${user.id}`}>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6">
        {interviewsData.map((candidate) => (
          <div
            key={candidate.interview_id}
            className="border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow bg-white"
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                {candidate.candidate_profiles.name}
              </h2>
              <span className={`px-4 py-1 rounded-full text-sm font-medium ${candidate.interview_decision
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
                }`}>
                {candidate.interview_decision ? 'Selected' : 'Rejected'}
              </span>
            </div>

            <div className="flex items-center mb-4">
              <div className="text-gray-600 mr-8">
                Match Score:
                <span className="ml-2 text-lg font-semibold text-blue-600">
                  {candidate.match_pct}%
                </span>
              </div>
            </div>

            <Link href={`/recruiter/${user.id}/jobs/${jobId}/results/${candidate.candidate_id}/analysis/`}>
              <Button className="w-full bg-gray-50 hover:bg-gray-100 text-gray-800 border border-gray-200">
                View Detailed Analysis →
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )

}