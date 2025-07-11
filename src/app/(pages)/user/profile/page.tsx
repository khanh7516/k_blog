'use client';

import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [postSummary, setPostSummary] = useState<{ ACTIVE: number; DRAFT: number } | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }

    if (status === 'authenticated') {
      fetch('/api/users/post-summary')
        .then((res) => res.json())
        .then((data) => {
          setPostSummary(data.posts);
        });
    }
  }, [status, router]);

  if (status === 'loading') {
    return <p className="text-center mt-15">Đang tải thông tin người dùng...</p>;
  }

  if (!session) return null;

  const user = session.user ?? {};

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <div className="max-w-5xl mx-auto mt-8 px-4 pt-8">
        <div className='flex justify-between items-center'>
          <h1 className="text-3xl font-bold mb-4">User Profile</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-pink-600 text-white font-semibold rounded-lg hover:bg-black cursor-pointer transition"
        >
            Logout
          </button>
        </div>
      <div className="space-y-2">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>
      {postSummary && (
        <div className="mt-2 flex items-center gap-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
                Posts:
            </h2>
            <p className="flex items-center gap-2">
                <span>🟢Active:</span> {postSummary.ACTIVE}
            </p>
            <p className="flex items-center gap-2">
                <span>📝Draft:</span> {postSummary.DRAFT}
            </p>
        </div>
      )}
    </div>
  );
}
