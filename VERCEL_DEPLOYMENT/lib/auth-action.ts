"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/utils/supabase/server";
import { insertCandidateProfile, insertNewProfile, insertRecruiterProfile } from "./utils/api_calls";

import { NewProfileResponse } from "@/lib/types/all_profiles";

export async function login(formData: FormData) {
  const supabase = createClient();

  const data2 = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  // let redirectUrl = formData.get("redirect") as string;
  const role = formData.get("role") as string;

  const { data, error } = await supabase.auth.signInWithPassword(data2);

  if (error) {
    console.log(error);
    redirect("/error");
  }

  const user_id = data.user.id;

  const redirectUrl = role === "candidate" ? `/candidate/${data.user.id}` : `/recruiter/${data.user.id}`;
  console.log("Role in auth-action login is: " + role);
  console.log(`Redirect URL in auth-action login: ${redirectUrl}`);

  revalidatePath("/", "layout");
  redirect(redirectUrl || "/");
}

export async function signup(formData: FormData) {
  const supabase = createClient();

  const firstName = formData.get("first-name") as string;
  const lastName = formData.get("last-name") as string;
  const data2 = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      data: {
        full_name: `${firstName + " " + lastName}`,
        email: formData.get("email") as string,
      },
    },
  };

  // const redirectUrl = formData.get("redirect") as string;
  const role = formData.get("role") as string;

  const { data, error } = await supabase.auth.signUp(data2);

  if (error) {
    console.log(error);
    redirect("/error");
  }

  const redirectUrl = role === "candidate" ? `/candidate/${data.user.id}` : `/recruiter/${data.user.id}`;
  console.log("Role in auth-action signup is: " + role);
  console.log(`Redirect URL in auth-action signup: ${redirectUrl}`);


  await insertNewProfile(data.user.id, role);


  const profileData: NewProfileResponse = {
    profile_id: data.user.id,
    role: role,
    name: data.user.user_metadata?.full_name,
    email: data.user.email
  }

  if (role === "candidate")
    await insertCandidateProfile(profileData);
  else if (role === "recruiter")
    await insertRecruiterProfile(profileData);

  revalidatePath("/", "layout");
  redirect(redirectUrl || "/");
}

export async function signout() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.log(error);
    redirect("/error");
  }

  redirect("/logout");
}

export async function signInWithGoogle(role: string) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    console.log(error);
    redirect("/error");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("Inside signin with Google Auth-action");

  revalidatePath("/", "layout");
  redirect(data.url);
}

export async function getUser() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
}