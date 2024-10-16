"use client";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/utils/supabase/client";
import { ArrowRight, Briefcase } from 'lucide-react';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function DashboardLoginButton({
  label,
  role,
  onClick
}: {
  label: string,
  role: string,
  onClick?: () => void
}) {
  const [user, setUser] = useState<any>(null);
  const [redirectUrl, setRedirectUrl] = useState<string>('');
  const router = useRouter();
  const supabase = createClient();

  // First time signup or login after logout would fetch "role" correctly on clicking button
  // If already logged in, button won't be visible, need to fetch role from Supabase DB

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        setRedirectUrl(role === 'candidate' ? `/candidate/${user.id}` : `/recruiter/${user.id}`)
      }
    };
    fetchUser();
  }, []);

  return (
    <>
      <Button
        asChild
        size="lg"
        variant="outline"
        className="w-full sm:w-auto group"
        onClick={() => {
          if (onClick)
            onClick();
          if (!user) {
            // router.push(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
            console.log(`Role in DashboardButton if not user: ${role}`);
            router.push(`/login?role=${role}`);
          } else {
            setRedirectUrl(role === 'candidate' ? `/candidate/${user.id}` : `/recruiter/${user.id}`)
            console.log(`RedirectURL: ${redirectUrl}`);
            router.push(redirectUrl);
          }
        }}
      >
        <span className="flex items-center justify-center">
          <Briefcase className="mr-2 h-5 w-5" />
          {label}
          <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
        </span>
      </Button>
    </>
  );
};
