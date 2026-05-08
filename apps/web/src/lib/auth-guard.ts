'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/use-store';

export function useAuthGuard(redirectTo: string) {
  const router = useRouter();
  const { isAuthenticated, setRedirectTo } = useStore();

  useEffect(() => {
    if (!isAuthenticated) {
      setRedirectTo(redirectTo);
      router.replace(`/auth/login?redirect=${encodeURIComponent(redirectTo)}`);
    }
  }, [isAuthenticated, redirectTo, router, setRedirectTo]);

  return isAuthenticated;
}
