export type ProfilesResponse = {
  id: number,
  profile_id: string,
  role: string
};

export type SelectedProfilesResponse = Pick<ProfilesResponse,
  'profile_id' | 'role'
>;


export type NewProfileResponse = {
  profile_id: string,
  role: string,
  name: string,
  email: string,
}