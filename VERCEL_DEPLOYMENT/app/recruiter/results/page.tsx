import { Page as RecruiterResultsPage } from '@/components/app-recruiter-results-page';
import { createClient } from '@/lib/utils/supabase/server';
import { redirect } from "next/navigation";

export default async function RecruiterResults() {
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
      <RecruiterResultsPage />
    </div>
  );
}