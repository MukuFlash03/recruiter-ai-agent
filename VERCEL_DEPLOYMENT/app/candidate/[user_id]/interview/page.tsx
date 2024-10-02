import { Page as InterviewInstructionsPage } from '@/components/app-candidate-profile-interview-page';
import { createClient } from '@/lib/utils/supabase/server';
import { redirect } from "next/navigation";

export default async function InterviewInstructions() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <div >
      <InterviewInstructionsPage />
    </div>
  );
}