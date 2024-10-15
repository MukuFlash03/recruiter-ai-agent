"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/utils/supabase/server";

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

  const redirectUrl = role === "candidate" ? `/candidate/${data.user.id}` : "/recruiter";
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

  const redirectUrl = role === "candidate" ? `/candidate/${data.user.id}` : "/recruiter";
  console.log("Role in auth-action signup is: " + role);
  console.log(`Redirect URL in auth-action signup: ${redirectUrl}`);

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

export async function signInWithGoogle(redirectUrl: string) {
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

  revalidatePath("/", "layout");
  redirect(data.url);
}

export async function getUser() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
}