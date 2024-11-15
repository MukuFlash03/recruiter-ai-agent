import { CandidateDashboardPage } from '@/components/CandidateDashboard';
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

  return (
    <div >
      <CandidateDashboardPage candidate_id={user.id} />
    </div>
  );
}