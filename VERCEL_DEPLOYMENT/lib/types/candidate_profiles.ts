export type CandidatesResponse = {
    candidate_id: number,
    name: string,
    email: string,
    contact: string,
    resume_content: string,
    linkedin_url: string,
    current_location: string,
    work_environment: string,
    salary_expectation: string,
    additional_info: string
};

export type SelectedTopCandidatesResponse = Pick<CandidatesResponse,
    'candidate_id' | 'name' | 'email' | 'contact'
>;
