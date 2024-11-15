import { JobRecruiterID } from "@/lib/types/jobs";

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';
const API_BASE_URL = 'http://127.0.0.1:8000';

export async function startJobCandidateMatching(jobDetails: JobRecruiterID) {
  console.log("Inside startJobCandidateMatching; making fetch request to FastAPI");;

  // const response = await fetch(`http://127.0.0.1:8000/get_candidates_analysis`, {
  const response = await fetch(`${API_BASE_URL}/api/py/get_candidates_analysis`, {
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