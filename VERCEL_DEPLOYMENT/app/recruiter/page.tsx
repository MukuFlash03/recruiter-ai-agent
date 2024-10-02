import { RecruiterDashboardComponent as RecruiterDashboardPage } from '@/components/recruiter-dashboard';
import { createClient } from '@/lib/utils/supabase/server';
import { redirect } from "next/navigation";

export default async function RecruiterDashboard() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <div >
      <RecruiterDashboardPage />
    </div>
  );
}