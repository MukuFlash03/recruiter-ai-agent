import { Suspense } from 'react';

import { LoginFormWrapper } from './components/LoginFormWrapper';

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>

      <div className="flex h-svh items-center">
        <LoginFormWrapper />
      </div>
    </Suspense>

  );
}
