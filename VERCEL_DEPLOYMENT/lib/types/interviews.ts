export type InterviewsResponse = {
  interview_id: number,
  candidate_id: string,
  recruiter_id: string,
  job_id: number,
  interview_decision: boolean,
  score: number,
  match_pct: number,
  reasoning_summary: string,
  custom_qna: string,
};

export type SelectedInterviewsResponse = Pick<InterviewsResponse,
  'interview_id' | 'candidate_id' | 'recruiter_id' | 'job_id' |
  'interview_decision' | 'score' | 'match_pct' | 'reasoning_summary' | 'custom_qna'
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
