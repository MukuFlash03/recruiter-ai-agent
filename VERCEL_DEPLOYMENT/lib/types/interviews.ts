export type InterviewsResponse = {
  interview_id: number,
  candidate_id: string,
  recruiter_id: string,
  job_id: number,
  interview_decision: boolean,
  score: number,
  match_pct: number
};

export type SelectedInterviewsResponse = Pick<InterviewsResponse,
  'interview_id' | 'candidate_id' | 'recruiter_id' | 'job_id' |
  'interview_decision' | 'score' | 'match_pct'
>;

export type InterviewsCandidateResponse = {
  interview_id: number,
  candidate_id: string,
  recruiter_id: string,
  job_id: number,
  interview_decision: boolean,
  score: number,
  match_pct: number,
  candidate_profiles: {
    name: string,
  },
}
