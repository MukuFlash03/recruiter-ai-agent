"use client";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/utils/supabase/client";
import { ArrowRight, Briefcase } from 'lucide-react';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const LoginButton = ({ label, url }: { label: string, url: string }) => {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);
  if (user) {
    return (
      <Button asChild size="lg" variant="outline" className="w-full sm:w-auto group">
        <Link href={url} className="flex items-center justify-center">
          <Briefcase className="mr-2 h-5 w-5" />
          {label}
          <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Link>
      </Button>
    );
  }
};

export default LoginButton;
