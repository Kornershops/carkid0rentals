import { useCallback } from 'react';
import { useToastStore } from '@/components/ui/toast';

export function useToast() {
  const addToast = useToastStore((state) => state.addToast);

  const success = useCallback(
    (message: string, duration?: number) => {
      addToast({ type: 'success', message, duration });
    },
    [addToast]
  );

  const error = useCallback(
    (message: string, duration?: number) => {
      addToast({ type: 'error', message, duration });
    },
    [addToast]
  );

  const info = useCallback(
    (message: string, duration?: number) => {
      addToast({ type: 'info', message, duration });
    },
    [addToast]
  );

  return { success, error, info };
}
