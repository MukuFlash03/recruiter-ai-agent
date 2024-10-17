'use client'

import { Clock, Sparkles, Users } from 'lucide-react';

import { DashboardLoginButton } from "@/app/(comp)/DashboardLoginButton";
import { DashboardViewButton } from "@/app/(comp)/DashboardViewButton";
import { NewProfileResponse } from "@/lib/types/all_profiles";
import { insertCandidateProfile, insertNewProfile, insertRecruiterProfile } from "@/lib/utils/api_calls";
import { createClient } from "@/lib/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function Page() {
  const [user, setUser] = useState<any>(null);
  const [redirectUrl, setRedirectUrl] = useState<string>('');
  const [role, setRole] = useState<'candidate' | 'recruiter' | null>(null);

  const router = useRouter();
  const supabase = createClient();

  // First time signup or login after logout would fetch "role" correctly on clicking button
  // If already logged in, button won't be visible, need to fetch role from Supabase DB
  // SignInWithGoogle role needs to be managed correctly
  // const role = "candidate";
  // const role = "recruiter";

  console.log("Inside Root Page");


  useEffect(() => {
    const fetchUserAndSetRole = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      const storedRole = localStorage.getItem('selectedRole');
      if (storedRole) {
        setRole(storedRole as 'recruiter' | 'candidate');
        // localStorage.removeItem('selectedRole');
        console.log(`Fetched updated Role in Page: role = ${role} ; storedRole = ${storedRole}`);
      }

      if (user) {
        console.log("User Details:", user);



        // setRedirectUrl(role === 'candidate' ? `/candidate/${user.id}` : `/recruiter/${user.id}`)
        console.log(`Go to dashboard for ${role} ${user.id}`);
        console.log(`Go to dashboard for ${storedRole} ${user.id}`);
        console.log("Inside user found in checkUserAndInsertProfile");

        console.log("User ID:", user.id);
        console.log("User email:", user.email);
        console.log("User name:", user.user_metadata?.full_name);
        console.log("User role:", role);
        console.log("User stored role:", storedRole);

        // Check if user already exists in the profiles table
        const { data: profileData, error: profileError } = await supabase
          .from('all_profiles')
          .select('*')
          .eq('profile_id', user.id)
          // .single()
          ;

        console.log("Profile data:", profileData);

        if (profileError && profileError.code !== 'PGRST116') {
          console.log("Error checking user profile:", profileError);
          return;
        }

        if (profileData.length === 0) {
          console.log("User not found in profiles table; inserting...");

          await insertNewProfile(user.id, storedRole);

          console.log("After inserting new profile");

          const newProfileData: NewProfileResponse = {
            profile_id: user.id,
            role: storedRole,
            name: user.user_metadata?.full_name,
            email: user.email
          }

          if (storedRole === "candidate") {
            console.log("Inside candidate role in checkUserAndInsertProfile");
            // Check if user already exists in the candidates table
            const { data: candidateData, error: candidateError } = await supabase
              .from('candidate_profiles')
              .select('candidate_id')
              .eq('candidate_id', user.id)
              // .single()
              ;

            if (candidateData.length === 0) {
              console.log("User not found in candidates table; inserting...");
              await insertCandidateProfile(newProfileData);
              console.log("After inserting candidate profile");

              setRedirectUrl(`/candidate/${user.id}`)
              console.log(`Redirect URL in candidate signin google: ${redirectUrl}`);
              router.push(redirectUrl);
            } else {
              console.log('Candidate profile already exists for the given candidate_id:', user.id);
            }
          }
          else if (storedRole === "recruiter") {
            console.log("Inside recruiter role in checkUserAndInsertProfile");
            // Check if user already exists in the recruiters table
            const { data: recruiterData, error: recruiterError } = await supabase
              .from('recruiter_profiles')
              .select('recruiter_id')
              .eq('recruiter_id', user.id)
              // .single()
              ;

            if (recruiterData.length === 0) {
              console.log("User not found in recruiters table; inserting...");
              await insertRecruiterProfile(newProfileData);
              console.log("After inserting recruiter profile");

              setRedirectUrl(`/recruiter/${user.id}`)
              console.log(`Redirect URL in recruiter signin google: ${redirectUrl}`);
              router.push(redirectUrl);
            } else {
              console.log('Recruiter profile already exists for the given recruiter_id:', user.id);
            }
          }
        } else {
          console.log("User already exists in profiles table.");
        }
      }
    };

    fetchUserAndSetRole();
  }, []);


  useEffect(() => {


  }, []);


  console.log("Inside Root Page before return component");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center space-y-8 max-w-4xl mb-16">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
          Find Your <span className="bg-gradient-to-r from-pink-500 to-violet-500 text-transparent bg-clip-text">Dream Match</span> with RecruitAI
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Our AI-powered platform connects awesome talent with cool companies. Say goodbye to endless interviews and hello to perfect matches!
        </p>
        {!user ? (
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <DashboardLoginButton
              label="I'm a Candidate"
              role="candidate"
              onClick={() => {
                const roleToSet = 'candidate';
                localStorage.setItem('selectedRole', roleToSet);
                setRole(roleToSet);
                console.log(`Role in Page: role = ${role} ; roleToSet = ${roleToSet}`);
              }} />
            <DashboardLoginButton
              label="I'm a Recruiter"
              role="recruiter"
              onClick={() => {
                const roleToSet = 'recruiter';
                localStorage.setItem('selectedRole', roleToSet);
                setRole(roleToSet);
                console.log(`Role in Page DLB: role = ${role} ; roleToSet = ${roleToSet}`);
              }} />
          </div>
        ) : (
          <div>
            <DashboardViewButton role={role} />
          </div>
        )}
      </div>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl">
        {features.map((feature, index) => (
          <div key={index} className="flex flex-col items-center text-center space-y-4 p-6 bg-background/60 backdrop-blur-sm rounded-lg shadow-lg">
            <div className="p-3 bg-primary/10 rounded-full">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

const features = [
  {
    icon: <Sparkles className="h-8 w-8 text-pink-500" />,
    title: "AI-Powered Matching",
    description: "Our smart AI finds the perfect fit for your vibe and skills. Get matched with opportunities that truly resonate with you."
  },
  {
    icon: <Clock className="h-8 w-8 text-indigo-500" />,
    title: "Save time",
    description: "Eliminate repetitive interviews and streamline the hiring process for both candidates and recruiters."
  },
  {
    icon: <Users className="h-8 w-8 text-violet-500" />,
    title: "Interview Avatars",
    description: "Show off your personality with short intros. No more boring CVs! Let your true self shine through."
  }
]