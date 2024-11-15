export type CandidatesResponse = {
  id: number,
  candidate_id: string,
  name: string,
  email: string,
  contact: string,
  resume_content: string,
  liProfile_content: string,
  interview_audio_text: string,
  linkedin_url: string,
  current_location: string,
  work_environment: string,
  salary_expectation: string,
  additional_info: string,
  interview_audio_texts: Record<string, any>,
};

export type SelectedTopCandidatesResponse = Pick<CandidatesResponse,
  'candidate_id' | 'name' | 'email' | 'contact'
>;

export type SelectedCandidateFields = Pick<CandidatesResponse,
  'candidate_id' | 'name' | 'email' | 'contact' |
  'resume_content' | 'liProfile_content' | 'linkedin_url' |
  'current_location' | 'work_environment' | 'salary_expectation' |
  'additional_info' | 'interview_audio_texts'
>;

export type DocumentUrls = {
  resume_pdf_url: string,
  liProfile_pdf_url: string,
};

export type EnhancedCandidateFields =
  SelectedCandidateFields &
  DocumentUrls
  ;
