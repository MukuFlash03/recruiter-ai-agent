'use client';

import { useSearchParams } from 'next/navigation';
import { SignUpFormClient } from './SignUpFormClient';

export function SignUpFormWrapper() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';

  return <SignUpFormClient redirectUrl={redirectUrl} />;
}
