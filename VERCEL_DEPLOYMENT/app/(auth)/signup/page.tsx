import { Suspense } from 'react';

import LoadingSpinner from '@/components/ui/loading-spinner';
import { SignUpFormWrapper } from "./components/SignUpFormWrapper";


export default function SignUpPage() {
  return (
    <Suspense fallback={<LoadingSpinner message="Loading signup form..." />}>

      <div className="flex h-svh items-center">
        <SignUpFormWrapper />
      </div>
    </Suspense>

  );
}
