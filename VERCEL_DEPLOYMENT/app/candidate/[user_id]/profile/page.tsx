import { CandidateProfileForm } from '@/components/app-candidate-profile-page';
import { createClient } from '@/lib/utils/supabase/server';
import { redirect } from "next/navigation";

export default async function CandidateProfile() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // return redirect("/login");
    return redirect("/");
  }

  return (
    <div >
      <CandidateProfileForm candidate_id={user.id} />
    </div>
  );
}