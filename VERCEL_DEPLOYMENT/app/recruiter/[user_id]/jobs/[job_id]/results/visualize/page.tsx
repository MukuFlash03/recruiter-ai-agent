"use client"
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { InterviewsCandidateResponse } from "@/lib/types/interviews";
import { fetchJobAnalysis } from '@/lib/utils/api_calls';
import { createClient } from "@/lib/utils/supabase/client";
import Link from 'next/link';
import { redirect, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import CandidateSkillsChart from './candidate-skills-chart';

/*
function convertData(inputData) {
  console.log("Inside convertData function");
  console.log("Input Data:", inputData);

  const candidates_2 = []
  return inputData.map((interview, index) => {
    console.log("Interview Data:", interview);

    const candidate_id = interview.candidate_id;
    const candidate_name = interview.candidate_profiles.name;
    const candidate_skills = interview.characteristic_values;

    candidates_2.push({
      candidate_id,
      candidate_name,
      candidate_skills,
    });

    console.log("Candidates 2 inside:", candidates_2);


    // return {
    //   id: (index + 1).toString(),
    //   name: `Candidate ${String.fromCharCode(65 + index)}`, // A, B, C, ...
    //   characteristics: {
    //     problem_solving: getScore('problem_solving_score'),
    //     technical_skills: getScore('technical_skills_score'),
    //     leadership: getScore('leadership_score'),
    //     communication: getScore('communication_score'),
    //     teamwork: getScore('teamwork_score'),
    //     adaptability: getScore('adaptability_score'),
    //     creativity: getScore('creativity_score')
    //   }
    // };
  });
}
*/

function convertData(inputData) {
  console.log("Inside convertData function");
  console.log("Input Data:", inputData);

  const candidates_2 = [];

  for (let index = 0; index < inputData.length; index++) {
    const interview = inputData[index];
    console.log("Interview Data:", interview);

    const candidate_id = interview.candidate_id;
    const candidate_name = interview.candidate_profiles.name;
    const candidate_skills = interview.characteristic_values;

    candidates_2.push({
      candidate_id,
      candidate_name,
      candidate_skills,
    });

  }

  console.log("Candidates 2 inside:", candidates_2);

  return candidates_2;
}

const candidates = [
  {
    id: '1',
    name: 'Candidate A',
    characteristics: {
      problem_solving: '3',
      technical_skills: '2',
      leadership: '3',
      communication: '4',
      teamwork: '3',
      adaptability: '5',
      creativity: '4'
    }
  },
  {
    id: '2',
    name: 'Candidate B',
    characteristics: {
      problem_solving: '4',
      technical_skills: '4',
      leadership: '4',
      communication: '5',
      teamwork: '4',
      adaptability: '3',
      creativity: '3'
    }
  }
];

export default function RecruiterDashboard() {
  const [jobAnalysisData, setJobAnalysisData] = useState<InterviewsCandidateResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [plotData, setPlotData] = useState<any>(null);

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

      setUser(user);

      try {
        const data = await fetchJobAnalysis({
          job_id: jobId,
          recruiter_id: user.id
        });

        console.log("Fetched job analysis data:", data);

        setJobAnalysisData(data.data);

        // setPlotData(convertData(jobAnalysisData))
      } catch (err) {
        setError('Failed to fetch candidate analysis data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndLoadData();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Fetching results..." />;
  }

  if (error || !jobAnalysisData) {
    return <div>Error: {error || 'Failed to load data'}</div>;
  }

  console.log("Job analysis data:", jobAnalysisData);

  console.log("After useEffect in CandidatesAnalysisPage");

  console.log("Logging jobAnalysisData in CandidatesAnalysisPage:");
  console.log(jobAnalysisData);

  const candidates_2 = convertData(jobAnalysisData);

  console.log("Logging candidates_2 in CandidatesAnalysisPage:");
  console.log(candidates_2);

  console.log("Logging candidates_0 in CandidatesAnalysisPage:");
  console.log(candidates);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          Candidate Skills Comparison
        </h1>
        <div className="flex gap-4">
          <Link href={`/recruiter/${user.id}/jobs/${jobId}/results`}>
            <Button
              className="bg-gray-50 hover:bg-gray-100 text-gray-800 border border-gray-200"
            >
              View Matched Candidates
            </Button>
          </Link>
          <Link href={`/recruiter/${user.id}`}>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <CandidateSkillsChart candidates={candidates} />
      </div>
    </div>
  )


  // return (
  //   <div>
  //     <h1>Candidate Skills Comparison</h1>
  //     <CandidateSkillsChart candidates={candidates} />
  //     {/* <CandidateSkillsChart candidates={plotData} /> */}
  //   </div>
  // );
}



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


//   return (
//     <div>
//       <h1>Candidate Skills Comparison</h1>
//       {/* <CandidateSkillsChart candidates={candidates} /> */}
//       <CandidateSkillsChart candidates={candidates_1} />
//     </div>
//   );
// }
