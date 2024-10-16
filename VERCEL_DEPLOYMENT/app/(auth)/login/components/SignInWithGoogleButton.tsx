"use client";
import { Button } from "@/components/ui/button";
import { signInWithGoogle } from "@/lib/auth-action";

export async function SignInWithGoogleButton({ role }: { role: string }) {
  console.log(`Role in SignInWithGoogleButton: ${role}`);

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={() => {
        signInWithGoogle(role);
      }}
    >
      Login with Google
    </Button>
  );
};
