export type RelevantContext = {
  yes_or_no: boolean,
  reasoning: string,
  relevant_context: string[]
}

export type InterviewsResponse = {
  interview_id: number,
  candidate_id: string,
  recruiter_id: string,
  job_id: number,
  interview_decision: boolean,
  match_pct: string,
  reasoning_summary: string,
  custom_answers: string[],
  relevant_contexts: {
    [key: string]: RelevantContext[]
  },
  characteristic_values: {
    [key: string]: string
  }
};

export type SelectedInterviewsResponse = Pick<InterviewsResponse,
  'interview_id' | 'candidate_id' | 'recruiter_id' | 'job_id' |
  'interview_decision' | 'match_pct' |
  'reasoning_summary' | 'custom_answers' | 'relevant_contexts'
>;

export type InterviewsCandidateResponse = {
  interview_id: number,
  candidate_id: string,
  recruiter_id: string,
  job_id: number,
  interview_decision: boolean,
  match_pct: string,
  reasoning_summary: string,
  custom_answers: string[],
  relevant_contexts: {
    [key: string]: RelevantContext[]
  },
  characteristic_values: {
    [key: string]: string
  }
  candidate_profiles: {
    name: string,
  },
}
