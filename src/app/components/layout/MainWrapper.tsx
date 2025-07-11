'use client';

import { ReactNode } from 'react';

export default function MainWrapper({ children }: { children: ReactNode }) {
  return (
    <main className="w-[80%] mx-auto px-4 mt-6">
      {children}
    </main>
  );
}
