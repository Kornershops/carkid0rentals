'use client';

import { ReactNode } from 'react';
import ToastContainer from './toast';

export function ToastProvider({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <ToastContainer />
    </>
  );
}
