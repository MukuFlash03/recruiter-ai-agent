"use client";
import { Button } from "@/components/ui/button";
import { signInWithGoogle } from "@/lib/auth-action";

export async function SignInWithGoogleButton({ redirectUrl, role }: { redirectUrl: string, role: string }) {
  console.log(`Redirect URL in SignInWithGoogleButton: ${redirectUrl}`);
  console.log(`Role in SignInWithGoogleButton: ${role}`);

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={() => {
        signInWithGoogle(redirectUrl);
      }}
    >
      Login with Google
    </Button>
  );
};
