'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white text-black drop-shadow-sm">
      <div className="container mx-auto py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold">
          <Link href="/">k_blog</Link>
        </h1>

        <nav className="space-x-4 flex items-center">
          <Link href="/" className="transition-colors hover:text-pink-600">
            Home
          </Link>
          <Link href="/about" className="transition-colors hover:text-pink-600">
            About
          </Link>
          <Link href="/contact" className="transition-colors hover:text-pink-600">
            Contact
          </Link>
          {status === 'loading' ? null : (
            <>
              {!session ? (
                <Link
                  href="/login"
                  className="bg-pink-600 text-white px-4 py-1 rounded hover:bg-pink-700 transition-colors"
                >
                  Sign In
                </Link>
              ) : (
                <span className="text-pink-700"> 
                  <Link href="/user/profile">{session.user?.name || session.user?.email}</Link>
                </span>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
