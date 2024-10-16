export type RecruitersResponse = {
  id: number,
  recruiter_id: string,
  name: string,
  email: string
};

export type SelectedRecruitersResponse = Pick<RecruitersResponse,
  'recruiter_id' | 'name' | 'email'
>;
