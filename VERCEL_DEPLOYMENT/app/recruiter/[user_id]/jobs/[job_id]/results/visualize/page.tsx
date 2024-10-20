"use client"
import { InterviewsCandidateResponse } from "@/lib/types/interviews";
import { fetchJobAnalysis } from '@/lib/utils/api_calls';
import { createClient } from "@/lib/utils/supabase/client";
import { redirect, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import CandidateSkillsChart from './candidate-skills-chart';

const candidates = [
  {
    id: '1',
    name: 'Candidate A',
    characteristics: {
      problem_solving: '5',
      technical_skills: '5',
      leadership: '4',
      communication: '5',
      teamwork: '4',
      adaptability: '5',
      creativity: '5'
    }
  },
  {
    id: '2',
    name: 'Candidate B',
    characteristics: {
      problem_solving: '4',
      technical_skills: '5',
      leadership: '5',
      communication: '4',
      teamwork: '5',
      adaptability: '4',
      creativity: '4'
    }
  }
  // Add more candidates as needed
];

export default function RecruiterDashboard() {
  const [jobAnalysisData, setJobAnalysisData] = useState<InterviewsCandidateResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  const supabase = createClient();

  const params = useParams();
  // const jobId = params.job_id;
  const jobId = Array.isArray(params.job_id) ? params.job_id[0] : params.job_id;
  console.log("Job ID from params:", jobId);

  console.log("Before useEffect in CandidateSkillsChart");

  useEffect(() => {
    const fetchUserAndLoadData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return redirect('/login');
      }

      try {
        const data = await fetchJobAnalysis({
          job_id: jobId,
          recruiter_id: user.id
        });

        console.log("Fetched job analysis data:", data);

        setJobAnalysisData(data.data[0]);
      } catch (err) {
        setError('Failed to fetch candidate analysis data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndLoadData();

    // }, [jobId, candidateId]);
  }, []);


  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !jobAnalysisData) {
    return <div>Error: {error || 'Failed to load data'}</div>;
  }

  console.log("After useEffect in CandidatesAnalysisPage");

  console.log("Logging jobAnalysisData in CandidatesAnalysisPage:");
  console.log(jobAnalysisData);

  // const data = {
  //   characteristic_values: jobAnalysisData.characteristic_values,
  //   candidate_name: jobAnalysisData.candidate_profiles.name,
  //   // candidate_selection: {
  //   //   selected: analysisData.interview_decision,
  //   //   reasoning: analysisData.reasoning_summary
  //   // },
  //   // match_pct: analysisData.match_pct,
  //   // answers: analysisData.custom_answers || [],
  //   // relevant_contexts: analysisData.relevant_contexts || []
  // }


  return (
    <div>
      <h1>Candidate Skills Comparison</h1>
      <CandidateSkillsChart candidates={candidates} />
    </div>
  );
}
