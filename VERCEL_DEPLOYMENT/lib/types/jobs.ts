export type JobsResponse = {
  job_id: number,
  recruiter_id: string,
  job_title: string,
  company_name: string,
  companyURL: string,
  job_description: string,
  required_skills: string,
  custom_questions: string[],
  analysis_status: boolean,
};

export type SelectedJobsResponse = Pick<JobsResponse,
  'job_id' | 'job_title' | 'company_name' | 'analysis_status'
>;

export interface JobPostingData {
  jobTitle: string;
  companyName: string;
  companyURL: string;
  jobDescription: string;
  requiredSkills: string;
  questions: string[];
}

export type JobRecruiterID = {
  recruiter_id: string;
  job_id: string;
}
