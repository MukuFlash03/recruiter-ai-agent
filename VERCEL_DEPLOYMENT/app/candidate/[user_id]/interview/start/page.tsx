import CandidateInterviewPage from '@/components/CandidateInterviewPage';
import { createClient } from '@/lib/utils/supabase/server';
import { redirect } from "next/navigation";

export default async function CandidateInterview() {
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
      <CandidateInterviewPage candidate_id={user.id} />
    </div>
  );
}