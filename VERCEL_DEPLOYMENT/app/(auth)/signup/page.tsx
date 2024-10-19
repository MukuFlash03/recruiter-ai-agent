import { Suspense } from 'react';

import { SignUpFormWrapper } from "./components/SignUpFormWrapper";

export default function SignUpPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>

      <div className="flex h-svh items-center">
        <SignUpFormWrapper />
      </div>
    </Suspense>

  );
}
