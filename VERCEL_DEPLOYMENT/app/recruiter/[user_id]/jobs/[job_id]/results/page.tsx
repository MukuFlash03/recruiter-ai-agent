import RecruiterResultsPage from '@/components/app-recruiter-results-page';
import { createClient } from '@/lib/utils/supabase/server';
import { redirect } from "next/navigation";

export default async function Page() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // return redirect("/login");
    return redirect("/");
  }

  console.log("Recruiter Job Posting Results internal page view details");
  console.log("User ID:", user.id);

  return (
    <div >
      <RecruiterResultsPage />
    </div>
  );
}
