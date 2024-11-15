import { RecruiterDashboardComponent as RecruiterDashboardPage } from '@/components/RecruiterDashboard';
import { createClient } from '@/lib/utils/supabase/server';
import { redirect } from "next/navigation";

export default async function RecruiterDashboard() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // console.log("User data:", user);
  // console.log("User email:", user?.email);
  // console.log("User name: ", user?.user_metadata?.full_name);


  if (!user) {
    // return redirect("/login");
    return redirect("/");
  }

  return (
    <div >
      <RecruiterDashboardPage />
    </div>
  );
}