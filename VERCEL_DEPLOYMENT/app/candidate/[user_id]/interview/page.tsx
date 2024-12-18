import { InterviewInstructionsPage } from '@/components/InterviewInstructions';
import { createClient } from '@/lib/utils/supabase/server';
import { redirect } from "next/navigation";

export default async function InterviewInstructions() {
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
      <InterviewInstructionsPage candidate_id={user.id} />
    </div>
  );
}