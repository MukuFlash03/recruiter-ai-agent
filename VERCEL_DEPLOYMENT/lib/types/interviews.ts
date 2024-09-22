export type InterviewsResponse = {
    interview_id: number,
    candidate_id: number,
    job_id: number,
    score: number,
    match_pct: number
    interview_decision: boolean,
};

export type SelectedInterviewsResponse = Pick<InterviewsResponse,
    'interview_id' | 'candidate_id' | 'job_id' | 'score' | 'match_pct' | 'interview_decision'
>;
