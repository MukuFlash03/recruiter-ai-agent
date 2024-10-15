'use client';

import { useSearchParams } from 'next/navigation';
import { LoginFormClient } from './LoginFormClient';

export function LoginFormWrapper() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';

  const role = searchParams.get('role') || '/';

  console.log(`Redirect URL in LoginFormWrapper: ${redirectUrl}`);
  console.log(`Role in LoginFormWrapper: ${role}`);


  return <LoginFormClient redirectUrl={redirectUrl} role={role} />;
}
