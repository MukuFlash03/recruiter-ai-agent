import LoadingSpinner from '@/components/ui/loading-spinner';
import { Suspense } from 'react';
import { LoginFormWrapper } from './components/LoginFormWrapper';

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingSpinner message="Loading login form..." />}>

      <div className="flex h-svh items-center">
        <LoginFormWrapper />
      </div>
    </Suspense>

  );
}
