'use client';

import { useState } from 'react';
import PostFilter from './components/post/PostFilter';
import PostList from './components/post/PostList';
import SortBar, { SortField, SortOrder } from './components/post/SortBar';

export default function Home() {
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  return (
    <div className="flex gap-6 max-w-6xl mx-auto mt-5 px-4 pt-8">
      <div className="w-1/4 sticky top-14 h-fit">
        <PostFilter
          sortField={sortField}
          sortOrder={sortOrder}
        />
      </div>
      <div className="flex-1">
        <div className="max-w-2xl w-full mx-auto sticky top-14 bg-white z-10">
          <SortBar
            sortField={sortField}
            sortOrder={sortOrder}
            setSortField={setSortField}
            setSortOrder={setSortOrder}
          />
        </div>
        <PostList />
      </div>
    </div>
  );
}