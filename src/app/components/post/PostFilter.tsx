'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCategoryColor } from '@/lib/utils';

interface Category {
  id: number;
  name: string;
}

interface User {
  id: number;
  name: string;
}

export default function PostFilter() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [authors, setAuthors] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    // Fetch categories
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data));

    // Fetch authors with at least one post
    fetch('/api/users/with-posts')
      .then(res => res.json())
      .then(data => setAuthors(data));
  }, []);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = Array.from(e.target.selectedOptions).map(opt => opt.value);
    setSelectedCategories(options);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const query = new URLSearchParams();

    if (title) query.set('title', title);
    if (author) query.set('authorId', author);
    selectedCategories.forEach(cat => query.append('category', cat));

    router.push(`/?${query.toString()}`);
  };

  return (
    <div className="p-4 bg-white rounded-md flex-grow">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-2 py-1"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
          <select
            className="w-full border border-gray-300 rounded px-2 py-1"
            value={author}
            onChange={e => setAuthor(e.target.value)}
          >
            <option value="">All</option>
            {authors.map(user => (
              <option key={user.id} value={user.id.toString()}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <div className="space-y-1">
            {categories.map(cat => (
            <label key={cat.id} className="flex items-center space-x-2">
                <input
                type="checkbox"
                value={cat.id}
                checked={selectedCategories.includes(cat.id.toString())}
                onChange={e => {
                    const id = e.target.value;
                    setSelectedCategories(prev =>
                    e.target.checked
                        ? [...prev, id]
                        : prev.filter(catId => catId !== id)
                    );
                }}
                />
                <span className={`${getCategoryColor(cat.name)} text-white text-sm px-2 py-0.5 rounded-full`}>#{cat.name}</span>
            </label>
            ))}
        </div>
        </div>


        <button
          type="submit"
          className="bg-pink-600 text-white px-4 py-1 rounded hover:bg-pink-700 cursor-pointer"
        >
          Apply
        </button>
      </form>
    </div>
  );
}