'use client';

import { usePathname } from 'next/navigation';
import { SessionProvider } from 'next-auth/react';
import Footer from './Footer';

const showFooterRoutes = ['/about', '/contact', '/user/profile'];

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showFooter = showFooterRoutes.includes(pathname);

  return (
    <SessionProvider>
      {showFooter ? (
        <div className="flex min-h-screen flex-col">
          <div className="flex-grow">{children}</div>
          <Footer />
        </div>
      ) : (
        <>{children}</>
      )}
    </SessionProvider>
  );
}
