export const maxDuration = 30;
import { JobRecruiterID } from "@/lib/types/jobs";

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';
// const API_BASE_URL = 'http://127.0.0.1:8000';


// const API_BASE_URL = process.env.NODE_ENV === 'development'
//   ? 'http://127.0.0.1:8000'
//   : '';

export async function startJobCandidateMatching(jobDetails: JobRecruiterID) {
  console.log("Inside startJobCandidateMatching; making fetch request to FastAPI");

  const url = process.env.NODE_ENV === 'development'
    ? `http://127.0.0.1:8000/api/py/get_candidates_analysis`
    : `/api/py/generate-notes-get_candidates_analysis`;

  console.log("Requesting URL:", url);

  const requestUrl = process.env.NODE_ENV === 'development'
    ? url
    : new URL(url, 'https://recruit-ai-agent.vercel.app/').toString();

  // const response = await fetch(`http://127.0.0.1:8000/get_candidates_analysis`, {
  // const response = await fetch(`${API_BASE_URL}/api/py/get_candidates_analysis`, {
  const response = await fetch(requestUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(jobDetails),
  });

  if (!response.ok) {
    throw new Error('Failed to start matching process for job->candidates');
  }

  console.log("After fetch request to FastAPI, returning...");

  return response.json();
}

export async function startCandidateJobMatching(candidate_id: string) {
  console.log("Inside startCandidateJobMatching; making fetch request to FastAPI");

  const url = process.env.NODE_ENV === 'development'
    ? `http://127.0.0.1:8000/api/py/get_matched_jobs`
    : `/api/py/generate-notes-get_matched_jobs`;

  console.log("Requesting URL:", url);

  const requestUrl = process.env.NODE_ENV === 'development'
    ? url
    : new URL(url, 'https://recruit-ai-agent.vercel.app/').toString();

  // const response = await fetch(`http://127.0.0.1:8000/get_matched_jobs`, {
  // const response = await fetch(`${API_BASE_URL}/api/py/get_matched_jobs`, {
  const response = await fetch(requestUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ candidate_id }),
  });

  if (!response.ok) {
    throw new Error('Failed to start matching process for candidate->jobs');
  }

  console.log("After fetch request to FastAPI, returning...");

  return response.json();
}
