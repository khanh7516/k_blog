'use client';

import { useEffect, useRef, useState } from 'react';
import { Post } from '../../../types/post';
import PostCard from './PostCard';
import { useSearchParams } from 'next/navigation';

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const searchParams = useSearchParams();
  const observerRef = useRef<HTMLDivElement | null>(null);

  const handleToggle = (id: number) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const fetchPosts = async (isInitial = false) => {
    const query = searchParams.toString();
    const url = `/api/posts/published?take=5${nextCursor && !isInitial ? `&cursor=${nextCursor}` : ''}${query ? `&${query}` : ''}`;

    const start = Date.now();

    try {
        if (!isInitial) setLoadingMore(true);
        else setLoading(true);

        const res = await fetch(url);
        const data = await res.json();

        const elapsed = Date.now() - start;
        const delay = Math.max(500 - elapsed, 0);

        setTimeout(() => {
            if (isInitial) {
                setPosts(data.posts);
                setLoading(false);
            } else {
                setPosts(prev => [...prev, ...data.posts]);
                setLoadingMore(false);
            }
            setNextCursor(data.nextCursor);
        }, delay);
    } catch (error) {
        console.error('Failed to load posts:', error);
        if (isInitial) setLoading(false);
        else setLoadingMore(false);
    }
  };

  useEffect(() => {
    setPosts([]);
    setNextCursor(null);
    fetchPosts(true);
  }, [searchParams]);

  useEffect(() => {
    setExpandedId(null);
  }, [posts]);

  useEffect(() => {
    if (!observerRef.current || !nextCursor) return;

    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        fetchPosts();
      }
    }, {
      rootMargin: '100px',
    });

    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [nextCursor]);

  if (loading && posts.length === 0) {
    return (
      <div className="flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="mt-6 max-w-2xl w-full mx-auto mb-8">
      {posts.map((post, index) => (
        <PostCard
          key={post.id}
          post={post}
          isLast={index === posts.length - 1}
          isExpanded={expandedId === post.id}
          onToggle={() => handleToggle(post.id)}
        />
      ))}

      {nextCursor && (
        <div ref={observerRef} className="text-center py-4 text-gray-500">
          {loadingMore ? 'Loading more...' : 'Scroll to load more...'}
        </div>
      )}
    </div>
  );
}
