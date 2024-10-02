import { Page as AppPage } from '@/components/app-page';
// import { createClient } from '@/lib/utils/supabase/server';
// import { redirect } from "next/navigation";

export default async function Home() {
  // const supabase = createClient();
  // const {
  //   data: { user },
  // } = await supabase.auth.getUser();

  // if (!user) {
  //   return redirect("/login");
  // }

  return (
    <div >
      <AppPage />
    </div>
  );
}
