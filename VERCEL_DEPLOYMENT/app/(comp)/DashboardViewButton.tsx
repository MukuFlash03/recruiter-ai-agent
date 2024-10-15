"use client";
import { Button } from "@/components/ui/button";
import { signout } from "@/lib/auth-action";
import { createClient } from "@/lib/utils/supabase/client";
import { ArrowRight } from 'lucide-react';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function DashboardViewButton({ role }: { role: string }) {
  const [user, setUser] = useState<any>(null);
  const [redirectUrl, setRedirectUrl] = useState<string>('');
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        setRedirectUrl(role === 'candidate' ? `/candidate/${user.id}` : '/recruiter')
        console.log(`RedirectURL in DashboardViewButton if user: ${redirectUrl}`);

      }
    };
    fetchUser();
  }, []);

  return (
    <>
      <div className="space-x-4">
        <Button asChild size="lg" variant="outline" className="w-full sm:w-auto group">
          <Link href={redirectUrl} className="flex items-center justify-center">
            Visit {role} dashboard
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
        <Button size="lg" variant="outline" className="w-full sm:w-auto group"
          onClick={() => {
            signout();
            setUser(null);
          }}
        >
          Log out
        </Button>
      </div>
    </>
  );
};
