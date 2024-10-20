import { JobRecruiterID } from "@/lib/types/jobs";


export async function startJobCandidateMatching(jobDetails: JobRecruiterID) {
  console.log("Inside startJobCandidateMatching; making fetch request to FastAPI");;

  const response = await fetch(`http://127.0.0.1:8000/get_candidates_analysis`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(jobDetails),
  });

  if (!response.ok) {
    throw new Error('Failed to start matching process for jobs->candidates');
  }

  console.log("After fetch request to FastAPI, returning...");

  return response.json();
}