'use client';

import { useSearchParams } from 'next/navigation';
import { SignUpFormClient } from './SignUpFormClient';

export function SignUpFormWrapper() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';

  const role = searchParams.get('role') || '/';

  console.log(`Redirect URL in SignUpFormWrapper: ${redirectUrl}`);
  console.log(`Role in SignUpFormWrapper: ${role}`);

  return <SignUpFormClient role={role} />;
}
