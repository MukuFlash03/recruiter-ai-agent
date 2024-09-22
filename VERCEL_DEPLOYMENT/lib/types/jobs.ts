export type JobsResponse = {
    job_id: number,
    job_title: string,
    company_name: string,
    job_description: string,
    required_skills: string,
    custom_questions: string[]
};

export type SelectedJobsResponse = Pick<JobsResponse,
    'job_id' | 'job_title' | 'company_name'
>;
